# NGO Connect — Admin Panel (`/admin`): Complete Implementation Prompt

> **Version:** v1.0
> **Date:** 2026-07-11
> **Scope:** Implement the approved prototype `NGO_Connect_Admin_Prototype_v1.0.html` (lives in the `NGOConnect_API` repo at `Documents/NGO_Connect_Admin_Prototype_v1.0.html` — copy it into this repo for reference before starting, e.g. `docs/admin-prototype-reference.html`) as a real, working `/admin` section of this Website app.
> **Backend companion doc:** `SuperAdmin_Backend_Dev_Prompt.md` (NGOConnect_API repo) — some Members-screen and Overview-screen features depend on endpoints listed there as "not yet built." Read Section 7 of this doc before assuming an endpoint exists.
> **Hard rule:** every screen, tab, drawer section, and action button present in the prototype must exist in the real build. If a backend endpoint isn't ready yet, build the UI against the documented shape and wire it once the endpoint ships — do not silently drop a feature.

---

## 1. Current State of This Repo — Read Before Changing Anything

This is a **marketing/landing site only** today:
```
package.json    — react 18, vite 5, tailwind 3, framer-motion, gsap, lenis, three
                   NO react-router-dom, NO axios/fetch wrapper, NO auth of any kind
src/App.jsx     — single page, no routes: Hero → Problem → AppReveal → Purpose →
                   Causes → GlobeExplore → Stories → Organizations → Download →
                   FinalRipple → Footer, wrapped in a GSAP/Lenis scroll experience
src/main.jsx    — plain ReactDOM.createRoot(<App />), no router
tailwind.config.js — theme: primary #2563EB, secondary #22C55E, accent #F97316,
                      violet #7C3AED, navy #0B1120; fonts Clash Display/Sora/Inter
```
The admin panel is a **second, unrelated application** sharing this codebase for deployment convenience. Keep it structurally isolated — do not let admin code creep into `src/components/` (marketing) or vice versa.

**The prototype's own design system is intentionally different from the marketing site's** (prototype uses `--p:#6B4EFF` violet-purple, `--tl:#2ECC71` teal-green, `--or:#FF8C42`, `--rd:#FF4444`, `--yw:#F59E0B` on a dark `#0F1115` sidebar with light content area). That's fine — it's an internal tool, not a public brand surface. **Do not try to reconcile it with the marketing Tailwind theme.** Port the prototype's CSS variables and component classes (`.pill`, `.card`, `.btn`, `.drawer`, `.nav-item`, `.ms-dropdown`, etc.) close to verbatim into a dedicated stylesheet scoped to the admin tree. This is the lowest-risk path to pixel/behavior parity — reimplementing everything in Tailwind utility classes from scratch risks silently dropping details (there is a real history of iteration bugs in this exact prototype: a `.card{overflow:hidden}` rule once clipped a dropdown panel, initials-fallback avatars were missed on the first pass, a `.pb` pill class was missing — treat the prototype file as the literal source of truth, not a rough guide).

---

## 2. New Dependencies

```bash
npm install react-router-dom axios
```
No state management library needed — React Context is enough for admin auth state; each page manages its own local state / data fetching (or use a tiny custom `useApi` hook, see Section 4).

---

## 3. File Structure to Create

```
src/
  admin/
    AdminApp.jsx                 — routes for everything under /admin
    admin.css                    — ported prototype CSS variables + component classes
    api/
      client.js                  — axios instance, env-based baseURL, auth interceptor
      auth.js                    — login(), logout(), getToken(), isAuthenticated()
      orgs.js                    — org list/detail/documents/approve/reject/suspend/reactivate/history
      members.js                 — member list/detail/documents/verify/suspend/reactivate
      lookups.js                 — lookup type/value CRUD
      dashboard.js                — KPIs + recent orgs
    context/
      AdminAuthContext.jsx       — provides { user, token, login, logout, isAuthenticated }
    components/
      AdminLayout.jsx            — sidebar + topbar shell (matches prototype .sidebar/.topbar)
      ProtectedRoute.jsx         — redirects to /admin/login if not authenticated
      Avatar.jsx                 — photo w/ onError → colored-initials fallback (port renderAvatar())
      MultiSelectDropdown.jsx    — searchable multi-select (port .ms-dropdown/.ms-panel behavior)
      StatusPill.jsx             — colored pill by status code
      Drawer.jsx                 — generic slide-over shell used by Org + Member drawers
    pages/
      LoginPage.jsx
      OverviewPage.jsx
      OrganisationsPage.jsx
      OrgDrawer.jsx
      MembersPage.jsx
      MemberDrawer.jsx
      SettingsPage.jsx
      LookupManagementPage.jsx
  App.jsx                        — unchanged marketing site
  main.jsx                       — add <BrowserRouter> wrapping <App /> (only structural change here)
```

---

## 4. Environment / API Base URL

