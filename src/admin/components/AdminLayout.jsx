import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import { getOrgsByStatus } from '../api/orgs'

const NAV_ITEMS = [
  { to: '/admin/overview', icon: '◻', label: 'Overview' },
  { to: '/admin/orgs', icon: '🏢', label: 'Organisations', badge: true },
  { to: '/admin/members', icon: '👥', label: 'Members' },
  { to: '/admin/settings', icon: '⚙', label: 'Settings' },
  { to: '/admin/lookup', icon: '📋', label: 'Lookup management' },
]

const TITLE_MAP = {
  overview: 'Overview',
  orgs: 'Organisations',
  members: 'Members',
  settings: 'Settings',
  lookup: 'Lookup management',
}

export default function AdminLayout() {
  const { user, logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [pendingCount, setPendingCount] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([getOrgsByStatus('PENDING'), getOrgsByStatus('UNDER_REVIEW')])
      .then(([pending, underReview]) => {
        if (!cancelled) setPendingCount(pending.length + underReview.length)
      })
      .catch(() => {
        if (!cancelled) setPendingCount(null)
      })
    return () => { cancelled = true }
  }, [location.pathname])

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const seg = location.pathname.split('/').filter(Boolean).pop()
  const title = TITLE_MAP[seg] || 'Admin'

  const initials = (user?.fullName || 'Super Admin')
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="admin-root">
      <div id="app">
        <div className="sidebar">
          <div className="sb-logo">
            <div className="mark">NC</div>
            <div>
              <div className="name">NGO Connect</div>
              <div className="tag">SUPER ADMIN</div>
            </div>
          </div>

          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' on' : ''}`}>
              <span className="ic">{item.icon}</span> {item.label}
              {item.badge && pendingCount ? <span className="badge">{pendingCount}</span> : null}
            </NavLink>
          ))}

          <div className="sb-foot">
            <div className="nav-item" onClick={handleLogout}><span className="ic">&#8592;</span> Log out</div>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <div className="h1">{title}</div>
            <div className="admin-chip">
              <div className="av">{initials}</div>
              <div>
                <div className="h3" style={{ fontSize: 13 }}>{user?.fullName || 'Super Admin'}</div>
                <div className="xs">Super Admin</div>
              </div>
            </div>
          </div>
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
