import { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ROUTES } from '../scenes/waypoints'
import useSmoothScroll from '../hooks/useSmoothScroll'
import useReducedMotion from '../hooks/useReducedMotion'
import CustomCursor from '../components/CustomCursor'
import StaticBackdrop from '../components/StaticBackdrop'
import Preloader from '../components/Preloader'
import Grain from '../components/Grain'
import Nav from '../components/Nav'
import PageTransition from '../components/PageTransition'
import Footer from './Footer'
import SceneCanvas from '../scenes/SceneCanvas'
import { signals } from '../scenes/signals'

import Home from '../pages/Home'
import Services from '../pages/Services'
import Work from '../pages/Work'
import Pricing from '../pages/Pricing'
import About from '../pages/About'
import Contact from '../pages/Contact'

// Dev-only leva panel for tuning the "surprise!" seam. The dynamic import lives
// inside the `import.meta.env.DEV` branch, so leva is dead-code-eliminated from
// production builds entirely.
const DevTuner = import.meta.env.DEV ? lazy(() => import('../components/DevTuner')) : null

/**
 * The app shell: persistent Canvas behind, DOM pages in front, nav + footer
 * around them. Keeps the shared `signals` in sync with React state so the
 * canvas (a separate reconciler) can read route / pointer every frame.
 */
export default function AppLayout() {
  useSmoothScroll()
  const location = useLocation()
  const reduced = useReducedMotion()

  // Direction of travel (+1 forward / -1 back) from the route order, so page
  // transitions slide the right way. Derived by adjusting state during render
  // (React's recommended pattern — also what Nav uses) so it's ready before the
  // animation, without reading refs during render.
  const [prevPath, setPrevPath] = useState(location.pathname)
  const [direction, setDirection] = useState(1)
  if (prevPath !== location.pathname) {
    const a = ROUTES.indexOf(prevPath)
    const b = ROUTES.indexOf(location.pathname)
    setDirection(a === -1 || b === -1 ? 1 : (Math.sign(b - a) || 1))
    setPrevPath(location.pathname)
  }

  // Tell the canvas which route to fly to (it reads this every frame).
  useEffect(() => { signals.route = location.pathname }, [location.pathname])
  useEffect(() => { signals.reducedMotion = reduced }, [reduced])

  // Global pointer → normalized signal for 3D parallax (canvas is pointer-events:none).
  useEffect(() => {
    const onMove = (e) => {
      signals.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      signals.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // Reset scroll to top *between* page transitions, so the exiting page stays
  // put and the entering one starts at its top.
  const onExitComplete = () => {
    if (signals.lenis) signals.lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      {DevTuner && <Suspense fallback={null}><DevTuner /></Suspense>}
      <CustomCursor />
      {reduced ? <StaticBackdrop /> : <SceneCanvas route={location.pathname} />}
      {!reduced && <Preloader />}
      <Grain />

      <Nav />

      <main id="main" className="site-main" tabIndex={-1}>
        <AnimatePresence mode="wait" custom={direction} onExitComplete={onExitComplete}>
          <PageTransition key={location.pathname} direction={direction}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />
    </>
  )
}
