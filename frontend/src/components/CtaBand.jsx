import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TubesBackground from './TubesBackground'

/**
 * A full-height, opaque "moment" that closes a content page: the neon-tubes
 * cursor effect (the same one behind the Home payoff) fills the section and the
 * tubes lean toward the cursor, with a centered call-to-action on top.
 *
 * It's a *dedicated, opaque* section on purpose. The site's 3D lives in one
 * persistent canvas behind the DOM, and each route keeps its focal model fixed
 * on screen — so a transparent tube overlay would fight that model for the same
 * pixels. Giving the tubes their own opaque, full-viewport band means they own
 * their region cleanly (no 3D bleeds through), while the space backdrop + that
 * route's focal model keep the page above it. Drop it in as a sibling AFTER the
 * `.page` column. The tube canvas itself is lazy / IntersectionObserver-gated /
 * touch- & reduced-motion-aware — all handled inside `TubesBackground`.
 */
export default function CtaBand({ eyebrow, title, primary, secondary }) {
  return (
    <motion.section
      className="cta-band"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.35, once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <TubesBackground />
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="display-lg">{title}</h2>
      <div className="cta-row">
        <Link to={primary.to} className="btn-primary">{primary.label}</Link>
        {secondary && <Link to={secondary.to} className="btn-ghost">{secondary.label}</Link>}
      </div>
    </motion.section>
  )
}
