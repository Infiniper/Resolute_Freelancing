import useSmoothScroll from './hooks/useSmoothScroll'
import CustomCursor    from './components/CustomCursor'
import Hero            from './sections/Hero'
import Surprise        from './sections/Surprise'

function Placeholder({ id, label }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center"
             style={{ background: '#080B14', borderTop: '1px solid #1E293B' }}>
      <p className="text-site-fore-faint text-xl">{label}</p>
    </section>
  )
}

function App() {
  useSmoothScroll()
  return (
    <>
      <CustomCursor />
      <main>
        <Hero />
        <Surprise />
        <Placeholder id="about"     label="About — Phase 3" />
        <Placeholder id="services"  label="Services — Phase 3" />
        <Placeholder id="portfolio" label="Portfolio — Phase 3" />
        <Placeholder id="contact"   label="Contact — Phase 3" />
      </main>
    </>
  )
}

export default App