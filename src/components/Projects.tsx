'use client'

import { useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { projects } from '@/data/projects'
import ProjectOverlay from './ProjectOverlay'
import styles from './Projects.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

function ProjectMockup({ name, image, transitionName }: { name: string; image: string; transitionName?: string }) {
  return (
    <div className={styles.preview} aria-hidden="true">
      <Image
        src={image}
        alt={`${name} website screenshot`}
        width={1920}
        height={1080}
        className={styles.previewImg}
        sizes="(max-width: 860px) 100vw, 56vw"
        style={transitionName ? ({ viewTransitionName: transitionName } as CSSProperties) : undefined}
      />
    </div>
  )
}

function startTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void }
  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(update)
  } else {
    update()
  }
}

export default function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const expandedProject = projects.find((p) => p.id === expandedId) ?? null

  return (
    <section id="work" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2 className={styles.sectionHeading}>
            Live and <em className={styles.emphasis}>running</em>
          </h2>
          <span className={styles.count}>{projects.length} projects</span>
        </motion.div>

        <div className={styles.list}>
          {projects.map((project, i) => (
            <motion.article
              key={project.id}
              className={`${styles.project} ${i % 2 === 1 ? styles.reversed : ''}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.05 }}
            >
              {/* Info note card — overlaps the mockup edge */}
              <div className={styles.noteWrap}>
                <div className={styles.noteCard}>
                  <span className={styles.cardLetter} aria-hidden="true">{project.name[0]}</span>
                  <div className={styles.titleRow}>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <span className={styles.categoryPill}>{project.category}</span>
                    {project.status === 'coming-soon' && (
                      <span className={styles.comingSoonBadge}>Coming soon</span>
                    )}
                  </div>
                  <p className={styles.description}>{project.description}</p>
                  {project.status === 'live' && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                      aria-label={`Visit ${project.name}`}
                    >
                      {project.domain}
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Screenshot mockup — expands into a full preview */}
              <div className={styles.imageCol}>
                <button
                  type="button"
                  className={styles.previewLink}
                  aria-label={`Expand preview of ${project.name}`}
                  onClick={() => startTransition(() => setExpandedId(project.id))}
                >
                  <ProjectMockup
                    name={project.name}
                    image={project.image}
                    transitionName={expandedId === project.id ? undefined : `project-image-${project.id}`}
                  />
                  {project.status === 'coming-soon' ? (
                    <span className={styles.soonLabel}>Coming soon</span>
                  ) : (
                    <span className={styles.visitLabel}>Expand ↗</span>
                  )}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expandedProject && (
          <ProjectOverlay
            project={expandedProject}
            onClose={() => startTransition(() => setExpandedId(null))}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
