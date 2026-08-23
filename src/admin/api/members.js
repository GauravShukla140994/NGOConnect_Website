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

export async function getMemberProfile(userId) {
  const res = await client.get(`/superadmin/members/${userId}`)
  return res.data?.data
}

export async function getMemberDocuments(userId) {
  const res = await client.get(`/superadmin/members/${userId}/documents`)
  return res.data?.data ?? []
}

export async function verifyMemberDocument(userDocumentId, isVerified) {
  const res = await client.put('/superadmin/members/documents/verify', { userDocumentId, isVerified })
  return res.data
}

export async function verifyMemberProfile(userId) {
  const res = await client.put(`/superadmin/members/${userId}/verify-profile`)
  return res.data
}

export async function requestMemberUpdate(userId, reason) {
  const res = await client.put('/superadmin/members/request-update', { userId, reason })
  return res.data
}

export async function suspendMember(userId, reason) {
  const res = await client.put(`/superadmin/members/${userId}/suspend`, { reason })
  return res.data
}

export async function reactivateMember(userId) {
  const res = await client.put(`/superadmin/members/${userId}/reactivate`)
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
export async function updateMemberProfile(userId, payload) {
  const res = await client.put(`/superadmin/members/${userId}/profile`, payload)
  return res.data
}
