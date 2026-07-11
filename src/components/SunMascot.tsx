'use client'

import { useEffect, useId, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import styles from './SunMascot.module.css'

const EYE_TRACK_RANGE = 8

const EASE = [0.16, 1, 0.3, 1] as const

const SUN_YELLOW = 'oklch(0.80 0.16 96)'

const BLOB_PATH =
  'M48 4C60 4 66 10 74 18C82 26 90 34 90 46C90 58 84 68 74 76C64 84 54 90 42 88C30 86 18 80 10 68C4 58 4 46 8 34C12 22 20 12 32 6C37 3 43 4 48 4Z'

const TEXTURE_DOTS = [
  { cx: 24, cy: 20, r: 2.6, o: 0.55 },
  { cx: 68, cy: 15, r: 2, o: 0.5 },
  { cx: 80, cy: 40, r: 1.8, o: 0.45 },
  { cx: 15, cy: 50, r: 2.2, o: 0.5 },
  { cx: 26, cy: 75, r: 1.6, o: 0.4 },
  { cx: 66, cy: 78, r: 2, o: 0.45 },
  { cx: 49, cy: 13, r: 1.5, o: 0.4 },
]

export default function SunMascot() {
  const reduceMotion = useReducedMotion()
  const clipId = useId()
  const svgRef = useRef<SVGSVGElement>(null)

  const pupilX = useMotionValue(0)
  const pupilY = useMotionValue(0)
  const springX = useSpring(pupilX, { stiffness: 180, damping: 16, mass: 0.35 })
  const springY = useSpring(pupilY, { stiffness: 180, damping: 16, mass: 0.35 })

  useEffect(() => {
    if (reduceMotion) return

    const onPointerMove = (e: PointerEvent) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy) || 1
      const clamped = Math.min(dist, 220)
      pupilX.set((dx / dist) * (clamped / 220) * EYE_TRACK_RANGE)
      pupilY.set((dy / dist) * (clamped / 220) * EYE_TRACK_RANGE)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [reduceMotion, pupilX, pupilY])

  return (
    <motion.div
      className={styles.mascot}
      initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      aria-hidden="true"
    >
      <motion.svg
        ref={svgRef}
        viewBox="0 0 96 96"
        width="100%"
        height="100%"
        animate={reduceMotion ? undefined : { rotate: [-3, 3, -3] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <defs>
          <clipPath id={clipId}>
            <path d={BLOB_PATH} />
          </clipPath>
        </defs>

        {/* Hand-drawn blob — deliberately irregular, not a true circle */}
        <path d={BLOB_PATH} fill={SUN_YELLOW} />

        <g clipPath={`url(#${clipId})`}>
          {/* Sun texture — soft highlight dots */}
          {TEXTURE_DOTS.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="white" opacity={d.o} />
          ))}

          {/* Eyes */}
          <motion.g
            style={{ transformOrigin: '49px 47px', x: springX, y: springY }}
            animate={reduceMotion ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 3.2,
                    repeat: Infinity,
                    times: [0, 0.88, 0.92, 0.96, 1],
                    ease: 'easeInOut',
                  }
            }
          >
            <circle cx="36" cy="47" r="3.4" fill="var(--color-ink)" />
            <circle cx="62" cy="47" r="3.4" fill="var(--color-ink)" />
          </motion.g>

          {/* Smile — closed default expression */}
          <motion.path
            d="M33 59c3.8 6.6 10.2 10.2 16.5 10.2s12.7-3.6 16.5-10.2"
            stroke="var(--color-ink)"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
            style={reduceMotion ? { opacity: 1 } : undefined}
            animate={
              reduceMotion
                ? undefined
                : { opacity: [1, 1, 0, 0, 1, 1] }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 3.8,
                    repeat: Infinity,
                    times: [0, 0.42, 0.48, 0.58, 0.64, 1],
                    ease: 'easeInOut',
                  }
            }
          />

          {/* Grin — brief open ":D" expression */}
          <motion.path
            d="M36.5 58c0 7.2 5.8 11.6 13.5 11.6s13.5-4.4 13.5-11.6c0-2.1-1.4-3.2-3.2-3.2H39.7c-1.8 0-3.2 1.1-3.2 3.2Z"
            fill="var(--color-ink)"
            style={reduceMotion ? { opacity: 0 } : undefined}
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0, 0, 1, 1, 0, 0] }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 3.8,
                    repeat: Infinity,
                    times: [0, 0.42, 0.48, 0.58, 0.64, 1],
                    ease: 'easeInOut',
                  }
            }
          />
        </g>
      </motion.svg>
    </motion.div>
  )
}
