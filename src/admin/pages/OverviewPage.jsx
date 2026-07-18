import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../api/dashboard'
import Avatar from '../components/Avatar'
import StatusPill from '../components/StatusPill'

export default function OverviewPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getDashboard()
      .then((d) => { if (!cancelled) setData(d) })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="sm">Loading…</div>

  if (error || !data) {
    return (
      <div className="card">
        <div className="card-head"><div className="h3">Overview</div></div>
        <div style={{ padding: 18 }} className="xs">
          Dashboard KPIs aren't available yet — this depends on <code>GET /superadmin/dashboard</code>,
          which is not built on the backend yet (see <code>SuperAdmin_Backend_Dev_Prompt.md</code>, Section 3).
          Once it ships, this screen will populate automatically.
        </div>
      </div>
    )
  }

  const kpis = data.kpis || data
  const recent = data.recentOrgs || []

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi"><div className="sm">Total NGOs</div><div className="n">{kpis.totalOrgs ?? '—'}</div></div>
        <div className="kpi"><div className="sm">Pending approval</div><div className="n" style={{ color: 'var(--or)' }}>{kpis.pendingOrgs ?? '—'}</div></div>
        <div className="kpi"><div className="sm">Active volunteers</div><div className="n">{kpis.activeVolunteersLast30Days ?? kpis.totalVolunteers ?? '—'}</div></div>
        <div className="kpi"><div className="sm">Total donations</div><div className="n">{kpis.totalDonationsAmount != null ? `₹${kpis.totalDonationsAmount}` : '—'}</div></div>
      </div>
      <div className="card">
        <div className="card-head">
          <div className="h3">Recently submitted</div>
          <Link className="btn-link" to="/admin/orgs">View all →</Link>
        </div>
        <table>
          <tbody>
            <tr><th>Organisation</th><th>Submitted</th><th>Status</th></tr>
            {recent.map((o) => (
              <tr key={o.orgId}>
                <td><div className="org-row"><Avatar name={o.orgName} photoUrl={o.logoUrl} size={32} radius={8} /> {o.orgName}</div></td>
                <td className="sm">{o.submittedAt}</td>
                <td><StatusPill status={o.statusCode} /></td>
              </tr>
            ))}
            {recent.length === 0 && <tr><td colSpan={3} className="xs" style={{ padding: 18 }}>Nothing submitted recently.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
