import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Planet from './Planet'

/**
 * A Planet with an orbital ring (torus). Reuses Planet for the body + hover/
 * click behaviour, adds a slowly turning ring. Used as a page-specific variant.
 */
export default function RingedPlanet({
  position = [0, 0, 0],
  radius = 1.1,
  color,
  atmosphere,
  emissive,
  ringColor = '#9ec5ff',
  tilt = Math.PI / 2.6,
}) {
  const ring = useRef()
  useFrame((_, dt) => { if (ring.current) ring.current.rotation.z += dt * 0.05 })

  return (
    <group position={position}>
      <Planet radius={radius} color={color} atmosphere={atmosphere} emissive={emissive} />
      {/* Static tilt on the parent; spin the child's z (re-render safe). */}
      <group rotation={[tilt, 0, 0]}>
        <mesh ref={ring}>
          <torusGeometry args={[radius * 1.9, radius * 0.05, 12, 110]} />
          <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={0.6} metalness={0.4} roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}
