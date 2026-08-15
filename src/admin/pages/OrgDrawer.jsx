import { useEffect, useState } from 'react'
import Drawer from '../components/Drawer'
import Avatar from '../components/Avatar'
import * as orgsApi from '../api/orgs'
import { getDocumentSignedUrl } from '../api/media'

export default function OrgDrawer({ orgId, onClose, onChanged }) {
  const [org, setOrg] = useState(null)
  const [documents, setDocuments] = useState([])
  const [history, setHistory] = useState([])
  const [historyAvailable, setHistoryAvailable] = useState(true)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [viewingDocId, setViewingDocId] = useState(null)
  const [canCreateRecurring, setCanCreateRecurring] = useState(false)
  const [canCreateFlexible, setCanCreateFlexible] = useState(false)
  const [orgMaxVolunteers, setOrgMaxVolunteers] = useState('')
  const [savingPermission, setSavingPermission] = useState(null) // 'recurring' | 'flexible' | 'maxVolunteers' | null
  const [maxVolunteersError, setMaxVolunteersError] = useState('')

  useEffect(() => {
    if (!orgId) return
    setOrg(null)
    setRejectOpen(false)
    setReason('')
    setSuspendOpen(false)
    setSuspendReason('')
    setMaxVolunteersError('')
    orgsApi.getOrgDetail(orgId).then((o) => {
      setOrg(o)
      // SP returns TINYINT (0/1), not a real boolean — coerce explicitly.
      setCanCreateRecurring(!!o?.canCreateRecurring)
      setCanCreateFlexible(!!o?.canCreateFlexible)
      setOrgMaxVolunteers(o?.orgMaxVolunteers != null ? String(o.orgMaxVolunteers) : '')
    }).catch(() => setOrg(null))
    orgsApi.getOrgDocuments(orgId).then(setDocuments).catch(() => setDocuments([]))
    orgsApi.getOrgStatusHistory(orgId)
      .then((h) => { setHistory(h); setHistoryAvailable(true) })
      .catch(() => { setHistory([]); setHistoryAvailable(false) })
  }, [orgId])

  if (!orgId) return null
  if (!org) {
    return (
      <Drawer open onClose={onClose}>
        <div className="sm">Loading…</div>
      </Drawer>
    )
  }

  async function refreshDocs() {
    orgsApi.getOrgDocuments(orgId).then(setDocuments).catch(() => {})
  }

  async function handleApprove() {
    setBusy(true)
    try {
      await orgsApi.approveOrg(orgId)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  async function handleReject() {
    if (!reason.trim()) return
    setBusy(true)
    try {
      await orgsApi.rejectOrg(orgId, reason)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  async function handleSuspend() {
    setBusy(true)
    try {
      await orgsApi.suspendOrg(orgId, suspendReason || undefined)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  async function handleReactivate() {
    setBusy(true)
    try {
      await orgsApi.reactivateOrg(orgId)
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
      const res = await orgsApi.updateOrgProjectPermissions(orgId, nextRecurring, nextFlexible)
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
      const res = await orgsApi.updateOrgProjectPermissions(orgId, canCreateRecurring, canCreateFlexible, parsed)
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
    await orgsApi.verifyOrgDocument(doc.orgDocumentId, !doc.isVerified)
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
        <button className="dr-close" onClick={onClose}>×</button>
      </div>

      <div className="slab">Quick facts</div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
        <div><div className="xs">Org type</div><div className="h3" style={{ fontSize: 13 }}>{org.orgType || '—'}</div></div>
        <div><div className="xs">Members</div><div className="h3" style={{ fontSize: 13 }}>{org.memberCount ?? '—'}</div></div>
        <div><div className="xs">Registered on</div><div className="h3" style={{ fontSize: 13 }}>{org.submittedAt || '—'}</div></div>
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
            <div className="xs">{h.createdAt} · by {h.changedByType}</div>
          </div>
        </div>
      ))}

      <div className="divider" />

      {(status === 'PENDING' || status === 'UNDER_REVIEW') && (
        <div>
          <div className="slab">Decision</div>
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
