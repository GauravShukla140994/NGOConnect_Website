import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router doesn't reset scroll position on navigation (it's a client-side
// route swap, not a real page load) — so following a link while scrolled down
// leaves the new page's content below the fold. This resets scroll to the top
// on every pathname change.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
