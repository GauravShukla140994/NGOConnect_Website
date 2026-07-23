import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCommunicationDashboard, getCampaigns } from '../../api/communication'
import StatusPill from '../../components/StatusPill'

// Communication_GetDashboardStats returns raw counts only — rates are computed
// here client-side on purpose (see NGOConnect_Complete_Setup_v4.9.sql comment
// above that SP). Division-by-zero guarded with '—'.
function pct(numerator, denominator) {
  if (!denominator) return null
  return Math.round((numerator / denominator) * 1000) / 10
}

export default function CommunicationDashboardPage() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([getCommunicationDashboard(), getCampaigns({ pageSize: 5 })])
      .then(([d, list]) => {
        if (cancelled) return
        setStats(d)
        setRecent(list?.items ?? [])
      })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="sm">Loading…</div>

  if (error || !stats) {
    return (
      <div className="card">
        <div className="card-head"><div className="h3">Communication Center</div></div>
        <div style={{ padding: 18 }} className="xs">Dashboard stats aren't available right now.</div>
      </div>
    )
  }

  const deliveryRate = pct(stats.totalDelivered, stats.totalAttempted)
  const openRate = pct(stats.totalOpened, stats.totalDelivered)
  const clickRate = pct(stats.totalClicked, stats.totalOpened)

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi"><div className="sm">Push sent</div><div className="n">{stats.totalPushSent ?? 0}</div></div>
        <div className="kpi"><div className="sm">Email sent</div><div className="n">{stats.totalEmailSent ?? 0}</div></div>
        <div className="kpi"><div className="sm">Delivered</div><div className="n" style={{ color: 'var(--tl)' }}>{stats.totalDelivered ?? 0}</div></div>
        <div className="kpi"><div className="sm">Failed</div><div className="n" style={{ color: 'var(--rd)' }}>{stats.totalFailed ?? 0}</div></div>
      </div>

      <div className="kpi-grid">
        <div className="kpi"><div className="sm">Delivery rate</div><div className="n">{deliveryRate != null ? `${deliveryRate}%` : '—'}</div></div>
        <div className="kpi"><div className="sm">Open rate</div><div className="n">{openRate != null ? `${openRate}%` : '—'}</div></div>
        <div className="kpi"><div className="sm">Click rate</div><div className="n">{clickRate != null ? `${clickRate}%` : '—'}</div></div>
        <div className="kpi">
          <div className="sm">Campaigns</div>
          <div className="n" style={{ fontSize: 16, display: 'flex', gap: 10, marginTop: 4 }}>
            <span title="Active"><span style={{ color: 'var(--or)' }}>{stats.activeCampaigns ?? 0}</span> active</span>
          </div>
          <div className="xs">{stats.scheduledCampaigns ?? 0} scheduled · {stats.draftCampaigns ?? 0} draft</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="h3">Recent campaigns</div>
          <Link className="btn-link" to="/admin/communication/campaigns">View all →</Link>
        </div>
        <table>
          <tbody>
            <tr><th>Campaign</th><th>Channels</th><th>Status</th><th>Recipients</th><th>Created</th></tr>
            {recent.map((c) => (
              <tr key={c.campaignId}>
                <td>
                  <Link className="btn-link" to={`/admin/communication/campaigns/${c.campaignId}`}>{c.campaignName}</Link>
                </td>
                <td className="sm">{c.channels || '—'}</td>
                <td><StatusPill status={c.statusCode} /></td>
                <td className="sm">{c.estimatedRecipients ?? '—'}</td>
                <td className="sm">{c.createdAt}</td>
              </tr>
            ))}
            {recent.length === 0 && <tr><td colSpan={5} className="xs" style={{ padding: 18 }}>No campaigns yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
