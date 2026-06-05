import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import useSmoothScroll from '../hooks/useSmoothScroll'
import useReducedMotion from '../hooks/useReducedMotion'
import CustomCursor from '../components/CustomCursor'
import StaticBackdrop from '../components/StaticBackdrop'
import Nav from '../components/Nav'
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

  useEffect(() => {
    signals.route = location.pathname
    // Reset scroll on navigation so each vantage starts from its top.
    if (signals.lenis) signals.lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [location.pathname])
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

  return (
    <>
      <CustomCursor />
      {reduced ? <StaticBackdrop /> : <SceneCanvas route={location.pathname} />}

      <Nav />

      <main id="main" className="site-main">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}
