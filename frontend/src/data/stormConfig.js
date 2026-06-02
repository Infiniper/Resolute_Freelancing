// The storm's wind blows right and slightly down.
// The "s" is the rightmost letter — first to be torn loose.
export const WIND = { x: 1, y: -0.25 }

// Beat ranges, measured in scroll progress (0 = top, 1 = end of hero track)
export const BEATS = {
  buildStart: 0.00,   // storm begins
  peakStart:  0.40,   // storm at full fury, "s" fighting to hold
  tearStart:  0.65,   // "s" loses grip, flies off, camera follows
  clearStart: 0.85,   // storm recedes into calm
}

// Helpers
export const clamp01 = (t) => Math.min(1, Math.max(0, t))
export const lerp = (a, b, t) => a + (b - a) * t
// Maps progress p within [min,max] to a 0→1 value
export const range = (p, min, max) => clamp01((p - min) / (max - min))