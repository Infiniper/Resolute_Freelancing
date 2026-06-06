import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import EnergyCore from '../3d/EnergyCore'
import GLBModel from '../3d/GLBModel'
import Crystals from '../3d/Crystals'
import { MODELS } from '../3d/models'

/**
 * Services = a small cluster of "service" satellites orbiting a glowing core,
 * in the right-hand negative space, with a few shards accenting the far left.
 * Everything sits behind the cards in z so it never fights the text. Each
 * satellite reacts to hover/click (see GLBModel).
 */
export default function ServicesScene({ mobile }) {
  const orbit = useRef()
  useFrame((_, dt) => { if (orbit.current) orbit.current.rotation.y += dt * 0.25 })

  const r = mobile ? 1.7 : 3            // orbit radius
  const satScale = mobile ? 0.5 : 0.8

  return (
    <group position={mobile ? [1, -5.5, -6] : [6.8, 0.5, -3]} scale={mobile ? 0.6 : 1}>
      <EnergyCore ring={false} radius={0.7} />
      <group ref={orbit}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2
          return (
            <GLBModel
              key={i}
              url={MODELS.satellite}
              position={[Math.cos(a) * r, Math.sin(a) * 0.6, Math.sin(a) * r]}
              scale={satScale}
              spin={[0, 0.5, 0.1]}
            />
          )
        })}
      </group>
      {!mobile && <Crystals position={[-14, -1.5, -2]} count={4} />}
    </group>
  )
}
