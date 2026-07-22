import { useParams } from 'react-router-dom'
import { useDeepLinkLanding } from '../hooks/useDeepLinkLanding.js'
import DeepLinkCard from '../components/deeplink/DeepLinkCard.jsx'
import { initials } from '../utils/initials.js'

export default function NgoLandingPage() {
  const { orgId } = useParams()
  const { status, data: org, error, storeUrl, openApp } = useDeepLinkLanding({
    apiPath: `/org/${orgId}/public`,
    deepLinkPath: `ngo/${orgId}`,
  })

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
          {org.city && <p className="mt-1 text-sm text-white/50">📍 {org.city}</p>}
          {typeof org.memberCount === 'number' && (
            <p className="mt-3 text-sm text-white/40">
              <b className="text-white/70">{org.memberCount}</b> {org.memberCount === 1 ? 'member' : 'members'}
            </p>
          )}
        </>
      )}
    </DeepLinkCard>
  )
}
