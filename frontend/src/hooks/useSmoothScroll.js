// src/hooks/useSmoothScroll.js

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      // Custom easing curve — exponential decay, feels very natural
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let frameId

    function raf(time) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    // Cleanup — very important, prevents memory leaks
    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, []) // Empty deps = runs once on mount
}