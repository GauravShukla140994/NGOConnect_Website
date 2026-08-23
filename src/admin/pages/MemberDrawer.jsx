import { useEffect, useState } from 'react'
import Drawer from '../components/Drawer'
import Avatar from '../components/Avatar'
import StatusPill from '../components/StatusPill'
import * as membersApi from '../api/members'
import * as lookupsApi from '../api/lookups'
import { getDocumentSignedUrl } from '../api/media'

async function findLookup(typeCode) {
  const types = await lookupsApi.getLookupTypes()
  const type = types.find((t) => t.typeCode === typeCode)
  if (!type) return []
  return lookupsApi.getLookupValues(type.lookupTypeId)
}

function blankMemberEditForm(profile) {
  return {
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    mobile: profile?.mobile || '',
    countryCode: profile?.countryCode || '+91',
    genderLkpId: profile?.genderLkpId ? String(profile.genderLkpId) : '',
    dateOfBirth: profile?.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : '',
    profilePhoto: profile?.profilePhoto || '',
    addressLine1: profile?.addressLine1 || '',
    addressLine2: profile?.addressLine2 || '',
    city: profile?.city || '',
    state: profile?.state || '',
    pincode: profile?.pincode || '',
    country: profile?.country || 'India',
  }
}

function PillList({ items, cls }) {
  if (!items || items.length === 0) return <span className="xs">None on file.</span>
  return items.map((item, idx) => (
    <span className={`pill ${cls}`} style={{ margin: '0 6px 6px 0' }} key={idx}>{item}</span>
  ))
}

