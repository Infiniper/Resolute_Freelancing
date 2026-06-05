import { motion } from "framer-motion";

export default function Surprise() {
  return (
    <section id="surprise" className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#080B14" }}>
      <motion.p
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="text-site-fore font-bold max-w-3xl mb-6"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
        A website doesn't have to be boring.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }}
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
  );
}