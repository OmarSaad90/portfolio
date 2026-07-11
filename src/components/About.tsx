'use client'

import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import styles from './About.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

const techGroups = [
  {
    label: 'Frontend',
    tools: [
      { icon: 'logos:nextjs-icon', name: 'Next.js' },
      { icon: 'logos:react', name: 'React' },
      { icon: 'logos:typescript-icon', name: 'TypeScript' },
      { icon: 'logos:html-5', name: 'HTML' },
      { icon: 'logos:css-3', name: 'CSS' },
    ],
  },
  {
    label: 'Backend',
    tools: [
      { icon: 'logos:nodejs-icon', name: 'Node.js' },
      { icon: 'logos:php', name: 'PHP' },
      { icon: 'logos:mysql', name: 'MySQL' },
      { icon: 'logos:supabase-icon', name: 'Supabase' },
    ],
  },
]

const infraItems = ['Domain & DNS', 'Hosting', 'Netlify', 'Email setup', 'SEO', 'Deployment']

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        {/* Left: tech stack */}
        <motion.div
          className={styles.stackCol}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.15 }}
        >
          {techGroups.map(({ label, tools }) => (
            <div key={label} className={styles.techGroup}>
              <span className={styles.techGroupLabel}>{label}</span>
              <div className={styles.iconRow}>
                {tools.map(({ icon, name }) => (
                  <div key={name} className={styles.iconItem}>
                    <Icon icon={icon} width={46} height={46} />
                    <span className={styles.iconName}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.infraGroup}>
            <span className={styles.techGroupLabel}>Infrastructure</span>
            <div className={styles.infraRow}>
              {infraItems.map((item) => (
                <span key={item} className={styles.infraTag}>{item}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: heading + copy */}
        <div className={styles.textCol}>
          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            Building for<br />businesses.
          </motion.h2>

          <motion.div
            className={styles.copy}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
          >
            <p>
              I&apos;m a web developer and IT specialist who builds websites for businesses in Canada, US and the Middle East. My clients are construction firms, law offices, education platforms, and consulting practices, organizations where the website needs to work, not just look good.
            </p>
            <p>
              What I bring is ownership of the whole project. Design, development, deployment, domain configuration, DNS setup, email forwarding, I handle it myself so clients get one point of contact from the first conversation to a live, running site.
            </p>
            <p>
              I find real satisfaction in translating someone&apos;s vision into something concrete. The brief, the build, the launch, the handoff, that arc is what I&apos;m here for.
            </p>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
