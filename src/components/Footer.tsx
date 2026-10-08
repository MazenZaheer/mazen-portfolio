import { site } from '@/content/site';
import Magnetic from './Magnetic';
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="contact" className={`${s.footer} theme-dark`}>
      <div className="container">
        <p className="eyebrow" data-reveal="up">
          Contact
        </p>
        <h2 className={s.title} data-reveal="lines">
          Have a project, a delegation or an application in mind?
        </h2>
        <div className={s.actions}>
          <Magnetic strength={0.3}>
            <a className={s.circle} href={`mailto:${site.email}`} data-cursor="accent" data-cursor-label="Write">
              <span>Get in touch</span>
            </a>
          </Magnetic>
          <a className={`${s.mail} u-link`} href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div className={s.bottom}>
          <span>© 2026 {site.name}</span>
          <span className={s.built}>Next.js · GSAP · Framer Motion</span>
          <a href="#top" className="u-link">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
