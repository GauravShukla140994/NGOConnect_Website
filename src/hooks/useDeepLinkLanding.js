import { useEffect, useState } from 'react'
import { APP_SCHEME_PREFIX, APP_STORE_URL, PLAY_STORE_URL, DEEP_LINK_TIMEOUT_MS } from '../constants/deepLinking.js'

// Shared logic for every /invite, /ngo, /opportunity landing page: fetch a
// public preview from the API, then attempt to open the app via custom scheme,
// falling back to the app/play store if nothing opened it.
//
// apiPath      — path appended to VITE_API_BASE_URL, e.g. `/public/org/${token}`
// deepLinkPath — path appended to the app scheme, e.g. `ngo/${token}`
//
// /ngo and /opportunity now take an opaque encrypted share token (not a raw
// numeric ID) — see PublicController.cs on the API side. A bad/tampered/expired
// token comes back as { isSuccess: 0, errorCode: "INVALID_SHARE_TOKEN", message }.
function friendlyError(errorCode, message) {
  if (errorCode === 'INVALID_SHARE_TOKEN') {
    return 'This link is no longer valid. Ask the sender for a new share link.'
  }
  return message || 'This link is no longer valid.'
}

export function useDeepLinkLanding({ apiPath, deepLinkPath }) {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const storeUrl = isIOS ? APP_STORE_URL : PLAY_STORE_URL

  useEffect(() => {
    if (!apiPath) return
    let cancelled = false

    fetch(`${import.meta.env.VITE_API_BASE_URL}${apiPath}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        if (json.isSuccess === 1 && json.data) {
          setData(json.data)
          setStatus('ready')
        } else {
          setError(friendlyError(json.errorCode, json.message))
          setStatus('error')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load this page. Check your connection and try again.')
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [apiPath])

  function openApp() {
    window.location.href = `${APP_SCHEME_PREFIX}${deepLinkPath}`
    // If the OS switched to the app, this tab goes into the background and
    // document.hidden becomes true — in that case, skip the store redirect.
    setTimeout(() => {
      if (!document.hidden) window.location.href = storeUrl
    }, DEEP_LINK_TIMEOUT_MS)
  }

  // Auto-attempt the deep link once we have a valid preview.
  useEffect(() => {
    if (status === 'ready') openApp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return { status, data, error, storeUrl, openApp }
}
