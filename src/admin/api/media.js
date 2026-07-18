import client from './client'

// Documents uploaded on/after the AWS S3 private-storage switch (2026-07-18) store a bare
// S3 object key in fileUrl, not a browsable link — the private bucket has no public access.
// This always asks the API for a fresh signed URL before opening a document; for older
// documents (local/cloudinary, already a real URL) the backend just hands that same URL
// back unchanged, so this is safe to call for every document regardless of when it was
// uploaded.
export async function getDocumentSignedUrl(fileKey, expiryMinutes = 15) {
  const res = await client.get('/superadmin/documents/signed-url', {
    params: { fileKey, expiryMinutes },
  })
  return res.data?.data
}
