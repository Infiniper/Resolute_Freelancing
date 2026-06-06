import { Link } from 'react-router-dom'
import { MODEL_CREDITS } from '../3d/models'

const NAV = [
  ['/services', 'Services'],
  ['/work', 'Work'],
  ['/pricing', 'Pricing'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="footer-mark">The Resolutes</p>
          <p className="footer-tag">Resolute by name. Unmoved by the storm.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {NAV.map(([to, label]) => (
            <Link key={to} to={to} className="footer-link">{label}</Link>
          ))}
        </nav>
      </div>

      <div className="footer-base">
        <span>© {new Date().getFullYear()} The Resolutes</span>
        <span>Frontend · Design · Full-Stack · AI/ML</span>
      </div>

      {/* CC-BY attribution for the Poly Pizza models (required). */}
      <p className="footer-credits">
        3D models via{' '}
        <a href="https://poly.pizza" target="_blank" rel="noreferrer">Poly Pizza</a>{' '}
        (CC-BY): {MODEL_CREDITS.map((m, i) => (
          <span key={m.name}>{i ? ', ' : ''}{m.name} by {m.author}</span>
        ))}
      </p>
    </footer>
  )
}
