import { useEffect, useRef, useState } from 'react'

/**
 * Project poster + optional preview clip.
 * - Desktop (fine pointer): show the poster; play a muted, looping preview on
 *   hover, fading it over the poster.
 * - Touch: autoplay the preview when the card scrolls into view (and pause it
 *   when it leaves), via IntersectionObserver.
 * The <video> uses preload="none" and is reset when inactive, so off-screen
 * cards cost nothing. Falls back to the gradient placeholder when there's no
 * media yet.
 */
export default function ProjectMedia({ image, preview, title, placeholder }) {
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const [active, setActive] = useState(false)

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  // Touch: drive `active` from visibility.
  useEffect(() => {
    if (!isTouch || !preview) return
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isTouch, preview])

  // Play / pause + reset the video to match `active`.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) { const p = v.play(); if (p?.catch) p.catch(() => {}) }
    else { v.pause(); v.currentTime = 0 }
  }, [active])

  if (!image && !preview) {
    return (
      <div className="project-media" aria-hidden>
        <span>{placeholder ? 'Sample slot' : 'Image — TODO'}</span>
      </div>
    )
  }

  return (
    <div
      className="project-media has-media"
      ref={wrapRef}
      onPointerEnter={() => { if (!isTouch && preview) setActive(true) }}
      onPointerLeave={() => { if (!isTouch && preview) setActive(false) }}
    >
      {image && <img className="project-poster" src={image} alt={`${title} preview`} loading="lazy" />}
      {preview && (
        <video
          ref={videoRef}
          className={`project-preview${active ? ' is-on' : ''}`}
          src={preview}
          muted
          loop
          playsInline
          preload="none"
        />
      )}
    </div>
  )
}
