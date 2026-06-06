import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Seo from '../components/Seo'
import useReducedMotion from '../hooks/useReducedMotion'
import { signals } from '../scenes/signals'
import { TRUST_STRIP } from '../data/content'

gsap.registerPlugin(ScrollTrigger)

function Payoff() {
  return (
    <>
      <p className="eyebrow">The storm couldn’t move us — only the “s” gave way.</p>
      <h1 className="display-xl">A website doesn’t have to be boring.</h1>
      <p className="lead">
        We’re The Resolutes — frontend, design, full-stack and AI/ML, building
        experiences most studios can’t. What you just saw is the demo.
      </p>
      <div className="cta-row">
        <Link to="/work" className="btn-primary">See Our Work</Link>
        <Link to="/contact" className="btn-ghost">Hire Us</Link>
      </div>
      <ul className="trust-strip" aria-label="Selected credentials">
        {TRUST_STRIP.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </>
  )
}

export default function Home() {
  const reduced = useReducedMotion()
  const trackRef = useRef(null)

  // The fixed canvas plays the storm; scrolling this tall track drives it 0→1.
  // Skipped entirely for reduced motion (there'd be no storm to scrub).
  useEffect(() => {
    if (reduced) return
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => { signals.homeScroll = self.progress },
    })
    return () => { signals.homeScroll = 0; st.kill() }
  }, [reduced])

  // Reduced motion: one calm static screen with the same content, no long scrub.
  if (reduced) {
    return (
      <>
        <Seo title={null} />
        <section className="home-payoff">
          <Payoff />
        </section>
      </>
    )
  }

  return (
    <>
      <Seo title={null} />

      {/* Storm scroll track — the canvas behind builds the storm as you scroll. */}
      <section ref={trackRef} className="storm-track" aria-label="Intro">
        <div className="storm-sticky">
          <p className="sr-only">
            The Resolutes — a cinematic 3D storm in which the word “Resolute”
            stands firm while its “s” tears loose and tumbles down to spell
            “Surprise”.
          </p>
          <div className="scroll-hint" aria-hidden>
            <span>Scroll</span>
            <span className="scroll-hint-line" />
          </div>
        </div>
      </section>

      {/* The calm after the storm — the payoff and the pitch. */}
      <section className="home-payoff">
        <Payoff />
      </section>
    </>
  )
}
