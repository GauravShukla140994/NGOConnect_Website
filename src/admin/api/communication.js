import client from './client'

// Marketing & Communication Center — Phase 0 + Phase 1 (Push + Email only).
// Wraps CampaignController + CommunicationPreferencesController exactly as they
// exist today. Do not add calls for endpoints that don't exist yet (templates,
// segments, message queue console, A/B testing, SMS/WhatsApp send) — those are
// Phase 2/3, see Documents/MarketingCommunicationCenter_BRD_v1.0.docx.

// ── Dashboard ────────────────────────────────────────────────
export async function getCommunicationDashboard() {
  const res = await client.get('/superadmin/communication/dashboard')
  return res.data?.data
}

// ── Campaign CRUD ────────────────────────────────────────────
// statusCode: DRAFT | SCHEDULED | RUNNING | COMPLETED | CANCELLED | FAILED | PAUSED
export async function getCampaigns({ statusCode, search, pageNumber = 1, pageSize = 20 } = {}) {
  const res = await client.get('/superadmin/campaigns', {
    params: { statusCode: statusCode || undefined, search: search || undefined, pageNumber, pageSize },
  })
  return res.data?.data ?? { items: [], totalCount: 0, pageNumber, pageSize }
}

export async function getCampaign(campaignId) {
  const res = await client.get(`/superadmin/campaigns/${campaignId}`)
  return res.data?.data
}

// payload: { campaignName, internalNotes, campaignTypeCode, priorityCode }
// returns the new campaignId (int)
export async function createCampaign(payload) {
  const res = await client.post('/superadmin/campaigns', payload)
  return res.data?.data
}

// payload: { campaignName?, internalNotes?, campaignTypeCode?, priorityCode?,
//            scheduleType?, scheduledAt?, timezoneName? }
export async function updateCampaign(campaignId, payload) {
  const res = await client.put(`/superadmin/campaigns/${campaignId}`, payload)
  return res.data
}

// ── Channels (Push + Email only in Phase 1) ──────────────────
// payload: { channelCode: 'PUSH'|'EMAIL', pushTitle?, pushBody?, pushImageUrl?,
//            pushDeepLink?, pushActionLabel?, emailSubject?, emailHtmlBody? }
export async function saveCampaignChannel(campaignId, payload) {
  const res = await client.post(`/superadmin/campaigns/${campaignId}/channels`, payload)
  return res.data
}

export async function deleteCampaignChannel(campaignId, channelCode) {
  const res = await client.delete(`/superadmin/campaigns/${campaignId}/channels/${channelCode}`)
  return res.data
}

// ── Audience (single rule per campaign in Phase 1) ───────────
// ruleType: ALL | ACTIVE | INACTIVE | NEW | BY_ORG | BY_ROLE
// ruleValue shapes:
//   ACTIVE/INACTIVE/NEW → { days: 7 }
//   BY_ORG              → { orgIds: [1,2,3] }
//   BY_ROLE             → { roleCodes: ['FOUNDER','ADMIN','MODERATOR','MEMBER','DONOR'] }
export async function saveCampaignAudience(campaignId, ruleType, ruleValue) {
  const res = await client.post(`/superadmin/campaigns/${campaignId}/audience`, { ruleType, ruleValue })
  return res.data
}

export async function estimateCampaignAudience(campaignId) {
  const res = await client.post(`/superadmin/campaigns/${campaignId}/estimate-audience`)
  return res.data?.data
}

// ── Test send (bypasses CampaignRecipients — never pollutes real metrics) ────
export async function testSendCampaign(campaignId, userIds) {
  const res = await client.post(`/superadmin/campaigns/${campaignId}/test-send`, { userIds })
  return res.data
}

// ── Send / Schedule / Cancel ──────────────────────────────────
export async function sendCampaignNow(campaignId) {
  const res = await client.post(`/superadmin/campaigns/${campaignId}/send`)
  return res.data
}

export async function scheduleCampaign(campaignId, scheduledAt, timezoneName = 'Asia/Kolkata') {
  const res = await client.post(`/superadmin/campaigns/${campaignId}/schedule`, { scheduledAt, timezoneName })
  return res.data
}

export async function cancelCampaign(campaignId) {
  const res = await client.post(`/superadmin/campaigns/${campaignId}/cancel`)
  return res.data
}

// ── History ───────────────────────────────────────────────────
export async function getCampaignHistory(campaignId) {
  const res = await client.get(`/superadmin/campaigns/${campaignId}/history`)
  return res.data?.data
}
