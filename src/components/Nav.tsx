'use client';

import { site } from '@/content/site';
import { useIntro } from './IntroProvider';
import Magnetic from './Magnetic';
import TransitionLink from './TransitionLink';
import s from './Nav.module.css';

// Sections are reached through the carousel, so the bar only offers home and contact.
const links = [{ href: '/', label: 'Index' }];

/** Fixed bar in `difference` blend so it reads on light, dark and photos alike. */
export default function Nav() {
  const { ready } = useIntro();
  return (
    <header className={s.nav} data-ready={ready}>
      <Magnetic strength={0.4}>
        <TransitionLink href="/" className={s.logo} aria-label={`${site.name}, home`}>
          {site.initials}
          <sup>©</sup>
        </TransitionLink>
      </Magnetic>
      <nav aria-label="Primary">
        <ul className={s.links}>
          {links.map((l) => (
            <li key={l.href}>
              <TransitionLink href={l.href}>
                <span className="u-link">{l.label}</span>
              </TransitionLink>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.email}`}>
              <span className="u-link">Contact</span>
            </a>
          </li>
        </ul>
      </nav>
      <span className={s.status}>
        <span className={s.pulse} aria-hidden />
        Open to projects
      </span>
    </header>
  );
}
