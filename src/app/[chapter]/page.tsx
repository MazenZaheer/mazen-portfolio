import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import GlassTabs from '@/components/GlassTabs';
import ProjectGrid from '@/components/ProjectGrid';
import ProjectList from '@/components/ProjectList';
import SectionHead from '@/components/SectionHead';
import SlideStack from '@/components/SlideStack';
import TagBlock from '@/components/TagBlock';
import TransitionLink from '@/components/TransitionLink';
import {
  chapters,
  competitions,
  courses,
  fellowships,
  panels,
  projects,
  research,
  roles,
  services,
  site,
  skillGroups,
  stats,
} from '@/content/site';
import s from './chapter.module.css';

type Params = { chapter: string };

const pad = (n: number) => String(n).padStart(2, '0');

export function generateStaticParams(): Params[] {
  return chapters.map((c) => ({ chapter: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { chapter } = await params;
  const c = chapters.find((x) => x.id === chapter);
  return c ? { title: c.title, description: c.note } : {};
}

/** Each carousel chapter opens here; the homepage itself is only the carousel. */
export default async function ChapterPage({ params }: { params: Promise<Params> }) {
  const { chapter } = await params;
  const i = chapters.findIndex((c) => c.id === chapter);
  if (i === -1) notFound();
  const current = chapters[i];
  const prev = chapters[(i - 1 + chapters.length) % chapters.length];
  const next = chapters[(i + 1) % chapters.length];
  const n = i + 1;

  return (
    <div id="top" className={s.page}>
      <nav className={`container ${s.bar}`} aria-label="Chapters" data-reveal="up">
        <TransitionLink href="/" className={s.barLink}>
          ← <span className="u-link">Index</span>
        </TransitionLink>
        <span className={s.barTitle}>
          <b>{pad(n)}</b> / {pad(chapters.length)} · {current.title}
        </span>
        <span className={s.barSide}>
          <TransitionLink href={`/${prev.id}`} className={s.barLink} aria-label={`Previous: ${prev.title}`}>
            <span className="u-link">Prev</span>
          </TransitionLink>
          <TransitionLink href={`/${next.id}`} className={s.barLink} aria-label={`Next: ${next.title}`}>
            <span className="u-link">Next</span> →
          </TransitionLink>
        </span>
      </nav>

      <div className={s.body}>
        <Section id={current.id} n={n} />
      </div>

      <nav className={`container ${s.next}`} aria-label="Next chapter">
        <TransitionLink href={`/${next.id}`} className={`${s.nextCard} gs`} data-cursor="view" data-cursor-label="Next">
          <div className={s.nextText}>
            <span className="eyebrow">
              <b>{pad(((i + 1) % chapters.length) + 1)}</b> Next chapter
            </span>
            <span className={s.nextTitle}>
              <span className="u-link">{next.title}</span>
            </span>
            <span className={s.nextNote}>{next.note}</span>
          </div>
          <div className={s.nextMedia} data-reveal="image-right">
            <Image src={next.image} alt="" fill sizes="(max-width: 768px) 100vw, 40vw" />
          </div>
        </TransitionLink>
      </nav>

      <Footer />
    </div>
  );
}

function Section({ id, n }: { id: string; n: number }) {
  switch (id) {
    case 'about':
      return (
        <section className={`section container ${s.intro}`}>
          <p className="eyebrow" data-reveal="up">
            <b>({pad(n)})</b> About
          </p>
          <p className={s.statement} data-reveal="lines">
            {site.statement}
          </p>
          <dl className={s.stats} data-reveal="stagger">
            {stats.map((st) => (
              <div key={st.label} className={s.stat}>
                <dt className={s.statLabel}>{st.label}</dt>
                <dd
                  className={s.statValue}
                  data-count={st.value}
                  data-decimals={st.decimals ?? 0}
                  data-suffix={st.suffix ?? ''}
                  data-group={st.group === false ? 'false' : undefined}
                >
                  {st.value.toLocaleString('en-US', {
                    minimumFractionDigits: st.decimals ?? 0,
                    useGrouping: st.group !== false,
                  })}
                  {st.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      );

    case 'academia':
      return <SlideStack panels={panels.filter((p) => p.id === 'academia' || p.id === 'xmum')} startIndex={n} />;

    case 'mun':
    case 'counselling':
      return <SlideStack panels={panels.filter((p) => p.id === id)} startIndex={n} />;

    case 'research':
      return (
        <section className="section container">
          <SectionHead
            index={n}
            label="Research"
            title="Physics at the beamline, psychology on the page."
            intro="Two very different questions: how many neutrons come off a tungsten target, and how people cope with being small in a very large universe."
          />
          <ProjectGrid projects={research} variant="wide" />
        </section>
      );

    case 'projects':
      return (
        <section className="section container">
          <SectionHead
            index={n}
            label="Projects"
            title="Products and programmes, measured."
            intro="Health tech, conservation, an international olympiad and a wearable. Hover for colour; click for the numbers."
          />
          <ProjectGrid projects={projects} startIndex={research.length} />
        </section>
      );

    case 'management':
      return (
        <section className="section container">
          <SectionHead
            index={n}
            label="Project Management"
            title="Six teams, one habit: ship it."
            intro="Coordinating volunteers, coaching cohorts and running content, from Lahore to remote teams across time zones."
          />
          <ProjectList items={roles} />
        </section>
      );

    case 'enrichment':
      return (
        <section className="section container theme-dark">
          <SectionHead
            index={n}
            label="Enrichment"
            title="Fellowships & olympiads."
            intro="Selective programmes and international competitions across physics, research, language and debate."
          />
          <div className={s.columns}>
            <RowList title="Fellowships & programmes" rows={fellowships} />
            <RowList title="Competitions & olympiads" rows={competitions} />
          </div>
        </section>
      );

    case 'courses':
      return (
        <section className="section container">
          <SectionHead
            index={n}
            label="Courses"
            title="Always enrolled in something."
            intro="Industry short courses from telecom to enterprise UX, alongside fellowships and astrophysics."
          />
          <RowList rows={courses} large />
        </section>
      );

    case 'services':
      return (
        <section className={`section theme-dark ${s.services}`}>
          <div className={s.servicesBg} aria-hidden data-parallax="0.12">
            <Image src={site.servicesImage} alt="" fill sizes="100vw" className={s.servicesImage} />
          </div>
          <div className="container">
            <SectionHead
              index={n}
              label="Services"
              title="What I can take off your plate."
              intro="Four ways to work together. Pick a tab, or click a card peeking out behind the front one."
            />
            <GlassTabs items={services} email={site.email} />
          </div>
        </section>
      );

    case 'skills':
      return (
        <section className="section container">
          <SectionHead
            index={n}
            label="Skills"
            title="Toolkit, loosely sorted."
            intro="Pick them up, throw them around, stack them however you like."
          />
          <div data-reveal="up">
            <TagBlock groups={skillGroups} />
          </div>
        </section>
      );

    default:
      return null;
  }
}

function RowList({ title, rows, large }: { title?: string; rows: { name: string; meta: string }[]; large?: boolean }) {
  return (
    <div>
      {title && (
        <h3 className={s.rowTitle} data-reveal="up">
          {title}
        </h3>
      )}
      <ul className={s.rows} data-large={large} data-reveal="stagger">
        {rows.map((r) => (
          <li key={r.name} className={s.row}>
            <span className={s.rowName}>{r.name}</span>
            <span className={s.rowMeta}>{r.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
