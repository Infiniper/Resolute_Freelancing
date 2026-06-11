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
  event that grows the DOM `CustomCursor` (the shatterable asteroids pass the
  `'break'` variant → a laser **targeting reticle** instead of the ring — R11).
  **7 of the 8 GLB models are placed** (asteroid → Home field; comet → Contact;
  satellite → Services; planet → Pricing; astronaut + iss → About; spaceship →
  Work); the **saucer** (`Traveler`) was pulled out of the world (R11) and awaits
  re-placement in a specific scene. Each focal scene places 1–2 in negative space,
  **behind the cards in z** and small/edge-placed (keep objects to the
  right/edges/corners, never top-left; per-scene positions/scales are flagged
  `OWNER:` for a browser nudge). A dim `MilkyWay` photo-sphere (the deepest
  backdrop — `/2k_stars_milky_way.jpg` on a big inverted sphere, tinted right
  down) lives in the persistent `WorldEnvironment` with the stars + slow debris.
  **No constellations / aurora / nebulae / fog** —
  the soft additive nebula planes and the scene fog each read as a translucent
  slab/haze across the hero with Bloom on; the Milky-Way wash + stars carry the
  depth. The `<Environment>` keeps its Lightformers (reflections only — `frames=1`,
  no `background` prop, so it never paints the backdrop) but **no `<color
  attach="background">` child**. (`src/3d/Nebulae.jsx` is now unused, left in the
  tree — see R10.)
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
  `stormConfig.js`): pages/asteroids fly in the bands above/below the letters
  (never across), lightning strikes to the sides. Keep new hero particles behind +
  banded — and **don't add a wide additive dust field _or large additive planes_**:
  Bloom smears them into a translucent band/slab across the whole hero (this is why
  `GlowParticles` (R8) and the `Nebulae` planes (R10) were both removed).
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
  scale**, whose native size is unknown to me, plus the Services satellite +
  About astronaut/iss offsets), the `MilkyWay` tint in `WorldEnvironment`, and the
  `s` seam via the dev leva panel → bake into `stormConfig.js` / `tune.js`.
