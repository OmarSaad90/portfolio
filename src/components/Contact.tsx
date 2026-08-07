'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import styles from './Contact.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

// A small burst of light on send: 8 points evenly spread around the spark,
// distance varied slightly so it doesn't read as a perfect mechanical ring.
const BURST_PARTICLES = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + 0.3
  const dist = 28 + (i % 3) * 9
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, delay: (i % 4) * 0.02 }
})

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const reduceMotion = useReducedMotion()

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const data = new FormData(form)
      data.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? '')
      data.append('subject', 'New message from omarsaad.dev portfolio')
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      })
      const result = await res.json()
      if (result.success) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        {/* Left: info */}
        <motion.div
          className={styles.info}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <h2 className={styles.heading}>
            Let&apos;s build<br />
            <em>something.</em>
          </h2>
          <p className={styles.subtext}>
            Have a project in mind? Tell me what you&apos;re building and I&apos;ll get back to you within a day.
          </p>

          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <span className={styles.contactLabel}>Email</span>
              <a href="mailto:omar.saad1998.os@gmail.com" className={styles.contactValue}>
                omar.saad1998.os@gmail.com
              </a>
            </li>
            <li className={styles.contactItem}>
              <span className={styles.contactLabel}>Phone</span>
              <a href="tel:+96170573866" className={styles.contactValue}>
                +961 70 573866
              </a>
            </li>
            <li className={styles.contactItem}>
              <span className={styles.contactLabel}>LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/omar-saad-879995221/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactValue}
              >
                Omar Saad ↗
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Right: form */}
        <motion.div
          className={styles.formWrap}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
        >
          {status === 'sent' ? (
            <div className={styles.sentMessage} role="status">
              <div className={styles.spark} aria-hidden="true">
                {!reduceMotion &&
                  BURST_PARTICLES.map((p, i) => (
                    <motion.span
                      key={i}
                      className={styles.particle}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{ x: p.x, y: p.y, opacity: 0 }}
                      transition={{ duration: 0.75, delay: 0.05 + p.delay, ease: EASE }}
                    />
                  ))}
                <motion.span
                  className={styles.sparkCore}
                  initial={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                  animate={{ scale: reduceMotion ? 1 : [0.4, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 0.55, times: reduceMotion ? undefined : [0, 0.6, 1], ease: EASE }}
                />
              </div>
              <p>Got it. I&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: 'none' }}
              />
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className={styles.input}
                    placeholder="Your name"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className={styles.input}
                    placeholder="you@company.com"
                  />
                </label>
              </div>
              <label className={styles.field}>
                <span className={styles.label}>What are you building?</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className={styles.textarea}
                  placeholder="Tell me about your project, the more detail the better."
                />
              </label>
              <button
                type="submit"
                disabled={status === 'sending'}
                data-sending={status === 'sending' ? 'true' : undefined}
                className={styles.submit}
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <p role="status" aria-live="polite" className={styles.errorMsg}>
                {status === 'error' && 'Something went wrong. Try emailing me directly.'}
              </p>
            </form>
          )}
        </motion.div>
      </div>

    </section>
  )
}
