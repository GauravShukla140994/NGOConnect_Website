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

  useEffect(() => {
    if (!orgId) return
    setOrg(null)
    setRejectOpen(false)
    setReason('')
    setSuspendOpen(false)
    setSuspendReason('')
    orgsApi.getOrgDetail(orgId).then(setOrg).catch(() => setOrg(null))
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

      <div className="slab">Founder &amp; contact</div>
      <div className="body" style={{ marginBottom: 16 }}>
        Founder: <b>{org.founderName || '—'}</b><br />
        Email: {org.founderEmail || '—'} · Phone: {org.founderMobile || '—'}
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
