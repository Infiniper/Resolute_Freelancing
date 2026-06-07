import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import EnergyCore from '../3d/EnergyCore'
import GLBModel from '../3d/GLBModel'
import { MODELS } from '../3d/models'

/**
 * Contact = the calm after the storm: the halo ring + glowing core (the
 * established visual language), tucked into the right-hand gap so it never
 * crosses the form inputs, with a small comet drifting slowly around it. Both
 * react to hover/click/tap.
 */
export default function ContactScene({ mobile }) {
  const orbit = useRef()
  useFrame((_, dt) => { if (orbit.current) orbit.current.rotation.y += dt * 0.18 })

  const r = mobile ? 2.3 : 3.4

  return (
    <group position={mobile ? [0, -5.5, -6] : [6.5, -0.3, -2]} scale={mobile ? 0.6 : 1}>
      <EnergyCore ring radius={0.75} ringRadius={2.7} />
      <group ref={orbit}>
        <GLBModel url={MODELS.comet} position={[r, 0.4, 0]} scale={mobile ? 0.22 : 0.34} spin={[0, 0.5, 0.3]} />
      </group>
    </group>
  )
}
