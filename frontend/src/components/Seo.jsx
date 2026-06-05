import { useEffect } from 'react'

const SITE = 'The Resolutes'
const DEFAULT_DESC =
  'The Resolutes — a frontend, design, full-stack and AI/ML freelance studio from India, building cinematic web experiences for clients worldwide.'

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Per-route document title + meta description, with no external dependency.
 * Drop one `<Seo>` at the top of every page.
 */
export default function Seo({ title, description = DEFAULT_DESC }) {
  useEffect(() => {
    const full = title ? `${title} — ${SITE}` : `${SITE} — Cinematic 3D Web, Design & AI/ML`
    document.title = full
    setMeta('description', description)
    // Open Graph / Twitter — helps link previews when the site is shared.
    setMeta('og:title', full, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', full)
    setMeta('twitter:description', description)
  }, [title, description])

  return null
}
