import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>© {year} Omar Saad</span>
        <nav aria-label="Footer navigation">
          <ul className={styles.links}>
            <li>
              <a
                href="https://www.linkedin.com/in/omar-saad-879995221/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a href="mailto:omar.saad1998.os@gmail.com" className={styles.link}>
                Email
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
