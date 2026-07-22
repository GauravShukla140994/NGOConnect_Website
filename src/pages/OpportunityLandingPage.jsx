import { useParams } from 'react-router-dom'
import { useDeepLinkLanding } from '../hooks/useDeepLinkLanding.js'
import DeepLinkCard from '../components/deeplink/DeepLinkCard.jsx'
import { initials } from '../utils/initials.js'

export default function OpportunityLandingPage() {
  const { token } = useParams()
  const { status, data, error, storeUrl, openApp } = useDeepLinkLanding({
    apiPath: `/public/opportunity/${encodeURIComponent(token)}`,
    deepLinkPath: `opportunity/${encodeURIComponent(token)}`,
  })
  // PublicController wraps the preview: { projectId, project: {...} }
  const project = data?.project

  return (
    <DeepLinkCard
      status={status}
      error={error}
      errorTitle="Opportunity not found"
      storeUrl={storeUrl}
      onOpenApp={openApp}
    >
      {project && (
        <>
          {project.orgLogo ? (
            <img
              src={project.orgLogo}
              alt={project.orgName}
              className="mx-auto mb-4 h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
              {initials(project.orgName)}
            </div>
          )}
          <h1 className="font-display text-xl font-bold text-white">{project.projectName}</h1>
          <p className="mt-1 text-sm text-white/50">{project.orgName}</p>
          <p className="mt-3 flex items-center justify-center gap-3 text-sm text-white/40">
            {project.city && <span>📍 {project.city}</span>}
            {project.scheduleType && <span>🗓️ {project.scheduleType}</span>}
          </p>
        </>
      )}
    </DeepLinkCard>
  )
}
