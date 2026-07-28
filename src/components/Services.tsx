'use client'

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react'
import styles from './Services.module.css'

const EASE = [0.16, 1, 0.3, 1] as const
const MAX_TILT = 7 // degrees, kept small so it reads as physical, not gimmicky
const SPRING = { stiffness: 300, damping: 34, mass: 0.6 } // near-critical: no bounce

const services = [
  {
    slug: 'dev',
    title: 'Website Development',
    description:
      'Custom websites built from the ground up with modern technologies, optimized for speed, usability, and growth.',
    feature: true,
  },
  {
    slug: 'design',
    title: 'Website Design',
    description: 'Clean, professional interfaces designed around your brand and your customers.',
  },
  {
    slug: 'seo',
    title: 'SEO & Performance',
    description: 'Technical SEO, page optimization, and improvements that help businesses get discovered online.',
  },
  {
    slug: 'webapps',
    title: 'Web Applications',
    description: 'Custom platforms with databases, authentication, dashboards, and interactive features.',
  },
  {
    slug: 'deploy',
    title: 'Deployment & Setup',
    description: 'Complete launch management including domains, DNS, hosting, business emails, and maintenance.',
  },
  {
    slug: 'reno',
    title: 'Website Renovation',
    description: "Redesigning and rebuilding existing sites, preserving what works and modernizing what doesn't.",
    wide: true,
  },
]

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

function useMagneticTilt() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    setEnabled(query.matches)
    const onChange = () => setEnabled(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return enabled
}

function ServiceCard({ service, className }: { service: (typeof services)[number]; className: string }) {
  const tiltEnabled = useMagneticTilt()
  const ref = useRef<HTMLElement>(null)

  const rotateXRaw = useMotionValue(0)
  const rotateYRaw = useMotionValue(0)
  const glowOpacityRaw = useMotionValue(0)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)

  const rotateX = useSpring(rotateXRaw, SPRING)
  const rotateY = useSpring(rotateYRaw, SPRING)
  const glowOpacity = useSpring(glowOpacityRaw, { stiffness: 260, damping: 30 })
  const glowPosition = useMotionTemplate`${mx}% ${my}%`

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (!tiltEnabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = (event.clientX - rect.left) / rect.width
    const relY = (event.clientY - rect.top) / rect.height
    rotateXRaw.set((0.5 - relY) * MAX_TILT)
    rotateYRaw.set((relX - 0.5) * MAX_TILT)
    mx.set(relX * 100)
    my.set(relY * 100)
    glowOpacityRaw.set(1)
  }

  function handlePointerLeave() {
    rotateXRaw.set(0)
    rotateYRaw.set(0)
    glowOpacityRaw.set(0)
  }

  return (
    <motion.article
      ref={ref}
      variants={cardVariants}
      className={className}
      style={tiltEnabled ? { rotateX, rotateY, transformPerspective: 700 } : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {tiltEnabled && (
        <motion.span
          aria-hidden="true"
          className={styles.glow}
          style={{ opacity: glowOpacity, '--glow-pos': glowPosition } as unknown as CSSProperties}
        />
      )}
      <h3 className={styles.cardTitle}>{service.title}</h3>
      <p className={styles.cardText}>{service.description}</p>
    </motion.article>
  )
}

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2 className={styles.sectionHeading}>
            What I do,<br /><em className={styles.emphasis}>in practice.</em>
          </h2>
          <span className={styles.count}>{services.length} services</span>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              className={[
                styles.card,
                styles[service.slug],
                service.feature ? styles.feature : '',
                service.wide ? styles.wide : '',
              ].join(' ')}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
