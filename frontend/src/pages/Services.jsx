import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import { SERVICES } from '../data/content'

export default function Services() {
  return (
    <>
      <Seo
        title="Services"
        description="What The Resolutes build: web development, design, coaching, backend/DevOps, AI/ML and data & analytics."
      />
      <div className="page">
        <PageHeader
          eyebrow="What we do"
          title="Services"
          lead="Six offerings, one standard — cinematic execution and code that holds up in production."
        />

        <ul className="card-grid" aria-label="Services offered">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} as="li" delay={(i % 3) * 0.06}>
              <TiltCard className="glass-card service-card">
                <div className="service-card-top">
                  <h2 className="card-title">{s.title}</h2>
                  <span className="pill">{s.tag}</span>
                </div>
                <ul className="chip-list">
                  {s.examples.map((e) => (
                    <li key={e} className="chip">{e}</li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          ))}
        </ul>

        <Reveal className="page-cta">
          <p>Have something specific in mind?</p>
          <Link to="/contact" className="btn-primary">Tell us about it</Link>
        </Reveal>
      </div>
    </>
  )
}
