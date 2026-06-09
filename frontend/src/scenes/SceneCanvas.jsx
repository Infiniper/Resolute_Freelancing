import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import useIsMobile from '../hooks/useIsMobile'
import WorldEnvironment from './WorldEnvironment'
import CameraRig from './CameraRig'
import { WAYPOINTS, fallbackWaypoint } from './waypoints'
import { signals } from './signals'

// Touch taps reach 3D objects through here: the DOM bumps `signals.tapSeq` with
// the tap's NDC (see AppLayout), and on a new tap we raycast the scene and poke
// the first hit object that registered a `userData.onTap` handler (walking up
// from the hit mesh to its interactive root). Mouse hover/click still go through
// R3F's own event system — this is only the no-pointer-events-on-canvas (mobile)
// path. The hit is passed through so instanced fields can read `instanceId`.
function TapRaycaster() {
  const { scene, camera, raycaster } = useThree()
  const seen = useRef(signals.tapSeq)
  useFrame(() => {
    if (signals.tapSeq === seen.current) return
    seen.current = signals.tapSeq
    raycaster.setFromCamera({ x: signals.tapX, y: signals.tapY }, camera)
    const hits = raycaster.intersectObjects(scene.children, true)
    for (const hit of hits) {
      let o = hit.object
      while (o) {
        if (o.userData?.onTap) { o.userData.onTap(hit); return }
        o = o.parent
      }
    }
  })
  return null
}

// Per-route focal scenes, code-split so each page's 3D loads on demand.
const SCENES = {
  '/':         lazy(() => import('./HomeScene')),
  '/services': lazy(() => import('./ServicesScene')),
  '/work':     lazy(() => import('./WorkScene')),
  '/pricing':  lazy(() => import('./PricingScene')),
  '/about':    lazy(() => import('./AboutScene')),
  '/contact':  lazy(() => import('./ContactScene')),
}

// Mounts the current route's scene, anchored at that route's `look` point so
// the camera (which aims there) frames it.
function SceneManager({ route, mobile }) {
  const Scene = SCENES[route] || SCENES['/']
  const anchor = (WAYPOINTS[route] || fallbackWaypoint).look
  return (
    <Suspense fallback={null}>
      <group position={anchor}>
        <Scene mobile={mobile} />
      </group>
    </Suspense>
  )
}

/**
 * The single, persistent R3F canvas for the whole site. Fixed behind the DOM
 * and pointer-events:none, so the page stays fully interactive/selectable and
 * all 3D parallax is fed from the global pointer signal instead.
 *
 * Quality adapts to the hardware: PerformanceMonitor lowers DPR and weakens
 * bloom when the frame rate drops, so weak laptops/phones stay smooth.
 */
export default function SceneCanvas({ route }) {
  const mobile = useIsMobile()
  const maxDpr = mobile ? 1.5 : 2
  const [dpr, setDpr] = useState(maxDpr)
  const [degraded, setDegraded] = useState(false)

  useEffect(() => { signals.isMobile = mobile }, [mobile])
  useEffect(() => { signals.quality = degraded ? 0.5 : 1 }, [degraded])

  return (
    <Canvas
      aria-hidden="true"
      // Desktop: pointer-events on, so hovers/clicks over the page's empty
      // negative space fall through `.site-main` (set pointer-events:none for
      // fine pointers in CSS) and reach the interactive 3D objects. Mobile:
      // off, so touch-scroll is never captured by the canvas.
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: mobile ? 'none' : 'auto' }}
      dpr={dpr}
      camera={{ position: WAYPOINTS['/'].pos, fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#05070E']} />

      <PerformanceMonitor
        onDecline={() => { setDpr(1); setDegraded(true) }}
        onIncline={() => { setDpr(maxDpr); setDegraded(false) }}
      />

      {/* DIAG STEP C: whole WorldEnvironment disabled (Environment/Stars/fog/etc). */}
      {false && <WorldEnvironment mobile={mobile} />}
      <CameraRig route={route} />
      <SceneManager route={route} mobile={mobile} />
      <TapRaycaster />

      {/* The cinematic layer — makes the emissive text, particles and lightning glow. */}
      <EffectComposer>
        <Bloom
          intensity={degraded ? 0.55 : 0.9}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur={!degraded}
        />
        <Vignette offset={0.25} darkness={degraded ? 0.6 : 0.85} eskil={false} />
      </EffectComposer>
    </Canvas>
  )
}
