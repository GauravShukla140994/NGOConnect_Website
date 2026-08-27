import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { initials } from '../utils/initials.js'
import { APP_SCHEME_PREFIX, APP_STORE_URL, PLAY_STORE_URL, DEEP_LINK_TIMEOUT_MS } from '../constants/deepLinking.js'

// Full, standalone, modern organisation public profile page — /organisation/{token}.
//
// Unlike NgoLandingPage.jsx (the old /ngo/{token} card), this page does NOT
// auto-attempt an app deep link. It's meant to be a real, browsable web page
// (about/mission/vision, stats, contact, projects, paginated reviews) —
// "Open in RippleHub app" is an explicit manual button here, not an
// automatic redirect. See CLAUDE.md "no unsolicited changes" — the app's
// own deep-link scheme path (ripplehub://ngo/{token}) is left untouched;
// only the website's URL segment changed from /ngo/ to /organisation/.
//
// Consumes:
//   GET /public/org/{token}/full      → { orgId, profile, ratings, projects } (first-page preview)
//   GET /public/org/{token}/projects  → PagedResult<project> (paginated "Load more")
//   GET /public/org/{token}/reviews   → PagedResult<review> (paginated, sortable)
//   GET /public/opportunity/{token}   → full project detail, lazy-loaded on "Expand"

const SUPPORT_EMAIL = 'support@ripplehub.app'

const SORT_OPTIONS = [
  { code: 'RECENT', label: 'Most recent' },
  { code: 'HELPFUL', label: 'Most helpful' },
  { code: 'HIGHEST', label: 'Highest rated' },
  { code: 'LOWEST', label: 'Lowest rated' },
]

function friendlyError(errorCode, message) {
  if (errorCode === 'INVALID_SHARE_TOKEN') {
    return 'This link is no longer valid. Ask the sender for a new share link.'
  }
  return message || 'This link is no longer valid.'
}

function Stars({ rating = 0, size = 'text-sm' }) {
  const full = Math.round(rating)
  return (
    <span className={`${size} tracking-tight text-amber-500`} aria-label={`${rating} out of 5 stars`}>
      {'★★★★★'.slice(0, full)}
      <span className="text-slate-300">{'★★★★★'.slice(full)}</span>
    </span>
  )
}

function StatCard({ label, value }) {
  if (value === null || value === undefined) return null
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center">
      <p className="font-display text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">{label}</p>
    </div>
  )
}

function RatingBar({ label, pct = 0 }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className="w-8 shrink-0">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct || 0}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right">{Math.round(pct || 0)}%</span>
    </div>
  )
}

