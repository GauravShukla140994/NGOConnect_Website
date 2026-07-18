import { useEffect, useState } from 'react'
import Drawer from '../components/Drawer'
import Avatar from '../components/Avatar'
import StatusPill from '../components/StatusPill'
import * as membersApi from '../api/members'

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

  useEffect(() => {
    if (!userId) return
    setProfile(null)
    setError(false)
    setRequestOpen(false)
    setIssueText('')
    membersApi.getMemberProfile(userId).then(setProfile).catch(() => setError(true))
    membersApi.getMemberDocuments(userId).then(setDocuments).catch(() => setDocuments([]))
  }, [userId])

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

      <div className="slab">Contact</div>
      <div className="body" style={{ marginBottom: 16 }}>Email: {profile.email || '—'} · Phone: {profile.mobile || '—'}</div>

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
            <a className="btn-o btn-sm" href={d.fileUrl} target="_blank" rel="noreferrer">View</a>
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
