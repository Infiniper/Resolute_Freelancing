import { useEffect, useRef } from 'react'

// Custom cursor: an instant dot + a lagging ring that grows over interactive
// elements. Uses event delegation so it keeps working as routes swap the DOM,
// and a rAF lerp (transforms only) so it stays smooth. Hidden on touch via CSS.
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    let tx = 0, ty = 0, rx = 0, ry = 0, raf = 0

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (dot) dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`
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

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])

  return (
    <div className="cursor-layer" aria-hidden>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  )
}
