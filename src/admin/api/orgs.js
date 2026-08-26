import client from './client'

// statusCode: PENDING | UNDER_REVIEW | APPROVED | REJECTED | SUSPENDED
export async function getOrgsByStatus(statusCode, pageSize = 200) {
  const res = await client.get('/superadmin/orgs', { params: { statusCode, pageNumber: 1, pageSize } })
  return res.data?.data?.items ?? []
}

// Buckets orgs into the 4 tabs the prototype shows. Pending groups PENDING + UNDER_REVIEW.
export async function getAllOrgsBucketed() {
  const codes = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'SUSPENDED', 'REJECTED']
  const results = await Promise.all(codes.map((c) => getOrgsByStatus(c).catch(() => [])))
  const byCode = Object.fromEntries(codes.map((c, i) => [c, results[i]]))
  return {
    pending: [...byCode.PENDING, ...byCode.UNDER_REVIEW],
    approved: byCode.APPROVED,
    suspended: byCode.SUSPENDED,
    rejected: byCode.REJECTED,
  }
}

// 2026-08-24: every function below takes/sends an encrypted orgToken (or
// orgDocumentToken), never the raw numeric OrgId — SuperAdminController
// decrypts it server-side. Each list row (getOrgsByStatus) and the detail
// response (getOrgDetail) both carry an `orgToken` field alongside `orgId`;
// the raw id is only ever used for React keys / display, never in a URL.
// See SuperAdminController.TryResolveId for the server-side contract.

export async function getOrgDetail(orgToken) {
  const res = await client.get(`/superadmin/orgs/${orgToken}`)
  return res.data?.data
}

export async function getOrgDocuments(orgToken) {
  const res = await client.get(`/superadmin/orgs/${orgToken}/documents`)
  return res.data?.data ?? []
}

export async function verifyOrgDocument(orgDocumentToken, isVerified) {
  const res = await client.put('/superadmin/orgs/documents/verify', { orgDocumentToken, isVerified })
  return res.data
}

// 2026-08-25: endpoint moved from PUT /orgs/{orgToken}/approve to a body-based
// PUT /orgs/approve — now also carries isNonRegistered + optional remarks
// (stored in OrgStatusHistory and included in the approval notification sent
// to org admins). See SuperAdminController.ApproveOrg / ApproveOrgRequest.
export async function approveOrg(orgToken, isNonRegistered = false, remarks = null) {
  const res = await client.put('/superadmin/orgs/approve', { orgToken, isNonRegistered, remarks })
  return res.data
}

// New (2026-08-25): toggle registration status on ANY org regardless of
// current approval status — independent of the approve/reject/suspend flow.
// See SuperAdminController.SetOrgNonRegistered / SetNonRegisteredRequest.
export async function setOrgNonRegistered(orgToken, isNonRegistered, remarks = null) {
  const res = await client.put('/superadmin/orgs/set-non-registered', { orgToken, isNonRegistered, remarks })
  return res.data
}

export async function rejectOrg(orgToken, reason) {
  const res = await client.put('/superadmin/orgs/reject', { orgToken, reason })
  return res.data
}

export async function suspendOrg(orgToken, reason) {
  const res = await client.put('/superadmin/orgs/suspend', { orgToken, reason })
  return res.data
}

export async function reactivateOrg(orgToken) {
  const res = await client.put(`/superadmin/orgs/${orgToken}/reactivate`)
  return res.data
}

export async function getOrgStatusHistory(orgToken) {
  const res = await client.get(`/superadmin/orgs/${orgToken}/history`)
  return res.data?.data ?? []
}

// Both flags are sent together on every call — the SP takes both and sets them
// as a pair (see SuperAdmin_UpdateOrgProjectPermissions), never one at a time.
// orgMaxVolunteers is optional — omit/pass null to leave the org's current
// limit unchanged (the SP COALESCEs a null param against the existing value).
export async function updateOrgProjectPermissions(orgToken, canCreateRecurring, canCreateFlexible, orgMaxVolunteers = null) {
  const res = await client.patch(`/superadmin/orgs/${orgToken}/project-permissions`, {
    canCreateRecurring,
    canCreateFlexible,
    orgMaxVolunteers,
  })
  return res.data
}

// Full-profile overwrite (name, type, reg number, contact, address, about/
// mission/vision, logo). Re-validates OrgName/RegNumber uniqueness server-side
// excluding this org — see SuperAdmin_Org_UpdateProfile.
export async function updateOrgProfile(orgToken, payload) {
  const res = await client.put(`/superadmin/orgs/${orgToken}/profile`, payload)
  return res.data
}
