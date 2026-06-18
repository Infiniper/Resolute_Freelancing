import Seo from '../components/Seo'
import ServicesStack from '../components/ServicesStack'
import CtaBand from '../components/CtaBand'
import { SERVICES } from '../data/content'

export default function Services() {
  return (
    <>
      <Seo
        title="Services"
        description="What The Resolutes build: web development, design, coaching, backend/DevOps, AI/ML and data & analytics."
      />
      <div className="services-page">
        {/* LEFT 60%: header + the reverse-stacking deck (both pinned together so the
            cards un-stack on the very first scroll). RIGHT 40%: left empty so the
            persistent 3D canvas (ServicesScene) shows through and stays fixed. */}
        <div className="services-layout">
          <div className="services-col-cards">
            <ServicesStack services={SERVICES} eyebrow="What we do" title="Services" />
          </div>
          <div className="services-col-3d" aria-hidden="true" />
        </div>
      </div>

      <CtaBand
        eyebrow="Have something specific in mind?"
        title="Let’s scope it together!"
        primary={{ to: '/contact', label: 'Tell us about it' }}
        secondary={{ to: '/work', label: 'See our work' }}
      />
    </>
  )
}
