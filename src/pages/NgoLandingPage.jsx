import { useParams } from 'react-router-dom'
import { useDeepLinkLanding } from '../hooks/useDeepLinkLanding.js'
import DeepLinkCard from '../components/deeplink/DeepLinkCard.jsx'
import { initials } from '../utils/initials.js'

// Uses the RICH profile endpoint (Org_GetPublicProfile + review aggregate +
// first page of projects) — see PublicController.GetOrgFullProfile. This page
// still auto-attempts the app deep link (same as every other /invite,
// /opportunity landing page), so it's a richer bounce-through card, not a
// full browsable web profile with paginated reviews — that's a separate,
// not-yet-built page (see DOCUMENTATION_GUIDELINES "Phase 3" note).
export default function NgoLandingPage() {
  const { token } = useParams()
  const { status, data, error, storeUrl, openApp } = useDeepLinkLanding({
    apiPath: `/public/org/${encodeURIComponent(token)}/full`,
    deepLinkPath: `ngo/${encodeURIComponent(token)}`,
  })
  // PublicController.GetOrgFullProfile: { orgId, profile: {...}, ratings: {...}, projects: {...} }
  const org = data?.profile
  const ratings = data?.ratings
  const projects = data?.projects

  return (
    <DeepLinkCard
      status={status}
      error={error}
      errorTitle="NGO not found"
      storeUrl={storeUrl}
      onOpenApp={openApp}
    >
      {org && (
        <>
          {org.logoUrl ? (
            <img
              src={org.logoUrl}
              alt={org.orgName}
              className="mx-auto mb-4 h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
              {initials(org.orgName)}
            </div>
          )}

          <h1 className="font-display text-xl font-bold text-white">{org.orgName}</h1>
          {org.verificationStatusCode === 'VERIFIED' && (
            <p className="mt-1 text-xs font-semibold text-emerald-400">✓ Verified organisation</p>
          )}
          {org.city && <p className="mt-1 text-sm text-white/50">📍 {org.city}{org.state ? `, ${org.state}` : ''}</p>}

          {org.about && (
            <p className="mt-3 line-clamp-3 text-sm text-white/60">{org.about}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/40">
            {typeof org.memberCount === 'number' && (
              <span><b className="text-white/70">{org.memberCount}</b> {org.memberCount === 1 ? 'member' : 'members'}</span>
            )}
            {typeof ratings?.totalReviews === 'number' && ratings.totalReviews > 0 && (
              <span>⭐ <b className="text-white/70">{ratings.avgRating}</b> ({ratings.totalReviews} {ratings.totalReviews === 1 ? 'review' : 'reviews'})</span>
            )}
            {typeof org.activeProjectCount === 'number' && (
              <span><b className="text-white/70">{org.activeProjectCount}</b> active {org.activeProjectCount === 1 ? 'project' : 'projects'}</span>
            )}
            {typeof org.completedProjectCount === 'number' && org.completedProjectCount > 0 && (
              <span><b className="text-white/70">{org.completedProjectCount}</b> completed</span>
            )}
          </div>

          {Array.isArray(projects?.items) && projects.items.length > 0 && (
            <div className="mt-5 text-left">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/30">Recent projects</p>
              <ul className="space-y-1.5">
                {projects.items.slice(0, 3).map((p) => (
                  <li key={p.projectId} className="truncate text-sm text-white/60">• {p.projectName}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </DeepLinkCard>
  )
}
