import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import useHover3d from './useHover3d'

/**
 * A glowing faceted core inside an optional slow halo ring — the calm "energy"
 * visual first used on Contact, promoted to a reusable component so the same
 * language reads across pages. Brightens on hover, spins up on click.
 */
export default function EnergyCore({
  position = [0, 0, 0],
  radius = 0.75,
  ring = true,
  ringRadius = 3.1,
  color = '#60a5fa',
}) {
  const ringRef = useRef()
  const coreRef = useRef()
  const spin = useRef(0)
  const { hovered, bind } = useHover3d()

  useFrame((_, dt) => {
    if (ringRef.current) ringRef.current.rotation.z += dt * (hovered ? 0.2 : 0.06)
    spin.current = Math.max(0, spin.current - dt)
    if (coreRef.current) coreRef.current.rotation.y += dt * (0.3 + spin.current * 4)
  })

  return (
    <Float speed={0.7} floatIntensity={0.6} rotationIntensity={0.15}>
      <group position={position}>
        {ring && (
          // Static tilt on the parent; we spin the child's z so a re-render
          // (on hover) can't reset the running rotation.
          <group rotation={[Math.PI / 2.6, 0, 0]}>
            <mesh ref={ringRef}>
              <torusGeometry args={[ringRadius, 0.035, 16, 140]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.3} />
            </mesh>
          </group>
        )}
        <mesh ref={coreRef} {...bind} onClick={(e) => { e.stopPropagation(); spin.current = 1.4 }}>
          <icosahedronGeometry args={[radius, 1]} />
          <meshStandardMaterial
            color={color}
            emissive="#1e63d6"
            emissiveIntensity={hovered ? 1.1 : 0.7}
            metalness={0.6}
            roughness={0.3}
            flatShading
          />
        </mesh>
      </group>
    </Float>
  )
}
