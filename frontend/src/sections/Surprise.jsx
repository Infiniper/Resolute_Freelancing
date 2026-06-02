import { motion } from 'framer-motion'

export default function Surprise() {
  return (
    <section id="surprise"
             className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
             style={{ background: '#080B14' }}>

      {/* "urprise!" with the S snapping in from above to make "Surprise!" */}
      <h2 className="font-bold text-site-fore leading-none mb-6"
          style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}>
        <motion.span
          initial={{ y: -500, rotate: -200, opacity: 0 }}
          whileInView={{ y: 0, rotate: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ type: 'spring', stiffness: 110, damping: 7 }}
          className="inline-block text-site-accent"
          style={{ textShadow: '0 0 70px rgba(59,130,246,0.6)' }}
        >S</motion.span>urprise!
      </h2>

      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }}
        className="text-site-fore-dim text-xl md:text-2xl max-w-2xl mb-12">
        A website doesn't have to be boring.
      </motion.p>

      {/* Old marketing copy moved here */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.9, duration: 0.8 }}
        className="flex flex-col items-center gap-6">
        <p className="text-site-accent text-xs font-semibold tracking-[0.3em] uppercase">
          AI · ML · Full-Stack Development
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a href="#contact" className="hero-btn-primary">Hire Us</a>
          <a href="#portfolio" className="hero-btn-secondary">See Our Work →</a>
        </div>
        <p className="text-site-fore-faint text-[11px] tracking-[0.25em] uppercase">
          Samsung AI · Amazon ML · VINDICATE Research · Yahora
        </p>
      </motion.div>
    </section>
  )
}