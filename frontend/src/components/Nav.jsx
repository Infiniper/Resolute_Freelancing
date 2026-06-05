import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { signals } from '../scenes/signals'

const LINKS = [
  ['/services', 'Services'],
  ['/work', 'Work'],
  ['/pricing', 'Pricing'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]

const menuVariants = {
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  open: { transition: { delayChildren: 0.12, staggerChildren: 0.07 } },
}
const itemVariants = {
  closed: { opacity: 0, y: 24 },
  open: { opacity: 1, y: 0 },
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [path, setPath] = useState(location.pathname)

  // Close the menu when the route changes — adjusting state during render is
  // React's recommended alternative to a route-watching effect, and it also
  // covers back/forward navigation, not just link clicks.
  if (location.pathname !== path) {
    setPath(location.pathname)
    if (open) setOpen(false)
  }

  // Freeze smooth-scroll behind the open overlay.
  useEffect(() => {
    if (open) signals.lenis?.stop()
    else signals.lenis?.start()
  }, [open])

  return (
    <header className="nav-root">
      <Link to="/" className="nav-mark" aria-label="The Resolutes — home">
        The Resolutes
      </Link>

      <nav className="nav-links" aria-label="Primary">
        {LINKS.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <Link to="/contact" className="nav-cta nav-cta-desktop">Hire Us</Link>

      <button
        type="button"
        className={`nav-burger${open ? ' is-open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <motion.nav
              className="mobile-menu-nav"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              aria-label="Mobile"
            >
              {LINKS.map(([to, label]) => (
                <motion.div key={to} variants={itemVariants}>
                  <NavLink to={to} className="mobile-link">{label}</NavLink>
                </motion.div>
              ))}
              <motion.div variants={itemVariants}>
                <Link to="/contact" className="mobile-cta">Hire Us</Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
