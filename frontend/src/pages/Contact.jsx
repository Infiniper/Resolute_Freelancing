import { useState } from 'react'
import emailjs from '@emailjs/browser'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CONTACT, EMAILJS } from '../data/content'

const emailOk = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)

const SOCIALS = [
  ['LinkedIn', CONTACT.linkedin],
  ['GitHub', CONTACT.github],
  ['LeetCode', CONTACT.leetcode],
]

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errors, setErrors] = useState({})

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    }

    const errs = {}
    if (!data.name) errs.name = 'Please tell us your name.'
    if (!emailOk(data.email)) errs.email = 'A valid email, please.'
    if (data.message.length < 10) errs.message = 'A little more detail helps.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setStatus('sending')
    try {
      // IMPORTANT: this only delivers once real EmailJS keys are set in
      // src/data/content.js (EMAILJS). With the TODO placeholders it will
      // reject — the mailto link below is the guaranteed fallback.
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, data, {
        publicKey: EMAILJS.publicKey,
      })
      setStatus('success')
      form.reset()
    } catch (err) {
      console.warn('EmailJS send failed — are the keys configured in content.js?', err)
      setStatus('error')
    }
  }

  return (
    <>
      <Seo title="Contact" description="Tell The Resolutes about your project. We reply fast." />
      <div className="page">
        <PageHeader
          eyebrow="Let’s build"
          title="Contact"
          lead="The calm after the storm. Tell us what you’re making — we reply fast."
        />

        <div className="contact-grid">
          <Reveal className="glass-card contact-form-card" from="left">
            <form className="contact-form" onSubmit={onSubmit} noValidate>
              <label className="field" htmlFor="cf-name">
                <span className="field-label">Name</span>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? 'cf-name-err' : undefined}
                />
                {errors.name && <span id="cf-name-err" className="field-error">{errors.name}</span>}
              </label>

              <label className="field" htmlFor="cf-email">
                <span className="field-label">Email</span>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'cf-email-err' : undefined}
                />
                {errors.email && <span id="cf-email-err" className="field-error">{errors.email}</span>}
              </label>

              <label className="field" htmlFor="cf-message">
                <span className="field-label">Project</span>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={5}
                  placeholder="What are you building, and by when?"
                  required
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'cf-message-err' : undefined}
                />
                {errors.message && <span id="cf-message-err" className="field-error">{errors.message}</span>}
              </label>

              <button type="submit" className="btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              <div className="form-status" role="status" aria-live="polite">
                {status === 'success' && <p className="status-ok">Got it — we’ll be in touch shortly.</p>}
                {status === 'error' && (
                  <p className="status-err">
                    Couldn’t send from here. Email us directly at{' '}
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
                  </p>
                )}
              </div>
            </form>
          </Reveal>

          <Reveal className="contact-aside" delay={0.08} from="right">
            <div className="glass-card contact-direct">
              <h2 className="section-title">Direct</h2>
              <a className="contact-email" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <ul className="contact-socials">
                {SOCIALS.map(([label, url]) => (
                  <li key={label}>
                    {url ? (
                      <a href={url} target="_blank" rel="noreferrer">{label} ↗</a>
                    ) : (
                      <span className="link-todo">{label}: TODO</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <p className="contact-fineprint">
              Prefer email? The address above always works — no form required.
            </p>
          </Reveal>
        </div>
      </div>
    </>
  )
}
