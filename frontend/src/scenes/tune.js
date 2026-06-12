import { S_LAND } from '../data/stormConfig'

// Live-tunable seam values for the "s → surprise!" handoff. In development the
// DevTuner (leva) panel mutates these so the owner can drag the "s" into a
// perfect "surprise!"; once happy, bake the chosen numbers back into
// stormConfig.js (`S_LAND.x`) and HomeScene's `urprise` group, and the tuner
// can go. Read every frame by HomeScene — same mutable-singleton idiom as
// `signals`, since the panel lives in the DOM tree and the word in the canvas.
export const tune = {
  sLandX: S_LAND.x,   // x where the falling "s" lands (its right edge meets "u")
  urpriseX: -2.28,     // x of the left-anchored "urprise!" group
}
