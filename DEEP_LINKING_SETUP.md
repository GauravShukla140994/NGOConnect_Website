# Deep Linking — Setup Status

Tracks what's built vs. what's still needed for the three deep-link landing pages
(`/invite/{token}`, `/ngo/{orgId}`, `/opportunity/{projectId}`) to actually open the
RippleHub app instead of just showing the web landing page.

## Shared implementation (added 2026-07-19)

All three pages share the same logic, refactored out so a future fix (App Store
ID, scheme correction, etc.) only needs updating in one place:

- `src/constants/deepLinking.js` — `APP_SCHEME_PREFIX`, `APP_STORE_URL`,
  `PLAY_STORE_URL`, `DEEP_LINK_TIMEOUT_MS`.
- `src/hooks/useDeepLinkLanding.js` — fetch + deep-link-attempt + store-fallback
  state machine (`status`, `data`, `error`, `storeUrl`, `openApp`).
- `src/components/deeplink/DeepLinkCard.jsx` — shared visual shell (loading /
  error / ready states); each page only supplies its own ready-state content.
- `src/utils/initials.js` — shared logo-fallback initials helper.

## Done (this repo)

- `src/pages/InvitePage.jsx` — `/invite/:token`. Fetches
  `GET {VITE_API_BASE_URL}/org/invite/verify/{token}` (confirmed live endpoint,
  confirmed response fields: `orgName`, `orgLogo`, `orgCity`, `invitedByName`,
  `orgAbout`, `statusCode`, `inviteType`, `tokenExpiry`, `message`, `errorCode`).
- `src/pages/NgoLandingPage.jsx` — `/ngo/:orgId`. Fetches
  `GET {VITE_API_BASE_URL}/org/{orgId}/public` (confirmed live, public, no auth
  — `OrgController.cs` comment literally says "used by website deep link landing
  page"). Confirmed response fields: `orgId`, `orgName`, `logoUrl`, `city`,
  `aboutShort`, `verificationStatusCode`, `memberCount`.
- `src/pages/OpportunityLandingPage.jsx` — `/opportunity/:projectId`. Fetches
  `GET {VITE_API_BASE_URL}/project/{projectId}` (confirmed live, public, no auth
  — no `[Authorize]` on the controller or the action). Confirmed response fields
  include `projectName` (not `title` — matches the existing `Projects` table
  naming rule in this project's CLAUDE.md), `orgName`, `orgLogo`, `city`,
  `scheduleType`, `scheduleTypeCode`, plus many project-detail fields not used
  on this landing page.
- All three attempt a custom-scheme deep link on load, fall back to the store
  after 2.5s if the tab is still in the foreground (i.e. nothing opened it).
- `public/.well-known/apple-app-site-association` — `appID` bundle-id portion
  confirmed (`app.ripplehub`); Apple Team ID prefix is still a placeholder.
  `paths` now covers all three routes: `["/invite/*", "/ngo/*", "/opportunity/*"]`.
- `public/.well-known/assetlinks.json` — `package_name` confirmed
  (`app.ripplehub`); `sha256_cert_fingerprints` is still a placeholder. **Does
  NOT have a `paths` field** — see note below, this isn't an oversight.
- `src/constants/deepLinking.js` `PLAY_STORE_URL` — confirmed, uses `app.ripplehub`.
- `public/serve.json` — forces `Content-Type: application/json` on both
  `.well-known` files (the AASA file has no extension, so `serve` can't infer
  this on its own; iOS requires exactly this content type).

## Note: assetlinks.json has no path-scoping field

The AASA file's `paths` array is real — Apple's Universal Links schema supports
per-path scoping directly in that file. Android's Digital Asset Links format
(`assetlinks.json`) has no equivalent field: `delegate_permission/common.handle_all_urls`
grants trust for the **whole domain**, and path-level restriction (which of
`/invite/*`, `/ngo/*`, `/opportunity/*` the app actually claims vs. leaves to the
browser) is configured entirely in the Android app's own `AndroidManifest.xml`
intent-filter (`<data android:pathPattern="..."/>` entries) — not in this repo.
So no change was made to `assetlinks.json` beyond what's already there.

## Confirmed 2026-07-19

- Android package name / iOS bundle ID: **`app.ripplehub`** (renamed from the
  old NGO Connect naming). Filled into `assetlinks.json`, `apple-app-site-association`,
  and `InvitePage.jsx`'s `PLAY_STORE_URL`.

## Still needed — real values, not something I can fill in from this repo

**Status (2026-07-19): Android side is ready to go as-is (`assetlinks.json`, Play Store
URL, package name all confirmed). iOS is blocked on the Apple Team ID — not
available yet. Nothing else is pending on Android.**

| Value | Where it's used | Source |
|---|---|---|
| Apple Team ID (10 chars, e.g. `AB12CD34EF`) — **blocking iOS, not yet available** | `apple-app-site-association` `appID` prefix | developer.apple.com → Membership |
| Android SHA-256 signing fingerprint | `assetlinks.json` | `keytool -list -v -keystore <release-key> -alias <alias>` on the actual release signing key |
| Custom URL scheme (currently assumed `ripplehub://`, matching the package rename, but not independently confirmed) | `src/constants/deepLinking.js` `APP_SCHEME_PREFIX` | Must match `AndroidManifest.xml` intent-filter + `Info.plist` `CFBundleURLSchemes` exactly |
| App Store listing URL | `src/constants/deepLinking.js` `APP_STORE_URL` | Once published on the App Store |

## Still needed — native app config (separate mobile repo, not this one)

- Android `AndroidManifest.xml` — `intent-filter` for both the custom scheme
  (`ripplehub://`) and the App Links domain (`ripplehub.app`, `autoVerify="true"`).
- iOS `Info.plist` — `CFBundleURLTypes` for the custom scheme.
- iOS Xcode — Signing & Capabilities → Associated Domains → `applinks:ripplehub.app`
  (cannot be done via file edit alone; needs Xcode or the `.entitlements` file).

## Known limitation

On iOS Safari specifically, attempting `window.location = 'ripplehub://...'` when
the app is **not** installed can trigger a "Cannot Open Page" system alert before
falling back to the store link — this is a known iOS Safari behavior with custom
URL schemes, not a bug in this page. Once Universal Links are properly configured
(the AASA file above, filled in and verified), iOS will handle `ripplehub.app/invite/*`
taps directly at the OS level when the app is installed, and this page will only
ever be shown to users who don't have the app — avoiding that alert entirely for
the common case.
