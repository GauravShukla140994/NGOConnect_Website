# Platform Name — Marketing Website

A cinematic, story-driven marketing experience for the mobile app. One continuous scroll: darkness → one glowing particle → ripples → a connected Earth → the movement.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Production build

```bash
npm run build
npm run preview
```

Output goes to `dist/` — deploy to any static host (Vercel, Netlify, Azure Static Web Apps).

## Stack

React 18 + Vite · Tailwind CSS · Framer Motion · GSAP ScrollTrigger · Three.js · Lenis smooth scroll

## Story structure

| Act | Section | File |
|---|---|---|
| Opening | Black → stars → one particle → ripple → Earth | `CosmicScene.jsx`, `IntroOverlay.jsx` |
| Hero + Live World | Headline over living globe, live impact toasts | `Hero.jsx` |
| The Problem | Globe fades, the question | `Problem.jsx` |
| App Reveal | Scroll-pinned phone, 6 animated user journeys | `AppReveal.jsx` |
| Purpose | 3D tilt cards | `Purpose.jsx` |
| Causes | 14-cause gradient grid | `Causes.jsx` |
| Global Exploration | Draggable dotted globe + counters | `GlobeExplore.jsx` |
| Stories | Photographic story cards | `Stories.jsx` |
| Organizations | Without/With comparison | `Organizations.jsx` |
| Download | Floating phones + QR | `Download.jsx` |
| Final Ripple | The particle returns, world illuminates, final CTA | `FinalRipple.jsx` |

## Before launch

- Replace "Platform Name" globally with the final brand name
- Replace the decorative QR in `Download.jsx` with a real QR code
- Point store buttons to real App Store / Play Store URLs
- Earth texture loads from unpkg CDN with a graceful offline fallback — self-host it for production
