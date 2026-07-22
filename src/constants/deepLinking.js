// Shared across every deep-link landing page (/invite, /ngo, /opportunity).
// Update here once and every page picks it up.

// Package name confirmed 2026-07-19: app.ripplehub (Android + iOS bundle ID).
// APP_SCHEME_PREFIX is assumed to match, but not independently confirmed against
// the mobile app's actual AndroidManifest.xml intent-filter / Info.plist
// CFBundleURLSchemes — verify before relying on it in production.
export const APP_SCHEME_PREFIX = 'ripplehub://'

// Still a placeholder — swap in the real numeric App Store ID once published.
export const APP_STORE_URL = 'https://apps.apple.com/app/ripplehub/idREPLACE_WITH_APP_STORE_ID'

// Confirmed 2026-07-19.
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.ripplehub'

export const DEEP_LINK_TIMEOUT_MS = 2500
