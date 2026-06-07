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
  fixed behind the DOM. On desktop (fine pointer) the canvas is
  `pointer-events: auto` and `.site-main` is made `pointer-events: none` (with
  `.page` / `.home-payoff` re-enabled), so hovers/clicks over the page's empty
  negative space fall through to the interactive 3D objects, while cards/text
  stay interactive. On touch the canvas is `pointer-events: none` so scrolling is
  never captured. Idle parallax is still fed from a global pointer signal.
- **`src/scenes/SceneCanvas.jsx`** — the single canvas: adaptive DPR/quality via
  `PerformanceMonitor`, Bloom + Vignette, and per-route focal scenes lazy-loaded
  from the `SCENES` map. The canvas is `aria-hidden`.
- **`src/scenes/signals.js`** — mutable singleton bridging the DOM tree and the
  canvas (separate React reconcilers; context can't cross `<Canvas>`). DOM writes
  `route`, `homeScroll`, `homeReveal`, `heroScale`, `quality`, `reducedMotion`,
  `isMobile`, `pointer`, `lenis`; `useFrame` reads them. Writes are plain
  assignments (no re-render).
- **`src/scenes/waypoints.js`** — per-route camera `pos`/`look`; `CameraRig`
  flies between them so routes read as one continuous flight through space. Each
  route's scene group is anchored at its `look` point (`SceneManager`).
- **3D object kit** (`src/3d/`): `Planet`, `RingedPlanet`, `EnergyCore`,
  `Crystals` (procedural) and `GLBModel` (loads/clones a Poly Pizza model, tumbles
  it, scale-in intro, hover/click emissive ping). `useHover3d` centralises hover
  state and dispatches the `cursor3d` event that grows the DOM `CustomCursor`.
  Each focal scene places 1–2 of these in negative space, **behind the cards in
  z** (the glass cards occlude anything behind them — the real overlap risk is
  only over the transparent header text / inter-card gaps, so keep objects to the
  right/edges, never top-left). `Nebulae`, `Constellations`, `Aurora` and
  `Traveler` (a flying saucer that eases toward each route's vantage) live in the
  persistent `WorldEnvironment`.
- **Routing** — six routes (`/`, `/services`, `/work`, `/pricing`, `/about`,
  `/contact`) in `AppLayout`, `*` falls back to Home. Transitions via
  `<AnimatePresence mode="wait">` + `PageTransition` keyed on `location.pathname`,
  **directional**: travel direction (+1/-1 from route order) flows through
  `AnimatePresence custom` so the outgoing page slides out one way and the
  incoming page enters from the opposite side; scroll resets to top in
  `onExitComplete`. `Reveal` arrives from the sides (alternating) on scroll.
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
- **Don't break the storm hero** or the `s → Surprise!` handoff. The hero scales
  to fit the viewport (`heroScale` from aspect) so it's never cut on a phone, and
  `CameraRig` reads the same `heroScale`. The word dissolves and the camera
  dollies past it as `homeReveal` → 0 (driven by a ScrollTrigger on `.home-payoff`,
  whose background is opaque) so the 3D "surprise!" and the payoff text never
  share the screen. The `s` seam is tuned via `src/scenes/tune.js`; in dev a leva
  panel (`DevTuner`, dead-code-eliminated from prod) drags `S_LAND.x` / urprise x.
- **3D objects must never overlap text.** Place focal objects in negative space,
  behind cards in z, away from the top-left header. In the kit, any `scale` /
  `rotation` you animate in `useFrame` is set **imperatively**, never as a JSX
  prop (a hover re-render would otherwise reset it). Dispose hand-built
  geometries and cloned materials on unmount (shared GLTF geometry is **not**
  disposed — it's cached by `useGLTF`). Keep counts low and bloom modest — fewer,
  well-placed objects over clutter.
- The ~1.1MB three + R3F chunk is **inherent** to a 3D app — it's cached, sits
  behind the preloader, and runtime FPS is governed by adaptive DPR/quality, not
  bundle size. `chunkSizeWarningLimit` is raised to `1200` in `vite.config.js`
  for that reason; don't treat the chunk size as a bug.
- Commit per phase with clear messages. **Ask before deleting anything
  ambiguous.** Co-author trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## TODO placeholders (user must supply)

- **Project media** — `image` (poster) + optional `preview` (muted clip) per
  `PROJECTS` entry, files in `/public/work/`; plus each project's **live / repo**.
- **Model credits** — `MODEL_CREDITS` in `src/3d/models.js` has `author: 'TODO'`
  for each Poly Pizza model (CC-BY requires real author names; shown in `Footer`).
- **Object tuning** (visual, needs a browser): per-scene object positions/scales
  in `src/scenes/*Scene.jsx`, and the `s` seam via the dev leva panel → bake into
  `stormConfig.js` / `tune.js`.
- Done by the owner: `EMAILJS` keys + `CONTACT` social URLs are filled in;
  `/public/2k_stars_milky_way.jpg` is wired as the dim Milky-Way backdrop.

## Phase status

- **A** — routed multipage app, one persistent canvas. ✅ committed
- **B** — preloader, nav + mobile menu, page transitions, grain. ✅ committed
- **C** — all six pages (DOM content + per-page 3D). ✅ committed
- **D** — performance, mobile, reduced-motion. ✅ committed
- **E** — accessibility + SEO (favicon, meta/OG, MotionConfig, skip link,
  aria-hidden canvas, contact-form a11y). ✅ committed
- **F** — cleanup (removed Vite-default dead code), README, this file, final QA.
  ✅ committed

### Refinement pass (make it cinematic, stop the 3D fighting the text)

- **R1** — composition + hero: asteroids behind the title, de-slabbed wordmark,
  hero fit-to-viewport, `homeReveal` dissolve, stronger parallax, `s`-seam leva. ✅
- **R2** — replaced `FloatingPanels` with the themed, interactive 3D kit; renamed
  the model files; desktop canvas interaction; footer CC-BY credits. ✅
- **R3** — rich sky: nebulae, constellations, aurora, brighter stars, Milky-Way
  backdrop, the saucer traveller. ✅
- **R4** — directional page transitions + choreographed side-slide reveals. ✅
- **R5** — tighter layouts that fit 100vh + Work poster/hover-video media. ✅
- **R6** — disposal, removed `ScenePlaceholder`, this doc, final QA. ✅

## Gotchas / notes

- Running on Windows; git warns about LF→CRLF — harmless.
- **Model files**: three Poly Pizza downloads had spaces / `%`-escapes in their
  names (fragile to load) and were renamed to `flying-saucer.glb`, `iss.glb`,
  `spaceship.glb`. Paths live in `src/3d/models.js`. The `.glb` assets are
  committed so the Netlify build stays self-contained (~10 MB total).
- Visual tuning (object placement, model scales, the `s` seam) was done by
  reasoning, not a live browser, in this environment — give it one fresh-browser
  pass and nudge the per-scene values.
- A previous session built a CDP screenshot helper at `%TEMP%/cdp-shot.mjs`
  (`RM` / `MOBILE` / `CLICK` / `FOCUS` env flags). It failed for **tooling**
  reasons (a persisted device-metrics override leaking across navigations; slow
  first WebGL boot under headless SwiftShader), not app bugs. If reused: restart
  Chrome fresh and wait longer for boot. Otherwise code review + one fresh-browser
  check is enough to commit.
