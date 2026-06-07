import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { WAYPOINTS, fallbackWaypoint } from '../scenes/waypoints'
import { signals } from '../scenes/signals'
import { MODELS } from './models'
import useHover3d from './useHover3d'

const _target = new THREE.Vector3()
const _vel = new THREE.Vector3()

/**
 * The signature traveller — a flying saucer that lives in the persistent world
 * and continuously eases toward an offset of the current route's vantage. As
 * you navigate, it flies from one section to the next, giving the multipage
 * flight a sense of continuity (see §5). Tucked high/back, out of the hero. It
 * also reacts: a scale-pop on hover (desktop) / tap (mobile).
 */
export default function Traveler({ mobile }) {
  const { scene } = useGLTF(MODELS.saucer)
  const base = mobile ? 0.4 : 0.7
  // Clone (so the cached GLTF is untouched) and bake in the base scale, so we
  // can drive scale imperatively below without a hover re-render resetting it.
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.scale.setScalar(base)
    return c
  }, [scene, base])
  const ref = useRef()
  const pop = useRef(0)
  const { hovered, bind } = useHover3d()

  const poke = useCallback(() => { pop.current = 1 }, [])
  useEffect(() => { if (ref.current) ref.current.userData.onTap = poke }, [poke])

  useFrame((s, dt) => {
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
    // Hover / poke scale-pop.
    pop.current = Math.max(0, pop.current - dt * 1.4)
    const ts = base * (hovered ? 1.2 : 1 + pop.current * 0.35)
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, ts, 0.15))
  })

  return (
    <primitive
      ref={ref}
      object={cloned}
      position={[0, 13, -34]}
      {...bind}
      onClick={(e) => { e.stopPropagation(); poke() }}
    />
  )
}

useGLTF.preload(MODELS.saucer)
