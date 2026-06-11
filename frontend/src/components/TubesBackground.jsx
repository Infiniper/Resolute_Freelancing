import { useEffect, useRef, useState } from 'react'
import { signals } from '../scenes/signals'

// Brand palette: electric-blue tubes, lit by blue / sky / cyan / violet lights.
const TUBE_COLORS = ['#3b82f6', '#60a5fa', '#8b5cf6']
const LIGHT_COLORS = ['#3b82f6', '#60a5fa', '#22d3ee', '#8b5cf6']

const randHex = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')

// Same device test the stylesheet uses for desktop interactivity, plus reduced
// motion. Touch-only devices never get the second WebGL context (the effect
// follows a cursor they don't have); reduced-motion users keep the static
// gradient. No width gate: phones are already covered by hover/pointer, and a
// narrow *desktop* window just means a smaller, cheaper canvas.
const DESKTOP_QUERY = '(hover: hover) and (pointer: fine)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
const canRun = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia(DESKTOP_QUERY).matches &&
  !window.matchMedia(REDUCED_QUERY).matches

// Cache the heavy tubes bundle (it ships its own self-contained three, so it
// won't clash with the app's three) — scrolling in and out of a tubes section
// then never re-downloads it. Dynamic import keeps it out of the main chunk and
// off every other route; it's fetched the first time a section comes near. A
// failed load clears the cache so one transient hiccup doesn't poison every
// later attempt for the rest of the session.
let _tubesPromise
function loadTubes() {
  if (!_tubesPromise) {
    _tubesPromise = import('threejs-components/build/cursors/tubes1.min.js')
      .then((m) => m.default || m)
      .catch((err) => {
        _tubesPromise = undefined
        throw err
      })
  }
  return _tubesPromise
}

// One boot confirmation per session, so a manual "is it even running?" check has
// something concrete to look for in the console.
let _bootLogged = false

/**
 * The neon "tubes" cursor effect — the background of the Home payoff and of
 * every closing `CtaBand`. It's a SECOND, self-contained WebGL context alongside
 * the persistent R3F canvas, so it's handled carefully:
 *   - lazy-inits ONLY while its section is (nearly) on screen, via
 *     IntersectionObserver, and disposes the moment it leaves — two heavy
 *     contexts never run needlessly (the lib additionally pauses its own render
 *     loop off-screen / on hidden tabs);
 *   - touch-only and reduced-motion users get a tasteful static gradient
 *     instead (no second context at all), and that gate is LIVE — plugging in a
 *     mouse or flipping the OS motion setting takes effect immediately;
 *   - a machine the R3F PerformanceMonitor has flagged as struggling still gets
 *     the effect, just at a lower pixel-ratio cap instead of the lib's pinned 2.
 * Clicking the section randomizes the colors. The host section must be
 * `position:relative` + `isolation:isolate` with an opaque background; the wrap
 * sits at z-index:-1 — above that background, below the copy — and is
 * pointer-events:none, so the text and CTAs stay readable and clickable on top.
 */
export default function TubesBackground() {
  const wrapRef = useRef(null)
  const [enabled, setEnabled] = useState(canRun)

  // Keep the gate live for the life of the component. (An earlier pass latched
  // it once at mount — load the site in the wrong state, e.g. a narrow window
  // with DevTools docked, and the effect stayed dead for the whole session.)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const queries = [window.matchMedia(DESKTOP_QUERY), window.matchMedia(REDUCED_QUERY)]
    const update = () => setEnabled(canRun())
    queries.forEach((q) => q.addEventListener('change', update))
    return () => queries.forEach((q) => q.removeEventListener('change', update))
  }, [])

  useEffect(() => {
    if (!enabled) return
    const wrap = wrapRef.current
    if (!wrap) return
    const section = wrap.closest('.home-payoff') || wrap.parentElement

    let app = null
    let canvas = null
    let inView = false
    let starting = false
    let dead = false // unmounted (or gate flipped) while an async start was in flight

    const randomize = (e) => {
      // Let the real controls (the CTAs) navigate without being hijacked.
      if (e.target?.closest?.('a, button, input, textarea, select, label')) return
      app?.tubes?.setColors?.([randHex(), randHex(), randHex()])
      app?.tubes?.setLightsColors?.([randHex(), randHex(), randHex(), randHex()])
    }

    const stop = () => {
      section?.removeEventListener('click', randomize)
      if (app) {
        try { app.dispose?.() } catch { /* lib teardown — ignore */ }
        app = null
      }
      if (canvas) {
        // Free the GL context deterministically (fresh canvas next time), so we
        // never leak toward the browser's WebGL context limit. (Under the lib's
        // WebGPU backend getContext returns null here — harmless.)
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        gl?.getExtension('WEBGL_lose_context')?.loseContext()
        canvas.remove()
        canvas = null
      }
    }

    const start = async () => {
      if (app || starting) return
      starting = true
      let TubesCursor
      try {
        TubesCursor = await loadTubes()
      } catch (err) {
        // Surface it — an earlier pass swallowed this (and never reset
        // `starting`, deadlocking every retry), which read as "the effect just
        // isn't there" with a clean console.
        console.error('[TubesBackground] tubes bundle failed to load', err)
        return
      } finally {
        starting = false
      }
      if (dead || !inView || app) return // scrolled away / unmounted while it loaded
      canvas = document.createElement('canvas')
      canvas.className = 'tubes-canvas'
      canvas.setAttribute('aria-hidden', 'true')
      wrap.appendChild(canvas)
      try {
        app = TubesCursor(canvas, {
          tubes: { colors: TUBE_COLORS, lights: { intensity: 200, colors: LIGHT_COLORS } },
        })
        // Struggling hardware (adaptive quality turned down) runs the tubes
        // cheaper instead of not at all: the library pins the canvas to a device
        // pixel ratio of 2 — its main cost — so relax that toward 1. (An earlier
        // pass *skipped init entirely* whenever quality < 1; one frame-rate dip
        // during the heavy storm hero and the tubes never appeared at all.)
        if (signals.quality < 1 && app.three) {
          app.three.minPixelRatio = 1
          app.three.maxPixelRatio = 1.25
          app.three.resize()
        }
        if (!_bootLogged) {
          _bootLogged = true
          console.info('[TubesBackground] neon tubes running')
        }
      } catch (err) {
        console.error('[TubesBackground] tubes init failed', err)
        stop()
        return
      }
      section?.addEventListener('click', randomize)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          inView = en.isIntersecting
          if (inView) start()
          else stop()
        }
      },
      // The 240px bottom margin pre-warms the bundle/context just before the
      // section arrives, so the tubes are already flowing as it scrolls in.
      { threshold: 0, rootMargin: '0px 0px 240px 0px' },
    )
    io.observe(wrap)

    return () => {
      dead = true
      io.disconnect()
      stop()
    }
  }, [enabled])

  return <div ref={wrapRef} className={enabled ? 'tubes-wrap' : 'tubes-fallback'} aria-hidden />
}
