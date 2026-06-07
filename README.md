# The Resolutes

A frontend-only, fully-3D freelancing portfolio for **The Resolutes** — a
frontend, design, full-stack and AI/ML studio. The site opens on a cinematic
space-storm hero where the 3D wordmark _"The Resolutes"_ stands firm while its
`s` tears loose and tumbles down to spell **"Surprise!"**. From there, every
route is a vantage point inside one continuous 3D space: navigating flies the
camera between waypoints rather than reloading a page.

Dark-navy space aesthetic, a single electric-blue accent (`#3B82F6`), and
Clash Display (display) + Satoshi (body) from Fontshare.

## Stack

- **React 19** + **Vite** (Rolldown) + **React Router**
- **React Three Fiber** (+ **drei**, **@react-three/postprocessing**) on **Three.js**
- **GSAP** + **ScrollTrigger** (scroll-driven storm choreography)
- **Lenis** (smooth scroll) · **Framer Motion** (page/UI transitions)
- **Tailwind v4** (via `@tailwindcss/vite`) with custom design tokens

## Scripts

```bash
npm install      # install deps
npm run dev      # Vite dev server (HMR)
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # eslint .
```

## Architecture

The whole site renders **one persistent R3F `<Canvas>`** mounted at the app
root, fixed behind the DOM and `pointer-events: none`, so the page stays fully
interactive and selectable while 3D parallax is fed from a global pointer
signal.

- **`src/layout/AppLayout.jsx`** — the shell. Persistent canvas behind, routed
  DOM pages in front, `Nav` + `Footer` around them, plus `CustomCursor`,
  `Preloader`, `Grain`, and a skip-to-content link.
- **`src/scenes/SceneCanvas.jsx`** — the single canvas. Adapts quality to the
  hardware (`PerformanceMonitor` lowers DPR and weakens bloom on slow frames),
  applies Bloom + Vignette, and lazy-loads the current route's focal scene.
- **`src/scenes/signals.js`** — a tiny mutable singleton bridging the DOM and
  the canvas (they render in **separate** React reconcilers, so context can't
  cross the `<Canvas>` boundary). The DOM writes `route`, `homeScroll`,
  `quality`, `reducedMotion`, `isMobile`, `pointer`; `useFrame` reads them.
- **`src/scenes/waypoints.js`** — per-route camera `pos`/`look`. `CameraRig`
  flies between them so routes feel like one continuous flight through space.
- **`src/pages/`** — the six routed pages (`/`, `/services`, `/work`,
  `/pricing`, `/about`, `/contact`), each real semantic HTML over its 3D scene.
- **`src/data/content.js`** — single source of truth for all copy (services,
  projects, pricing, team, contact). Things the team must supply are marked
  `TODO`.

Page transitions use `<AnimatePresence mode="wait">` + a `PageTransition`
keyed on the route; scroll resets to top between transitions.

### Accessibility & reduced motion

`prefers-reduced-motion` is honored end to end: the animated canvas is swapped
for a static gradient `StaticBackdrop`, the Home route collapses to a single
calm hero (no empty scroll track), Lenis falls back to native scrolling, and
`<MotionConfig reducedMotion="user">` disables Framer transforms. The canvas is
`aria-hidden`; there's a skip link, visible `:focus-visible` rings, and the
contact form has labeled fields with `aria-invalid` / `aria-describedby` errors.

## What you must supply (marked `TODO`)

- **EmailJS keys** in `src/data/content.js` (`EMAILJS`) to enable contact-form
  delivery. Until then the form falls back to the `mailto:` link.
- **LinkedIn / GitHub / LeetCode URLs** in `CONTACT`.
- **Project images** (drop into `/public`, reference from `PROJECTS`) and each
  project's **live / repo** links.
