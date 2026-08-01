import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// Public certificate verification page — /verify/{certCode}. No login, no app
// redirect (unlike the other /invite, /ngo, /opportunity landing pages) since
// anyone (employer, donor, NGO) needs to be able to open this cold, in any
// browser, and see the certificate immediately.
// Spec: NGOConnectAPI/Documents/ripplehub_verify_page_spec.md
// Backend: GET /api/v1/certificates/{certCode} — CertificateController.GetCertificate,
// [AllowAnonymous], already deployed (no backend work needed for this page).

const SUPPORT_EMAIL = 'support@ripplehub.app'

// "Communication:4.5|Leadership:4.0|Teamwork:5.0" → [{ name, rating }]
function parseSkillRatings(raw) {
  return (raw ?? '')
    .split('|')
    .filter(Boolean)
    .map((pair) => {
      const [name, rating] = pair.split(':')
      return { name, rating: parseFloat(rating) }
    })
    .filter((s) => s.name && !Number.isNaN(s.rating))
}

function formatIssuedDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return iso
  }
}

function formatCompletionMonth(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

// Maps the API's field names to the template's renderCertificate(data) shape —
// the two were designed independently (see the spec's Data Mapping table).
function mapToTemplateData(api) {
  return {
    certificateId: api.certCode,
    issueDate: formatIssuedDate(api.issuedAt),
    ngoName: api.orgName,
    volunteerName: api.volunteerName,
    projectName: api.projectName,
    hoursContributed: `${api.totalHours ?? 0} hrs`,
    completionDate: formatCompletionMonth(api.issuedAt),
    impactScore: `+${api.impactScore ?? 0} pts`,
    // API has no coordinator name field — spec's own mapping table says to fall
    // back to a generic label, so that's the only value this can ever be.
    coordinatorName: 'NGO Coordinator',
    skills: parseSkillRatings(api.skillRatings),
  }
}

export default function VerifyCertificatePage() {
  const { certCode } = useParams()
  const [status, setStatus] = useState('loading') // loading | valid | revoked | notfound | error
  const [cert, setCert] = useState(null)
  const [iframeHeight, setIframeHeight] = useState(900)
  const iframeRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    fetch(`${import.meta.env.VITE_API_BASE_URL}/certificates/${encodeURIComponent(certCode)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        if (json.isSuccess === 1 && json.data) {
          setCert(json.data)
          setStatus(json.data.isDeleted ? 'revoked' : 'valid')
        } else {
          setStatus('notfound')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [certCode])

  // Client-side OG/title update — helps the browser tab and any crawler that
  // executes JS, but this is a plain SPA (no SSR), so it won't reach crawlers
  // that only read the initial HTML (WhatsApp/Facebook link previews will still
  // show the generic site preview). Same limitation the other landing pages have.
  useEffect(() => {
    if (status !== 'valid' || !cert) return
    document.title = `${cert.volunteerName} — Volunteer Certificate | RippleHub`
    const setMeta = (selector, value) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', value)
    }
    setMeta('meta[property="og:title"]', `${cert.volunteerName} — Volunteer Certificate`)
    setMeta('meta[property="og:description"]', `Issued by ${cert.orgName} via RippleHub for ${cert.projectName}`)
  }, [status, cert])

  // Listen for the iframe's real content height (see certificate-template.html)
  // instead of guessing a fixed height that clips or leaves dead space.
  useEffect(() => {
    function onMessage(e) {
      if (e.data?.type === 'cert-height' && typeof e.data.height === 'number') {
        setIframeHeight(e.data.height + 40)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  function handleIframeLoad() {
    const win = iframeRef.current?.contentWindow
    if (!win || !cert) return
    win.renderCertificate(mapToTemplateData(cert))
    win.__reportCertHeight?.()
    // Re-report after a tick — web fonts / layout can still settle after the
    // initial synchronous render call above.
    setTimeout(() => win.__reportCertHeight?.(), 300)
  }

  function handlePrint() {
    iframeRef.current?.contentWindow?.print()
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-5 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/icon-192.png" alt="" width={28} height={28} className="h-7 w-7 rounded-lg" />
            <span className="font-display text-base font-bold text-slate-900">RippleHub</span>
          </a>
          <span className="ml-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
            Certificate Verification
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <img src="/icon-192.png" alt="" width={48} height={48} className="mb-4 h-12 w-12 rounded-xl" />
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="mt-4 text-sm text-slate-500">Verifying certificate…</p>
          </div>
        )}

        {status === 'notfound' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mb-3 text-5xl">⚠️</div>
            <h1 className="text-lg font-bold text-slate-900">Certificate Not Found</h1>
            <p className="mt-2 text-sm text-slate-500">
              The certificate ID &ldquo;{certCode}&rdquo; does not exist in our records.
              <br />
              If you believe this is an error, contact{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-primary underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        )}

        {status === 'revoked' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mb-3 text-5xl">🚫</div>
            <h1 className="text-lg font-bold text-slate-900">Certificate Revoked</h1>
            <p className="mt-2 text-sm text-slate-500">
              This certificate has been revoked by the issuing organisation.
              <br />
              Certificate ID: <span className="font-medium text-slate-700">{certCode}</span>
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mb-3 text-5xl">🔌</div>
            <h1 className="text-lg font-bold text-slate-900">Could Not Connect</h1>
            <p className="mt-2 text-sm text-slate-500">
              Check your connection and reload the page to try again.
            </p>
          </div>
        )}

        {status === 'valid' && cert && (
          <>
            <iframe
              ref={iframeRef}
              src="/certificate-template.html"
              title="Volunteer Certificate"
              onLoad={handleIframeLoad}
              style={{ width: '100%', height: iframeHeight, border: 'none', display: 'block' }}
            />

            {/* Trust badge strip */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-medium text-slate-500">
              <span>✅ Issued by RippleHub</span>
              <span>🏛 {cert.orgName}</span>
              <span>📅 Verified {formatIssuedDate(cert.issuedAt)}</span>
            </div>

            <div className="mt-6 text-center">
              <button onClick={handlePrint} className="btn-primary">
                🖨 Download / Print
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Powered by RippleHub &middot;{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
          {SUPPORT_EMAIL}
        </a>
      </footer>
    </div>
  )
}
