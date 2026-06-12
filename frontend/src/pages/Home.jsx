import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Seo from '../components/Seo'
import TubesBackground from '../components/TubesBackground'
import useReducedMotion from '../hooks/useReducedMotion'
import { signals } from '../scenes/signals'
import { TRUST_STRIP } from '../data/content'
import { S_FLY_START } from '../data/stormConfig'

gsap.registerPlugin(ScrollTrigger)

function Payoff() {
  return (
    <>
      <p className="eyebrow">The storm couldn’t move us, only the “s” gave way!</p>
      <h1 className="display-xl">Make them stare at the beautiful chaos!</h1>
      <p className="lead">
        We’re The Resolutes. Building experiences through code. <br/> Let's Dream, Develop and Disrupt.
      </p>
      <div className="cta-row">
        <Link to="/work" className="btn-primary">See Our Work</Link>
        <Link to="/services" className="btn-ghost">Explore Services</Link>
      </div>
      <ul className="trust-strip" aria-label="Selected credentials">
        {TRUST_STRIP.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {/* Pointer-only easter-egg hint — CSS shows it only where the live tube
          canvas can actually run (fine pointer + motion OK). */}
      <p className="tubes-hint" aria-hidden="true">
        The tubes follow your cursor, click anywhere to change their colors.
      </p>
    </>
  )
}

export default function Home() {
  const reduced = useReducedMotion()
  const trackRef = useRef(null)
  const payoffRef = useRef(null)

  // The fixed canvas plays the storm; scrolling the tall track drives it 0→1.
  // A second trigger on the payoff drives `homeReveal` 1→0 as it scrolls in, so
  // the canvas can dissolve the 3D word and dolly the camera past it — the word
  // and the payoff text are never on screen together. Skipped for reduced
  // motion (there'd be no storm to scrub).
  useEffect(() => {
    if (reduced) return
    const storm = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => { signals.homeScroll = self.progress },
      // The scroll may never rest while the "s" is mid-flight (progress
      // S_FLY_START→1): if the user stops scrolling there, auto-scroll the
      // rest of the way until the "s" seats into "urprise!" — or, if they
      // were heading back up, return it to its slot. Outside that window the
      // function returns `value` unchanged, which GSAP treats as "no snap".
      // New wheel/touch input kills the glide (the scroll tween self-cancels
      // on foreign movement), and ScrollTrigger only snaps while the scroll
      // is inside this trigger's range — it can never pull the page back up
      // from the payoff. The DOM is a full-viewport sticky for the whole
      // track, so the glide reads as the animation finishing itself, not as
      // the page scrolling.
      snap: {
        snapTo: (value, self) =>
          value > S_FLY_START && value < 1
            ? (self.direction < 0 ? S_FLY_START : 1)
            : value,
        duration: { min: 0.4, max: 1.6 },
        ease: 'power2.inOut',
        delay: 0.01,
        inertia: false,
      },
    })
    const revealST = ScrollTrigger.create({
      trigger: payoffRef.current,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => { signals.homeReveal = 1 - self.progress },
    })
    return () => {
      signals.homeScroll = 0
      signals.homeReveal = 1
      storm.kill()
      revealST.kill()
    }
  }, [reduced])

  // Reduced motion: one calm static screen with the same content, no long scrub.
  if (reduced) {
    return (
      <>
        <Seo title={null} />
        <section className="home-payoff">
          <TubesBackground />
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

      {/* The calm after the storm — the payoff rises in as the word dissolves. */}
      <motion.section
        ref={payoffRef}
        className="home-payoff"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <TubesBackground />
        <Payoff />
      </motion.section>
    </>
  )
}
