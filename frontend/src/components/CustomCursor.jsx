import { useEffect, useRef } from 'react'

// Custom cursor: an instant dot + a lagging ring that grows over interactive
// elements, plus a laser targeting reticle that locks on over the breakable hero
// asteroids. Uses event delegation so it keeps working as routes swap the DOM,
// and a rAF lerp (transforms only) so it stays smooth. Hidden on touch via CSS.
export default function CustomCursor() {
  const layerRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const reticleRef = useRef(null)

  useEffect(() => {
    const layer = layerRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    const reticle = reticleRef.current
    let tx = 0, ty = 0, rx = 0, ry = 0, raf = 0

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      // Dot + reticle track instantly (precise aim); the ring lags (below).
      const t = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`
      if (dot) dot.style.transform = t
      if (reticle) reticle.style.transform = t
    }
    const loop = () => {
      rx += (tx - rx) * 0.18
      ry += (ty - ry) * 0.18
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const interactive = (t) =>
      t && t.closest && t.closest('a, button, input, textarea, select, label, [data-cursor]')
    const onOver = (e) => { if (interactive(e.target)) ring?.classList.add('is-hover') }
    const onOut = (e) => { if (interactive(e.target)) ring?.classList.remove('is-hover') }

    // Interactive 3D objects in the canvas dispatch this (see useHover3d). The
    // detail is { on, variant }: 'break' (asteroids) toggles the reticle lock-on
    // via `.is-break` on the layer; 'default' just grows the ring like a link.
    const onCursor3d = (e) => {
      const { on, variant } = e.detail || {}
      if (variant === 'break') layer?.classList.toggle('is-break', !!on)
      else ring?.classList.toggle('is-hover', !!on)
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    window.addEventListener('cursor3d', onCursor3d)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      window.removeEventListener('cursor3d', onCursor3d)
    }
  }, [])

  return (
    <div ref={layerRef} className="cursor-layer" aria-hidden>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      {/* Laser targeting reticle — shown only in `.is-break` (over a shatterable
          asteroid). Spinning outer ring + cardinal ticks + a bright core. */}
      <div ref={reticleRef} className="cursor-reticle">
        <svg className="reticle-svg" viewBox="0 0 100 100">
          <g className="reticle-spin">
            <circle className="reticle-ring" cx="50" cy="50" r="36" />
          </g>
          <g className="reticle-ticks">
            <line x1="50" y1="4" x2="50" y2="17" />
            <line x1="50" y1="83" x2="50" y2="96" />
            <line x1="4" y1="50" x2="17" y2="50" />
            <line x1="83" y1="50" x2="96" y2="50" />
          </g>
          <circle className="reticle-core" cx="50" cy="50" r="3.5" />
        </svg>
      </div>
    </div>
  )
}
