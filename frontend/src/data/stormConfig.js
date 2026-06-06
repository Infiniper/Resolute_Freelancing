export const WIND = { x: -1, y: -0.12 };              // right → left
export const S_BASE = { x: 4.15, y: -0.4, z: -0.1 };  // "s" resting slot (your tuned value)
export const URPRISE_Y = -16;                          // how far below the reveal sits
export const S_LAND = { x: -4.2, y: URPRISE_Y, z: 0 }; // where the "s" lands in "urprise"
export const NAME_BASE_Y = -0.4;                       // resting Y of "The Resolute"

export const clamp01 = (t) => Math.min(1, Math.max(0, t));
export const lerp = (a, b, t) => a + (b - a) * t;
export const range = (p, min, max) => clamp01((p - min) / (max - min));

// easeInOutQuad — used by both the storm camera pan and the "s" flight so they
// stay locked together as the user scrolls.
export const easeInOut = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Storm rises to full by 35%, holds, then clears from 70%→100% (so calm returns for the reveal)
export const stormIntensity = (p) =>
  clamp01(p / 0.35) * (1 - clamp01((p - 0.7) / 0.3));