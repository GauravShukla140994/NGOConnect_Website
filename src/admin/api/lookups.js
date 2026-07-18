import client from './client'

export async function getLookupTypes() {
  const res = await client.get('/superadmin/lookup-types')
  return res.data?.data ?? []
}

export async function getLookupValues(lookupTypeId) {
  const res = await client.get(`/superadmin/lookup-types/${lookupTypeId}/values`)
  return res.data?.data ?? []
}

export async function addLookupType(payload) {
  const res = await client.post('/superadmin/lookup-types', payload)
  return res.data
}

export async function updateLookupType(payload) {
  const res = await client.put('/superadmin/lookup-types', payload)
  return res.data
}

export async function addLookupValue(payload) {
  const res = await client.post('/superadmin/lookup-values', payload)
  return res.data
}

export async function updateLookupValue(payload) {
  const res = await client.put('/superadmin/lookup-values', payload)
  return res.data
}

export async function setLookupValueActive(lookupValueId, isActive) {
  const res = await client.put('/superadmin/lookup-values/active', { lookupValueId, isActive })
  return res.data
}
