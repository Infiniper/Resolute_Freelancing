import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from './Reveal'
import TiltCard from './TiltCard'
import PageHeader from './PageHeader'
import useReducedMotion from '../hooks/useReducedMotion'
import useIsMobile from '../hooks/useIsMobile'

gsap.registerPlugin(ScrollTrigger)

// Below this width we drop the pinned stacking for a plain vertical list (the
// 3D model drops behind on touch/tablet anyway). Matches the CSS grid breakpoint.
const DESKTOP_BP = 1024

// ── Reverse-stack feel (OWNER: tune here) ────────────────────────────────────
const PEEK = 16           // px each deeper card sits below the one above (deck edge)
const SCALE_STEP = 0.04   // each deeper card is this much smaller
const EXIT_Y = 460        // px the top card travels down as it peels off
const EXIT_SCALE = 0.9    // and shrinks to this as it fades out
const PER_TRANSITION_VH = 0.7 // pinned scroll distance per card hand-off (× viewport height)

// Inline, network-free illustrations — one clearly-relevant line-art icon per
// service (the repo stays self-contained; see CLAUDE.md). They inherit the card's
// accent color via `currentColor`; the gradient wash lives on `.service-media` in CSS.
const ART = {
  web: (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="12" y="14" width="96" height="52" rx="6" />
      <path d="M12 28 H108" />
      <circle cx="22" cy="21" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="30" cy="21" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="38" cy="21" r="1.6" fill="currentColor" stroke="none" />
      <path d="M52 39 L44 47 L52 55" />
      <path d="M68 39 L76 47 L68 55" />
    </svg>
  ),
  design: (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="48" cy="34" r="18" />
      <rect x="52" y="38" width="34" height="26" rx="4" />
      <path d="M30 60 L44 46" />
      <path d="M86 24 l8 -8 m-4 12 l8 -8" />
    </svg>
  ),
  coach: (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M60 22 L96 36 L60 50 L24 36 Z" />
      <path d="M40 43 V57 c0 5 40 5 40 0 V43" />
      <path d="M96 36 V52" />
    </svg>
  ),
  backend: (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="60" cy="24" rx="26" ry="9" />
      <path d="M34 24 V40 c0 5 11.6 9 26 9 s26 -4 26 -9 V24" />
      <path d="M34 40 V56 c0 5 11.6 9 26 9 s26 -4 26 -9 V40" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M40 26 L80 20 M40 26 L80 40 M40 54 L80 40 M40 54 L80 60 M40 26 L40 54" />
      <circle cx="40" cy="26" r="6" fill="currentColor" stroke="none" />
      <circle cx="40" cy="54" r="6" fill="currentColor" stroke="none" />
      <circle cx="80" cy="20" r="6" fill="currentColor" stroke="none" />
      <circle cx="80" cy="40" r="6" fill="currentColor" stroke="none" />
      <circle cx="80" cy="60" r="6" fill="currentColor" stroke="none" />
    </svg>
  ),
  data: (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 62 H96" />
      <rect x="32" y="44" width="10" height="14" />
      <rect x="50" y="34" width="10" height="24" />
      <rect x="68" y="24" width="10" height="34" />
      <path d="M32 40 L55 30 L73 20 L92 14" />
    </svg>
  ),
}

