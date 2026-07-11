'use client'

import { motion } from 'motion/react'
import SunMascot from './SunMascot'
import SunRays from './SunRays'
import styles from './Hero.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.heroInner}>
        <SunRays />
        <SunMascot />

        <motion.h1
          className={styles.headline}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        >
          Hello, I build websites for businesses that deserve to{' '}
          <em className={styles.emphasis}>look as good</em> as the work they do.
        </motion.h1>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.32 }}
        >
          <p className={styles.bio}>
            Building multi-page sites for construction firms, law offices, and education platforms in Canada, US and the Middle East, from the first conversation to a live, running site.
          </p>
          <div className={styles.ctaRow}>
            <a href="#work" className={styles.primaryCta}>View projects</a>
            <a href="#contact" className={styles.secondaryCta}>Start a conversation</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
