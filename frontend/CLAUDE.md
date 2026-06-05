# CLAUDE.md — The Resolutes

Guidance for working in this repo. Read this first after a context reset.

## What this is

A **frontend-only**, multipage, fully-3D freelancing portfolio for **The
Resolutes** (frontend / design / full-stack / AI-ML studio). Cinematic
space-storm hero where the 3D wordmark "The Resolutes" sheds its `s`, which
becomes the `S` of "Surprise!". Dark-navy space aesthetic, single electric-blue
accent `#3B82F6`, Clash Display + Satoshi (Fontshare). No backend.

## Stack

React 19 · Vite (Rolldown) · React Router · React Three Fiber (+ drei,
@react-three/postprocessing) on Three.js · GSAP/ScrollTrigger · Lenis · Framer
Motion · Tailwind v4 (`@tailwindcss/vite`).

Scripts: `npm run dev` · `npm run build` · `npm run preview` · `npm run lint`.

## Architecture (verify, don't rebuild)

- **One persistent R3F `<Canvas>`** at the app root (`src/layout/AppLayout.jsx`),
  fixed behind the DOM, `pointer-events: none`. The DOM stays interactive; 3D
  parallax is fed from a global pointer signal.
- **`src/scenes/SceneCanvas.jsx`** — the single canvas: adaptive DPR/quality via
  `PerformanceMonitor`, Bloom + Vignette, and per-route focal scenes lazy-loaded
  from the `SCENES` map. The canvas is `aria-hidden`.
- **`src/scenes/signals.js`** — mutable singleton bridging the DOM tree and the
  canvas (separate React reconcilers; context can't cross `<Canvas>`). DOM writes
  `route`, `homeScroll`, `quality`, `reducedMotion`, `isMobile`, `pointer`,
  `lenis`; `useFrame` reads them. Writes are plain assignments (no re-render).
- **`src/scenes/waypoints.js`** — per-route camera `pos`/`look`; `CameraRig`
  flies between them so routes read as one continuous flight through space. Each
  route's scene group is anchored at its `look` point (`SceneManager`).
- **Routing** — six routes (`/`, `/services`, `/work`, `/pricing`, `/about`,
  `/contact`) in `AppLayout`, `*` falls back to Home. Transitions via
  `<AnimatePresence mode="wait">` + `PageTransition` keyed on `location.pathname`;
  scroll resets to top in `onExitComplete`.
- **`src/data/content.js`** — single source of truth for all copy. Anything the
  team must supply is marked `TODO` (see below).
- **Shell pieces**: `Preloader`, `Nav` (+ mobile overlay menu rendered as a
  **sibling** of the header so the header's `backdrop-filter` doesn't become its
  containing block — `.mobile-menu` is `z-index: 45`), `CustomCursor`, `Grain`,
  `Footer`, `Seo` (per-route title/meta, no dependency).
- **Hooks**: `useReducedMotion`, `useIsMobile`, `useSmoothScroll` (Lenis; skipped
  under reduced motion).

## Conventions

- **Design tokens** live in `src/styles/index.css` under `@theme` — extend, don't
  replace. Body copy uses `--color-site-fore` / `--color-site-fore-dim`;
  `--color-site-fore-faint` is **decorative only** (low contrast).
- **Reduced motion is honored end to end** — don't regress it: canvas →
  `StaticBackdrop`, Home → single static hero (no empty scroll track), Lenis →
  native scroll, `<MotionConfig reducedMotion="user">`.
- **Don't break the storm hero** or the `s → Surprise!` handoff. Refactor only
  where needed.
- The ~1.1MB three + R3F chunk is **inherent** to a 3D app — it's cached, sits
  behind the preloader, and runtime FPS is governed by adaptive DPR/quality, not
  bundle size. `chunkSizeWarningLimit` is raised to `1200` in `vite.config.js`
  for that reason; don't treat the chunk size as a bug.
- Commit per phase with clear messages. **Ask before deleting anything
  ambiguous.** Co-author trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## TODO placeholders (user must supply)

- **EmailJS** keys in `content.js` (`EMAILJS`) — until set, the contact form
  rejects and falls back to the `mailto:` link.
- **Social URLs** in `CONTACT` (LinkedIn / GitHub / LeetCode).
- **Project images** (into `/public`, referenced from `PROJECTS`) and each
  project's **live / repo** links.

## Phase status

- **A** — routed multipage app, one persistent canvas. ✅ committed
- **B** — preloader, nav + mobile menu, page transitions, grain. ✅ committed
- **C** — all six pages (DOM content + per-page 3D). ✅ committed
- **D** — performance, mobile, reduced-motion. ✅ committed
- **E** — accessibility + SEO (favicon, meta/OG, MotionConfig, skip link,
  aria-hidden canvas, contact-form a11y). ✅ committed
- **F** — cleanup (removed Vite-default dead code), README, this file, final QA.
  ✅ in progress / committing

## Gotchas / notes

- Running on Windows; git warns about LF→CRLF — harmless.
- A previous session built a CDP screenshot helper at `%TEMP%/cdp-shot.mjs`
  (`RM` / `MOBILE` / `CLICK` / `FOCUS` env flags). It failed for **tooling**
  reasons (a persisted device-metrics override leaking across navigations; slow
  first WebGL boot under headless SwiftShader), not app bugs. If reused: restart
  Chrome fresh and wait longer for boot. Otherwise code review + one fresh-browser
  check is enough to commit.
