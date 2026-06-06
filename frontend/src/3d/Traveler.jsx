import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { WAYPOINTS, fallbackWaypoint } from '../scenes/waypoints'
import { signals } from '../scenes/signals'
import { MODELS } from './models'

const _target = new THREE.Vector3()
const _vel = new THREE.Vector3()

/**
 * The signature traveller — a flying saucer that lives in the persistent world
 * and continuously eases toward an offset of the current route's vantage. As
 * you navigate, it flies from one section to the next, giving the multipage
 * flight a sense of continuity (see §5). Tucked high/back, out of the hero.
 */
export default function Traveler({ mobile }) {
  const { scene } = useGLTF(MODELS.saucer)
  const cloned = useMemo(() => scene.clone(true), [scene])
  const ref = useRef()

  useFrame((s) => {
    const m = ref.current
    if (!m) return
    const t = s.clock.elapsedTime
    if (signals.route === '/') {
      // Keep it well clear of the hero — parked high and far behind.
      _target.set(0, 13, -34)
    } else {
      const wp = WAYPOINTS[signals.route] || fallbackWaypoint
      _target.set(wp.look[0] + 6.5, wp.look[1] + 5 + Math.sin(t * 0.5) * 0.6, wp.look[2] - 7)
    }
    _vel.copy(_target).sub(m.position)
    m.position.addScaledVector(_vel, 0.02)
    // Bank + face the direction of travel (saucers are near-symmetric, so this
    // is mostly for the gentle banking life).
    if (_vel.lengthSq() > 1e-5) {
      m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, Math.atan2(_vel.x, _vel.z), 0.08)
    }
    m.rotation.z = Math.sin(t * 0.6) * 0.12
  })

  return <primitive ref={ref} object={cloned} position={[0, 13, -34]} scale={mobile ? 0.4 : 0.7} />
}

useGLTF.preload(MODELS.saucer)
