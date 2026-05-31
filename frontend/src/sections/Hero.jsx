import { motion } from 'framer-motion'
import ParticleField from '../3d/ParticleField'

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay:    i * 0.15,
      duration: 0.85,
      ease:     [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#080B14' }}
    >

      {/* Layer 1 — 3D background */}
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      {/* Layer 2 — vignette overlay so text stays readable */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 10%, rgba(8,11,20,0.6) 55%, rgba(8,11,20,0.95) 100%)',
        }}
      />

      {/* Layer 3 — main content */}
      <div className="relative z-[2] text-center px-6 max-w-5xl mx-auto">

        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-site-accent text-xs font-semibold tracking-[0.3em] uppercase mb-6"
        >
          AI · ML · Full-Stack Development
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-site-fore font-bold leading-[1.1] mb-6"
          style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5.5rem)' }}
        >
          We Build{' '}
          <span
            className="text-site-accent"
            style={{ textShadow: '0 0 70px rgba(59,130,246,0.55)' }}
          >
            Intelligent
          </span>
          <br />
          Experiences
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-site-fore-dim text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          From AI-powered products to stunning web platforms —
          we turn your ideas into things that actually work.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#contact" className="hero-btn-primary">
            Hire Us
          </a>
          <a href="#portfolio" className="hero-btn-secondary">
            See Our Work →
          </a>
        </motion.div>

        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 text-site-fore-faint text-[11px] tracking-[0.25em] uppercase"
        >
          Samsung AI · Amazon ML · VINDICATE Research · Yahora
        </motion.p>

      </div>

      {/* Layer 4 — scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2"
      >
        <span className="text-site-fore-faint text-[9px] tracking-[0.35em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width:      '1px',
            height:     '28px',
            background: 'linear-gradient(to bottom, #475569, transparent)',
          }}
        />
      </motion.div>

    </section>
  )
}