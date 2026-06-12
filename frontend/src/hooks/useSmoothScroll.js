import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { signals } from '../scenes/signals'

gsap.registerPlugin(ScrollTrigger)

// Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
// The instance is stashed on `signals` so navigation can reset scroll to top.
export default function useSmoothScroll() {
  useEffect(() => {
    // Respect reduced motion — fall back to native scrolling, no smoothing.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // 0.9 keeps the glide but shortens the post-wheel easing tail — the storm's
    // snap-to-landing can only kick in once this tail has decayed (ScrollTrigger
    // treats the scroll as moving until velocity < 10px/s), so a longer duration
    // here reads as lag before the auto-landing takes over.
    const lenis = new Lenis({ duration: 0.1 })
    signals.lenis = lenis
    if (import.meta.env.DEV) window.__lenis = lenis // dev-only handle for debugging/QA
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      if (signals.lenis === lenis) signals.lenis = null
    }
  }, [])
}
