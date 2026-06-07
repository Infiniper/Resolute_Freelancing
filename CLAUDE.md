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
  `pointer-events: auto` and `.site-main` is `pointer-events: none`, with **only
  the real content re-enabled** (cards/`.glass-card`, headings, controls, links —
  **not** the structural wrappers like `.page` / grids / sections). That's the
  key: re-enabling the whole `.page` column (as an earlier pass did) captured the
  empty negative space *inside* it, so the 3D objects never got hovers/clicks —
  re-enabling only the content leaves that empty space transparent, so events fall
  through to the interactive 3D objects while cards/text stay usable. On touch the
  canvas is `pointer-events: none` (scroll is never captured); **taps reach 3D via
  a window-level tap detector → `signals.tap*` → `TapRaycaster` inside the canvas**
  (see below). Idle parallax + tap NDC are fed from global pointer signals.
- **`src/scenes/SceneCanvas.jsx`** — the single canvas: adaptive DPR/quality via
  `PerformanceMonitor`, Bloom + Vignette, and per-route focal scenes lazy-loaded
  from the `SCENES` map. The canvas is `aria-hidden`.
- **`src/scenes/signals.js`** — mutable singleton bridging the DOM tree and the
  canvas (separate React reconcilers; context can't cross `<Canvas>`). DOM writes
  `route`, `homeScroll`, `homeReveal`, `heroScale`, `quality`, `reducedMotion`,
  `isMobile`, `pointer`, `pointerSmooth` (CameraRig-lerped), `tapSeq`/`tapX`/`tapY`
  (touch taps), `lenis`; `useFrame` reads them. Writes are plain assignments (no
  re-render).
- **Pointer → 3D reactions.** Every interactive object exposes a `poke()` (the
  shared click/tap reaction) and registers it on its root mesh as
  `userData.onTap`. Desktop click/hover go through R3F events (`useHover3d` +
  `onClick`); touch taps go through `TapRaycaster` (in `SceneCanvas`), which on a
  new `signals.tapSeq` raycasts the scene and calls the first hit's
  `userData.onTap` (walking up to the interactive root; instanced fields read
  `instanceId`).
- **`src/scenes/waypoints.js`** — per-route camera `pos`/`look`; `CameraRig`
  flies between them so routes read as one continuous flight through space. Each
  route's scene group is anchored at its `look` point (`SceneManager`).
- **3D object kit** (`src/3d/`): `Planet`, `RingedPlanet`, `EnergyCore`,
  `Crystals` (procedural) and `GLBModel` (loads/clones a Poly Pizza model, tumbles
  it, scale-in intro, hover scale-up + `poke()` = emissive ping + a randomised
  spin shove). `useHover3d` centralises hover state and dispatches the `cursor3d`
  event that grows the DOM `CustomCursor`. **All 8 GLB models are used**
  (asteroid → Home field; comet → Home + Contact; saucer → world `Traveler`;
  satellite → Services; planet → Pricing; astronaut + iss → About; spaceship →
  Work). Each focal scene places 1–2 in negative space, **behind the cards in z**
  and small/edge-placed (keep objects to the right/edges/corners, never top-left;
  per-scene positions/scales are flagged `OWNER:` for a browser nudge). `Nebulae`
  (soft, off-center, far back) and `Traveler` (a flying saucer that eases toward
  each route's vantage and reacts to hover/tap) live in the persistent
  `WorldEnvironment`. **No constellations / aurora** — they read as flat
  shapes/slabs across the hero; nebulae + stars carry the depth.
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
- **Hero draw-order (don't regress).** The wordmark meshes render last
  (`renderOrder` 10) with `depthWrite`/`depthTest` on, so the solid letters always
  composite on top of the (additive, `depthWrite:false`) storm particles — nothing
  paints over the text. Every hero particle also stays **behind** the wordmark in
  z and out of the **keep-out box** (`HERO_KEEPOUT` + `bandY()` in
  `stormConfig.js`): glow/pages/asteroids fly in the bands above/below the letters
  (never across), lightning strikes to the sides. Keep new hero particles behind +
  banded.
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
  in `src/scenes/*Scene.jsx` (search `OWNER:` — esp. the **Pricing `Planet.glb`
  scale** and **Home comet** scale, whose native sizes are unknown to me, plus
  the Services satellite + About astronaut/iss offsets), and the `s` seam via the
  dev leva panel → bake into `stormConfig.js` / `tune.js`.
- Done by the owner: `EMAILJS` keys + `CONTACT` social URLs are filled in, **and
  the WhatsApp/phone numbers** (`CONTACT.phones`); `/public/2k_stars_milky_way.jpg`
  is wired as the dim Milky-Way backdrop. (Still add a `{{phone}}` field to the
  EmailJS template so the form's optional phone comes through.)

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
- **R7** — browser-QA fixes + two features (per-fix commits): ✅
  - Removed `Constellations` + `Aurora` (read as broken shapes / a slab); nebulae
    pushed off-center.
  - **Hero draw-order**: wordmark `renderOrder`/depth + `HERO_KEEPOUT`/`bandY`
    keep-out so storm particles never cross/paint over the letters.
  - **All 8 models** used, scaled down into true negative space; Services
    satellite de-sprawled.
  - **Interactivity fixed**: fine-grained pointer-events re-enable (empty space
    falls through) + `TapRaycaster` for touch + `poke()` reactions on every
    object (incl. the saucer).
  - **Camera parallax** stronger + a look-offset (turns toward the cursor),
    smoothed via `pointerSmooth`, on home + every route.
  - Explicit **Home** tab in the nav.
  - **Asteroid shatter** (click/tap → 3–5 fragments + spark burst + subtle
    `sfx.js` crack; capped pools; field replenishes).
  - **Contact**: optional phone/WhatsApp field, "Message us on WhatsApp" (wa.me,
    prefilled), direct numbers with `wa.me`/`tel:` — numbers in `CONTACT.phones`.

## Gotchas / notes

- Running on Windows; git warns about LF→CRLF — harmless.
- **One deliberate off-palette colour**: the Contact "Message us on WhatsApp"
  button + WhatsApp icons use WhatsApp green (`#25d366`) for recognizability —
  the single intentional step off the one-blue accent.
- **Interactivity depends on placement**: an object only reacts where the pointer
  can reach it — i.e. over genuinely empty space (not behind a `.glass-card`,
  which is pointer-enabled). If a model "doesn't react", it's likely rendering
  over a card; move it to the edge/gutter, don't touch the pointer-events rules.
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
