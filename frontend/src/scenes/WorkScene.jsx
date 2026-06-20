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
    const t = s.clock.elapsedTime * 0.35
    // Desktop: bias the arc LEFT (centre at -2, swing 7) so the ship's rightmost
    // reach (x=+5) stays well clear of the upper-right planet (left edge x≈5.3).
    // Mobile keeps the original right-biased arc — planet is at the bottom.
    m.position.x = (mobile ? 3 : -2) + Math.sin(t) * (mobile ? 4 : 7)
    m.position.y = (mobile ? 4 : 3.9) + Math.cos(t * 0.7) * 0.5
    m.position.z = -9 + Math.cos(t) * 2
    m.rotation.y = Math.cos(t) * 0.5 + Math.PI / 2       // face the direction of travel
    m.rotation.z = -Math.cos(t) * 0.3                    // bank into the turn
  })

  return (
    <group>
      <RingedPlanet
        position={mobile ? [2.0, -5.0, -6] : [10.0, 3.6, -4]}
        radius={mobile ? 0.85 : 1}
        color="#2f6bd6"
        atmosphere="#6ea8ff"
      />
      <group ref={ship} scale={mobile ? 0.6 : 1}>
        <GLBModel url={MODELS.spaceship} scale={1} spin={[0, 0, 0]} />
      </group>
    </group>
  )
}
