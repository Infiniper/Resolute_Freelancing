import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Seo from '../components/Seo'
import { signals } from '../scenes/signals'

gsap.registerPlugin(ScrollTrigger)

const TRUST = [
  'Samsung AI',
  'Amazon ML Challenge · AIR 1122',
  'VINDICATE Research',
  '240+ DSA',
  'Hackathon Winners',
]

export default function Home() {
  const trackRef = useRef(null)

  // The fixed canvas plays the storm; scrolling this tall track drives it 0→1.
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => { signals.homeScroll = self.progress },
    })
    return () => { signals.homeScroll = 0; st.kill() }
  }, [])

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
        <p className="eyebrow">The storm couldn’t move us — only the “s” gave way.</p>
        <h1 className="display-xl">A website doesn’t have to be boring.</h1>
        <p className="lead">
          We’re The Resolutes — frontend, design, full-stack and AI/ML, building
          experiences most studios can’t. What you just scrolled through is the demo.
        </p>

        <div className="cta-row">
          <Link to="/work" className="btn-primary">See Our Work</Link>
          <Link to="/contact" className="btn-ghost">Hire Us</Link>
        </div>

        <ul className="trust-strip" aria-label="Selected credentials">
          {TRUST.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </>
  )
}