export default function MemberDrawer({ userId, onClose, onChanged }) {
  const [profile, setProfile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [error, setError] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [issueText, setIssueText] = useState('')
  const [busy, setBusy] = useState(false)
  const [viewingDocId, setViewingDocId] = useState(null)

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [genders, setGenders] = useState([])
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')

  useEffect(() => {
    if (!userId) return
    setProfile(null)
    setError(false)
    setRequestOpen(false)
    setIssueText('')
    setEditing(false)
    setEditError('')
    membersApi.getMemberProfile(userId).then(setProfile).catch(() => setError(true))
    membersApi.getMemberDocuments(userId).then(setDocuments).catch(() => setDocuments([]))
    findLookup('GENDER').then(setGenders).catch(() => setGenders([]))
  }, [userId])

  const emailMobileLocked = !!profile?.isVerified

  function startEdit() {
    setEditForm(blankMemberEditForm(profile))
    setEditError('')
    setEditing(true)
  }
  function updateEditField(field, value) {
    setEditForm((f) => ({ ...f, [field]: value }))
  }
  async function handleSaveEdit() {
    if (!editForm.firstName.trim()) { setEditError('First name is required.'); return }
    if (!emailMobileLocked && !editForm.email.trim() && !editForm.mobile.trim()) {
      setEditError('At least one of Email or Mobile is required.')
      return
    }

    setSavingEdit(true)
    setEditError('')
    try {
      const payload = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName || null,
        // Server-side also enforces this (SuperAdmin_User_UpdateProfile ignores
        // Email/Mobile once the member has logged in) — locking here too so
        // the request payload matches what's shown on screen.
        email: emailMobileLocked ? null : (editForm.email || null),
        mobile: emailMobileLocked ? null : (editForm.mobile || null),
        countryCode: editForm.countryCode || null,
        genderLkpId: editForm.genderLkpId ? Number(editForm.genderLkpId) : null,
        dateOfBirth: editForm.dateOfBirth || null,
        profilePhoto: editForm.profilePhoto || null,
        addressLine1: editForm.addressLine1 || null,
        addressLine2: editForm.addressLine2 || null,
        city: editForm.city || null,
        state: editForm.state || null,
        pincode: editForm.pincode || null,
        country: editForm.country || null,
      }
      const res = await membersApi.updateMemberProfile(userId, payload)
      if (res?.isSuccess === 1) {
        const fresh = await membersApi.getMemberProfile(userId)
        setProfile(fresh)
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

  if (!userId) return null

  if (error) {
    return (
      <Drawer open onClose={onClose}>
        <div className="xs">Couldn't load this member's profile. Please try again.</div>
      </Drawer>
    )
  }

  if (!profile) {
    return (
      <Drawer open onClose={onClose}>
        <div className="sm">Loading…</div>
      </Drawer>
    )
  }

  async function handleVerify() {
    setBusy(true)
    try {
      await membersApi.verifyMemberProfile(userId)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  async function handleRequestUpdate() {
    if (!issueText.trim()) return
    setBusy(true)
    try {
      await membersApi.requestMemberUpdate(userId, issueText)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  async function handleSuspend(reasonText) {
    if (!reasonText.trim()) return
    setBusy(true)
    try {
      await membersApi.suspendMember(userId, reasonText)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  async function handleReactivate() {
    setBusy(true)
    try {
      await membersApi.reactivateMember(userId)
      onChanged?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  async function handleVerifyDoc(doc) {
    await membersApi.verifyMemberDocument(doc.userDocumentId, !doc.isVerified)
    membersApi.getMemberDocuments(userId).then(setDocuments).catch(() => {})
  }

  async function handleViewDoc(doc) {
    setViewingDocId(doc.userDocumentId)
    try {
      const url = await getDocumentSignedUrl(doc.fileUrl)
      if (url) window.open(url, '_blank', 'noreferrer')
    } catch {
      alert('Could not open this document. Please try again.')
    } finally {
      setViewingDocId(null)
    }
  }

  return (
    <Drawer open onClose={onClose}>
      <div className="drawer-head">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Avatar name={profile.fullName} photoUrl={profile.profilePhoto} size={56} fontSize={18} />
          <div>
            <div className="h2">{profile.fullName}</div>
            <div className="sm">{[profile.role, profile.orgNames].filter(Boolean).join(' · ')}</div>
          </div>
        </div>
        {!editing && (
          <button className="btn-o btn-sm" style={{ flexShrink: 0 }} onClick={startEdit}>Edit</button>
        )}
        <button className="dr-close" onClick={onClose}>×</button>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        <div>
          <div className="slab">Profile verification</div>
          <StatusPill status={profile.profileVerificationStatus} />
        </div>
        <div>
          <div className="slab">Account</div>
          <StatusPill status={profile.accountStatus} />
        </div>
      </div>

      {!editing && (
        <>
          <div className="slab">Contact</div>
          <div className="body" style={{ marginBottom: 16 }}>Email: {profile.email || '—'} · Phone: {profile.mobile || '—'}</div>
        </>
      )}

      {editing && editForm && (
        <>
          <div className="slab">Edit member profile</div>
          {editError && <div className="xs" style={{ color: '#C0392B', marginBottom: 10 }}>{editError}</div>}
          {emailMobileLocked && (
            <div className="xs" style={{ marginBottom: 10 }}>
              This member has already logged in, so Email/Mobile can't be changed here — they'd need to use the
              app's own change-email/change-mobile flow (OTP verified).
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <input className="fi" placeholder="First name *" value={editForm.firstName} onChange={(e) => updateEditField('firstName', e.target.value)} />
            <input className="fi" placeholder="Last name" value={editForm.lastName} onChange={(e) => updateEditField('lastName', e.target.value)} />
            <input
              className="fi" placeholder="Email address" type="email" value={editForm.email}
              disabled={emailMobileLocked}
              style={emailMobileLocked ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
              onChange={(e) => updateEditField('email', e.target.value)}
            />
            <input
              className="fi" placeholder="Mobile number" value={editForm.mobile}
              disabled={emailMobileLocked}
              style={emailMobileLocked ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
              onChange={(e) => updateEditField('mobile', e.target.value)}
            />
            <select className="fi" value={editForm.genderLkpId} onChange={(e) => updateEditField('genderLkpId', e.target.value)}>
              <option value="">Gender (optional)</option>
              {genders.map((g) => <option key={g.lookupValueId} value={g.lookupValueId}>{g.valueName}</option>)}
            </select>
            <input className="fi" type="date" placeholder="Date of birth" value={editForm.dateOfBirth} onChange={(e) => updateEditField('dateOfBirth', e.target.value)} />
            <input className="fi" placeholder="Profile photo URL" value={editForm.profilePhoto} onChange={(e) => updateEditField('profilePhoto', e.target.value)} style={{ gridColumn: '1 / -1' }} />
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

      <div className="slab">Impact</div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
        <div><div className="xs">Hours volunteered</div><div className="h3" style={{ fontSize: 13 }}>{profile.hours ?? '—'}</div></div>
        <div><div className="xs">Reliability</div><div className="h3" style={{ fontSize: 13 }}>{profile.reliability ?? '—'}</div></div>
        <div><div className="xs">Projects completed</div><div className="h3" style={{ fontSize: 13 }}>{profile.projects ?? '—'}</div></div>
      </div>

      <div className="slab">Skills</div>
      <div style={{ marginBottom: 14 }}><PillList items={profile.skills} cls="pp" /></div>
      <div className="slab">Interests</div>
      <div style={{ marginBottom: 14 }}><PillList items={profile.interests} cls="pb" /></div>
      <div className="slab">Badges earned</div>
      <div style={{ marginBottom: 16 }}><PillList items={profile.badges} cls="py" /></div>

      <div className="slab">Other organisations</div>
      <div style={{ marginBottom: 8 }}>
        {(!profile.otherOrgs || profile.otherOrgs.length === 0) ? (
          <span className="xs">Not a member of any other organisation.</span>
        ) : profile.otherOrgs.map((o, idx) => (
          <div className="doc-row" key={idx}>
            <div style={{ flex: 1 }}>
              <div className="h3" style={{ fontSize: 12.5 }}>{o.orgName}</div>
              <div className="xs">{o.role}</div>
            </div>
            <span className={`pill ${o.status === 'Approved' ? 'pg' : 'py'}`}>{o.status}</span>
          </div>
        ))}
      </div>

      <div className="slab">Documents uploaded on profile</div>
      {documents.length === 0 && <div className="xs" style={{ padding: '8px 0' }}>No documents uploaded yet.</div>}
      {documents.map((d, idx) => (
        <div className="doc-row" key={d.userDocumentId ?? idx}>
          <div className="doc-ic">{(d.documentType || '?').slice(0, 2).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div className="h3" style={{ fontSize: 12.5 }}>{d.documentType}</div>
            <div className="xs">{d.isVerified ? 'Verified' : 'Not verified'}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-o btn-sm" onClick={() => handleViewDoc(d)} disabled={viewingDocId === d.userDocumentId}>
              {viewingDocId === d.userDocumentId ? 'Loading…' : 'View'}
            </button>
            <button className="btn-o btn-sm" onClick={() => handleVerifyDoc(d)}>{d.isVerified ? 'Unverify' : 'Verify'}</button>
          </div>
        </div>
      ))}

      <div className="divider" />

      <div className="slab">Profile verification decision</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-tl" style={{ flex: 1 }} onClick={handleVerify} disabled={busy}>Mark as verified</button>
        <button className="btn-rd" style={{ flex: 1 }} onClick={() => setRequestOpen((o) => !o)}>Request update</button>
      </div>
      <div className={`reject-box${requestOpen ? ' on' : ''}`}>
        <div className="fl" style={{ marginTop: 12 }}>
          <label>What needs to be fixed? (shown to member as a notification)</label>
          <textarea
            className="fta"
            value={issueText}
            onChange={(e) => setIssueText(e.target.value)}
            placeholder="e.g. Profile photo is blurry, please re-upload a clear face photo."
          />
        </div>
        <button className="btn-rd" style={{ width: '100%' }} onClick={handleRequestUpdate} disabled={busy || !issueText.trim()}>Send notification to member</button>
      </div>

      <div className="divider" />

      <div className="slab">Account access</div>
      {profile.accountStatus === 'SUSPENDED' ? (
        <button className="btn-tl" style={{ width: '100%' }} onClick={handleReactivate} disabled={busy}>Reactivate account</button>
      ) : (
        <SuspendAccountBox busy={busy} onConfirm={handleSuspend} />
      )}
    </Drawer>
  )
}

function SuspendAccountBox({ busy, onConfirm }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  return (
    <div>
      <button className="btn-yw" style={{ width: '100%' }} onClick={() => setOpen((o) => !o)} disabled={busy}>Suspend account</button>
      <div className={`reject-box${open ? ' on' : ''}`}>
        <div className="fl" style={{ marginTop: 12 }}>
          <label>Reason (required — member is signed out everywhere immediately)</label>
          <textarea className="fta" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Multiple volunteer complaints pending review." />
        </div>
        <button className="btn-yw" style={{ width: '100%' }} onClick={() => onConfirm(reason)} disabled={busy || !reason.trim()}>Confirm suspension</button>
      </div>
    </div>
  )
}
