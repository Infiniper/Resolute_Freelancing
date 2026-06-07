import EnergyCore from '../3d/EnergyCore'
import GLBModel from '../3d/GLBModel'
import Crystals from '../3d/Crystals'
import { MODELS } from '../3d/models'

/**
 * Services = a glowing core with a single small satellite drifting off to the
 * right edge (the old 3-satellite orbit sprawled across the cards — QA flagged
 * it), plus a few shards accenting the far-left gutter. Everything sits in the
 * right-hand / left-edge negative space, behind the cards in z. The core and
 * the satellite both react to hover/click/tap.
 *
 * OWNER: nudge the group offset + `satellite` scale/position here if the
 * satellite ever drifts over a card on your screen width.
 */
export default function ServicesScene({ mobile }) {
  return (
    <group position={mobile ? [1, -6, -6] : [7.8, 1.7, -4]} scale={mobile ? 0.6 : 1}>
      <EnergyCore ring={false} radius={mobile ? 0.55 : 0.65} />
      <GLBModel
        url={MODELS.satellite}
        position={mobile ? [1.4, -2.4, 0.5] : [2.6, -2.6, 0.5]}
        scale={mobile ? 0.15 : 0.24}
        spin={[0.1, 0.4, 0.05]}
      />
      {!mobile && <Crystals position={[-15.5, -2, -2]} count={3} />}
    </group>
  )
}
