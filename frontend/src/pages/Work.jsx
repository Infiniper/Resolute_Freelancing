import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import ProjectMedia from '../components/ProjectMedia'
import { PROJECTS } from '../data/content'

export default function Work() {
  return (
    <>
      <Seo
        title="Work"
        description="Selected projects from The Resolutes — explainable RL research, multimodal ML, NLP, full-stack and games."
      />
      <div className="page">
        <PageHeader
          eyebrow="Selected work"
          title="Work"
          lead="Research, machine learning and full-stack products — the proof behind the pitch."
        />

        <div className="work-grid">
          {PROJECTS.map((p, i) => (
            <Reveal key={`${p.title}-${i}`} delay={(i % 2) * 0.06} from={i % 2 ? 'right' : 'left'}>
              <article className={`glass-card project-card${p.placeholder ? ' is-placeholder' : ''}`}>
                <ProjectMedia image={p.image} preview={p.preview} title={p.title} placeholder={p.placeholder} />
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
                  <div className="project-links">
                    {p.live ? (
                      <a href={p.live} className="project-link" target="_blank" rel="noreferrer">
                        Live ↗
                      </a>
                    ) : (
                      <span className="link-todo">Live: TODO</span>
                    )}
                    {p.repo ? (
                      <a href={p.repo} className="project-link" target="_blank" rel="noreferrer">
                        Code ↗
                      </a>
                    ) : (
                      <span className="link-todo">Repo: TODO</span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  )
}
