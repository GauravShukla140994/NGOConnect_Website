import { useEffect, useState } from 'react'
import Drawer from '../components/Drawer'
import Avatar from '../components/Avatar'
import * as orgsApi from '../api/orgs'
import * as lookupsApi from '../api/lookups'
import { getDocumentSignedUrl } from '../api/media'
import { formatDateTime, formatDate } from '../utils/date'

async function findLookup(typeCode) {
  const types = await lookupsApi.getLookupTypes()
  const type = types.find((t) => t.typeCode === typeCode)
  if (!type) return []
  return lookupsApi.getLookupValues(type.lookupTypeId)
}

function blankOrgEditForm(org) {
  return {
    orgName: org?.orgName || '',
    orgTypeLkpId: org?.orgTypeLkpId ? String(org.orgTypeLkpId) : '',
    regNumber: org?.regNumber || '',
    registrationDate: org?.registrationDate ? String(org.registrationDate).slice(0, 10) : '',
    category: org?.category || '',
    contactPerson: org?.contactPerson || '',
    about: org?.about || '',
    mission: org?.mission || '',
    vision: org?.vision || '',
    logoUrl: org?.logoUrl || '',
    contactEmail: org?.contactEmail || '',
    contactPhone: org?.contactPhone || '',
    website: org?.website || '',
    addressLine1: org?.addressLine1 || '',
    addressLine2: org?.addressLine2 || '',
    city: org?.city || '',
    state: org?.state || '',
    pincode: org?.pincode || '',
    country: org?.country || 'India',
  }
}

