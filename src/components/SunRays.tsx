'use client'

import { motion, useReducedMotion } from 'motion/react'
import styles from './SunRays.module.css'

/* Two long sweeps from the mascot, confined to the clear sky above the headline,
   plus two shorter accent rays living entirely in the empty right margin —
   past the text column, so nothing ever crosses live copy. */
const RAYS = [
  {
    d: 'M 70 110 C 300 50, 620 40, 900 90 C 1020 115, 1100 140, 1160 160',
    color: 'var(--color-accent)',
    width: 2.5,
    opacity: 0.42,
    delay: 0,
  },
  {
    d: 'M 85 140 C 320 100, 640 120, 920 180 C 1030 205, 1100 220, 1160 235',
    color: 'var(--color-primary)',
    width: 2,
    opacity: 0.26,
    delay: 1.2,
  },
  {
    d: 'M 800 300 C 900 340, 1000 400, 1080 470 C 1110 495, 1135 515, 1155 535',
    color: 'var(--color-accent)',
    width: 1.75,
    opacity: 0.2,
    delay: 2.4,
  },
  {
    d: 'M 830 430 C 920 470, 1000 520, 1070 580 C 1095 600, 1115 615, 1130 630',
    color: 'var(--color-primary)',
    width: 1.5,
    opacity: 0.15,
    delay: 3.6,
  },
] as const

export default function SunRays() {
  const reduceMotion = useReducedMotion()

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.inner}>
        <svg
          className={styles.rays}
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMinYMin slice"
        >
          {RAYS.map((ray, i) => (
            <motion.path
              key={i}
              d={ray.d}
              fill="none"
              stroke={ray.color}
              strokeWidth={ray.width}
              strokeLinecap="round"
              style={{ opacity: ray.opacity }}
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [ray.opacity, ray.opacity * 1.4, ray.opacity] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 6, repeat: Infinity, delay: ray.delay, ease: 'easeInOut' }
              }
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
