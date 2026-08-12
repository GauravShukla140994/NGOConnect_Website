import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// Public certificate verification page — /verify/{token}. No login, no app
// redirect (unlike the other /invite, /ngo, /opportunity landing pages) since
// anyone (employer, donor, NGO) needs to be able to open this cold, in any
// browser, and see the certificate immediately.
//
// Certificate rendering was centralized to the API side — the backend now
// returns a fully-rendered HTML string (CertificateHtmlService, server-side
// {{PLACEHOLDER}} substitution into NGOConnect.API/Templates/CertificateTemplate.html)
// instead of this page fetching structured JSON and building the certificate
// itself from a local template file. This page's job is now just: fetch the
// HTML, render it in an iframe, done. No template file, no client-side
// data-mapping, no QR code library — the returned HTML already contains a
// QR image from api.qrserver.com.
//
// IMPORTANT: `token` is the same AES-256-GCM encrypted payload as before
// (CertificateDal.AttachVerifyLink, IUrlTokenService, entityType "CERT") —
// URL structure is unchanged, only what the API returns at this route changed.
//
// NOTE — trade-off from this change: because the website no longer receives
// structured certificate data (volunteerName, orgName, issuedAt, etc.), the
// per-certificate browser-tab title / OG title+description personalization
// that the old JSON-based version did (document.title = "{name} — Volunteer
// Certificate | RippleHub") is no longer possible from here without re-parsing
// the returned HTML. Left as the page's static default title — flagging this
// as a known regression, not an oversight, in case it matters for link
// previews later.

const SUPPORT_EMAIL = 'support@ripplehub.app'

// Desktop-only: below this width, users already expect to scroll (that's normal
// mobile UX) and shrinking the certificate to avoid it would make the text
// illegible instead. Matches the sm: breakpoint used throughout this page.
const FIT_TO_VIEW_MIN_WIDTH = 768
// Never shrink past this — below it the certificate starts looking like a
// tiny thumbnail rather than a document.
const MIN_SCALE = 0.82

export default function VerifyCertificatePage() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // loading | valid | revoked | notfound | error
  const [message, setMessage] = useState('')
  const [certHtml, setCertHtml] = useState('')
  const [iframeHeight, setIframeHeight] = useState(900)
  const [scale, setScale] = useState(1)
  const iframeRef = useRef(null)
  const headerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    fetch(`${import.meta.env.VITE_API_BASE_URL}/certificates/verify/${encodeURIComponent(token)}/html`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        if (json.isSuccess === 1 && json.data) {
          setCertHtml(json.data)
          setStatus('valid')
        } else if (json.errorCode === 'CERT_REVOKED') {
          setMessage(json.message || 'This certificate has been revoked.')
          setStatus('revoked')
        } else {
          // Covers NOT_FOUND and anything else — same generic
          // "don't leak whether something exists" posture as the API.
          setMessage(json.message || '')
          setStatus('notfound')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [token])

  // The returned HTML is rendered via srcDoc, which (unlike a cross-origin
  // src="") keeps the iframe's document same-origin with this page — so we
  // can read its real content height directly on load instead of needing the
  // certificate HTML to carry its own height-reporting script (it doesn't;
  // it's a static, fully server-rendered document now, no client JS at all).
  function handleIframeLoad() {
    const doc = iframeRef.current?.contentDocument
    const h = doc?.body?.scrollHeight
    if (h) setIframeHeight(h + 40)
  }

  // Desktop "fit to view" — shrink the certificate + button as one unit so the
  // whole thing is visible without scrolling, the way a print-preview
  // thumbnail works. Reads contentRef's natural (untransformed) scrollHeight —
  // CSS transform: scale() doesn't affect layout/scrollHeight, only paint, so
  // this is safe to recompute even while a previous scale is applied.
  useEffect(() => {
    function recomputeScale() {
      if (window.innerWidth < FIT_TO_VIEW_MIN_WIDTH || !contentRef.current) {
        setScale(1)
        return
      }
      const naturalHeight = contentRef.current.scrollHeight
      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0
      const verticalBreathingRoom = 48 // top + bottom padding around the content block
      const available = window.innerHeight - headerHeight - verticalBreathingRoom
      if (naturalHeight <= 0 || available <= 0) {
        setScale(1)
        return
      }
      setScale(Math.max(MIN_SCALE, Math.min(1, available / naturalHeight)))
    }

    recomputeScale()
    window.addEventListener('resize', recomputeScale)
    return () => window.removeEventListener('resize', recomputeScale)
  }, [iframeHeight, status])

  function handlePrint() {
    iframeRef.current?.contentWindow?.print()
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Header */}
      <header ref={headerRef} className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-2.5 gap-y-1.5 px-4 py-3 sm:px-5 sm:py-4">
          <a href="/" className="flex items-center gap-2 sm:gap-2.5">
            <img src="/icon-192.png" alt="" width={28} height={28} className="h-6 w-6 rounded-lg sm:h-7 sm:w-7" />
            <span className="font-display text-sm font-bold text-slate-900 sm:text-base">RippleHub</span>
          </a>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 sm:ml-1 sm:text-xs">
            Certificate Verification
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-10">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <img src="/icon-192.png" alt="" width={48} height={48} className="mb-4 h-12 w-12 rounded-xl" />
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="mt-4 text-sm text-slate-500">Verifying certificate…</p>
          </div>
        )}

        {status === 'notfound' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
            <div className="mb-3 text-5xl">⚠️</div>
            <h1 className="text-lg font-bold text-slate-900">Certificate Not Found</h1>
            <p className="mt-2 text-sm text-slate-500">
              This verification link is invalid, has expired, or the certificate does not exist in our records.
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
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
            <div className="mb-3 text-5xl">🚫</div>
            <h1 className="text-lg font-bold text-slate-900">Certificate Revoked</h1>
            <p className="mt-2 text-sm text-slate-500">{message || 'This certificate has been revoked by the issuing organisation.'}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
            <div className="mb-3 text-5xl">🔌</div>
            <h1 className="text-lg font-bold text-slate-900">Could Not Connect</h1>
            <p className="mt-2 text-sm text-slate-500">
              Check your connection and reload the page to try again.
            </p>
          </div>
        )}

        {status === 'valid' && certHtml && (
          // Outer wrapper collapses to the SCALED height so nothing below (footer)
          // leaves a blank gap equal to the un-scaled size. Inner wrapper is the
          // thing actually transformed — scale(1) on mobile/short content is a no-op.
          <div style={{ height: scale < 1 ? contentRef.current?.scrollHeight * scale : undefined }}>
            <div ref={contentRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
              <iframe
                ref={iframeRef}
                srcDoc={certHtml}
                title="Volunteer Certificate"
                onLoad={handleIframeLoad}
                style={{ width: '100%', height: iframeHeight, minHeight: '100vh', border: 'none', display: 'block', maxWidth: '100%' }}
              />

              <div className="mt-6 text-center">
                <button onClick={handlePrint} className="btn-primary w-full sm:w-auto">
                  🖨 Download / Print
                </button>
              </div>
            </div>
          </div>
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
