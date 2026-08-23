import client from './client'

export async function getMembers({ orgIds, search, pageNumber = 1, pageSize = 100 } = {}) {
  const res = await client.get('/superadmin/members', {
    params: {
      orgIds: orgIds && orgIds.length ? orgIds.join(',') : undefined,
      search: search || undefined,
      pageNumber,
      pageSize,
    },
  })
  return res.data?.data?.items ?? res.data?.data ?? []
}

// 2026-08-24: every function below takes/sends an encrypted userToken (or
// userDocumentToken), never the raw numeric UserId — SuperAdminController
// decrypts it server-side. Each list row (getMembers) and the detail response
// (getMemberProfile) both carry a `userToken` field alongside `userId`; the
// raw id is only ever used for React keys / display, never in a URL.

export async function getMemberProfile(userToken) {
  const res = await client.get(`/superadmin/members/${userToken}`)
  return res.data?.data
}

export async function getMemberDocuments(userToken) {
  const res = await client.get(`/superadmin/members/${userToken}/documents`)
  return res.data?.data ?? []
}

export async function verifyMemberDocument(userDocumentToken, isVerified) {
  const res = await client.put('/superadmin/members/documents/verify', { userDocumentToken, isVerified })
  return res.data
}

export async function verifyMemberProfile(userToken) {
  const res = await client.put(`/superadmin/members/${userToken}/verify-profile`)
  return res.data
}

export async function requestMemberUpdate(userToken, reason) {
  const res = await client.put('/superadmin/members/request-update', { userToken, reason })
  return res.data
}

export async function suspendMember(userToken, reason) {
  const res = await client.put(`/superadmin/members/${userToken}/suspend`, { reason })
  return res.data
}

export async function reactivateMember(userToken) {
  const res = await client.put(`/superadmin/members/${userToken}/reactivate`)
  return res.data
}

// Proactive onboarding — creates User+UserProfile+Organisation(optional)+OrgMembers
// in one atomic call. See SuperAdmin_CreateMemberWithOrg for validation rules
// (duplicate email/mobile is a hard reject, not a silent merge).
export async function createMemberWithOrg(payload) {
  const res = await client.post('/superadmin/members', payload)
  return res.data
}

// Full-profile overwrite (name, DOB, gender, photo, address). Email/Mobile in
// the payload are only actually applied server-side while the member has
// never logged in (Users.IsVerified = 0) — see SuperAdmin_User_UpdateProfile.
// Response data.emailMobileLocked tells you whether they were skipped.
export async function updateMemberProfile(userToken, payload) {
  const res = await client.put(`/superadmin/members/${userToken}/profile`, payload)
  return res.data
}
