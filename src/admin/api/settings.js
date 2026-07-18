import client from './client'

// Backed by the existing SettingsController — no new backend work needed.
// There is no "list all groups" endpoint, so the group list is maintained
// client-side in pages/SettingsPage.jsx, matched against the real seed data
// in Documents/NGOConnect_Complete_Setup_v4.4.sql.
export async function getSettingsByGroup(group) {
  const res = await client.get(`/settings/${group}`)
  return res.data?.data ?? []
}

export async function updateSetting(key, settingValue) {
  const res = await client.put(`/settings/${key}`, { settingValue })
  return res.data
}
