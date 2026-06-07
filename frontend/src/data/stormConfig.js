export const WIND = { x: -1, y: -0.12 };              // right → left
export const S_BASE = { x: 4.15, y: -0.4, z: -0.1 };  // "s" resting slot (your tuned value)
export const URPRISE_Y = -16;                          // how far below the reveal sits
export const S_LAND = { x: -3.7, y: URPRISE_Y, z: 0 };  // where the "s" lands in "urprise" (right edge meets the "u")
export const NAME_BASE_Y = -0.4;                       // resting Y of "The Resolute"

// Hero keep-out: a box (in the hero group's local space, pre-heroScale) around
// the standing wordmark. Hero particles must never drift across it — they fly in
// the bands above / below it, and always behind it in z — so nothing ever
// crosses the letters. `halfX` covers "The Resolute" + the floating "s".
export const HERO_KEEPOUT = { halfX: 7, top: 1.2, bottom: -2.0 };

// Pick a resting Y in the clear band either above or below the wordmark (never
// across it). `gap` clears the keep-out edge with room for the swirl amplitude;
// `extent` is how far the bands reach. Used on spawn and on horizontal wrap.
export function bandY(extent = 7.5, gap = 2.0) {
  return Math.random() < 0.5
    ? HERO_KEEPOUT.top + gap + Math.random() * (extent - HERO_KEEPOUT.top - gap)
    : HERO_KEEPOUT.bottom - gap - Math.random() * (extent + HERO_KEEPOUT.bottom - gap);
}

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