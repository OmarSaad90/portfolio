'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import styles from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.inner}>
        <nav aria-label="Primary navigation">
          <ul className={styles.links}>
            <li><a href="#work" className={styles.link}>Work</a></li>
            <li><a href="#about" className={styles.link}>About</a></li>
            <li>
              <a href="#contact" className={styles.cta}>
                Let&apos;s talk
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  )
}
