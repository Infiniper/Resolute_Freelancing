import { useState, useCallback, useEffect } from 'react'

// Bridge so 3D pointer events can drive the DOM custom cursor (which lives in a
// separate reconciler). CustomCursor listens for this event. `variant` picks the
// cursor treatment: 'default' grows the ring (every interactive object); 'break'
// swaps in the laser targeting reticle (the shatterable hero asteroids).
export function setCursor3d(on, variant = 'default') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cursor3d', { detail: { on, variant } }))
  }
}

/**
 * Shared hover state + cursor bridge for an interactive 3D object. Spread
 * `bind` onto a mesh/group/primitive; add your own `onClick` for the reaction.
 * `stopPropagation` keeps only the front-most object reacting. Releases the
 * cursor on unmount so a grown ring never gets stranded.
 */
export default function useHover3d() {
  const [hovered, setHovered] = useState(false)

  const over = useCallback((e) => { e.stopPropagation(); setHovered(true); setCursor3d(true) }, [])
  const out = useCallback((e) => { e.stopPropagation(); setHovered(false); setCursor3d(false) }, [])

  useEffect(() => () => setCursor3d(false), [])

  return { hovered, bind: { onPointerOver: over, onPointerOut: out } }
}
