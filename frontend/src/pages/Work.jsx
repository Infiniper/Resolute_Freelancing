import { useState } from 'react'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import ProjectMedia from '../components/ProjectMedia'
import CtaBand from '../components/CtaBand'
import { PROJECTS } from '../data/content'

function ProjectCard({ p }) {
  const [hover, setHover] = useState(false)
  const card = (
    <article
      className={`glass-card project-card${p.placeholder ? ' is-placeholder' : ''}`}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <ProjectMedia
        image={p.image}
        preview={p.preview}
        title={p.title}
        placeholder={p.placeholder}
        active={hover}
      />
      <div className="project-body">
        <div className="project-head">
          <h2 className="card-title">{p.title}</h2>
          <span className="badge">{p.note}</span>
        </div>
        <p className="project-outcome">{p.outcome}</p>
        <ul className="chip-list">
          {p.stack.map((s) => (
            <li key={s} className="chip">{s}</li>
          ))}
        </ul>
        {p.live && (
          <div className="project-links">
            <span className="project-link">View it Live ↗</span>
          </div>
        )}
      </div>
    </article>
  )
  return p.live ? (
    <a
      className="project-card-link"
      href={p.live}
      target="_blank"
      rel="noreferrer"
      aria-label={`${p.title} — open live`}
    >
      {card}
    </a>
  ) : card
}

export default function Work() {
  return (
    <>
      <Seo
        title="Work"
        description="Selected projects from The Resolutes — explainable RL research, multimodal ML, NLP, full-stack and games."
      />
      <div className="page">
        <PageHeader title="Work" />

        <div className="work-grid">
          {PROJECTS.map((p, i) => (
            <Reveal key={`${p.title}-${i}`} delay={(i % 2) * 0.06} from={i % 2 ? 'right' : 'left'}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>

      <CtaBand
        eyebrow="That’s the proof."
        title="Like what you see? Let’s build yours."
        primary={{ to: '/contact', label: 'Start a project' }}
        secondary={{ to: '/services', label: 'Explore services' }}
      />
    </>
  )
}
