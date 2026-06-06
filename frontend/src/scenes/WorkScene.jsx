import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import RingedPlanet from '../3d/RingedPlanet'
import GLBModel from '../3d/GLBModel'
import { MODELS } from '../3d/models'

/**
 * Work = a slowly rotating planet in the top-right, with a spaceship cruising a
 * wide arc across the far background (banking into the turns). The Work cards
 * fill left + centre, so the 3D stays to the right/top, behind the cards.
 */
export default function WorkScene({ mobile }) {
  const ship = useRef()
  useFrame((s) => {
    const m = ship.current
    if (!m) return
    const t = s.clock.elapsedTime * 0.08
    m.position.x = 3 + Math.sin(t) * (mobile ? 4 : 9)   // arc biased right of centre
    m.position.y = (mobile ? 4 : 4.5) + Math.cos(t * 0.7) * 0.5
    m.position.z = -9 + Math.cos(t) * 2
    m.rotation.y = Math.cos(t) * 0.5 + Math.PI / 2       // face the direction of travel
    m.rotation.z = -Math.cos(t) * 0.3                    // bank into the turn
  })

  return (
    <group>
      <RingedPlanet
        position={mobile ? [1.5, -5.5, -6] : [7.2, 2.4, -3]}
        radius={mobile ? 1.1 : 1.7}
        color="#2f6bd6"
        atmosphere="#6ea8ff"
      />
      <group ref={ship} scale={mobile ? 0.5 : 0.9}>
        <GLBModel url={MODELS.spaceship} scale={1} spin={[0, 0, 0]} />
      </group>
    </group>
  )
}
