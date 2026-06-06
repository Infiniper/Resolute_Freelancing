import { useControls } from 'leva'
import { tune } from '../scenes/tune'
import { S_LAND } from '../data/stormConfig'

/**
 * Development-only leva panel for dialling in the "surprise!" seam. Loaded only
 * when `import.meta.env.DEV` (see AppLayout), so leva never ships to production.
 * Drag the sliders until the "s" sits flush in "surprise!", then bake the
 * values into stormConfig.js (`S_LAND.x`) and HomeScene's urprise group.
 */
export default function DevTuner() {
  useControls('Surprise seam', {
    sLandX: {
      value: S_LAND.x, min: -8, max: 0, step: 0.01,
      onChange: (v) => { tune.sLandX = v },
    },
    urpriseX: {
      value: tune.urpriseX, min: -8, max: 2, step: 0.01,
      onChange: (v) => { tune.urpriseX = v },
    },
  })
  return null
}
