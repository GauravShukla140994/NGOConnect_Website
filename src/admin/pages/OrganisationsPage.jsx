import { useCallback, useEffect, useState } from 'react'
import Avatar from '../components/Avatar'
import StatusPill from '../components/StatusPill'
import * as orgsApi from '../api/orgs'
import OrgDrawer from './OrgDrawer'

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'rejected', label: 'Rejected' },
]

export default function OrganisationsPage() {
  const [buckets, setBuckets] = useState({ pending: [], approved: [], suspended: [], rejected: [] })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')
  const [selectedOrgId, setSelectedOrgId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const b = await orgsApi.getAllOrgsBucketed()
      setBuckets(b)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const rows = buckets[tab] || []

  return (
    <div className="card">
      <div className="tabs">
        {TABS.map((t) => (
          <div key={t.key} className={`tab${tab === t.key ? ' on' : ''}`} onClick={() => setTab(t.key)}>
            {t.label} ({buckets[t.key]?.length ?? 0})
          </div>
        ))}
      </div>
      <div className="xs" style={{ padding: '10px 18px 0' }}>
        Status codes: PENDING → APPROVED / REJECTED (by you). An APPROVED org can be SUSPENDED for cause, and reactivated back to APPROVED later.
      </div>

      {loading ? (
        <div style={{ padding: 18 }} className="sm">Loading…</div>
      ) : (
        <table>
          <tbody>
            <tr><th>Organisation</th><th>Type</th><th>City</th><th>Submitted</th><th>Status</th><th>Action</th></tr>
            {rows.map((o) => (
              <tr key={o.orgId}>
                <td><div className="org-row"><Avatar name={o.orgName} photoUrl={o.logoUrl} size={32} radius={8} /> {o.orgName}</div></td>
                <td className="sm">{o.orgType || '—'}</td>
                <td className="sm">{o.city}</td>
                <td className="sm">{o.submittedAt}</td>
                <td><StatusPill status={o.statusCode} /></td>
                <td><button className="btn-o btn-sm" onClick={() => setSelectedOrgId(o.orgId)}>{tab === 'pending' ? 'Review' : 'View'}</button></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="xs" style={{ padding: 18 }}>No organisations in this tab.</td></tr>}
          </tbody>
        </table>
      )}

      <OrgDrawer orgId={selectedOrgId} onClose={() => setSelectedOrgId(null)} onChanged={load} />
    </div>
  )
}
