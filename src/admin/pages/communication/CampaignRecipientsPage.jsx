import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCampaign, getCampaignRecipients } from '../../api/communication'
import { formatDateTime } from '../../utils/date'

// Per-recipient drill-down — phone/email/name + individual delivery status.
// DeliveredCount here means real device-confirmed delivery (CampaignRecipient_AckDelivered),
// not just "FCM accepted the send" (that's QueueStatus = SENT, a distinct row).
const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'SENT', label: 'Sent (not yet confirmed)' },
  { key: 'FAILED', label: 'Failed' },
  { key: 'SKIPPED_OPTOUT', label: 'Skipped (opted out)' },
  { key: 'SKIPPED_NO_ADDRESS', label: 'Skipped (no address)' },
]

const STATUS_PILL = {
  QUEUED: 'pgr', PROCESSING: 'pb', SENT: 'po', DELIVERED: 'pg',
  FAILED: 'pr', SKIPPED_OPTOUT: 'pgr', SKIPPED_NO_ADDRESS: 'pgr',
}

const PAGE_SIZE = 25

export default function CampaignRecipientsPage() {
  const { campaignId } = useParams()
  const navigate = useNavigate()
  const [campaignName, setCampaignName] = useState('')
  const [statusCode, setStatusCode] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCampaign(campaignId).then((c) => setCampaignName(c?.campaignName || '')).catch(() => {})
  }, [campaignId])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getCampaignRecipients(campaignId, { statusCode: statusCode || undefined, pageNumber, pageSize: PAGE_SIZE })
      setRows(result.items ?? [])
      setTotalCount(result.totalCount ?? 0)
    } finally {
      setLoading(false)
    }
  }, [campaignId, statusCode, pageNumber])

  useEffect(() => { load() }, [load])

  function changeTab(key) {
    setStatusCode(key)
    setPageNumber(1)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <div className="card">
      <div className="card-head">
        <div className="h3">Recipients — {campaignName || `Campaign #${campaignId}`}</div>
        <button className="btn-o btn-sm" onClick={() => navigate('/admin/communication/campaigns')}>Back to list</button>
      </div>

      <div className="tabs">
        {STATUS_TABS.map((t) => (
          <div key={t.key} className={`tab${statusCode === t.key ? ' on' : ''}`} onClick={() => changeTab(t.key)}>
            {t.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 18 }} className="sm">Loading…</div>
      ) : (
        <table>
          <tbody>
            <tr>
              <th>User</th><th>Email</th><th>Mobile</th><th>Channel</th><th>Status</th>
              <th>Sent</th><th>Delivered</th><th>Fail reason</th>
            </tr>
            {rows.map((r) => (
              <tr key={`${r.campaignRecipientId}`}>
                <td className="sm">{r.userName || `User #${r.userId}`}</td>
                <td className="sm">{r.email || '—'}</td>
                <td className="sm">{r.mobile || '—'}</td>
                <td className="sm">{r.channelCode}</td>
                <td><span className={`pill ${STATUS_PILL[r.queueStatus] || 'pgr'}`}>{r.queueStatus}</span></td>
                <td className="xs">{formatDateTime(r.sentAt)}</td>
                <td className="xs">{formatDateTime(r.deliveredAt)}</td>
                <td className="xs">{r.failReason || '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="xs" style={{ padding: 18 }}>No recipients in this filter.</td></tr>}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '14px 18px' }} className="sm">
          <button className="btn-o btn-sm" disabled={pageNumber <= 1} onClick={() => setPageNumber((p) => p - 1)}>Prev</button>
          Page {pageNumber} of {totalPages} ({totalCount} recipients)
          <button className="btn-o btn-sm" disabled={pageNumber >= totalPages} onClick={() => setPageNumber((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}
