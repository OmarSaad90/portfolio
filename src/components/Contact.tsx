'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import styles from './Contact.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    // Replace with your form endpoint (e.g., Resend, Formspree, etc.)
    await new Promise((r) => setTimeout(r, 800))
    setStatus('sent')
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
            <div className={styles.sentMessage}>
              <span className={styles.sentIcon}>✓</span>
              <p>Got it. I&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
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
                  placeholder="Tell me about your project — the more detail the better."
                />
              </label>
              <button
                type="submit"
                disabled={status === 'sending'}
                className={styles.submit}
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              {status === 'error' && (
                <p className={styles.errorMsg}>Something went wrong. Try emailing me directly.</p>
              )}
            </form>
          )}
        </motion.div>
      </div>

    </section>
  )
}
