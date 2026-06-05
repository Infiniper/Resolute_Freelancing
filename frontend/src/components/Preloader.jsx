import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { signals } from '../scenes/signals'

/**
 * Branded loading screen. Tracks real asset progress via drei's `useProgress`
 * (GLB models + Text3D fonts register with three's loading manager), holds
 * briefly on 100%, then wipes upward to reveal the hero. A safety timeout
 * ensures it never blocks if an asset stalls. Initial-load only.
 */
export default function Preloader() {
  const { progress, active } = useProgress()
  const [done, setDone] = useState(false)
  const pct = Math.min(100, Math.round(progress))

  // Reveal once loaders settle at 100% (brief hold for the brand beat).
  useEffect(() => {
    if (done) return
    if (!active && progress >= 100) {
      const t = setTimeout(() => setDone(true), 650)
      return () => clearTimeout(t)
    }
  }, [active, progress, done])

  // Safety net — never trap the user behind a stalled asset.
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 7000)
    return () => clearTimeout(t)
  }, [])

  // Lock smooth-scroll while the curtain is up.
  useEffect(() => {
    if (done) signals.lenis?.start()
    else signals.lenis?.stop()
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader-inner">
            <motion.span
              className="preloader-mark"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              The Resolutes
            </motion.span>

            <div className="preloader-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Loading">
              <span className="preloader-bar-fill" style={{ width: `${pct}%` }} />
            </div>

            <span className="preloader-pct">{pct}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
