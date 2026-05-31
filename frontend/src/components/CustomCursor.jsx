// src/components/CustomCursor.jsx

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef     = useRef(null)
  const ringRef    = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current

    // Track mouse position
    const onMouseMove = ({ clientX: x, clientY: y }) => {
      // Dot follows instantly
      if (dot) {
        dot.style.left = x + 'px'
        dot.style.top  = y + 'px'
      }
      // Ring follows with slight lag via Web Animations API
      if (ring) {
        ring.animate(
          { left: x + 'px', top: y + 'px' },
          { duration: 450, fill: 'forwards' }
        )
      }
    }

    // Grow ring when hovering clickable elements
    const onHoverIn  = () => {
      if (!ring) return
      ring.style.width        = '50px'
      ring.style.height       = '50px'
      ring.style.borderColor  = 'rgba(59,130,246,0.8)'
      ring.style.background   = 'rgba(59,130,246,0.08)'
    }
    const onHoverOut = () => {
      if (!ring) return
      ring.style.width        = '32px'
      ring.style.height       = '32px'
      ring.style.borderColor  = 'rgba(59,130,246,0.35)'
      ring.style.background   = 'transparent'
    }

    window.addEventListener('mousemove', onMouseMove)

    // Attach grow/shrink to all links and buttons on the page
    const targets = document.querySelectorAll('a, button')
    targets.forEach(el => {
      el.addEventListener('mouseenter', onHoverIn)
      el.addEventListener('mouseleave', onHoverOut)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      targets.forEach(el => {
        el.removeEventListener('mouseenter', onHoverIn)
        el.removeEventListener('mouseleave', onHoverOut)
      })
    }
  }, [])

  return (
    // Only show on desktop — touch screens have no cursor
    <div className="hidden md:block">
      {/* Small inner dot */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '7px',
          height:        '7px',
          background:    '#3B82F6',
          borderRadius:  '50%',
          pointerEvents: 'none',
          transform:     'translate(-50%, -50%)',
          zIndex:        9999,
          transition:    'background 0.2s',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '32px',
          height:        '32px',
          border:        '1.5px solid rgba(59,130,246,0.35)',
          borderRadius:  '50%',
          pointerEvents: 'none',
          transform:     'translate(-50%, -50%)',
          zIndex:        9998,
          transition:    'width 0.2s, height 0.2s, border-color 0.2s, background 0.2s',
        }}
      />
    </div>
  )
}