- Done by the owner: `EMAILJS` keys + `CONTACT` social URLs are filled in, **and
  the WhatsApp/phone numbers** (`CONTACT.phones`). (Still add a `{{phone}}` field
  to the EmailJS template so the form's optional phone comes through.)

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
- **R8** — removed the hero's `GlowParticles` dust field (`HomeScene.jsx`): the
  Bloom pass smeared its additive glow sprites into a translucent light-blue band
  across the whole hero. The band **was the particles** — not a plane / nebula /
  the Milky-Way backdrop (all ruled out first; the Milky-Way sphere is still
  wired and stays). Deleting the field kills the band; the wordmark, storm pages,
  asteroids, lightning + comet still carry the storm. `src/3d/GlowParticles.jsx`
  remains in the tree but is now unused (left in place, not deleted). ✅
- **R9** — restore + enrich the sky, and two payoff features (per-item commits): ✅
  - **World backdrop restored + de-banded.** A diagnostic had left the whole
    `WorldEnvironment` behind `{false && …}` in `SceneCanvas` (stars, nebula
    glows, fog, debris, the saucer — all off). Re-enabled it, and removed the
    `<color attach="background">` child from `<Environment>`: *that* was the
    remaining blue slab (it composited the env's dark-blue into the view). The
    Lightformers stay (reflections only). **If the slab ever returns**, the next
    step is to shrink/drop the big `scale={[12,12,1]}` Lightformer.
  - **Milky-Way backdrop actually wired** (it was referenced nowhere before,
    despite earlier notes): `/2k_stars_milky_way.jpg` on a big inverted sphere
    (`MilkyWay`), `BackSide`, tinted `#39496a`, `fog={false}`,
    `depthWrite={false}` — a dim deep wash under the nebulae + stars.
  - **Hero comet removed** from `HomeScene` (function + usage + now-unused
    `GLBModel`/`MODELS` imports) — to be reused elsewhere; the comet still lives
    in Contact, so all 8 models stay in use.
  - **Payoff CTA** "Hire Us" → **"Explore Services"** → `/services` (the nav's
    top-right "Hire Us" is untouched).
  - **Asteroid hover hint** (`Asteroids.jsx`): hovering a hero rock eases it up
    ~1.12× and rides a soft additive inverted-hull halo (brand-blue rim that
    blooms) + flips the custom cursor via `cursor3d` — so people sense rocks are
    breakable. Per-instance via the event `instanceId`; click/tap-to-shatter
    unchanged.
  - **Neon "tubes" payoff background** (`TubesBackground`, `threejs-components`
    tubes1) on the `.home-payoff` section only — a **second** WebGL context, so:
    dynamic import → its own lazy chunk (its bundled three is self-contained;
    `manualChunks` excludes `threejs-components`); `IntersectionObserver`
    lazy-inits it **only while the section is on screen** and disposes on leave
    (`app.dispose()` + `WEBGL_lose_context`, fresh canvas each time); **skipped on
    touch / reduced-motion / narrow / `signals.quality < 1`** → static gradient
    instead (no 2nd context on phones). The wrap is `z-index:-1` under the text
    (`.home-payoff` is `isolation:isolate`) and `pointer-events:none`; clicking
    the section randomizes the colours (`tubes.setColors` / `setLightsColors`).
    *(R12: those mount-latched gates — above all the `quality < 1` skip — turned
    out to be why the effect never visibly appeared; relaxed + made live there.)*
- **R10** — kill the hero slab + thin the sky (owner browser feedback): ✅
  - **`Nebulae` removed** from `WorldEnvironment` (usage + import). Its big soft
    **additive plane sprites** (blue / indigo / teal / violet) were the
    translucent slab across the hero — Bloom smears large additive planes into a
    band, the exact R8 `GlowParticles` failure mode. (Dropping the
    `<Environment>` `<color>` child in R9 didn't fix it, because a `frames=1`
    Environment with no `background` prop only feeds reflections, never the
    visible backdrop.) `src/3d/Nebulae.jsx` is left in the tree but unused, like
    `GlowParticles`.
  - **Scene `<fog>` removed** too (owner request) — it read as a haze. The Stars'
    own `fade` still softens the star edges so depth holds; `MilkyWay`'s
    `fog={false}` is now a harmless no-op.
  - Net: the wanted **stars + dim Milky-Way wash** stay; the slab/haze are gone.
    If any slab somehow persists, the next suspects are the `MilkyWay` tint
    (darken `#39496a`) or the big `scale={[12,12,1]}` Lightformer.
- **R11** — saucer out of the hero + a themed asteroid break-cursor (owner
  request, per-item commits): ✅
  - **`Traveler` (flying saucer) removed** from the persistent `WorldEnvironment`
    (usage + import + its Suspense). It rode the persistent world, so it showed
    on every route incl. the hero; pulled out to be reused in a specific scene
    later. `src/3d/Traveler.jsx` stays in the tree, unused (so the saucer GLB is
    momentarily un-placed — 7 of 8 models rendered).
  - **Laser targeting reticle cursor** over the shatterable asteroids. Chosen
    over a lightning-bolt or pickaxe cursor: a reticle is the clearest "target →
    click to destroy" signal and stays elegant/minimal on-brand. `setCursor3d`
    now takes a `variant` and dispatches `{ on, variant }`; asteroids send
    `'break'`. `CustomCursor` gained a `.cursor-reticle` (spinning ring + cardinal
    ticks + bright core, electric-blue with a glow); `.is-break` on the layer
    fades out the dot/ring and snaps the reticle in (scale 1.55→1 lock-on). The
    rock still grows + rim-glows. Honors reduced motion (no spin / snap). Asteroid
    `onPointerOut` + an unmount cleanup release the reticle.
- **R12** — the neon tubes were never actually visible (owner: "integrated 3–4
  times, never seen it") — root-caused, fixed, and rolled out site-wide as
  closing CTA bands. ✅ owner-verified in the browser ("it worked").
  - **Why it never showed** — three independent, *silent* kills in
    `TubesBackground.jsx`, any one of which left only the faint static gradient:
    1. `start()` hard-skipped whenever `signals.quality < 1`. Drei's
       `PerformanceMonitor` flips quality to 0.5 after any frame-rate dip — the
       storm hero (DPR 2 + Bloom) dips on most non-gaming machines during load,
       and on a 60Hz display it tends to *stay* degraded (`onIncline` needs fps
       above the upper bound). By the time anyone scrolled to the payoff the
       gate was shut. No error, no signal.
    2. The `enabled` matchMedia gate (incl. `max-width: 820px`) was latched
       **once at mount**: load the site in a half-width window (DevTools docked)
       and the effect stayed dead all session, even after maximizing.
    3. A one-off import failure poisoned it permanently: the `starting` flag was
       never reset on a rejected import (deadlocking every retry), the cached
       module promise kept the rejection forever, and the error was swallowed.
    Plus, in dev, the first scroll to a tubes section made Vite discover the
    dynamic `threejs-components` dep → "optimized → **full page reload**" right
    as the effect was about to appear.
  - **Fixes** (`TubesBackground.jsx`): the quality gate no longer skips init —
    a degraded machine gets a lower pixel-ratio cap instead (1.25 vs the lib's
    pinned 2, via `app.three.min/maxPixelRatio` + `resize()`); the gate is now
    live media-query listeners using the site's standard desktop test
    (`(hover:hover) and (pointer:fine)`) + reduced-motion (width gate dropped —
    phones are covered by hover/pointer; reduced-motion is still honored
    end-to-end); import failures `console.error`, reset `starting` and clear the
    cached promise; one-time `console.info('[TubesBackground] neon tubes
    running')` confirms boot for manual checks; IO pre-warms 240px before the
    section arrives; a `dead` flag guards unmount/StrictMode races. Also
    `optimizeDeps.exclude: ['threejs-components']` in `vite.config.js` (the
    file is one self-contained ESM — serving it unbundled kills the dev reload).
  - `.home-payoff` joined `.cta-band` in the fine-pointer `pointer-events: auto`
    re-enable list: both are opaque, full-viewport tube hosts (the 3D canvas is
    fully covered there), and without it the payoff's click-to-randomize could
    never fire on desktop.
  - **`CtaBand`** (`components/CtaBand.jsx`) — a full-height, opaque closing
    "moment" hosting the same `TubesBackground`, dropped in as a sibling AFTER
    the `.page` column on **Work / Services / Pricing / About** (it replaces the
    small `.page-cta` on Services/Pricing, whose CSS is gone). This is the
    "tubes everywhere, but never under a wandering model" answer: each route's
    focal 3D model lives over the content area, so the tubes get their own
    opaque band where no model can bleed through. **Contact deliberately has
    none** (the page *is* the form + the comet's region; a second full-screen
    CTA before the footer reads as noise — owner call if wanted).

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
