// Module-level signals shared between the React-DOM tree and the R3F <Canvas>.
//
// The DOM and the canvas render in *separate* React reconcilers, so React
// context does not cross the <Canvas> boundary. High-frequency values (scroll
// progress, the active route, adaptive quality) are therefore written from the
// DOM side and read inside `useFrame` through this tiny mutable singleton —
// the same idiom as the original storm's `progress` ref, just shared app-wide.
//
// Writes are plain assignments (no React re-render); reads happen every frame.
export const signals = {
  route: '/',           // current pathname — drives the CameraRig waypoint
  homeScroll: 0,        // 0→1 storm progress on the Home route
  homeReveal: 1,        // 1→0 as the payoff scrolls in — dissolves the 3D word
  heroScale: 1,         // wordmark fit-to-viewport factor (CameraRig matches it)
  quality: 1,           // 1 = full quality; PerformanceMonitor scales this down
  reducedMotion: false, // prefers-reduced-motion → canvas suppressed in DOM
  isMobile: false,      // coarse pointer / narrow viewport → lighter scenes
  pointer: { x: 0, y: 0 }, // -1..1 normalized, for idle parallax off the canvas
  lenis: null,          // the Lenis instance, for scroll-to-top on navigation
}
