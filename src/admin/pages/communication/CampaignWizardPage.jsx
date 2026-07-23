import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StatusPill from '../../components/StatusPill'
import MultiSelectDropdown from '../../components/MultiSelectDropdown'
import { getOrgsByStatus } from '../../api/orgs'
import {
  getCampaign, createCampaign, updateCampaign,
  saveCampaignChannel, deleteCampaignChannel,
  saveCampaignAudience, estimateCampaignAudience,
  testSendCampaign, sendCampaignNow, scheduleCampaign,
} from '../../api/communication'

// Create/Edit Campaign wizard — Phase 1 scope only (Push + Email, one audience
// rule per campaign). Matches MKTG_CAMPAIGN_TYPE / MKTG_CAMPAIGN_PRIORITY seed
// values exactly (NGOConnect_Complete_Setup_v4.9.sql ~line 1717). Editing is
// only possible while a campaign is DRAFT or SCHEDULED (enforced by
// Campaign_Update itself) — anything else renders as read-only.

const CAMPAIGN_TYPES = [
  ['PROMOTION', 'Promotion'], ['ANNOUNCEMENT', 'Announcement'], ['REMINDER', 'Reminder'],
  ['FEATURE_LAUNCH', 'Feature Launch'], ['DONATION', 'Donation'], ['VOLUNTEER', 'Volunteer'],
  ['EMERGENCY', 'Emergency'], ['FESTIVAL', 'Festival'], ['SURVEY', 'Survey'], ['CUSTOM', 'Custom'],
]
const PRIORITIES = [['LOW', 'Low'], ['NORMAL', 'Normal'], ['HIGH', 'High'], ['CRITICAL', 'Critical']]

const AUDIENCE_RULES = [
  { code: 'ALL', label: 'All active users', desc: 'Every active user on the platform.' },
  { code: 'ACTIVE', label: 'Recently active users', desc: "Logged in within the last N days." },
  { code: 'INACTIVE', label: 'Inactive users', desc: "Haven't logged in for N+ days (or never)." },
  { code: 'NEW', label: 'New users', desc: 'Signed up within the last N days.' },
  { code: 'BY_ORG', label: 'Members of specific organisations', desc: 'Users belonging to selected NGOs.' },
  { code: 'BY_ROLE', label: 'By role', desc: 'Founders, Admins, Moderators, Members, and/or Donors.' },
]
const ROLE_OPTIONS = [
  { value: 'FOUNDER', label: 'Founder' }, { value: 'ADMIN', label: 'Admin' },
  { value: 'MODERATOR', label: 'Moderator' }, { value: 'MEMBER', label: 'Member' },
  { value: 'DONOR', label: 'Donor (donation-only users)' },
]

function parseMaybeJson(v, fallback) {
  if (v == null) return fallback
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return fallback }
}

function buildRuleValue(ruleType, ui) {
  if (ruleType === 'ACTIVE' || ruleType === 'INACTIVE' || ruleType === 'NEW') return { days: Number(ui.days) || (ruleType === 'INACTIVE' ? 30 : 7) }
  if (ruleType === 'BY_ORG') return { orgIds: ui.orgIds }
  if (ruleType === 'BY_ROLE') return { roleCodes: ui.roleCodes }
  return {}
}

const STEPS = ['Details', 'Channels', 'Audience', 'Review & Send']

