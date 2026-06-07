import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import useHover3d from './useHover3d'

/**
 * Loads a Poly Pizza GLB, clones it (so the same model can appear more than
 * once) and gives it life: a continuous tumble, a scale-in intro that masks
 * lazy-load pop-in, hover feedback (scale-up + emissive ping) and a click
 * reaction. Keep instances few — these are a page's "hero" objects, placed in
 * negative space behind the cards (see each scene).
 *
 * Note: `scale` and `rotation` are driven imperatively in useFrame, NOT passed
 * as props, so a hover-triggered re-render can't reset the running animation.
 */
export default function GLBModel({
  url,
  position = [0, 0, 0],
  scale = 1,
  spin = [0, 0.3, 0],
  ping = '#3b82f6',
}) {
  const { scene } = useGLTF(url)
  const ref = useRef()
  const pingT = useRef(0)
  const spinImpulse = useRef(0) // click/tap "shove" — a decaying spin kick
  const intro = useRef(0) // 0→1 scale-in
  const { hovered, bind } = useHover3d()

  // The shared reaction for a click (desktop) or tap (mobile): a bright emissive
  // ping + a randomised spin shove, so the object visibly recoils / spins off.
  const poke = useCallback(() => {
    pingT.current = 1.6
    spinImpulse.current = 7 + Math.random() * 5
  }, [])

  // Deep-clone the model and its materials (so emissive pings don't leak across
  // instances/pages), and start it tiny for the intro. `mats` are the glowable
  // ones; `allMats` is every clone, for disposal on unmount.
  const { cloned, mats, allMats } = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.scale.setScalar(0.0001)
    const mats = []
    const allMats = []
    cloned.traverse((o) => {
      if (!o.isMesh) return
      o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone()
      const list = Array.isArray(o.material) ? o.material : [o.material]
      list.forEach((m) => { allMats.push(m); if ('emissiveIntensity' in m) mats.push(m) })
    })
    return { cloned, mats, allMats }
  }, [scene])

  // Dispose the cloned materials when the scene unmounts (on navigation). The
  // geometry is shared with the cached GLTF, so we must NOT dispose that.
  useEffect(() => () => { allMats.forEach((m) => m.dispose()) }, [allMats])

  // Register the tap handler on the model root so the canvas tap-raycaster
  // (mobile) can poke it; desktop uses the onClick below.
  useEffect(() => { if (ref.current) ref.current.userData.onTap = poke }, [poke])

  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    intro.current = Math.min(1, intro.current + dt * 1.5)
    spinImpulse.current = Math.max(0, spinImpulse.current - dt * 7)
    const imp = spinImpulse.current
    m.rotation.x += (spin[0] + imp * 0.5) * dt
    m.rotation.y += (spin[1] * (hovered ? 2.2 : 1) + imp) * dt
    m.rotation.z += spin[2] * dt
    pingT.current = Math.max(0, pingT.current - dt * 1.5)
    const target = scale * intro.current * (hovered ? 1.14 : 1 + pingT.current * 0.12)
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, target, 0.18))
    const glow = hovered ? 0.9 : pingT.current * 0.9
    mats.forEach((mat) => { mat.emissive.set(ping); mat.emissiveIntensity = glow })
  })

  return (
    <primitive
      ref={ref}
      object={cloned}
      position={position}
      {...bind}
      onClick={(e) => { e.stopPropagation(); poke() }}
    />
  )
}
