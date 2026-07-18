import { useEffect, useState } from 'react'
import * as settingsApi from '../api/settings'

// No "list all groups" endpoint exists on SettingsController, so the group list is
// maintained here, matched against the real seed data in
// Documents/NGOConnect_Complete_Setup_v4.4.sql. Groups with zero settings in a given
// environment are hidden automatically once loaded.
const GROUPS = ['OTP', 'AUTH', 'PAGINATION', 'PLATFORM', 'FEATURE', 'DONATION', 'UPLOAD', 'SOS', 'SMS', 'PROJECT']

function SettingRow({ setting, onSaved }) {
  const [value, setValue] = useState(setting.settingValue)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      await settingsApi.updateSetting(setting.settingKey, value)
      onSaved?.()
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr>
      <td className="sm">{setting.settingKey}</td>
      <td style={{ width: 130 }}>
        {setting.dataType === 'BOOLEAN' ? (
          <div
            style={{
              width: 38, height: 22, borderRadius: 11,
              background: value === 'true' ? 'var(--p)' : '#D8D8E4',
              position: 'relative', cursor: 'pointer',
            }}
            onClick={() => setValue(value === 'true' ? 'false' : 'true')}
          >
            <div style={{ position: 'absolute', top: 3, left: value === 'true' ? 19 : 3, width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: 'left .15s' }} />
          </div>
        ) : (
          <input className="fs" value={value} onChange={(e) => setValue(e.target.value)} />
        )}
      </td>
      <td className="sm">{setting.description}</td>
      <td><button className="btn-p btn-sm" style={{ width: 'auto' }} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></td>
    </tr>
  )
}

function GroupCard({ group }) {
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    settingsApi.getSettingsByGroup(group).then(setSettings).catch(() => setSettings([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [group])

  if (!loading && settings.length === 0) return null

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-head"><div className="h3">{group}</div></div>
      {loading ? (
        <div style={{ padding: 18 }} className="sm">Loading…</div>
      ) : (
        <table>
          <tbody>
            <tr><th>Key</th><th>Value</th><th>Description</th><th></th></tr>
            {settings.map((s) => <SettingRow key={s.settingKey} setting={s} onSaved={load} />)}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div>
      {GROUPS.map((g) => <GroupCard key={g} group={g} />)}
    </div>
  )
}
