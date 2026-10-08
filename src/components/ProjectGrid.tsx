'use client';

import Image from 'next/image';
import { useRef } from 'react';
import type { Project } from '@/content/site';
import { useTouchColor } from '@/hooks/useMedia';
import TransitionLink from './TransitionLink';
import s from './ProjectGrid.module.css';

type Props = {
  projects: Project[];
  /** "stagger": offset two-up editorial grid. "wide": two large landscape tiles. */
  variant?: 'stagger' | 'wide';
  startIndex?: number;
};

/** Grayscale thumbnails that bloom into colour on hover (or mid-screen on touch). */
export default function ProjectGrid({ projects, variant = 'stagger', startIndex = 0 }: Props) {
  return (
    <ul className={s.grid} data-variant={variant}>
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} index={startIndex + i} side={i % 2 === 0 ? 'left' : 'right'} />
      ))}
    </ul>
  );
}

function ProjectCard({ project, index, side }: { project: Project; index: number; side: 'left' | 'right' }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useTouchColor(ref);

  return (
    <li className={s.item}>
      <TransitionLink
        ref={ref}
        href={`/work/${project.slug}`}
        className={`${s.card} gs`}
        data-cursor="view"
        data-cursor-label="View"
      >
        <div className={s.media} data-reveal={`image-${side}`}>
          <Image
            src={project.image}
            alt={`${project.title}: ${project.kicker}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span className={s.badge}>{project.category}</span>
        </div>
        <div className={s.meta} data-reveal="up">
          <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className={s.title}>
              <span className="u-link">{project.title}</span>
            </h3>
            <p className={s.kicker}>{project.kicker}</p>
          </div>
          <span className={s.period}>{project.period}</span>
        </div>
      </TransitionLink>
    </li>
  );
}
