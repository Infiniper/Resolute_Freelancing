import { useEffect, useRef, useState } from 'react'
import { signals } from '../scenes/signals'

// Brand palette: electric-blue tubes, lit by blue / sky / cyan / violet lights.
const TUBE_COLORS = ['#3b82f6', '#60a5fa', '#8b5cf6']
const LIGHT_COLORS = ['#3b82f6', '#60a5fa', '#22d3ee', '#8b5cf6']

const randHex = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')

// Cache the heavy tubes bundle (it ships its own self-contained three, so it
// won't clash with the app's three) — scrolling in and out of the payoff section
// then never re-downloads it. Dynamic import keeps it out of the main chunk and
// off every other route; it's fetched the first time the section is reached.
let _tubesPromise
function loadTubes() {
  if (!_tubesPromise) {
    _tubesPromise = import('threejs-components/build/cursors/tubes1.min.js').then((m) => m.default || m)
  }
  return _tubesPromise
}

/**
 * The neon "tubes" cursor effect, scoped as the background of the Home payoff
 * section only. It's a SECOND, self-contained WebGL context alongside the
 * persistent R3F canvas, so it's handled carefully:
 *   - lazy-inits ONLY while the section is on screen (IntersectionObserver) and
 *     disposes the moment it leaves, so two heavy contexts never run needlessly;
 *   - is skipped entirely on touch / reduced-motion / throttled hardware, which
 *     get a tasteful static gradient instead (no second context at all).
 * Clicking the section randomizes the colors. The wrap sits at z-index:-1 — above
 * the section's own gradient, below the payoff text — and is pointer-events:none,
 * so the heading, lead and CTAs stay readable and clickable on top.
 */
export default function TubesBackground() {
  const wrapRef = useRef(null)
  // Decided once on mount (these don't change at runtime): phones, coarse
  // pointers and reduced-motion users never spin up a second live context.
  // Runtime perf throttling (PerformanceMonitor) is re-checked at init time.
  const [enabled] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const narrow = window.matchMedia('(max-width: 820px)').matches
    return !reduced && !coarse && !narrow
  })

  useEffect(() => {
    if (!enabled) return
    const wrap = wrapRef.current
    if (!wrap) return
    const section = wrap.closest('.home-payoff') || wrap.parentElement

    let app = null
    let canvas = null
    let inView = false
    let starting = false

    const randomize = (e) => {
      // Let the real controls (the CTAs) navigate without being hijacked.
      if (e.target?.closest?.('a, button, input, textarea, select, label')) return
      app?.tubes?.setColors?.([randHex(), randHex(), randHex()])
      app?.tubes?.setLightsColors?.([randHex(), randHex(), randHex(), randHex()])
    }

    const start = async () => {
      // Skip on a struggling machine (adaptive quality has been turned down).
      if (app || starting || signals.quality < 1) return
      starting = true
      const TubesCursor = await loadTubes()
      starting = false
      if (!inView || app) return // scrolled away (or already running) while it loaded
      canvas = document.createElement('canvas')
      canvas.className = 'tubes-canvas'
      canvas.setAttribute('aria-hidden', 'true')
      wrap.appendChild(canvas)
      app = TubesCursor(canvas, {
        tubes: { colors: TUBE_COLORS, lights: { intensity: 200, colors: LIGHT_COLORS } },
      })
      section?.addEventListener('click', randomize)
    }

    const stop = () => {
      section?.removeEventListener('click', randomize)
      if (app) {
        try { app.dispose?.() } catch { /* lib teardown — ignore */ }
        app = null
      }
      if (canvas) {
        // Free the GL context deterministically (fresh canvas next time), so we
        // never leak toward the browser's WebGL context limit.
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        gl?.getExtension('WEBGL_lose_context')?.loseContext()
        canvas.remove()
        canvas = null
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          inView = en.isIntersecting
          if (inView) start()
          else stop()
        }
      },
      { threshold: 0 },
    )
    io.observe(wrap)

    return () => { io.disconnect(); stop() }
  }, [enabled])

  return <div ref={wrapRef} className={enabled ? 'tubes-wrap' : 'tubes-fallback'} aria-hidden />
}
