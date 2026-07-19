import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function LoginPage() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/admin/overview', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-root">
      <div id="loginScreen">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-logo">NC</div>
          <div className="login-title">Super Admin</div>
          <div className="login-sub">Internal access only — RippleHub platform team</div>
          {error && <div className="login-err">{error}</div>}
          <div className="fl">
            <label>Username</label>
            <input className="fi" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus />
          </div>
          <div className="fl">
            <label>Password</label>
            <input className="fi" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button className="btn-p" type="submit" disabled={loading || !username || !password}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 16 }} className="xs">
            No self-signup — accounts are created directly in the DB by the dev team.
          </div>
        </form>
      </div>
    </div>
  )
}
