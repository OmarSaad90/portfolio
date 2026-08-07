'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import type { Project } from '@/data/projects'
import styles from './ProjectOverlay.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

interface ProjectOverlayProps {
  project: Project
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function ProjectOverlay({ project, index, total, onClose, onPrev, onNext }: ProjectOverlayProps) {
  const reduceMotion = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKeyDown)

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <motion.div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-overlay-name"
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close project preview"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navPrev}`}
              onClick={onPrev}
              aria-label="Previous project"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M11 3L5 9l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navNext}`}
              onClick={onNext}
              aria-label="Next project"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M7 3l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        <div
          className={styles.imageWrap}
          style={{ viewTransitionName: `project-image-${project.id}` } as CSSProperties}
        >
          <Image
            src={project.image}
            alt={`${project.name} website screenshot`}
            width={1920}
            height={1080}
            className={styles.image}
            sizes="(max-width: 860px) 100vw, 900px"
            priority
          />
        </div>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h3 id="project-overlay-name" className={styles.name}>{project.name}</h3>
            <span className={styles.categoryPill}>{project.category}</span>
            {project.status === 'coming-soon' && (
              <span className={styles.comingSoonBadge}>Coming soon</span>
            )}
            {total > 1 && (
              <span className={styles.counter}>{index + 1} / {total}</span>
            )}
          </div>
          <p className={styles.description}>{project.description}</p>
          <div className={styles.techList}>
            {project.tech.map((t) => (
              <span key={t} className={styles.techTag}>{t}</span>
            ))}
          </div>
          {project.status === 'live' && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {project.domain}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </motion.div>
    </div>
  )
}
