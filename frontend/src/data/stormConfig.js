export const WIND = { x: -1, y: -0.12 };              // right → left
export const S_BASE = { x: 4.6, y: -0.45, z: -0.1 };  // "s" resting slot (your tuned value)
export const URPRISE_Y = -16;                          // how far below the reveal sits
export const S_LAND = { x: -4.2, y: URPRISE_Y, z: 0 }; // where the "s" lands in "urprise"

export const clamp01 = (t) => Math.min(1, Math.max(0, t));
export const lerp = (a, b, t) => a + (b - a) * t;
export const range = (p, min, max) => clamp01((p - min) / (max - min));

// Storm rises to full by 35%, holds, then clears from 70%→100% (so calm returns for the reveal)
export const stormIntensity = (p) =>
  clamp01(p / 0.35) * (1 - clamp01((p - 0.7) / 0.3));