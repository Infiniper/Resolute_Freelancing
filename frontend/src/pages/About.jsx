import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { TEAM, CREDENTIALS } from '../data/content'

const initials = (name) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="The Resolute story and the team behind it — Vishwajeet, Neeraj, and a backing team of developers."
      />
      <div className="page">
        <PageHeader
          eyebrow="Who we are"
          title="About"
          lead="Resolute — firm, determined, unwavering."
        />

        <Reveal className="glass-card about-story">
          <p>
            We named ourselves for a single idea: <strong>resolute</strong> — firm,
            determined, unmoved. In our hero, a storm tears at the word and
            everything trembles, yet <em>The&nbsp;Resolute</em> stands. Only the
            “s” gives way — and even that turns into a surprise. The storm
            couldn’t move us.
          </p>
          <p>
            That’s how we work: calm under pressure, precise under deadline, and
            a little bit theatrical when it earns its keep.
          </p>
        </Reveal>

        <section className="about-section" aria-labelledby="team-h">
          <h2 id="team-h" className="section-title">The team</h2>
          <div className="team-grid">
            {TEAM.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <article className="glass-card team-card">
                  <div className="team-avatar" aria-hidden>{initials(t.name)}</div>
                  <h3 className="team-name">{t.name}</h3>
                  <p className="team-role">{t.role}</p>
                  <p className="team-blurb">{t.blurb}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="team-note">
            …and we’re backed by a wider team of developers, so larger projects
            are fully covered.
          </p>
        </section>

        <section className="about-section" aria-labelledby="cred-h">
          <h2 id="cred-h" className="section-title">Credibility</h2>
          <ul className="chip-list cred-list">
            {CREDENTIALS.map((c) => (
              <li key={c} className="chip">{c}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