// Real photo over the gradient panel; falls back to the inline SVG if it can't
// load (keeps the repo graceful when the image host is slow/unreachable).
function CardMedia({ s }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="service-media">
      {ART[s.art]}
      {s.img && !failed && (
        <img
          className="service-photo"
          src={s.img}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

function CardInner({ s, i, total }) {
  return (
    <>
      <CardMedia s={s} />
      <div className="service-card-body">
        <div className="service-card-top">
          <span className="service-index">
            {String(i + 1).padStart(2, '0')}
            <span className="service-index-total">/{String(total).padStart(2, '0')}</span>
          </span>
          <span className="pill">{s.tag}</span>
        </div>
        <h2 className="card-title">{s.title}</h2>
        <p className="service-blurb">{s.blurb}</p>
        <ul className="chip-list">
          {s.examples.slice(0, 4).map((e) => (
            <li key={e} className="chip">{e}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

/**
 * Services list with a scroll-scrubbed "reverse stacking" deck on desktop.
 *
 * Desktop (≥1024px, motion OK): the cards start stacked like a deck (each deeper
 * one nudged down + scaled down so its edge peeks). A single pinned ScrollTrigger
 * scrubs a timeline of (n−1) hand-offs: the top card slides down + fades out while
 * the one beneath settles up into the active slot — fully reversible, tied 1:1 to
 * scroll. Pin uses `pinType:'transform'` so it survives the page's transformed
 * ancestor (the framer-motion PageTransition wrapper).
 *
 * The header is rendered *inside* the pinned wrapper so the pin can start at the
 * very top of the page — the cards begin un-stacking on the first scroll (no
 * pre-scroll), and only once every hand-off is done does the page scroll on.
 *
 * Mobile/tablet or reduced-motion: a plain vertical list, no pin, no scrub.
 */
export default function ServicesStack({ services, eyebrow, title }) {
  const reduced = useReducedMotion()
  const belowDesktop = useIsMobile(DESKTOP_BP)
  const simple = reduced || belowDesktop

  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const cardsRef = useRef([])

  // useLayoutEffect (GSAP's React pattern): runs after DOM commit but before
  // paint, so the deck's stacked offsets are set before the first frame — no FOUC.
  useLayoutEffect(() => {
    if (simple) return
    const cards = cardsRef.current.filter(Boolean)
    const n = cards.length
    if (!pinRef.current || n < 2) return

    const ctx = gsap.context(() => {
      // Initial deck: deeper cards sit lower + smaller, top card highest in z.
      cards.forEach((card, i) => {
        gsap.set(card, {
          y: i * PEEK,
          scale: 1 - i * SCALE_STEP,
          autoAlpha: 1,
          zIndex: n - i,
        })
      })

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power1.inOut' },
        scrollTrigger: {
          trigger: pinRef.current,
          // Pinned wrapper sits at the page top, so the pin engages at scroll 0:
          // the deck un-stacks on the first scroll, then the page moves on.
          start: 'top top',
          end: () => '+=' + (n - 1) * window.innerHeight * PER_TRANSITION_VH,
          scrub: true,
          pin: true,
          pinType: 'transform', // survive the transformed PageTransition ancestor
          invalidateOnRefresh: true,
        },
      })

      // (n−1) hand-offs, each one timeline-unit long. fromTo keeps every segment
      // deterministic across refreshes/resizes (no reliance on live values).
      for (let k = 0; k < n - 1; k++) {
        tl.fromTo(
          cards[k],
          { y: 0, scale: 1, autoAlpha: 1 },
          { y: EXIT_Y, scale: EXIT_SCALE, autoAlpha: 0, ease: 'power2.in' },
          k,
        )
        for (let j = k + 1; j < n; j++) {
          const d = j - k // current depth before this hand-off
          tl.fromTo(
            cards[j],
            { y: d * PEEK, scale: 1 - d * SCALE_STEP },
            { y: (d - 1) * PEEK, scale: 1 - (d - 1) * SCALE_STEP, ease: 'power2.out' },
            k,
          )
        }
      }
    }, rootRef)

    // Re-measure once layout settles — font swap can change card heights and
    // shift the pin start/end. (Resize is auto-handled by ScrollTrigger.)
    const refresh = () => ScrollTrigger.refresh()
    const settle = setTimeout(refresh, 300)
    if (document.fonts?.ready) document.fonts.ready.then(refresh)

    return () => {
      clearTimeout(settle)
      ctx.revert() // kills the ScrollTrigger + pin-spacer and restores inline styles
    }
  }, [simple, services.length])

  const total = services.length

  if (simple) {
    return (
      <div className="services-list-wrap">
        <PageHeader eyebrow={eyebrow} title={title} />
        <ul className="services-list" aria-label="Services offered">
          {services.map((s, i) => (
            <Reveal key={s.title} as="li" from={i % 2 ? 'right' : 'left'}>
              <TiltCard className="glass-card service-card">
                <CardInner s={s} i={i} total={total} />
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="services-stack">
      <div ref={pinRef} className="services-pin">
        <PageHeader eyebrow={eyebrow} title={title} />
        <ul className="stack-deck" aria-label="Services offered">
          {services.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => { cardsRef.current[i] = el }}
              className="glass-card service-card stack-card"
              style={{ zIndex: total - i }}
            >
              <CardInner s={s} i={i} total={total} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
