import client, { setToken, clearToken, getToken } from './client'

const USER_KEY = 'sa_user'

export async function login(username, password) {
  const res = await client.post('/superadmin/login', { username, password })
  const data = res.data?.data
  if (!data?.accessToken) {
    throw new Error(res.data?.message || 'Login failed')
  }
  setToken(data.accessToken)
  const user = {
    superAdminUserId: data.superAdminUserId,
    username: data.username,
    fullName: data.fullName,
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  clearToken()
  localStorage.removeItem(USER_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return !!getToken()
}