// orgToken is the encrypted IUrlTokenService token for this org (from the
// orgs list row or a previous detail fetch) — NEVER the raw numeric OrgId.
// 2026-08-24: raw OrgId in this drawer's request URLs (GET /superadmin/
// orgs/64, etc.) was visible in the Network tab, leaking org count/growth to
// anyone with eyes on an authenticated Super Admin session. See
// SuperAdminController.TryResolveId for the server-side contract — every
// orgsApi call below now takes/sends this token instead.
export default function OrgDrawer({ orgToken, onClose, onChanged }) {
  const [org, setOrg] = useState(null)
  const [documents, setDocuments] = useState([])
  const [history, setHistory] = useState([])
  const [historyAvailable, setHistoryAvailable] = useState(true)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [approveNonRegistered, setApproveNonRegistered] = useState(false)
  const [approveRemarks, setApproveRemarks] = useState('')
  const [regStatusOpen, setRegStatusOpen] = useState(false)
  const [regStatusNonRegistered, setRegStatusNonRegistered] = useState(false)
  const [regStatusRemarks, setRegStatusRemarks] = useState('')
  const [savingRegStatus, setSavingRegStatus] = useState(false)
  // 2026-08-26: Reject + Request Update on an already-APPROVED org. Reject here
  // reuses the same rejectOrg call as the PENDING flow (backend now allows it
  // from APPROVED too, and cascade-cancels the org's live projects). Request
  // Update is the soft alternative — org flips to NEEDS_UPDATE, projects untouched.
  const [approvedRejectOpen, setApprovedRejectOpen] = useState(false)
  const [approvedRejectReason, setApprovedRejectReason] = useState('')
  const [requestUpdateOpen, setRequestUpdateOpen] = useState(false)
  const [requestUpdateReason, setRequestUpdateReason] = useState('')
  const [savingCompliance, setSavingCompliance] = useState(false)
  const [viewingDocId, setViewingDocId] = useState(null)
  const [canCreateRecurring, setCanCreateRecurring] = useState(false)
  const [canCreateFlexible, setCanCreateFlexible] = useState(false)
  const [orgMaxVolunteers, setOrgMaxVolunteers] = useState('')
  const [savingPermission, setSavingPermission] = useState(null) // 'recurring' | 'flexible' | 'maxVolunteers' | null
  const [maxVolunteersError, setMaxVolunteersError] = useState('')

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [orgTypes, setOrgTypes] = useState([])
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')

  useEffect(() => {
    if (!orgToken) return
    setOrg(null)
    setRejectOpen(false)
    setReason('')
    setSuspendOpen(false)
    setSuspendReason('')
    setMaxVolunteersError('')
    setEditing(false)
    setEditError('')
    setApproveNonRegistered(false)
    setApproveRemarks('')
    setRegStatusOpen(false)
    setApprovedRejectOpen(false)
    setApprovedRejectReason('')
    setRequestUpdateOpen(false)
    setRequestUpdateReason('')
    orgsApi.getOrgDetail(orgToken).then((o) => {
      setOrg(o)
      // SP returns TINYINT (0/1), not a real boolean — coerce explicitly.
      setCanCreateRecurring(!!o?.canCreateRecurring)
      setCanCreateFlexible(!!o?.canCreateFlexible)
      setOrgMaxVolunteers(o?.orgMaxVolunteers != null ? String(o.orgMaxVolunteers) : '')
      setRegStatusNonRegistered(!!o?.isNonRegistered)
      setRegStatusRemarks('')
    }).catch(() => setOrg(null))
    orgsApi.getOrgDocuments(orgToken).then(setDocuments).catch(() => setDocuments([]))
    orgsApi.getOrgStatusHistory(orgToken)
      .then((h) => { setHistory(h); setHistoryAvailable(true) })
      .catch(() => { setHistory([]); setHistoryAvailable(false) })
    findLookup('ORG_TYPE').then(setOrgTypes).catch(() => setOrgTypes([]))
  }, [orgToken])

  function startEdit() {
    setEditForm(blankOrgEditForm(org))
    setEditError('')
    setEditing(true)
  }
  // org.orgToken (from GetOrgDetailAsync) is the SAME encrypted "ORG:{id}"
  // token ShareController mints for public share links — no extra API call
  // needed, and no raw OrgId ever touches this request either.
  function handleViewProfile() {
    if (!org?.orgToken) return
    window.open(`${window.location.origin}/organisation/${org.orgToken}`, '_blank', 'noreferrer')
  }
  function updateEditField(field, value) {
    setEditForm((f) => ({ ...f, [field]: value }))
  }
  async function handleSaveEdit() {
    if (!editForm.orgName.trim()) { setEditError('Organisation name is required.'); return }
    if (!editForm.regNumber.trim()) { setEditError('Registration number is required.'); return }
    if (!editForm.orgTypeLkpId) { setEditError('Organisation type is required.'); return }

    setSavingEdit(true)
    setEditError('')
    try {
      const payload = {
        orgName: editForm.orgName.trim(),
        orgTypeLkpId: Number(editForm.orgTypeLkpId),
        regNumber: editForm.regNumber.trim(),
        registrationDate: editForm.registrationDate || null,
        category: editForm.category || null,
        contactPerson: editForm.contactPerson || null,
        about: editForm.about || null,
        mission: editForm.mission || null,
        vision: editForm.vision || null,
        logoUrl: editForm.logoUrl || null,
        contactEmail: editForm.contactEmail || null,
        contactPhone: editForm.contactPhone || null,
        website: editForm.website || null,
        addressLine1: editForm.addressLine1 || null,
        addressLine2: editForm.addressLine2 || null,
        city: editForm.city || null,
        state: editForm.state || null,
        pincode: editForm.pincode || null,
        country: editForm.country || null,
      }
      const res = await orgsApi.updateOrgProfile(orgToken, payload)
      if (res?.isSuccess === 1) {
        const fresh = await orgsApi.getOrgDetail(orgToken)
        setOrg(fresh)
        setEditing(false)
        onChanged?.()
      } else {
        setEditError(res?.message || 'Could not save changes. Please review the details and try again.')
      }
    } catch (e) {
      setEditError(e?.response?.data?.message || 'Could not save changes. Please review the details and try again.')
    } finally {
      setSavingEdit(false)
    }
  }

  if (!orgToken) return null
  if (!org) {
    return (
      <Drawer open onClose={onClose}>
        <div className="sm">Loading…</div>
      </Drawer>
    )
  }

  async function refreshDocs() {
    orgsApi.getOrgDocuments(orgToken).then(setDocuments).catch(() => {})
  }

  async function handleApprove() {
    setBusy(true)
    try {
      await orgsApi.approveOrg(orgToken, approveNonRegistered, approveRemarks.trim() || null)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  // Independent of the approve/reject/suspend flow — toggles registration
  // status on an already-APPROVED org. Refreshes the drawer's detail on
  // success (per spec) rather than closing it, since the admin may want to
  // keep reviewing the same org.
  async function handleSaveRegStatus() {
    setSavingRegStatus(true)
    try {
      const res = await orgsApi.setOrgNonRegistered(orgToken, regStatusNonRegistered, regStatusRemarks.trim() || null)
      if (res?.isSuccess === 1) {
        const fresh = await orgsApi.getOrgDetail(orgToken)
        setOrg(fresh)
        setRegStatusOpen(false)
        setRegStatusRemarks('')
        onChanged?.()
        alert('Registration status updated.')
      } else {
        alert(res?.message || 'Could not update registration status. Please try again.')
      }
    } catch (e) {
      alert(e?.response?.data?.message || 'Could not update registration status. Please try again.')
    } finally {
      setSavingRegStatus(false)
    }
  }
  async function handleReject() {
    if (!reason.trim()) return
    setBusy(true)
    try {
      await orgsApi.rejectOrg(orgToken, reason)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  // Reject an already-APPROVED org — backend now allows this (previously
  // PENDING/UNDER_REVIEW only) and cascade-cancels the org's live projects.
  // Kept as a separate handler/form from the PENDING-flow handleReject above
  // since it lives in a different section of the drawer with its own state.
  async function handleApprovedReject() {
    if (!approvedRejectReason.trim()) return
    setSavingCompliance(true)
    try {
      const res = await orgsApi.rejectOrg(orgToken, approvedRejectReason.trim())
      if (res?.isSuccess === 1) {
        onChanged?.()
        onClose()
      } else {
        alert(res?.message || 'Could not reject organisation. Please try again.')
      }
    } catch (e) {
      alert(e?.response?.data?.message || 'Could not reject organisation. Please try again.')
    } finally {
      setSavingCompliance(false)
    }
  }
  // Soft alternative to reject — org flips to NEEDS_UPDATE (hidden from public
  // listings) but its projects/members are left untouched. Founder resubmits
  // via the app; org lands in RESUBMITTED for Super Admin to re-approve.
  async function handleRequestUpdate() {
    if (!requestUpdateReason.trim()) return
    setSavingCompliance(true)
    try {
      const res = await orgsApi.requestOrgUpdate(orgToken, requestUpdateReason.trim())
      if (res?.isSuccess === 1) {
        onChanged?.()
        onClose()
      } else {
        alert(res?.message || 'Could not request update. Please try again.')
      }
    } catch (e) {
      alert(e?.response?.data?.message || 'Could not request update. Please try again.')
    } finally {
      setSavingCompliance(false)
    }
  }
  async function handleSuspend() {
    setBusy(true)
    try {
      await orgsApi.suspendOrg(orgToken, suspendReason || undefined)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  async function handleReactivate() {
    setBusy(true)
    try {
      await orgsApi.reactivateOrg(orgToken)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  // Both flags always go together — the API takes both on every call, so we
  // send the current (possibly just-flipped) value of each, not just the one
  // the admin clicked. Optimistic update with revert-on-failure since these
  // are simple booleans and the row already shows a spinner while in flight.
  async function handleTogglePermission(which) {
    if (savingPermission) return
    const nextRecurring = which === 'recurring' ? !canCreateRecurring : canCreateRecurring
    const nextFlexible  = which === 'flexible'  ? !canCreateFlexible  : canCreateFlexible

    setSavingPermission(which)
    setCanCreateRecurring(nextRecurring)
    setCanCreateFlexible(nextFlexible)
    try {
      const res = await orgsApi.updateOrgProjectPermissions(orgToken, nextRecurring, nextFlexible)
      if (res?.isSuccess === 1) {
        alert('Permissions updated')
      } else {
        throw new Error(res?.message || 'Update failed')
      }
    } catch {
      // Revert to pre-toggle state on failure — only the flag that was
      // actually clicked needs flipping back; the other was never touched.
      if (which === 'recurring') setCanCreateRecurring(!nextRecurring)
      else setCanCreateFlexible(!nextFlexible)
      alert('Could not update permissions. Please try again.')
    } finally {
      setSavingPermission(null)
    }
  }

  // Free-text field, so unlike the toggles this needs an explicit Save rather
  // than firing on every keystroke. Sends the current toggle values alongside
  // the new limit — same "both/all fields together" contract as the toggles.
  async function handleSaveMaxVolunteers() {
    if (savingPermission) return
    const trimmed = orgMaxVolunteers.trim()
    const parsed = Number(trimmed)
    if (!trimmed || !Number.isInteger(parsed) || parsed < 1) {
      setMaxVolunteersError('Enter a whole number of 1 or more.')
      return
    }
    setMaxVolunteersError('')
    const previous = org?.orgMaxVolunteers != null ? String(org.orgMaxVolunteers) : ''

    setSavingPermission('maxVolunteers')
    try {
      const res = await orgsApi.updateOrgProjectPermissions(orgToken, canCreateRecurring, canCreateFlexible, parsed)
      if (res?.isSuccess === 1) {
        setOrg((o) => (o ? { ...o, orgMaxVolunteers: parsed } : o))
        alert('Permissions updated')
      } else {
        throw new Error(res?.message || 'Update failed')
      }
    } catch (err) {
      setOrgMaxVolunteers(previous)
      alert(err?.response?.data?.message || 'Could not update max volunteers. Please try again.')
    } finally {
      setSavingPermission(null)
    }
  }

  async function handleVerifyDoc(doc) {
    await orgsApi.verifyOrgDocument(doc.orgDocumentToken, !doc.isVerified)
    refreshDocs()
  }

  async function handleViewDoc(doc) {
    setViewingDocId(doc.orgDocumentId)
    try {
      const url = await getDocumentSignedUrl(doc.fileUrl)
      if (url) window.open(url, '_blank', 'noreferrer')
    } catch {
      alert('Could not open this document. Please try again.')
    } finally {
      setViewingDocId(null)
    }
  }

  const status = org.statusCode

  return (
    <Drawer open onClose={onClose}>
      <div className="drawer-head">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Avatar name={org.orgName} photoUrl={org.logoUrl} size={56} radius={16} fontSize={18} />
          <div>
            <div className="h2">{org.orgName}</div>
            <div className="sm">{[org.orgType, org.city, org.state].filter(Boolean).join(' · ')}</div>
          </div>
        </div>
        {!editing && (
          <>
            <button className="btn-o btn-sm" style={{ flexShrink: 0 }} onClick={handleViewProfile}>View profile</button>
            <button className="btn-o btn-sm" style={{ flexShrink: 0 }} onClick={startEdit}>Edit</button>
          </>
        )}
        <button className="dr-close" onClick={onClose}>×</button>
      </div>

      {!editing && (
        <>
          <div className="slab">Quick facts</div>
          <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
            <div><div className="xs">Org type</div><div className="h3" style={{ fontSize: 13 }}>{org.orgType || '—'}</div></div>
            <div><div className="xs">Members</div><div className="h3" style={{ fontSize: 13 }}>{org.memberCount ?? '—'}</div></div>
            {/* "Registered on" = when this org signed up on Ripple Hub (Organisations.CreatedAt).
                "Registration date" = the org's own govt registration date (Organisations.RegistrationDate) —
                a completely different date, easy to confuse since both say "registration". */}
            <div><div className="xs">Registered on Ripple Hub</div><div className="h3" style={{ fontSize: 13 }}>{formatDateTime(org.submittedAt)}</div></div>
            {/* org.regNumber was already returned by SuperAdmin_Org_GetDetail but
                never rendered here — only shown inside the Edit form. */}
            <div><div className="xs">Registration No.</div><div className="h3" style={{ fontSize: 13 }}>{org.regNumber || (org.isNonRegistered ? 'Non-registered' : '—')}</div></div>
            <div><div className="xs">Registration date</div><div className="h3" style={{ fontSize: 13 }}>{formatDate(org.registrationDate)}</div></div>
          </div>

          <div className="slab">Tax eligibility</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <span className={`pill ${org.is80GEligible ? 'pg' : 'py'}`}>
              80G {org.is80GEligible ? '✓ Yes' : '✗ No'}
            </span>
            <span className={`pill ${org.is12AEligible ? 'pg' : 'py'}`}>
              12A {org.is12AEligible ? '✓ Yes' : '✗ No'}
            </span>
          </div>

          <div className="slab">Founder</div>
          <div className="body" style={{ marginBottom: 16 }}>
            <b>{org.founderName || '—'}</b><br />
            Email: {org.founderEmail || '—'} · Phone: {org.founderMobile || '—'}
          </div>

          <div className="slab">Organisation contact</div>
          <div className="body" style={{ marginBottom: 16 }}>
            Contact person: <b>{org.contactPerson || '—'}</b><br />
            Email: {org.contactEmail || '—'} · Phone: {org.contactPhone || '—'}
          </div>

          <div className="slab">Address</div>
          <div className="body" style={{ marginBottom: 16 }}>
            {[org.addressLine1, org.addressLine2, org.city, org.state, org.pincode].filter(Boolean).join(', ') || '—'}
          </div>

          <div className="slab">About</div>
          <div className="body" style={{ marginBottom: 12 }}>{org.about || '—'}</div>
          <div className="slab">Mission</div>
          <div className="body" style={{ marginBottom: 12 }}>{org.mission || '—'}</div>
          <div className="slab">Vision</div>
          <div className="body" style={{ marginBottom: 16 }}>{org.vision || '—'}</div>
        </>
      )}

      {editing && editForm && (
        <>
          <div className="slab">Edit organisation profile</div>
          {editError && <div className="xs" style={{ color: '#C0392B', marginBottom: 10 }}>{editError}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <input className="fi" placeholder="Organisation name *" value={editForm.orgName} onChange={(e) => updateEditField('orgName', e.target.value)} />
            <select className="fi" value={editForm.orgTypeLkpId} onChange={(e) => updateEditField('orgTypeLkpId', e.target.value)}>
              <option value="">Organisation type *</option>
              {orgTypes.map((t) => <option key={t.lookupValueId} value={t.lookupValueId}>{t.valueName}</option>)}
            </select>
            <input className="fi" placeholder="Registration number *" value={editForm.regNumber} onChange={(e) => updateEditField('regNumber', e.target.value)} />
            <input className="fi" type="date" placeholder="Registration date" value={editForm.registrationDate} onChange={(e) => updateEditField('registrationDate', e.target.value)} />
            <input className="fi" placeholder="Category" value={editForm.category} onChange={(e) => updateEditField('category', e.target.value)} />
            <input className="fi" placeholder="Contact person" value={editForm.contactPerson} onChange={(e) => updateEditField('contactPerson', e.target.value)} />
            <input className="fi" placeholder="Contact email" value={editForm.contactEmail} onChange={(e) => updateEditField('contactEmail', e.target.value)} />
            <input className="fi" placeholder="Contact phone" value={editForm.contactPhone} onChange={(e) => updateEditField('contactPhone', e.target.value)} />
            <input className="fi" placeholder="Website" value={editForm.website} onChange={(e) => updateEditField('website', e.target.value)} />
            <input className="fi" placeholder="Logo URL" value={editForm.logoUrl} onChange={(e) => updateEditField('logoUrl', e.target.value)} style={{ gridColumn: '1 / -1' }} />
            <textarea className="fi" placeholder="About" value={editForm.about} onChange={(e) => updateEditField('about', e.target.value)} style={{ gridColumn: '1 / -1', minHeight: 60 }} />
            <textarea className="fi" placeholder="Mission" value={editForm.mission} onChange={(e) => updateEditField('mission', e.target.value)} style={{ gridColumn: '1 / -1', minHeight: 50 }} />
            <textarea className="fi" placeholder="Vision" value={editForm.vision} onChange={(e) => updateEditField('vision', e.target.value)} style={{ gridColumn: '1 / -1', minHeight: 50 }} />
            <input className="fi" placeholder="Address line 1" value={editForm.addressLine1} onChange={(e) => updateEditField('addressLine1', e.target.value)} style={{ gridColumn: '1 / -1' }} />
            <input className="fi" placeholder="Address line 2" value={editForm.addressLine2} onChange={(e) => updateEditField('addressLine2', e.target.value)} style={{ gridColumn: '1 / -1' }} />
            <input className="fi" placeholder="City" value={editForm.city} onChange={(e) => updateEditField('city', e.target.value)} />
            <input className="fi" placeholder="State" value={editForm.state} onChange={(e) => updateEditField('state', e.target.value)} />
            <input className="fi" placeholder="PIN / ZIP code" value={editForm.pincode} onChange={(e) => updateEditField('pincode', e.target.value)} />
            <input className="fi" placeholder="Country" value={editForm.country} onChange={(e) => updateEditField('country', e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 16 }}>
            <button className="btn-o" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => setEditing(false)} disabled={savingEdit}>Cancel</button>
            <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} onClick={handleSaveEdit} disabled={savingEdit}>
              {savingEdit ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </>
      )}

      <div className="slab">Project Permissions</div>
      <div className="xs" style={{ marginBottom: 10 }}>Control which project types this organisation can create.</div>
      <div style={{ marginBottom: 16 }}>
        <PermissionRow
          label="Recurring Projects"
          subLabel="Allow this org to create multi-session recurring projects"
          checked={canCreateRecurring}
          saving={savingPermission === 'recurring'}
          disabled={savingPermission !== null}
          onToggle={() => handleTogglePermission('recurring')}
        />
        <PermissionRow
          label="Flexible Projects"
          subLabel="Allow this org to create open-ended flexible projects"
          checked={canCreateFlexible}
          saving={savingPermission === 'flexible'}
          disabled={savingPermission !== null}
          onToggle={() => handleTogglePermission('flexible')}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px 0' }}>
          <div style={{ paddingRight: 12 }}>
            <div className="h3" style={{ fontSize: 13 }}>Max Volunteers</div>
            <div className="xs">Maximum volunteers allowed per project for this org</div>
            {maxVolunteersError && <div className="xs" style={{ color: '#C0392B', marginTop: 2 }}>{maxVolunteersError}</div>}
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <input
              className="fi"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              style={{ width: 90 }}
              value={orgMaxVolunteers}
              disabled={savingPermission !== null}
              onChange={(e) => { setOrgMaxVolunteers(e.target.value); setMaxVolunteersError('') }}
            />
            <button
              className="btn-o btn-sm"
              style={{ width: 'auto' }}
              onClick={handleSaveMaxVolunteers}
              disabled={savingPermission !== null || orgMaxVolunteers.trim() === (org?.orgMaxVolunteers != null ? String(org.orgMaxVolunteers) : '')}
            >
              {savingPermission === 'maxVolunteers' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="slab">Submitted documents</div>
      {documents.length === 0 && <div className="xs" style={{ paddingBottom: 8 }}>No documents uploaded.</div>}
      {documents.map((d) => (
        <div className="doc-row" key={d.orgDocumentId}>
          <div className="doc-ic">{(d.documentType || '?').slice(0, 3).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div className="h3" style={{ fontSize: 12.5 }}>{d.documentType}</div>
            <div className="xs">{d.isVerified ? 'Verified' : 'Not verified'}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-o btn-sm" onClick={() => handleViewDoc(d)} disabled={viewingDocId === d.orgDocumentId}>
              {viewingDocId === d.orgDocumentId ? 'Loading…' : 'View'}
            </button>
            <button className="btn-o btn-sm" onClick={() => handleVerifyDoc(d)}>{d.isVerified ? 'Unverify' : 'Verify'}</button>
          </div>
        </div>
      ))}

      <div className="slab">Status history</div>
      {!historyAvailable && (
        <div className="xs" style={{ marginBottom: 8 }}>Couldn't load status history.</div>
      )}
      {historyAvailable && history.length === 0 && <div className="xs" style={{ marginBottom: 8 }}>No history recorded.</div>}
      {history.map((h, idx) => (
        <div className="doc-row" style={{ alignItems: 'flex-start' }} key={h.orgStatusHistoryId ?? idx}>
          <div className="doc-ic">&#8226;</div>
          <div style={{ flex: 1 }}>
            <div className="h3" style={{ fontSize: 12.5 }}>{h.newStatusName}{h.reason ? ` — ${h.reason}` : ''}</div>
            <div className="xs">{formatDateTime(h.createdAt)} · by {h.changedByType}</div>
          </div>
        </div>
      ))}

      <div className="divider" />

      {(status === 'PENDING' || status === 'UNDER_REVIEW') && (
        <div>
          <div className="slab">Decision</div>
          <div className="fl" style={{ marginBottom: 10 }}>
            <label>Remarks (optional, shown to org admins)</label>
            <textarea
              className="fta"
              value={approveRemarks}
              onChange={(e) => setApproveRemarks(e.target.value.slice(0, 1000))}
              placeholder="Optional remarks for the organisation admin…"
              maxLength={1000}
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={approveNonRegistered}
              onChange={(e) => setApproveNonRegistered(e.target.checked)}
            />
            <span className="sm">Approve as non-registered organisation</span>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-tl" style={{ flex: 1 }} onClick={handleApprove} disabled={busy}>Approve</button>
            <button className="btn-rd" style={{ flex: 1 }} onClick={() => setRejectOpen((o) => !o)}>Reject</button>
          </div>
          <div className={`reject-box${rejectOpen ? ' on' : ''}`}>
            <div className="fl" style={{ marginTop: 12 }}>
              <label>Reason for rejection (shown to founder)</label>
              <textarea
                className="fta"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Registration certificate unreadable, please re-upload a clear scan."
              />
            </div>
            <button className="btn-rd" style={{ width: '100%' }} onClick={handleReject} disabled={busy || !reason.trim()}>Confirm rejection</button>
          </div>
        </div>
      )}

      {status === 'APPROVED' && (
        <div>
          <div className="slab">Registration Status</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className={`pill ${org.isNonRegistered ? 'py' : 'pg'}`}>
              {org.isNonRegistered ? 'Non-Registered' : 'Registered'}
            </span>
            <button className="btn-o btn-sm" onClick={() => setRegStatusOpen((o) => !o)}>Change Registration Status</button>
          </div>
          <div className={`reject-box${regStatusOpen ? ' on' : ''}`}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={regStatusNonRegistered}
                onChange={(e) => setRegStatusNonRegistered(e.target.checked)}
              />
              <span className="sm">Mark as Non-Registered</span>
            </label>
            <div className="fl" style={{ marginTop: 10 }}>
              <label>Remarks (optional)</label>
              <textarea
                className="fta"
                value={regStatusRemarks}
                onChange={(e) => setRegStatusRemarks(e.target.value.slice(0, 1000))}
                placeholder="Reason for change…"
                maxLength={1000}
              />
            </div>
            <button className="btn-o" style={{ width: '100%' }} onClick={handleSaveRegStatus} disabled={savingRegStatus}>
              {savingRegStatus ? 'Saving…' : 'Save'}
            </button>
          </div>

          <div className="slab">Compliance</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <button className="btn-o" style={{ flex: 1 }} onClick={() => { setRequestUpdateOpen((o) => !o); setApprovedRejectOpen(false) }} disabled={savingCompliance}>
              Request Update
            </button>
            <button className="btn-rd" style={{ flex: 1 }} onClick={() => { setApprovedRejectOpen((o) => !o); setRequestUpdateOpen(false) }} disabled={savingCompliance}>
              Reject
            </button>
          </div>
          <div className={`reject-box${requestUpdateOpen ? ' on' : ''}`}>
            <div className="fl" style={{ marginTop: 12 }}>
              <label>Reason (shown to founder — org stays approved but hidden from public listings until they resubmit)</label>
              <textarea
                className="fta"
                value={requestUpdateReason}
                onChange={(e) => setRequestUpdateReason(e.target.value)}
                placeholder="e.g. Please re-upload a clearer copy of your 80G certificate."
              />
            </div>
            <button className="btn-o" style={{ width: '100%' }} onClick={handleRequestUpdate} disabled={savingCompliance || !requestUpdateReason.trim()}>
              {savingCompliance ? 'Saving…' : 'Confirm — request update'}
            </button>
          </div>
          <div className={`reject-box${approvedRejectOpen ? ' on' : ''}`}>
            <div className="fl" style={{ marginTop: 12 }}>
              <label>Reason for rejection (shown to founder — active projects will be cancelled)</label>
              <textarea
                className="fta"
                value={approvedRejectReason}
                onChange={(e) => setApprovedRejectReason(e.target.value)}
                placeholder="e.g. Registration found to be fraudulent."
              />
            </div>
            <button className="btn-rd" style={{ width: '100%' }} onClick={handleApprovedReject} disabled={savingCompliance || !approvedRejectReason.trim()}>
              {savingCompliance ? 'Saving…' : 'Confirm rejection'}
            </button>
          </div>

          <div className="slab">Actions</div>
          <button className="btn-yw" style={{ width: '100%' }} onClick={() => setSuspendOpen((o) => !o)} disabled={busy}>Suspend organisation</button>
          <div className={`reject-box${suspendOpen ? ' on' : ''}`}>
            <div className="fl" style={{ marginTop: 12 }}>
              <label>Reason (optional, logged to status history)</label>
              <textarea className="fta" value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} placeholder="e.g. Dormant 90+ days, no active projects." />
            </div>
            <button className="btn-yw" style={{ width: '100%' }} onClick={handleSuspend} disabled={busy}>Confirm suspension</button>
          </div>
        </div>
      )}

      {(status === 'NEEDS_UPDATE' || status === 'RESUBMITTED') && (
        <div>
          <div className="slab">Status</div>
          <div className="sm" style={{ marginBottom: 12 }}>
            {status === 'NEEDS_UPDATE'
              ? 'This organisation was previously approved but has been asked to update something. It is hidden from public listings until the founder resubmits.'
              : 'The founder has resubmitted this organisation after an update request. Review the changes and re-approve, or reject.'}
          </div>
          {status === 'RESUBMITTED' && (
            <>
              <div className="fl" style={{ marginBottom: 10 }}>
                <label>Remarks (optional, shown to org admins)</label>
                <textarea
                  className="fta"
                  value={approveRemarks}
                  onChange={(e) => setApproveRemarks(e.target.value.slice(0, 1000))}
                  placeholder="Optional remarks for the organisation admin…"
                  maxLength={1000}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-tl" style={{ flex: 1 }} onClick={handleApprove} disabled={busy}>Approve</button>
                <button className="btn-rd" style={{ flex: 1 }} onClick={() => setRejectOpen((o) => !o)}>Reject</button>
              </div>
              <div className={`reject-box${rejectOpen ? ' on' : ''}`}>
                <div className="fl" style={{ marginTop: 12 }}>
                  <label>Reason for rejection (shown to founder)</label>
                  <textarea
                    className="fta"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Registration certificate unreadable, please re-upload a clear scan."
                  />
                </div>
                <button className="btn-rd" style={{ width: '100%' }} onClick={handleReject} disabled={busy || !reason.trim()}>Confirm rejection</button>
              </div>
            </>
          )}
        </div>
      )}

      {status === 'SUSPENDED' && (
        <div>
          <div className="slab">Actions</div>
          <button className="btn-tl" style={{ width: '100%' }} onClick={handleReactivate} disabled={busy}>Reactivate organisation</button>
        </div>
      )}

      {status === 'REJECTED' && (
        <div>
          <div className="slab">Actions</div>
          <div className="xs" style={{ padding: '8px 0' }}>
            Rejected — nothing for you to do right now. The founder can edit their details/documents and resubmit
            from the mobile app, which puts it back in your Pending queue.
          </div>
        </div>
      )}
    </Drawer>
  )
}

// Pill-switch styling matches the existing Active toggle in LookupManagementPage.jsx
// (var(--p) on / #D8D8E4 off, 34x19 track) — kept consistent rather than introducing
// a new switch component or library for this one section.
function PermissionRow({ label, subLabel, checked, saving, disabled, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bd, #EEEEF2)' }}>
      <div style={{ paddingRight: 12 }}>
        <div className="h3" style={{ fontSize: 13 }}>{label}</div>
        <div className="xs">{subLabel}</div>
      </div>
      {saving ? (
        <div className="xs">Saving…</div>
      ) : (
        <div
          role="switch"
          aria-checked={checked}
          aria-label={label}
          style={{
            width: 34, height: 19, borderRadius: 10,
            background: checked ? 'var(--p)' : '#D8D8E4',
            position: 'relative', flexShrink: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
          onClick={disabled ? undefined : onToggle}
        >
          <div style={{ position: 'absolute', top: 2, left: checked ? 17 : 2, width: 15, height: 15, background: '#fff', borderRadius: '50%', transition: 'left .15s' }} />
        </div>
      )}
    </div>
  )
}
