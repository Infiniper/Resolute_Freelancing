import { Link, NavLink } from 'react-router-dom'

const LINKS = [
  ['/services', 'Services'],
  ['/work', 'Work'],
  ['/pricing', 'Pricing'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]

// Phase A nav — wordmark + links + CTA. Mobile overlay menu arrives in Phase B.
export default function Nav() {
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

      <Link to="/contact" className="nav-cta">Hire Us</Link>
    </header>
  )
}
