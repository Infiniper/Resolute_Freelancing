import { motion } from 'framer-motion'

// Scroll-into-view reveal with real direction: blocks arrive from the side
// (alternate `from="left"`/`"right"` across a grid) or rise up. Content should
// *arrive*, not just fade. Under prefers-reduced-motion Framer drops the
// x/y transforms and it becomes a clean fade.
const OFFSETS = {
  up: { x: 0, y: 28 },
  left: { x: -48, y: 0 },
  right: { x: 48, y: 0 },
}

export default function Reveal({ children, delay = 0, className, as = 'div', from = 'up' }) {
  const MotionTag = motion[as] || motion.div
  const o = OFFSETS[from] || OFFSETS.up
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, x: o.x, y: o.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
