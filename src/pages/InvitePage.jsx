import { useParams } from 'react-router-dom'
import { useDeepLinkLanding } from '../hooks/useDeepLinkLanding.js'
import DeepLinkCard from '../components/deeplink/DeepLinkCard.jsx'
import { initials } from '../utils/initials.js'

export default function InvitePage() {
  const { token } = useParams()
  const { status, data: invite, error, storeUrl, openApp } = useDeepLinkLanding({
    apiPath: `/org/invite/verify/${token}`,
    deepLinkPath: `invite/${token}`,
  })

  return (
    <DeepLinkCard
      status={status}
      error={error}
      errorTitle="Invalid invitation"
      storeUrl={storeUrl}
      onOpenApp={openApp}
    >
      {invite && (
        <>
          {invite.orgLogo ? (
            <img
              src={invite.orgLogo}
              alt={invite.orgName}
              className="mx-auto mb-4 h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
              {initials(invite.orgName)}
            </div>
          )}
          <h1 className="font-display text-xl font-bold text-white">{invite.orgName}</h1>
          {invite.orgCity && <p className="mt-1 text-sm text-white/50">📍 {invite.orgCity}</p>}
          {invite.invitedByName && (
            <p className="mt-3 text-sm text-white/40">
              Invited by <b className="text-white/70">{invite.invitedByName}</b>
            </p>
          )}
        </>
      )}
    </DeepLinkCard>
  )
}
