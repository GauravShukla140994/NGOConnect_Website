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

export async function getOrgDetail(orgId) {
  const res = await client.get(`/superadmin/orgs/${orgId}`)
  return res.data?.data
}

export async function getOrgDocuments(orgId) {
  const res = await client.get(`/superadmin/orgs/${orgId}/documents`)
  return res.data?.data ?? []
}

export async function verifyOrgDocument(orgDocumentId, isVerified) {
  const res = await client.put('/superadmin/orgs/documents/verify', { orgDocumentId, isVerified })
  return res.data
}

export async function approveOrg(orgId) {
  const res = await client.put(`/superadmin/orgs/${orgId}/approve`)
  return res.data
}

export async function rejectOrg(orgId, reason) {
  const res = await client.put('/superadmin/orgs/reject', { orgId, reason })
  return res.data
}

export async function suspendOrg(orgId, reason) {
  const res = await client.put('/superadmin/orgs/suspend', { orgId, reason })
  return res.data
}

export async function reactivateOrg(orgId) {
  const res = await client.put(`/superadmin/orgs/${orgId}/reactivate`)
  return res.data
}

export async function getOrgStatusHistory(orgId) {
  const res = await client.get(`/superadmin/orgs/${orgId}/history`)
  return res.data?.data ?? []
}
