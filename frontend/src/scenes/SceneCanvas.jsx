import { Suspense, lazy, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import useIsMobile from '../hooks/useIsMobile'
import WorldEnvironment from './WorldEnvironment'
import CameraRig from './CameraRig'
import { WAYPOINTS, fallbackWaypoint } from './waypoints'
import { signals } from './signals'

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
 */
export default function SceneCanvas({ route }) {
  const mobile = useIsMobile()
  useEffect(() => { signals.isMobile = mobile }, [mobile])

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      dpr={[1, 2]}
      camera={{ position: WAYPOINTS['/'].pos, fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#05070E']} />
      <WorldEnvironment mobile={mobile} />
      <CameraRig route={route} />
      <SceneManager route={route} mobile={mobile} />

      {/* The cinematic layer — makes the emissive text, particles and lightning glow. */}
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette offset={0.25} darkness={0.85} eskil={false} />
      </EffectComposer>
    </Canvas>
  )
}
