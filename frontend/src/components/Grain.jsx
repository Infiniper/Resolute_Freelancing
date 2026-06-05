// Full-screen film-grain overlay for cinematic texture. Pure CSS (an SVG
// turbulence data-URI animated by steps), pointer-events:none, very low opacity.
// Suppressed for reduced-motion users via the stylesheet.
export default function Grain() {
  return <div className="grain" aria-hidden />
}
