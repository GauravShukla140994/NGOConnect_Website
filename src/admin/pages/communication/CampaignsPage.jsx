import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatusPill from '../../components/StatusPill'
import { getCampaigns, sendCampaignNow, cancelCampaign } from '../../api/communication'

// Doubles as the campaign history view — Campaign_GetList already returns the
// delivered/opened/clicked/failed rollups per campaign, so there's no separate
// "history" page in Phase 1. A dedicated History tab is Phase 3 (per-recipient
// drill-down via Campaign_GetHistoryDetail) — not built yet.
const TABS = [
  { key: '', label: 'All' },
  { key: 'DRAFT', label: 'Draft' },
  { key: 'SCHEDULED', label: 'Scheduled' },
  { key: 'RUNNING', label: 'Running' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'FAILED', label: 'Failed' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

const PAGE_SIZE = 20

export default function CampaignsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('')
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getCampaigns({ statusCode: tab || undefined, search: search || undefined, pageNumber, pageSize: PAGE_SIZE })
      setRows(result.items ?? [])
      setTotalCount(result.totalCount ?? 0)
    } finally {
      setLoading(false)
    }
  }, [tab, search, pageNumber])

  useEffect(() => { load() }, [load])

  function changeTab(key) {
    setTab(key)
    setPageNumber(1)
  }

  async function handleSendNow(campaignId) {
    if (!window.confirm('Send this campaign now? This will queue it for immediate delivery.')) return
    setBusyId(campaignId)
    try {
      await sendCampaignNow(campaignId)
      await load()
    } finally {
      setBusyId(null)
    }
  }

  async function handleCancel(campaignId) {
    if (!window.confirm('Cancel this campaign?')) return
    setBusyId(campaignId)
    try {
      await cancelCampaign(campaignId)
      await load()
    } finally {
      setBusyId(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <div className="card">
      <div className="card-head">
        <div className="h3">Campaigns</div>
        <button className="btn-p" style={{ width: 'auto', padding: '9px 18px' }} onClick={() => navigate('/admin/communication/campaigns/new')}>
          + Create campaign
        </button>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <div key={t.key} className={`tab${tab === t.key ? ' on' : ''}`} onClick={() => changeTab(t.key)}>
            {t.label}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 18px 0' }}>
        <input
          className="fs"
          style={{ width: 260 }}
          placeholder="Search campaign name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPageNumber(1) }}
        />
      </div>

      {loading ? (
        <div style={{ padding: 18 }} className="sm">Loading…</div>
      ) : (
        <table>
          <tbody>
            <tr>
              <th>Campaign</th><th>Type</th><th>Channels</th><th>Status</th>
              <th>Recipients</th><th>Delivered</th><th>Failed</th><th>Created</th><th>Action</th>
            </tr>
            {rows.map((c) => (
              <tr key={c.campaignId}>
                <td>
                  <Link className="btn-link" to={`/admin/communication/campaigns/${c.campaignId}`}>{c.campaignName}</Link>
                </td>
                <td className="sm">{c.campaignTypeName || c.campaignTypeCode || '—'}</td>
                <td className="sm">{c.channels || '—'}</td>
                <td><StatusPill status={c.statusCode} label={c.statusName} /></td>
                <td className="sm">{c.totalRecipients ?? c.estimatedRecipients ?? '—'}</td>
                <td className="sm">{c.deliveredCount ?? '—'}</td>
                <td className="sm">{c.failedCount ?? '—'}</td>
                <td className="sm">{c.createdAt}</td>
                <td>
                  <div className="act-row">
                    {c.statusCode === 'DRAFT' && (
                      <button className="btn-o btn-sm" disabled={busyId === c.campaignId} onClick={() => handleSendNow(c.campaignId)}>Send now</button>
                    )}
                    {['DRAFT', 'SCHEDULED', 'PAUSED'].includes(c.statusCode) && (
                      <button className="btn-rd btn-sm" disabled={busyId === c.campaignId} onClick={() => handleCancel(c.campaignId)}>Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={9} className="xs" style={{ padding: 18 }}>No campaigns in this tab.</td></tr>}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '14px 18px' }} className="sm">
          <button className="btn-o btn-sm" disabled={pageNumber <= 1} onClick={() => setPageNumber((p) => p - 1)}>Prev</button>
          Page {pageNumber} of {totalPages}
          <button className="btn-o btn-sm" disabled={pageNumber >= totalPages} onClick={() => setPageNumber((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}
