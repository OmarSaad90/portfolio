'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import styles from './FAQ.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

const faqs = [
  {
    question: 'How do I get started?',
    answer:
      "Fill out the contact form below, or reach out directly if you'd rather talk it through first. We'll have a short, easygoing conversation about what you're building and take it from there.",
  },
  {
    question: 'Do I own my website once it’s built?',
    answer:
      'Yes. The site, the code, and everything on it belongs to you. Nothing is licensed or held back on my end.',
  },
  {
    question: 'What happens after my website goes live?',
    answer:
      'You get 30 days of free changes and updates while you settle in. After that, questions stay free forever. Ongoing updates and maintenance beyond that window come with a small fee.',
  },
  {
    question: 'What if I’m not happy with the design?',
    answer:
      'Every project comes with a 100% satisfaction guarantee. If the final website doesn’t match what we agreed at the start, you don’t pay the final balance. Every package also includes two full rounds of revisions, so you have plenty of chances to give feedback before we go live. I don’t consider a project finished until you’re completely happy with it.',
  },
  {
    question: 'Will my website work on mobile?',
    answer:
      'Yes. Every site I build is fully responsive, so it looks and works just as well on a phone or tablet as it does on a desktop.',
  },
  {
    question: 'Do I need to provide content for my website?',
    answer:
      'Ideally, yes. Photos and copy that are actually yours make the site feel real, and I’ll use whatever you can send over. It’s not required though. If something’s missing, I can help fill the gaps.',
  },
  {
    question: 'How long does it take to build a website?',
    answer:
      'A single page site usually takes a week at most. Bigger, multi-page sites take about 2 to 4 weeks, depending on scope.',
  },
  {
    question: 'What’s included in the website?',
    answer:
      'A content management system so you can update things yourself, hosting on my end, and a free HTTPS/SSL certificate so your site is secure from day one.',
  },
  {
    question: 'Is my website actually custom, or built from a template?',
    answer:
      'Fully custom. Every site is designed from scratch around your business, not a template with the colors swapped. That’s why none of my projects look alike.',
  },
]

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <h2 className={styles.heading}>
            Before you reach out,<br />
            <em>a few answers.</em>
          </h2>
          <p className={styles.subtext}>
            The questions almost everyone asks before their first project. If yours isn&apos;t here, just ask directly.
          </p>
        </motion.div>

        <motion.ul
          className={styles.list}
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const questionId = `faq-question-${index}`
            const answerId = `faq-answer-${index}`

            return (
              <motion.li
                key={faq.question}
                className={`${styles.item} ${isOpen ? styles.open : ''}`}
                variants={itemVariants}
              >
                <h3 className={styles.itemHeading}>
                  <button
                    type="button"
                    id={questionId}
                    className={styles.trigger}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggle(index)}
                  >
                    <span className={styles.question}>{faq.question}</span>
                    <span className={styles.icon} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className={styles.answerWrap}
                >
                  <div className={styles.answerInner}>
                    <p className={styles.answer}>{faq.answer}</p>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