Vite reads `VITE_*` vars from mode-specific `.env` files at build time (`import.meta.env.VITE_API_BASE_URL`).

Create:
```
.env.development
  VITE_API_BASE_URL=<local API URL — ask the user for the exact host:port their API runs on locally, do not assume>

.env.staging
  VITE_API_BASE_URL=https://ngoconnectapi-staging.up.railway.app/api/v1

.env.production
  VITE_API_BASE_URL=<confirm the production API URL with the user before filling this in>
```
Build commands: `vite build --mode staging`, `vite build --mode production` (default `vite build` uses `.env.production` automatically — confirm this matches intended deploy pipeline).

`src/admin/api/client.js`:
```js
import axios from 'axios'
import { getToken, logout } from './auth'

const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logout()
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export default client
```
Store the JWT under a distinct key (e.g. `localStorage.setItem('sa_token', token)`) — never reuse any key the mobile app or a future volunteer-facing web login might use, to avoid collision if this site ever gains user-facing auth later.

---

## 5. Routing

`src/main.jsx` — only change: wrap in `BrowserRouter`.
`src/App.jsx` — unchanged, still renders at `/`.

Add a top-level router (in `main.jsx` or a new `src/Root.jsx`) that switches between the marketing `App` and the new `AdminApp` based on path prefix:
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/admin/*" element={<AdminApp />} />
    <Route path="/*" element={<App />} />
  </Routes>
</BrowserRouter>
```
`AdminApp.jsx`:
```jsx
<Routes>
  <Route path="login" element={<LoginPage />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<AdminLayout />}>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<OverviewPage />} />
      <Route path="orgs" element={<OrganisationsPage />} />
      <Route path="members" element={<MembersPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="lookup" element={<LookupManagementPage />} />
    </Route>
  </Route>
</Routes>
```
**Deployment note:** this is client-side routing — the hosting platform must rewrite all unmatched paths to `index.html` or a direct browser hit on `/admin/orgs` will 404. Add the appropriate rewrite rule for whatever host is used (Vercel `vercel.json` rewrites, Netlify `_redirects`, or Railway static-serve config) — confirm which platform is in use before writing the rule.

---

## 6. Screen-by-Screen Feature Checklist (mapped from the prototype — nothing here is optional)

### 6.1 Login (`s-login` equivalent → `LoginPage`)
- Username + password fields, calls `POST /superadmin/login`
- On success: store JWT + admin name, redirect to `/admin/overview`
- On failure: inline error message (no alert())

### 6.2 Shell (`AdminLayout`)
- Dark sidebar (`#0F1115`-style, port from prototype `.sidebar`), 5 nav items exactly as in the prototype: **Overview**, **Organisations** (with a live pending-count badge), **Members**, **Settings**, **Lookup management**, plus **Log out** at the bottom
- Topbar or sidebar footer showing the logged-in admin's name
- Active nav item highlighting matches prototype `.nav-item.on`

### 6.3 Overview (`pgOverview` → `OverviewPage`)
- KPI cards: Total NGOs, Pending approval, Active volunteers, Total donations — from `GET /superadmin/dashboard` (backend Section 3 — **not yet built**, see Section 7 below)
- Recently submitted organisations list/table below the cards

### 6.4 Organisations (`pgOrgs` → `OrganisationsPage` + `OrgDrawer`)
- 4 tabs with live counts: **Pending**, **Approved**, **Suspended**, **Rejected** — real status codes are `PENDING`/`UNDER_REVIEW` (grouped under "Pending"), `APPROVED`, `SUSPENDED`, `REJECTED`. Do not use "Active/Inactive" labels anywhere.
- Table columns: logo/initials avatar, org name, type, city, member count, submitted date, status pill, View/Review action
- **Org drawer** (full profile, opens on row click):
  - Avatar/logo with initials fallback (port `renderAvatar()` exactly — `<img onerror="...">` swap to a colored circle with initials, `colorForName()` for consistent per-name color)
  - Quick facts strip (type, city, member count, registered date)
  - Founder & contact section (name, email, mobile)
  - Address section (address line, landmark, city, state, pincode)
  - About / Mission / Vision section
  - Documents list with per-document verify action → `PUT /orgs/documents/verify`
  - **Status history timeline** (port `renderTimeline()`) — sourced from `GET /orgs/{orgId}/history` (backend Section 1 — **not yet built**, see Section 7)
  - State-aware action panel, one of four variants depending on current status:
    - Pending/Under review: Approve button + Reject button (reject opens a reason field, required) → `PUT /orgs/{orgId}/approve`, `PUT /orgs/reject`
    - Approved: Suspend button (reason required) → `PUT /orgs/suspend`
    - Suspended: Reactivate button → `PUT /orgs/{orgId}/reactivate`
    - Rejected: read-only note explaining the org can resubmit from the mobile app; no action buttons here

### 6.5 Members (`pgMembers` → `MembersPage` + `MemberDrawer`)
- **Searchable multi-select org filter dropdown** — "All organisations" master checkbox, individual org checkboxes, a search box inside the dropdown panel to filter the org list itself, label summarizing selection (e.g. "3 organisations selected"). Port `toggleOrgMs()`/`toggleOrgAll()`/`onOrgItemChange()`/`updateOrgMsLabel()`/`filterOrgOptions()` behavior into `MultiSelectDropdown.jsx`.
  - **Known trap:** the parent card must not clip this dropdown panel. The prototype had a real bug where a global `.card{overflow:hidden}` rule clipped the panel despite a high z-index — the fix was `overflow:visible` on the specific card + a new stacking context on the card header + a much higher z-index on the panel itself (60→150), not a z-index bump alone. Either replicate that fix or render the panel via a portal to `document.body` to sidestep overflow clipping entirely (portal is the more robust React-idiomatic fix — prefer it).
- Separate free-text search box (name/email/mobile)
- Table columns: avatar w/ initials fallback, name, org(s), **three separate status columns** — Membership, Account, Profile verification. These are deliberately distinct concepts, do not merge them into one status pill:
  - Membership status = org-level membership state (read-only here)
  - Account status = `Users.IsActive`-derived (Active/Suspended) — Super Admin can toggle
  - Profile verification status = Super Admin's own document check (Pending/Verified/Needs Update) — Super Admin can toggle
- **Member drawer** (full profile):
  - Avatar w/ initials fallback
  - Profile verification pill + account status pill at top
  - Contact section
  - Impact stats (hours, score, badges count)
  - Skills, interests, badges — rendered as pill lists (port `renderPillList()`)
  - Other organisations list (port `renderOtherOrgs()`)
  - Documents list with verify action
  - Actions: Verify profile / Request update (with reason) / Suspend account (with reason) / Reactivate account

### 6.6 Settings (`pgSettings` → `SettingsPage`)
- Grouped by `SettingGroup`, editable inputs matched to each setting's `DataType`
- Backed entirely by the **existing** `SettingsController` (`GetByGroup`, `Update`) — no new backend work, this is fully buildable today

### 6.7 Lookup Management (`pgLookup` → `LookupManagementPage`)
- Two-pane layout: LookupType list (left) + LookupValue table for the selected type (right)
- Add/edit LookupType, add/edit LookupValue, activate/deactivate toggle
- Guard: values where `IsSystemValue = 1` should not be deactivatable from the UI (disable the toggle, show a tooltip explaining why) — matches the real seed-data protection already enforced server-side
- Fully buildable today against existing `SuperAdminController` lookup endpoints

---

## 7. Backend Dependency Map — What's Real vs. Not Yet

| Screen | Endpoints used | Status |
|---|---|---|
| Login | `POST /superadmin/login` | ✅ live |
| Organisations tab + drawer (everything except history timeline) | `GET/PUT /orgs*` | ✅ live |
| Org drawer status history timeline | `GET /orgs/{orgId}/history` | ⛔ not built — see backend prompt Section 1 |
| Lookup Management | `GET/POST/PUT /lookup-types*`, `/lookup-values*` | ✅ live |
| Settings | existing `SettingsController` | ✅ live |
| Overview KPIs + recent list | `GET /superadmin/dashboard` | ⛔ not built — see backend prompt Section 3 |
| Members (entire screen) | `GET /members*`, verify/suspend/reactivate | ⛔ not built at all — see backend prompt Section 2 |

**Recommendation:** build Organisations, Lookup Management, Settings, and Login first — fully functional against real data today. Build Overview and Members UI against the documented response shapes in the backend prompt (Section 4 there) with the API calls wired but expect them to fail/404 until that backend work ships; do not fake the data with hardcoded mocks left in the shipped build — a clear "not yet available" empty state is safer than stale prototype sample data (`ORG_DATA`/`MEMBER_DATA` from the HTML file) accidentally reaching production.

---

## 8. Acceptance Checklist

- [ ] `/admin/login` works standalone, marketing site at `/` is untouched
- [ ] Direct browser navigation to any `/admin/*` URL works (no 404) after a hosting rewrite rule is confirmed and applied
- [ ] JWT persists across refresh, expires gracefully (redirect to login on 401, not a blank screen)
- [ ] Every screen in Section 6 is present with every listed feature — cross-check against the actual prototype HTML file, not just this list, before calling it done
- [ ] Org status labels are `PENDING`/`UNDER_REVIEW`/`APPROVED`/`REJECTED`/`SUSPENDED` — never "Active/Inactive"
- [ ] Member screen shows Membership/Account/Profile-verification as three distinct, separately-actioned pieces of UI
- [ ] Avatars fall back to colored initials when no photo URL or the photo fails to load, for both orgs and members
- [ ] Multi-select org filter dropdown is not clipped by any parent `overflow:hidden`
- [ ] Env files correctly point Dev/Staging/Prod builds at the right `VITE_API_BASE_URL`
