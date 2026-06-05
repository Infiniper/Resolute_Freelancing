import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StormScene from '../3d/StormScene'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const trackRef = useRef(null)   // the tall scroll track
  const pinRef   = useRef(null)   // the canvas, pinned in place
  const hintRef  = useRef(null)   // the scroll hint
  const progress = useRef(0)      // 0 → 1, the master value everything reads

  useEffect(() => {
    // Pin the canvas and convert scroll position into progress (0→1)
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start:   'top top',
      end:     '+=5500',          // bigger = slower, more drawn-out storm
      pin:     pinRef.current,
      scrub:   1,
      onUpdate: (self) => { progress.current = self.progress },
    })

    // Fade the scroll hint out as soon as scrolling starts
    const hint = gsap.to(hintRef.current, {
      opacity: 0,
      scrollTrigger: { trigger: trackRef.current, start: 'top top', end: '+=400', scrub: true },
    })

    return () => { st.kill(); hint.scrollTrigger?.kill() }
  }, [])

  return (
    <section ref={trackRef} id="home" style={{ background: '#05070E' }}>
      <div ref={pinRef} className="h-screen w-full relative overflow-hidden">
        <StormScene progress={progress} />

        <div ref={hintRef}
             className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-site-fore-faint text-[9px] tracking-[0.35em] uppercase">Scroll</span>
          <div style={{ width: '1px', height: '28px',
                        background: 'linear-gradient(to bottom, #475569, transparent)' }} />
        </div>
      </div>
    </section>
  )
}