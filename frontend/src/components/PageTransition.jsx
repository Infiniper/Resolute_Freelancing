import { motion } from 'framer-motion'

// One coherent motion language for every DOM page. Timed to roughly match the
// CameraRig fly (~1.2s) under AnimatePresence mode="wait": the old page blurs
// out as the camera leaves, the new page settles in as the camera arrives.
const variants = {
  initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
  enter: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 },
  },
  exit: {
    opacity: 0, y: -14, filter: 'blur(8px)',
    transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] },
  },
}

export default function PageTransition({ children }) {
  return (
    <motion.div variants={variants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  )
}
