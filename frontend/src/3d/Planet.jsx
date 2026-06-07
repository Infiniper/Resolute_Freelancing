import { useCallback, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useHover3d from './useHover3d'

/**
 * A procedural planet: a lit sphere wrapped in a soft back-lit atmosphere rim.
 * Rotates slowly; brightens and speeds up on hover; pulses on click. Cheap
 * (two spheres) and on-brand — the default focal object for several pages.
 */
export default function Planet({
  position = [0, 0, 0],
  radius = 1.2,
  color = '#2f6bd6',
  atmosphere = '#60a5fa',
  spin = 0.15,
  emissive = '#1b3a73',
}) {
  const grp = useRef()
  const core = useRef()
  const pulse = useRef(0)
  const { hovered, bind } = useHover3d()

  const poke = useCallback(() => { pulse.current = 1 }, [])
  useEffect(() => { if (grp.current) grp.current.userData.onTap = poke }, [poke])

  useFrame((_, dt) => {
    if (core.current) core.current.rotation.y += spin * dt * (hovered ? 3 : 1)
    pulse.current = Math.max(0, pulse.current - dt * 1.6)
    if (grp.current) grp.current.scale.setScalar(1 + pulse.current * 0.18)
  })

  return (
    <group
      ref={grp}
      position={position}
      {...bind}
      onClick={(e) => { e.stopPropagation(); poke() }}
    >
      {/* Atmosphere — a slightly larger back-side sphere, additive, for a rim glow. */}
      <mesh scale={1.18}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={atmosphere}
          transparent
          opacity={hovered ? 0.3 : 0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          metalness={0.35}
          roughness={0.65}
        />
      </mesh>
    </group>
  )
}
