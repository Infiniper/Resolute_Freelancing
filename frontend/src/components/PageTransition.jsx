import { motion } from 'framer-motion'

// One coherent, directional motion language for every DOM page. Timed to match
// the CameraRig fly (~1.2s) under AnimatePresence mode="wait": the outgoing page
// slides + blurs out in the direction of travel as the camera leaves, and the
// incoming page enters from the opposite side as the camera arrives. `direction`
// (+1 forward / -1 back, from the route order) flows in via AnimatePresence
// `custom`, so the exiting and entering pages always agree on which way to move.
// Under prefers-reduced-motion, Framer drops the x-slide and it becomes a fade.
const variants = {
  initial: (d) => ({ opacity: 0, x: 64 * d, filter: 'blur(10px)' }),
  enter: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 },
  },
  exit: (d) => ({
    opacity: 0, x: -64 * d, filter: 'blur(10px)',
    transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] },
  }),
}

export default function PageTransition({ children, direction = 1 }) {
  return (
    <motion.div custom={direction} variants={variants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  )
}
