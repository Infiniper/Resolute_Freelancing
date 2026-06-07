import GLBModel from '../3d/GLBModel'
import { MODELS } from '../3d/models'

/**
 * About = an astronaut drifting and tumbling in zero-g (hover spins it up,
 * click/tap shoves it into a spin) with the ISS slowly cruising across the far
 * background. Both sit in the right-hand / upper negative space, well clear of
 * the story + team cards.
 */
export default function AboutScene({ mobile }) {
  return (
    <group>
      <GLBModel
        url={MODELS.astronaut}
        position={mobile ? [1.6, -6, -6] : [8.2, 2.2, -3]}
        scale={mobile ? 0.5 : 0.95}
        spin={[0.12, 0.3, 0.06]}
      />
      <GLBModel
        url={MODELS.iss}
        position={mobile ? [-2, 5.5, -8] : [-9.5, 4.2, -6]}
        scale={mobile ? 0.18 : 0.32}
        spin={[0, 0.25, 0]}
      />
    </group>
  )
}
