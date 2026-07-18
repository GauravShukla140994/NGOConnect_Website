import { useCallback, useEffect, useState } from 'react'
import Avatar from '../components/Avatar'
import StatusPill from '../components/StatusPill'
import MultiSelectDropdown from '../components/MultiSelectDropdown'
import * as membersApi from '../api/members'
import * as orgsApi from '../api/orgs'
import MemberDrawer from './MemberDrawer'

export default function MembersPage() {
  const [orgOptions, setOrgOptions] = useState([])
  const [selectedOrgIds, setSelectedOrgIds] = useState([])
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)

  useEffect(() => {
    // Build the filter from orgs of EVERY status, not just APPROVED — otherwise the
    // default "all organisations" selection silently excludes members whose only org
    // is still PENDING/UNDER_REVIEW/REJECTED/SUSPENDED, which is exactly the opposite
    // of what cross-NGO oversight needs (a pending org's founder is who you most need
    // to see here).
    orgsApi.getAllOrgsBucketed()
      .then((buckets) => {
        const all = [...buckets.pending, ...buckets.approved, ...buckets.suspended, ...buckets.rejected]
        const opts = all.map((o) => ({ value: o.orgId, label: o.orgName }))
        setOrgOptions(opts)
        setSelectedOrgIds(opts.map((o) => o.value))
      })
      .catch(() => {})
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const list = await membersApi.getMembers({ orgIds: selectedOrgIds, search })
      setMembers(list)
    } catch {
      setError(true)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [selectedOrgIds, search])

  useEffect(() => { load() }, [load])

  return (
    <div className="card" style={{ overflow: 'visible' }}>
      <div className="card-head" style={{ flexWrap: 'wrap', gap: 10, position: 'relative', zIndex: 2 }}>
        <div className="h3">All members — cross-NGO oversight</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <MultiSelectDropdown options={orgOptions} selected={selectedOrgIds} onChange={setSelectedOrgIds} placeholder="All organisations" />
          <input className="fs" style={{ width: 220 }} placeholder="Search by name, email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {error ? (
        <div style={{ padding: 18 }} className="xs">Couldn't load members. Please try again.</div>
      ) : loading ? (
        <div style={{ padding: 18 }} className="sm">Loading…</div>
      ) : (
        <table>
          <tbody>
            <tr><th>Member</th><th>Organisation</th><th>Role</th><th>Membership</th><th>Account</th><th>Profile verification</th><th>Joined</th><th>Action</th></tr>
            {members.map((m) => (
              <tr key={m.userId}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Avatar name={m.fullName} photoUrl={m.profilePhoto} size={28} /> {m.fullName}</div></td>
                <td className="sm">{m.orgNames || 'No organisation yet'}</td>
                <td className="sm">{m.role || '—'}</td>
                <td>{m.membershipStatus ? <StatusPill status={m.membershipStatus} /> : <span className="xs">—</span>}</td>
                <td><StatusPill status={m.accountStatus} /></td>
                <td><StatusPill status={m.profileVerificationStatus} /></td>
                <td className="sm">{m.joinedAt}</td>
                <td><button className="btn-o btn-sm" onClick={() => setSelectedUserId(m.userId)}>Review</button></td>
              </tr>
            ))}
            {members.length === 0 && <tr><td colSpan={8} className="xs" style={{ padding: 18 }}>No members match this filter.</td></tr>}
          </tbody>
        </table>
      )}

      <div style={{ padding: '14px 18px' }} className="xs">
        Three separate things, on purpose: <b>Membership</b> (Approved/Pending, set by the NGO's own admin),
        <b> Account</b> (Active/Suspended — platform-wide, for policy violations/fraud), and
        <b> Profile verification</b> (your document check).
      </div>

      <MemberDrawer userId={selectedUserId} onClose={() => setSelectedUserId(null)} onChanged={load} />
    </div>
  )
}
