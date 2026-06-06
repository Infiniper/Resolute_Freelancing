// Shown instead of the 3D canvas for `prefers-reduced-motion` users:
// a calm, on-brand gradient so the page never reads as broken.
export default function StaticBackdrop() {
  return <div aria-hidden className="static-backdrop" />
}
