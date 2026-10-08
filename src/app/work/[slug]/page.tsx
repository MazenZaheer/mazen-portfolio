import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ColorRevealImage from '@/components/ColorRevealImage';
import Footer from '@/components/Footer';
import TransitionLink from '@/components/TransitionLink';
import { allWork } from '@/content/site';
import s from './work.module.css';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allWork.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = allWork.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = allWork.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = allWork[index];
  const next = allWork[(index + 1) % allWork.length];
  const back = project.category === 'Research' ? '/research' : '/projects';

  const meta = [
    { label: 'Role', value: project.role },
    { label: 'When', value: project.period },
    project.with && { label: 'With', value: project.with },
    project.where && { label: 'Where', value: project.where },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className={s.page} id="top">
      <header className="container">
        <div className={s.topRow} data-reveal="up">
          <TransitionLink href={back} className={s.back}>
            ← <span className="u-link">All work</span>
          </TransitionLink>
          <span className="eyebrow">
            <b>{String(index + 1).padStart(2, '0')}</b> / {String(allWork.length).padStart(2, '0')} · {project.category}
          </span>
        </div>
        <p className={s.kicker} data-reveal="up">
          {project.kicker}
        </p>
        <h1 className={s.title} data-reveal="lines">
          {project.title}
        </h1>
        <dl className={s.meta} data-reveal="stagger">
          {meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className={`container ${s.media}`}>
        <ColorRevealImage src={project.image} alt={`${project.title}: ${project.kicker}`} />
      </div>

      <section className={`container ${s.body}`}>
        <p className="eyebrow" data-reveal="up">
          Overview
        </p>
        <p className={s.summary} data-reveal="lines">
          {project.summary}
        </p>
      </section>

      <section className={`container ${s.metricsWrap}`}>
        <ul className={s.metrics} data-reveal="stagger">
          {project.metrics.map((m) => (
            <li key={m.label}>
              <span className={s.metricValue}>{m.value}</span>
              <span className={s.metricLabel}>{m.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${s.body}`}>
        <p className="eyebrow" data-reveal="up">
          What I did
        </p>
        <ol className={s.points} data-reveal="stagger">
          {project.points.map((p, i) => (
            <li key={p}>
              <span className={s.pointIndex}>{String(i + 1).padStart(2, '0')}</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </section>

      <nav className={`container ${s.next}`} aria-label="Next project">
        <TransitionLink href={`/work/${next.slug}`} className={`${s.nextCard} gs`} data-cursor="view" data-cursor-label="Next">
          <div className={s.nextText}>
            <span className="eyebrow">Next project</span>
            <span className={s.nextTitle}>
              <span className="u-link">{next.title}</span>
            </span>
            <span className={s.nextKicker}>{next.kicker}</span>
          </div>
          <div className={s.nextMedia} data-reveal="image-right">
            <Image src={next.image} alt="" fill sizes="(max-width: 768px) 100vw, 40vw" />
          </div>
        </TransitionLink>
      </nav>
      <Footer />
    </article>
  );
}
