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
 * The cards now occupy the left 60% of the page; this scene lives in the right
 * 40% negative space. Pulled inward + scaled down so the satellite reads fully
 * on screen there (was drifting off the right edge), behind the cards in z.
 *
 * OWNER: nudge the group offset + `satellite` scale/position here if the
 * satellite sits too far right/left or large on your screen width.
 */
export default function ServicesScene({ mobile }) {
  return (
    <group position={mobile ? [1, -6, -6] : [4.4, 1.2, -4]} scale={mobile ? 0.6 : 0.78}>
      {/* Lifted up off the satellite below — the glowing core was sitting right
          on top of the model. OWNER: nudge the y here if it drifts. */}
      <EnergyCore ring={false} radius={mobile ? 0.55 : 0.6} position={[0, mobile ? 1.8 : 2.6, 0]} />
      <GLBModel
        url={MODELS.satellite}
        position={mobile ? [1.4, -2.4, 0.5] : [1.6, -2, 0.4]}
        scale={mobile ? 0.15 : 0.2}
        spin={[0.1, 0.4, 0.05]}
      />
      {!mobile && <Crystals position={[-15.5, -2, -2]} count={3} />}
    </group>
  )
}