export default function CampaignWizardPage() {
  const { campaignId: routeId } = useParams()
  const navigate = useNavigate()
  const isNew = routeId === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [loadError, setLoadError] = useState(false)
  const [campaignId, setCampaignId] = useState(isNew ? null : Number(routeId))
  const [statusCode, setStatusCode] = useState(isNew ? 'DRAFT' : null)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  // Step 1 — Details
  const [campaignName, setCampaignName] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [campaignTypeCode, setCampaignTypeCode] = useState('PROMOTION')
  const [priorityCode, setPriorityCode] = useState('NORMAL')

  // Step 2 — Channels
  const [pushOn, setPushOn] = useState(true)
  const [emailOn, setEmailOn] = useState(false)
  const [push, setPush] = useState({ title: '', body: '', imageUrl: '', deepLink: '', actionLabel: '' })
  const [email, setEmail] = useState({ subject: '', htmlBody: '' })

  // Step 3 — Audience
  const [ruleType, setRuleType] = useState('ALL')
  const [days, setDays] = useState(7)
  const [orgIds, setOrgIds] = useState([])
  const [roleCodes, setRoleCodes] = useState([])
  const [orgOptions, setOrgOptions] = useState([])
  const [estimate, setEstimate] = useState(null)

  // Step 4 — Review & Send
  const [scheduleMode, setScheduleMode] = useState('now')
  const [scheduledAt, setScheduledAt] = useState('')
  const [testUserIds, setTestUserIds] = useState('')
  const [testMsg, setTestMsg] = useState('')

  const isEditable = isNew || statusCode === 'DRAFT' || statusCode === 'SCHEDULED'

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    getCampaign(campaignId)
      .then((c) => {
        if (cancelled || !c) return
        setStatusCode(c.statusCode)
        setCampaignName(c.campaignName || '')
        setInternalNotes(c.internalNotes || '')
        setCampaignTypeCode(c.campaignTypeCode || 'PROMOTION')
        setPriorityCode(c.priorityCode || 'NORMAL')

        const channels = parseMaybeJson(c.channelsJson, [])
        const pushCh = channels.find((ch) => ch.channelCode === 'PUSH')
        const emailCh = channels.find((ch) => ch.channelCode === 'EMAIL')
        setPushOn(!!pushCh)
        setEmailOn(!!emailCh)
        if (pushCh) setPush({ title: pushCh.pushTitle || '', body: pushCh.pushBody || '', imageUrl: pushCh.pushImageUrl || '', deepLink: pushCh.pushDeepLink || '', actionLabel: pushCh.pushActionLabel || '' })
        if (emailCh) setEmail({ subject: emailCh.emailSubject || '', htmlBody: emailCh.emailHtmlBody || '' })

        const rt = c.audienceRuleType || 'ALL'
        setRuleType(rt)
        const rv = parseMaybeJson(c.audienceRuleValueJson, {})
        if (rv.days) setDays(rv.days)
        if (rv.orgIds) setOrgIds(rv.orgIds)
        if (rv.roleCodes) setRoleCodes(rv.roleCodes)
        setEstimate(c.estimatedRecipients ?? null)

        if (c.scheduleType === 'SCHEDULED' && c.scheduledAt) {
          setScheduleMode('later')
          setScheduledAt(c.scheduledAt.slice(0, 16))
        }
      })
      .catch(() => { if (!cancelled) setLoadError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [isNew, campaignId])

  useEffect(() => {
    if (ruleType !== 'BY_ORG' || orgOptions.length > 0) return
    getOrgsByStatus('APPROVED').then((orgs) => setOrgOptions(orgs.map((o) => ({ value: o.orgId, label: o.orgName })))).catch(() => {})
  }, [ruleType, orgOptions.length])

  async function handleSaveDetails() {
    if (!campaignName.trim()) { setErr('Campaign name is required.'); return }
    setSaving(true); setErr('')
    try {
      if (isNew) {
        const newId = await createCampaign({ campaignName, internalNotes, campaignTypeCode, priorityCode })
        setCampaignId(newId)
        setStatusCode('DRAFT')
        navigate(`/admin/communication/campaigns/${newId}`, { replace: true })
      } else {
        await updateCampaign(campaignId, { campaignName, internalNotes, campaignTypeCode, priorityCode })
      }
      setStep(2)
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not save campaign details.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveChannels() {
    setSaving(true); setErr('')
    try {
      if (pushOn) await saveCampaignChannel(campaignId, { channelCode: 'PUSH', pushTitle: push.title, pushBody: push.body, pushImageUrl: push.imageUrl || null, pushDeepLink: push.deepLink || null, pushActionLabel: push.actionLabel || null })
      else await deleteCampaignChannel(campaignId, 'PUSH').catch(() => {})

      if (emailOn) await saveCampaignChannel(campaignId, { channelCode: 'EMAIL', emailSubject: email.subject, emailHtmlBody: email.htmlBody })
      else await deleteCampaignChannel(campaignId, 'EMAIL').catch(() => {})

      if (!pushOn && !emailOn) { setErr('Enable at least one channel (Push or Email).'); setSaving(false); return }
      setStep(3)
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not save channels.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveAudience() {
    setSaving(true); setErr('')
    try {
      const ruleValue = buildRuleValue(ruleType, { days, orgIds, roleCodes })
      await saveCampaignAudience(campaignId, ruleType, ruleValue)
      const est = await estimateCampaignAudience(campaignId)
      setEstimate(est?.estimatedRecipients ?? null)
      setStep(4)
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not save audience rule.')
    } finally {
      setSaving(false)
    }
  }

  async function handleTestSend() {
    const ids = testUserIds.split(',').map((s) => Number(s.trim())).filter((n) => n > 0)
    if (ids.length === 0) { setTestMsg('Enter at least one numeric User ID.'); return }
    setTestMsg('Sending…')
    try {
      const res = await testSendCampaign(campaignId, ids)
      setTestMsg(res?.message || 'Test send complete.')
    } catch (e) {
      setTestMsg(e.response?.data?.message || 'Test send failed.')
    }
  }

  async function handleSendNow() {
    if (!window.confirm(`Send "${campaignName}" now to an estimated ${estimate ?? '?'} recipients?`)) return
    setSaving(true); setErr('')
    try {
      await sendCampaignNow(campaignId)
      navigate('/admin/communication/campaigns')
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not send campaign.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSchedule() {
    if (!scheduledAt) { setErr('Pick a date and time to schedule.'); return }
    setSaving(true); setErr('')
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
      await scheduleCampaign(campaignId, new Date(scheduledAt).toISOString(), tz)
      navigate('/admin/communication/campaigns')
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not schedule campaign.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="sm">Loading…</div>
  if (loadError) return <div className="card"><div style={{ padding: 18 }} className="xs">Could not load this campaign.</div></div>

  if (!isEditable) {
    return <CampaignReadOnlyView campaignId={campaignId} statusCode={statusCode} campaignName={campaignName} />
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="h3">{isNew ? 'Create campaign' : `Edit campaign${statusCode ? ' — ' : ''}`} {statusCode && <StatusPill status={statusCode} />}</div>
        <button className="btn-o btn-sm" onClick={() => navigate('/admin/communication/campaigns')}>Back to list</button>
      </div>

      <div className="tabs">
        {STEPS.map((label, i) => (
          <div key={label} className={`tab${step === i + 1 ? ' on' : ''}`} style={{ cursor: campaignId ? 'pointer' : 'default' }}
               onClick={() => { if (campaignId || i === 0) setStep(i + 1) }}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <div style={{ padding: 20 }}>
        {err && <div className="login-err" style={{ marginBottom: 16 }}>{err}</div>}

        {step === 1 && (
          <>
            <div className="fl">
              <label>Campaign name</label>
              <input className="fi" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="e.g. Diwali Volunteer Drive 2026" />
            </div>
            <div className="fl">
              <label>Internal notes (not shown to recipients)</label>
              <textarea className="fta" value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div className="fl" style={{ flex: 1 }}>
                <label>Campaign type</label>
                <select className="fs" style={{ width: '100%' }} value={campaignTypeCode} onChange={(e) => setCampaignTypeCode(e.target.value)}>
                  {CAMPAIGN_TYPES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </div>
              <div className="fl" style={{ flex: 1 }}>
                <label>Priority</label>
                <select className="fs" style={{ width: '100%' }} value={priorityCode} onChange={(e) => setPriorityCode(e.target.value)}>
                  {PRIORITIES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </div>
            </div>
            <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} disabled={saving} onClick={handleSaveDetails}>
              {saving ? 'Saving…' : 'Next: Channels →'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <ChannelToggle label="Push notification" on={pushOn} onChange={setPushOn}>
              <div className="fl"><label>Title</label><input className="fi" value={push.title} onChange={(e) => setPush({ ...push, title: e.target.value })} maxLength={200} /></div>
              <div className="fl"><label>Body</label><textarea className="fta" value={push.body} onChange={(e) => setPush({ ...push, body: e.target.value })} maxLength={500} /></div>
              <div className="fl"><label>Image URL (optional)</label><input className="fi" value={push.imageUrl} onChange={(e) => setPush({ ...push, imageUrl: e.target.value })} /></div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div className="fl" style={{ flex: 1 }}><label>Deep link (optional)</label><input className="fi" value={push.deepLink} onChange={(e) => setPush({ ...push, deepLink: e.target.value })} /></div>
                <div className="fl" style={{ flex: 1 }}><label>Action label (optional)</label><input className="fi" value={push.actionLabel} onChange={(e) => setPush({ ...push, actionLabel: e.target.value })} maxLength={50} /></div>
              </div>
              <div className="xs">Image/deep-link are stored and sent in the payload; the mobile app's notification tap-handler needs to read them to actually navigate — confirm this is wired up before relying on it.</div>
            </ChannelToggle>

            <ChannelToggle label="Email" on={emailOn} onChange={setEmailOn}>
              <div className="fl"><label>Subject</label><input className="fi" value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })} maxLength={255} /></div>
              <div className="fl"><label>HTML body</label><textarea className="fta" style={{ minHeight: 160, fontFamily: 'monospace', fontSize: 12 }} value={email.htmlBody} onChange={(e) => setEmail({ ...email, htmlBody: e.target.value })} /></div>
            </ChannelToggle>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-o" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} disabled={saving} onClick={handleSaveChannels}>
                {saving ? 'Saving…' : 'Next: Audience →'}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {AUDIENCE_RULES.map((r) => (
              <label key={r.code} className="ms-option" style={{ padding: '10px 4px', alignItems: 'flex-start' }}>
                <input type="radio" name="ruleType" checked={ruleType === r.code} onChange={() => setRuleType(r.code)} style={{ marginTop: 3 }} />
                <span>
                  <div className="h3" style={{ fontSize: 13 }}>{r.label}</div>
                  <div className="xs">{r.desc}</div>
                </span>
              </label>
            ))}

            {(ruleType === 'ACTIVE' || ruleType === 'INACTIVE' || ruleType === 'NEW') && (
              <div className="fl" style={{ maxWidth: 200, marginTop: 10 }}>
                <label>{ruleType === 'NEW' ? 'Signed up within last (days)' : ruleType === 'ACTIVE' ? 'Logged in within last (days)' : 'No login for at least (days)'}</label>
                <input className="fi" type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} />
              </div>
            )}

            {ruleType === 'BY_ORG' && (
              <div className="fl" style={{ marginTop: 10 }}>
                <label>Organisations</label>
                <MultiSelectDropdown options={orgOptions} selected={orgIds} onChange={setOrgIds} placeholder="Select organisations..." />
              </div>
            )}

            {ruleType === 'BY_ROLE' && (
              <div className="fl" style={{ marginTop: 10 }}>
                <label>Roles</label>
                {ROLE_OPTIONS.map((r) => (
                  <label key={r.value} className="ms-option" style={{ padding: '6px 4px' }}>
                    <input type="checkbox" checked={roleCodes.includes(r.value)}
                           onChange={(e) => setRoleCodes(e.target.checked ? [...roleCodes, r.value] : roleCodes.filter((v) => v !== r.value))} />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn-o" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} disabled={saving} onClick={handleSaveAudience}>
                {saving ? 'Estimating…' : 'Next: Review →'}
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="card" style={{ marginBottom: 16, boxShadow: 'none', border: '1px solid var(--bd)' }}>
              <div style={{ padding: 16 }}>
                <div className="h3">{campaignName}</div>
                <div className="sm" style={{ marginTop: 4 }}>{CAMPAIGN_TYPES.find(([c]) => c === campaignTypeCode)?.[1]} · {PRIORITIES.find(([c]) => c === priorityCode)?.[1]} priority</div>
                <div className="sm">Channels: {[pushOn && 'Push', emailOn && 'Email'].filter(Boolean).join(', ') || 'None'}</div>
                <div className="sm">Estimated recipients: <strong>{estimate ?? '—'}</strong></div>
              </div>
            </div>

            <div className="fl">
              <label>Test send (comma-separated User IDs — bypasses real metrics)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="fi" value={testUserIds} onChange={(e) => setTestUserIds(e.target.value)} placeholder="e.g. 12, 45" />
                <button className="btn-o" style={{ width: 'auto', padding: '10px 16px' }} onClick={handleTestSend}>Test send</button>
              </div>
              {testMsg && <div className="xs" style={{ marginTop: 6 }}>{testMsg}</div>}
            </div>

            <div className="divider" />

            <div className="fl">
              <label>When to send</label>
              <div style={{ display: 'flex', gap: 16 }}>
                <label className="ms-option" style={{ padding: 0 }}><input type="radio" checked={scheduleMode === 'now'} onChange={() => setScheduleMode('now')} /> <span>Send now</span></label>
                <label className="ms-option" style={{ padding: 0 }}><input type="radio" checked={scheduleMode === 'later'} onChange={() => setScheduleMode('later')} /> <span>Schedule for later</span></label>
              </div>
            </div>
            {scheduleMode === 'later' && (
              <div className="fl" style={{ maxWidth: 260 }}>
                <label>Date & time (your local timezone)</label>
                <input className="fi" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button className="btn-o" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => setStep(3)}>← Back</button>
              {scheduleMode === 'now'
                ? <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} disabled={saving} onClick={handleSendNow}>{saving ? 'Sending…' : 'Send now'}</button>
                : <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} disabled={saving} onClick={handleSchedule}>{saving ? 'Scheduling…' : 'Schedule campaign'}</button>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ChannelToggle({ label, on, onChange, children }) {
  return (
    <div className="card" style={{ marginBottom: 16, boxShadow: 'none', border: '1px solid var(--bd)' }}>
      <div className="card-head">
        <div className="h3">{label}</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <span className="sm">{on ? 'Enabled' : 'Disabled'}</span>
          <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--p)' }} />
        </label>
      </div>
      {on && <div style={{ padding: 16 }}>{children}</div>}
    </div>
  )
}

function CampaignReadOnlyView({ campaignId, statusCode, campaignName }) {
  const navigate = useNavigate()
  return (
    <div className="card">
      <div className="card-head">
        <div className="h3">{campaignName} <StatusPill status={statusCode} /></div>
        <button className="btn-o btn-sm" onClick={() => navigate('/admin/communication/campaigns')}>Back to list</button>
      </div>
      <div style={{ padding: 18 }} className="xs">
        This campaign is {statusCode?.toLowerCase()} and can no longer be edited — only Draft or Scheduled
        campaigns are editable. Delivery stats for this campaign are visible on the Campaigns list.
      </div>
    </div>
  )
}
