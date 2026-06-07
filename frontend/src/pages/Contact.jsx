import { useRef, useState } from 'react'
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

// The team number the form's WhatsApp button opens a chat with.
const TEAM_WA = CONTACT.phones[0]?.wa

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.107zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01a1.1 1.1 0 00-.792.372c-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

// Build a readable, pre-filled WhatsApp message from the current form values
// (only the filled ones), so leads can reach out with one tap — no backend.
function buildWaMessage(form) {
  const val = (k) => form?.[k]?.value.trim()
  const parts = ['Hi The Resolutes!']
  if (val('name')) parts.push(`Name: ${val('name')}`)
  if (val('email')) parts.push(`Email: ${val('email')}`)
  if (val('phone')) parts.push(`Phone: ${val('phone')}`)
  if (val('message')) parts.push('', val('message'))
  return parts.join('\n')
}

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errors, setErrors] = useState({})
  const formRef = useRef(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(), // optional — add {{phone}} to the EmailJS template
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
      // reject — the WhatsApp button + mailto link are guaranteed fallbacks.
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

  // Open WhatsApp with the form's details pre-filled (URL-encoded). Works with
  // no backend — the Pankaj Traders pattern.
  const onWhatsApp = () => {
    if (!TEAM_WA) return
    const text = encodeURIComponent(buildWaMessage(formRef.current))
    window.open(`https://wa.me/${TEAM_WA}?text=${text}`, '_blank', 'noopener,noreferrer')
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
            <form className="contact-form" ref={formRef} onSubmit={onSubmit} noValidate>
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

              <label className="field" htmlFor="cf-phone">
                <span className="field-label">Phone / WhatsApp (optional)</span>
                <input
                  id="cf-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 90000 00000"
                  inputMode="tel"
                />
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

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
                {TEAM_WA && (
                  <button type="button" className="btn-whatsapp" onClick={onWhatsApp}>
                    <WhatsAppIcon /> Message us on WhatsApp
                  </button>
                )}
              </div>

              <div className="form-status" role="status" aria-live="polite">
                {status === 'success' && <p className="status-ok">Got it — we’ll be in touch shortly.</p>}
                {status === 'error' && (
                  <p className="status-err">
                    Couldn’t send from here. WhatsApp us above, or email{' '}
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

              {CONTACT.phones?.length > 0 && (
                <ul className="contact-channels">
                  {CONTACT.phones.map((p) => (
                    <li key={p.wa} className="contact-channel">
                      <a className="contact-wa" href={`https://wa.me/${p.wa}`} target="_blank" rel="noreferrer">
                        <WhatsAppIcon /> {p.label}
                      </a>
                      <a className="contact-tel" href={`tel:${p.tel}`}>Call</a>
                    </li>
                  ))}
                </ul>
              )}

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
              Prefer WhatsApp or a call? Use the numbers above — no form required.
            </p>
          </Reveal>
        </div>
      </div>
    </>
  )
}
