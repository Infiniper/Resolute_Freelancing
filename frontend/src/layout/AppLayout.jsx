import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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

/**
 * The app shell: persistent Canvas behind, DOM pages in front, nav + footer
 * around them. Keeps the shared `signals` in sync with React state so the
 * canvas (a separate reconciler) can read route / pointer every frame.
 */
export default function AppLayout() {
  useSmoothScroll()
  const location = useLocation()
  const reduced = useReducedMotion()

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
      <CustomCursor />
      {reduced ? <StaticBackdrop /> : <SceneCanvas route={location.pathname} />}
      {!reduced && <Preloader />}
      <Grain />

      <Nav />

      <main id="main" className="site-main">
        <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
          <PageTransition key={location.pathname}>
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
