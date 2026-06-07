import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Planet from '../3d/Planet'

/**
 * Pricing = two orbiting bodies (local ₹ vs international $) revolving a shared
 * centre in the right-hand negative space, behind the pricing table.
 */
export default function PricingScene({ mobile }) {
  const orbit = useRef()
  useFrame((_, dt) => { if (orbit.current) orbit.current.rotation.y += dt * 0.3 })

  const r = mobile ? 1.5 : 2.6

  return (
    <group position={mobile ? [1.5, -5.5, -6] : [7, 0.5, -3]} scale={mobile ? 0.6 : 1}>
      <group ref={orbit}>
        <Planet position={[r, 0, 0]} radius={0.95} color="#2f6bd6" atmosphere="#6ea8ff" />
        <Planet position={[-r, 0, 0]} radius={0.62} color="#22a4c9" atmosphere="#7fe0ff" emissive="#10455a" />
      </group>
    </group>
  )
}
