import styles from "./EditorialIntro.module.css";

export default function EditorialIntro() {
  return (
    <section aria-labelledby="editorial-intro-title" className={styles.intro}>
      <div aria-hidden="true" className={styles.grid} />
      <div aria-hidden="true" className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.edition}>
          <span>Daddieshinor / Independent thinking</span>
          <span>Tech. Culture. Branding. Life.</span>
        </div>
        <div className={styles.statement}>
          <p className={styles.eyebrow}>A different point of view</p>
          <h1 id="editorial-intro-title" className={styles.title}>
            <span className={styles.line}><span>LOOK CLOSER.</span></span>
            <span className={styles.line}><span className={styles.outline}>THINK DEEPER.</span></span>
          </h1>
          <p className={styles.description}>
            Technology, culture, brands, and the lives we build around them.
            Stories with something to say.
          </p>
        </div>
        <a href="#journal" className={styles.invitation}>
          <span className={styles.invitationText}>
            <span className={styles.read}>Start reading</span>
            <span className={styles.scroll}>Scroll down. Find your perspective.</span>
          </span>
          <span className={styles.arrow}>
            <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
              <path d="M60 8v98M17 63l43 43 43-43" stroke="currentColor" strokeWidth="3" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
