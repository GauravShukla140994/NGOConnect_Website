// Maps every status code used across the admin panel (org status, membership,
// account, profile verification) to the prototype's pill color classes.
const PILL_MAP = {
  PENDING: { cls: 'po', label: 'Pending' },
  UNDER_REVIEW: { cls: 'po', label: 'Under Review' },
  APPROVED: { cls: 'pg', label: 'Approved' },
  REJECTED: { cls: 'pr', label: 'Rejected' },
  SUSPENDED: { cls: 'pgr', label: 'Suspended' },
  ACTIVE: { cls: 'pg', label: 'Active' },
  VERIFIED: { cls: 'pg', label: 'Verified' },
  UNREVIEWED: { cls: 'pgr', label: 'Not reviewed' },
  NOT_REVIEWED: { cls: 'pgr', label: 'Not reviewed' },
  NEEDS_UPDATE: { cls: 'pr', label: 'Needs update' },
}

export default function StatusPill({ status, label }) {
  if (!status && !label) return <span className="pill pgr">—</span>
  const meta = PILL_MAP[status] || { cls: 'pgr', label: label || status }
  return <span className={`pill ${meta.cls}`}>{label || meta.label}</span>
}