export default function OrganisationProfilePage() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // loading | ready | unavailable | error
  const [errorMsg, setErrorMsg] = useState('')
  const [data, setData] = useState(null)

  const [reviews, setReviews] = useState([])
  const [reviewsTotal, setReviewsTotal] = useState(0)
  const [reviewsPage, setReviewsPage] = useState(0)
  const [sort, setSort] = useState('RECENT')
  const [loadingReviews, setLoadingReviews] = useState(false)

  const [projects, setProjects] = useState([])
  const [projectsTotal, setProjectsTotal] = useState(0)
  const [projectsPage, setProjectsPage] = useState(0)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [projectDetails, setProjectDetails] = useState({}) // projectId -> detail object
  const [loadingDetailId, setLoadingDetailId] = useState(null)

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const storeUrl = isIOS ? APP_STORE_URL : PLAY_STORE_URL

  function openApp() {
    window.location.href = `${APP_SCHEME_PREFIX}ngo/${encodeURIComponent(token)}`
    setTimeout(() => {
      if (!document.hidden) window.location.href = storeUrl
    }, DEEP_LINK_TIMEOUT_MS)
  }

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    fetch(`${import.meta.env.VITE_API_BASE_URL}/public/org/${encodeURIComponent(token)}/full`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        if (json.isSuccess === 1 && json.data) {
          setData(json.data)
          setStatus(json.errorCode === 'ORG_UNAVAILABLE' ? 'unavailable' : 'ready')
        } else if (json.errorCode === 'ORG_UNAVAILABLE') {
          setData(json.data || null)
          setStatus('unavailable')
        } else {
          setErrorMsg(friendlyError(json.errorCode, json.message))
          setStatus('error')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMsg('Unable to load this page. Check your connection and try again.')
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const loadReviews = useCallback(
    (page, sortCode, replace) => {
      setLoadingReviews(true)
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/public/org/${encodeURIComponent(token)}/reviews?sort=${sortCode}&pageNumber=${page}&pageSize=10`
      )
        .then((r) => r.json())
        .then((json) => {
          if (json.isSuccess === 1 && json.data) {
            const items = json.data.items || []
            setReviews((prev) => (replace ? items : [...prev, ...items]))
            setReviewsTotal(json.data.totalCount ?? items.length)
            setReviewsPage(page)
          }
        })
        .catch(() => {})
        .finally(() => setLoadingReviews(false))
    },
    [token]
  )

  const loadProjects = useCallback(
    (page, replace) => {
      setLoadingProjects(true)
      fetch(`${import.meta.env.VITE_API_BASE_URL}/public/org/${encodeURIComponent(token)}/projects?pageNumber=${page}&pageSize=6`)
        .then((r) => r.json())
        .then((json) => {
          if (json.isSuccess === 1 && json.data) {
            const items = json.data.items || []
            setProjects((prev) => (replace ? items : [...prev, ...items]))
            setProjectsTotal(json.data.totalCount ?? items.length)
            setProjectsPage(page)
          }
        })
        .catch(() => {})
        .finally(() => setLoadingProjects(false))
    },
    [token]
  )

  useEffect(() => {
    if (status === 'ready') {
      loadReviews(1, sort, true)
      loadProjects(1, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sort])

  // Lazy-loads full project detail (description, schedule, location, eligibility, etc.)
  // the first time a card is expanded, then caches it — collapsing/re-expanding is instant.
  function toggleExpand(project) {
    const id = project.projectId
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (projectDetails[id] || !project.projectToken) return
    setLoadingDetailId(id)
    fetch(`${import.meta.env.VITE_API_BASE_URL}/public/opportunity/${encodeURIComponent(project.projectToken)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.isSuccess === 1 && json.data?.project) {
          setProjectDetails((prev) => ({ ...prev, [id]: json.data.project }))
        }
      })
      .catch(() => {})
      .finally(() => setLoadingDetailId((cur) => (cur === id ? null : cur)))
  }

  const org = data?.profile
  const ratings = data?.ratings

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-2.5 gap-y-1.5 px-4 py-3 sm:px-5 sm:py-4">
          <a href="/" className="flex items-center gap-2 sm:gap-2.5">
            <img src="/icon-192.png" alt="" width={28} height={28} className="h-6 w-6 rounded-lg sm:h-7 sm:w-7" />
            <span className="font-display text-sm font-bold text-slate-900 sm:text-base">RippleHub</span>
          </a>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 sm:ml-1 sm:text-xs">
            Organisation Profile
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-8">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <img src="/icon-192.png" alt="" width={48} height={48} className="mb-4 h-12 w-12 rounded-xl" />
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="mt-4 text-sm text-slate-500">Loading organisation profile…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
            <div className="mb-3 text-5xl">⚠️</div>
            <h1 className="text-lg font-bold text-slate-900">
              {errorMsg.includes('valid') ? 'Link Not Valid' : 'Could Not Connect'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {errorMsg}
              <br />
              If you believe this is an error, contact{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-primary underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        )}

        {status === 'unavailable' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
            <div className="mb-3 text-5xl">🔒</div>
            <h1 className="text-lg font-bold text-slate-900">{org?.orgName || 'Profile Not Available'}</h1>
            <p className="mt-2 text-sm text-slate-500">
              This organisation's profile isn't publicly available right now.
            </p>
          </div>
        )}

        {status === 'ready' && org && (
          <div className="space-y-5">
            {/* Hero */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="h-24 bg-gradient-to-r from-primary via-violet to-secondary sm:h-32" />
              <div className="px-5 pb-5 sm:px-8 sm:pb-8">
                <div className="-mt-10 flex flex-col items-start gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-4">
                    {org.logoUrl ? (
                      <img
                        src={org.logoUrl}
                        alt={org.orgName}
                        className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md sm:h-24 sm:w-24"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-primary text-2xl font-bold text-white shadow-md sm:h-24 sm:w-24">
                        {initials(org.orgName)}
                      </div>
                    )}
                  </div>
                  <button onClick={openApp} className="btn-primary !bg-primary !px-5 !py-2.5 !text-sm">
                    Open in App
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">{org.orgName}</h1>
                    {org.verificationStatusCode === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                    {org.orgType && <span>{org.orgType}</span>}
                    {org.category && <span>· {org.category}</span>}
                    {org.city && (
                      <span>📍 {org.city}{org.state ? `, ${org.state}` : ''}</span>
                    )}
                  </div>
                  {typeof ratings?.avgRating === 'number' && ratings.totalReviews > 0 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <Stars rating={ratings.avgRating} />
                      <span className="text-sm font-semibold text-slate-700">{ratings.avgRating}</span>
                      <span className="text-sm text-slate-400">({ratings.totalReviews} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Members" value={org.memberCount} />
              <StatCard label="Active Projects" value={org.activeProjectCount} />
              <StatCard label="Completed" value={org.completedProjectCount} />
              <StatCard label="Followers" value={org.followerCount} />
            </div>

            {/* About / Mission / Vision */}
            {(org.about || org.mission || org.vision) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                {org.about && (
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">About</h2>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700">{org.about}</p>
                  </div>
                )}
                {org.mission && (
                  <div className="mt-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Mission</h2>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700">{org.mission}</p>
                  </div>
                )}
                {org.vision && (
                  <div className="mt-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Vision</h2>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700">{org.vision}</p>
                  </div>
                )}
              </div>
            )}

            {/* Contact & eligibility */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Contact & Details</h2>
              <div className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm text-slate-600 sm:grid-cols-2">
                {org.contactEmail && <p>✉️ {org.contactEmail}</p>}
                {org.contactPhone && <p>📞 {org.contactPhone}</p>}
                {org.website && (
                  <p>
                    🔗{' '}
                    <a href={org.website} target="_blank" rel="noreferrer" className="text-primary underline">
                      {org.website}
                    </a>
                  </p>
                )}
                {org.regNumber && <p>🏛️ Reg. No. {org.regNumber}</p>}
                {(org.addressLine1 || org.city) && (
                  <p className="sm:col-span-2">
                    📍 {[org.addressLine1, org.addressLine2, org.city, org.state, org.pincode].filter(Boolean).join(', ')}
                  </p>
                )}
                {org.onPlatformSince && (
                  <p className="sm:col-span-2 text-slate-400">
                    On RippleHub since {new Date(org.onPlatformSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
              {(org.is80GEligible || org.is12AEligible || org.isDonationEnabled) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {org.is80GEligible ? (
                    <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
                      80G Eligible
                    </span>
                  ) : null}
                  {org.is12AEligible ? (
                    <span className="rounded-full bg-violet/10 px-2.5 py-1 text-xs font-semibold text-violet">
                      12A Eligible
                    </span>
                  ) : null}
                  {org.isDonationEnabled ? (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      Accepts Donations
                    </span>
                  ) : null}
                </div>
              )}
            </div>

            {/* Projects */}
            {(projects.length > 0 || loadingProjects) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Projects</h2>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {projects.map((p) => {
                    const isOpen = expandedId === p.projectId
                    const detail = projectDetails[p.projectId]
                    const isLoadingDetail = loadingDetailId === p.projectId
                    return (
                      <div key={p.projectId} className="rounded-xl border border-slate-200 p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">{p.projectName}</p>
                          {p.statusCode && (
                            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500">
                              {p.statusCode}
                            </span>
                          )}
                        </div>
                        {(p.landmark || p.address) && (
                          <p className="mt-1 text-xs text-slate-400">📍 {p.landmark || p.address}</p>
                        )}

                        <button
                          onClick={() => toggleExpand(p)}
                          className="mt-2 text-xs font-semibold text-primary hover:underline"
                        >
                          {isOpen ? 'Hide details ▲' : 'Expand details ▼'}
                        </button>

                        {isOpen && (
                          <div className="mt-2.5 space-y-1.5 border-t border-slate-100 pt-2.5 text-xs text-slate-600">
                            {isLoadingDetail && <p className="text-slate-400">Loading details…</p>}
                            {!isLoadingDetail && !detail && (
                              <p className="text-slate-400">Details unavailable right now.</p>
                            )}
                            {detail && (
                              <>
                                {detail.description && (
                                  <p className="whitespace-pre-line leading-relaxed">{detail.description}</p>
                                )}
                                {detail.category && <p><span className="font-semibold text-slate-500">Category:</span> {detail.category}</p>}
                                {detail.scheduleType && <p><span className="font-semibold text-slate-500">Schedule:</span> {detail.scheduleType}</p>}
                                {detail.oneTimeDate && <p><span className="font-semibold text-slate-500">Date:</span> {detail.oneTimeDate}</p>}
                                {(detail.recurStart || detail.recurEnd) && (
                                  <p><span className="font-semibold text-slate-500">Runs:</span> {[detail.recurStart, detail.recurEnd].filter(Boolean).join(' – ')}{detail.recurDays ? ` (${detail.recurDays})` : ''}</p>
                                )}
                                {(detail.sessionStartTime || detail.sessionEndTime) && (
                                  <p><span className="font-semibold text-slate-500">Time:</span> {[detail.sessionStartTime, detail.sessionEndTime].filter(Boolean).join(' – ')}</p>
                                )}
                                {detail.locationType && <p><span className="font-semibold text-slate-500">Location type:</span> {detail.locationType}</p>}
                                {(detail.addressLine || detail.city) && (
                                  <p><span className="font-semibold text-slate-500">Address:</span> {[detail.addressLine, detail.landmark, detail.city, detail.state].filter(Boolean).join(', ')}</p>
                                )}
                                {typeof detail.maxVolunteers === 'number' && (
                                  <p><span className="font-semibold text-slate-500">Volunteers needed:</span> {detail.maxVolunteers}{typeof detail.approvedCount === 'number' ? ` (${detail.approvedCount} approved)` : ''}</p>
                                )}
                                {detail.minHoursRequired != null && (
                                  <p><span className="font-semibold text-slate-500">Min. hours:</span> {detail.minHoursRequired}</p>
                                )}
                                {detail.joinType && <p><span className="font-semibold text-slate-500">Joining:</span> {detail.joinType}</p>}
                                {detail.impactSummary && (
                                  <p><span className="font-semibold text-slate-500">Impact:</span> {detail.impactSummary}</p>
                                )}
                                {detail.googleMapsUrl && (
                                  <p>
                                    <a href={detail.googleMapsUrl} target="_blank" rel="noreferrer" className="font-semibold text-primary underline">
                                      View on Google Maps
                                    </a>
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {projects.length < projectsTotal && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => loadProjects(projectsPage + 1, false)}
                      disabled={loadingProjects}
                      className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {loadingProjects ? 'Loading…' : 'Load more projects'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Reviews</h2>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.code} value={o.code}>{o.label}</option>
                  ))}
                </select>
              </div>

              {ratings?.totalReviews > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-4 border-b border-slate-100 pb-4 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="text-center sm:pr-4">
                    <p className="font-display text-3xl font-bold text-slate-900">{ratings.avgRating}</p>
                    <Stars rating={ratings.avgRating} size="text-base" />
                    <p className="mt-1 text-xs text-slate-400">{ratings.totalReviews} reviews</p>
                  </div>
                  <div className="space-y-1">
                    <RatingBar label="5★" pct={ratings.star5Pct} />
                    <RatingBar label="4★" pct={ratings.star4Pct} />
                    <RatingBar label="3★" pct={ratings.star3Pct} />
                    <RatingBar label="2★" pct={ratings.star2Pct} />
                    <RatingBar label="1★" pct={ratings.star1Pct} />
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-4">
                {reviews.length === 0 && !loadingReviews && (
                  <p className="py-6 text-center text-sm text-slate-400">No reviews yet.</p>
                )}
                {reviews.map((r) => (
                  <div key={r.reviewId} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      {r.authorAvatar ? (
                        <img src={r.authorAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                          {initials(r.authorName)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <p className="text-sm font-semibold text-slate-800">{r.authorName || 'Anonymous'}</p>
                          <Stars rating={r.overallRating} />
                        </div>
                        {r.createdAt && (
                          <p className="text-[11px] text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                        )}
                        {r.reviewText && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{r.reviewText}</p>}
                        {r.responseText && (
                          <div className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500">
                            <span className="font-semibold text-slate-600">Response from {org.orgName}: </span>
                            {r.responseText}
                          </div>
                        )}
                        {typeof r.helpfulCount === 'number' && r.helpfulCount > 0 && (
                          <p className="mt-1.5 text-[11px] text-slate-400">👍 {r.helpfulCount} found this helpful</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {reviews.length < reviewsTotal && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => loadReviews(reviewsPage + 1, sort, false)}
                    disabled={loadingReviews}
                    className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                  >
                    {loadingReviews ? 'Loading…' : 'Load more reviews'}
                  </button>
                </div>
              )}
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
