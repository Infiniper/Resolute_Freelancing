import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Planet from '../3d/Planet'
import GLBModel from '../3d/GLBModel'
import { MODELS } from '../3d/models'

/**
 * Pricing = two orbiting bodies (local ₹ vs international $) revolving a shared
 * centre in the right-hand negative space, behind the pricing table: a
 * procedural planet paired with the Poly Pizza Planet model. Both react.
 *
 * OWNER: the Planet.glb model's native size is unknown to me — nudge its
 * `scale` here if it reads too big/small next to the procedural planet.
 */
export default function PricingScene({ mobile }) {
  const orbit = useRef()
  useFrame((_, dt) => { if (orbit.current) orbit.current.rotation.y += dt * 0.3 })

  const r = mobile ? 1.5 : 2.6

  return (
    <group position={mobile ? [1.5, -5.5, -6] : [7, 0.5, -3]} scale={mobile ? 0.6 : 1}>
      <group ref={orbit}>
        <Planet position={[r, 0, 0]} radius={0.95} color="#2f6bd6" atmosphere="#6ea8ff" />
        <GLBModel
          url={MODELS.planet}
          position={[-r, 0, 0]}
          scale={mobile ? 0.5 : 0.9}
          spin={[0.1, 0.4, 0]}
        />
      </group>
    </group>
  )
}
