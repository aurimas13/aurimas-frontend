import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertCircle, Github } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

interface ProjectMeta {
  url: string;
  github: string;
  index: string;
  domain?: string;
  /** Image paths under /public; captions come from translations (`screenshotCaptions`). */
  screenshots?: string[];
  /** Secondary plates layout; 'wide-narrow' suits a desktop + mobile pair. Defaults to even columns. */
  plateGrid?: 'even' | 'wide-narrow';
}

const projectMeta: Record<string, ProjectMeta> = {
  'code-editing-agent': {
    url: 'https://code.aurimas.io',
    github: 'https://github.com/aurimas13/Code-Editing-Agent',
    index: '01',
    domain: 'code.aurimas.io',
    screenshots: [
      '/projects/code-editing-agent/playground.png',
      '/projects/code-editing-agent/guide.png',
      '/projects/code-editing-agent/home.png',
    ],
  },
  'claude-agent-from-scratch': {
    url: 'https://agent.aurimas.io',
    github: 'https://github.com/aurimas13/Claude-Agent-From-Scratch',
    index: '02',
    domain: 'agent.aurimas.io',
    screenshots: [
      '/projects/claude-agent-from-scratch/demo.gif',
      '/projects/claude-agent-from-scratch/multi-step.png',
      '/projects/claude-agent-from-scratch/weather.png',
      '/projects/claude-agent-from-scratch/memory-and-cache.png',
      '/projects/claude-agent-from-scratch/how-it-works.png',
    ],
  },
  'calculator-agent': {
    url: 'https://calculator.aurimas.io',
    github: 'https://github.com/aurimas13/Calculator-Agent',
    index: '03',
    domain: 'calculator.aurimas.io',
    plateGrid: 'wide-narrow',
    screenshots: [
      '/projects/calculator-agent/demo.gif',
      '/projects/calculator-agent/screenshot-light.png',
      '/projects/calculator-agent/screenshot-mobile.png',
    ],
  },
  '100-days-with-ai': { url: 'https://github.com/aurimas13/100-Days-With-AI', github: 'https://github.com/aurimas13/100-Days-With-AI', index: '04', domain: 'github.com/aurimas13' },
  cleartrace: { url: 'https://cleartrace.aurimas.io', github: 'https://github.com/aurimas13/ClearTrace',    index: '05' },
  aegis:      { url: 'https://aegis.aurimas.io',      github: 'https://github.com/aurimas13/Aegis_AI',        index: '06' },
  gateway:    { url: 'https://gateway.aurimas.io',    github: 'https://github.com/aurimas13/AI_Platform',     index: '07' },
  agentic:    { url: 'https://agentic.aurimas.io',    github: 'https://github.com/aurimas13/web_application', index: '08' },
  'machine-learning-goodness': { url: 'https://github.com/aurimas13/Machine-Learning-Goodness', github: 'https://github.com/aurimas13/Machine-Learning-Goodness', index: '09', domain: 'github.com/aurimas13' },
  'solutions-to-problems': { url: 'https://github.com/aurimas13/Solutions-To-Problems', github: 'https://github.com/aurimas13/Solutions-To-Problems', index: '10', domain: 'github.com/aurimas13' },
};

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

interface PlateProps {
  src: string;
  alt: string;
  label: string;
  caption?: string;
}

/** A framed screenshot. Portrait images are height-capped and centred so tall captures don't dominate the page. */
const Plate: React.FC<PlateProps> = ({ src, alt, label, caption }) => {
  const [portrait, setPortrait] = React.useState(false);
  return (
    <figure className="border border-[rgba(26,22,18,0.32)] bg-paper p-3 m-0 flex flex-col">
      <div className={portrait ? 'flex items-center justify-center bg-[rgba(26,22,18,0.03)]' : ''}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={(e) => setPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth)}
          className={portrait ? 'max-h-[560px] w-auto h-auto block' : 'w-full h-auto block'}
        />
      </div>
      <figcaption className="pt-3 px-1 flex items-baseline justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute whitespace-nowrap">{label}</span>
        {caption && <span className="text-[12px] text-ink-mute text-right leading-snug">{caption}</span>}
      </figcaption>
    </figure>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode; index: string }> = ({
  title,
  children,
  index,
}) => (
  <section className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12 py-10 border-t border-[rgba(26,22,18,0.14)]">
    <div>
      <p className="meta uppercase tracking-[0.2em]">{index}</p>
    </div>
    <div>
      <h2
        className="display-sm text-ink mb-4"
        style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontVariationSettings: '"opsz" 36, "wght" 480' }}
      >
        {title}
      </h2>
      <div
        className="font-display text-ink leading-[1.65]"
        style={{ fontSize: '18px', fontVariationSettings: '"opsz" 14, "wght" 400' }}
      >
        {children}
      </div>
    </div>
  </section>
);

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const projects = (t.projects as any).items;

  if (!slug || !projects[slug]) {
    return (
      <section className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-ink-mute mx-auto mb-4" />
          <h1 className="display-md text-ink mb-3">Project not found</h1>
          <Link to="/projects" className="link-ink font-mono uppercase text-[12px] tracking-[0.18em]">
            ← {t.projects.backToProjects}
          </Link>
        </div>
      </section>
    );
  }

  const item = projects[slug];
  const meta = projectMeta[slug];
  const [first, ...rest] = item.name.split(' ');
  const screenshots: string[] = meta.screenshots ?? [];
  const captions: string[] = item.screenshotCaptions ?? [];
  const plateLabel: string = (t.projects as any).plate ?? 'Plate';
  const [leadShot, ...moreShots] = screenshots;
  const plateProps = (src: string, i: number): PlateProps => ({
    src,
    label: `${plateLabel} ${ROMAN[i]}`,
    caption: captions[i],
    alt: captions[i] ?? `${item.name} — ${plateLabel} ${ROMAN[i]}`,
  });
  // Two secondary plates read best as wide + narrow; more than two fall into even columns.
  const gridCols = meta.plateGrid === 'wide-narrow' ? 'md:grid-cols-[3fr_2fr]' : 'md:grid-cols-2';

  return (
    <section className="pt-28 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 mb-12 font-mono uppercase text-[11px] tracking-[0.22em] text-ink-mute hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          {t.projects.backToProjects}
        </Link>

        {/* Header */}
        <div className="reveal reveal-d2 mb-12">
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[rgba(26,22,18,0.32)]">
            <span className="meta uppercase tracking-[0.2em]">{meta.index} · {t.projects.caseStudyLabel}</span>
            <span className="meta uppercase tracking-[0.2em]">{meta.domain ?? `${slug}.aurimas.io`}</span>
          </div>

          <h1
            className="display-xl text-ink"
            style={{ fontSize: 'clamp(48px, 8vw, 112px)', fontVariationSettings: '"opsz" 144, "wght" 360, "SOFT" 30, "WONK" 1' }}
          >
            {first}
            {rest.length > 0 && (
              <>
                {' '}
                <span className="italic-accent" style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 100, "WONK" 1' }}>
                  {rest.join(' ')}
                </span>
              </>
            )}
            .
          </h1>

          <p
            className="font-display text-ink-soft mt-7 max-w-[680px]"
            style={{ fontSize: 'clamp(20px, 2.4vw, 24px)', lineHeight: 1.45, fontVariationSettings: '"opsz" 18, "wght" 400' }}
          >
            {item.tagline}
          </p>

          <p className="mt-6 max-w-[680px] text-ink leading-relaxed text-[17px]">
            {item.description}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href={meta.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {t.projects.viewProject}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href={meta.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <Github className="w-3.5 h-3.5" />
              {t.projects.viewSource}
            </a>
          </div>
        </div>

        {/* Plates / screenshots — only for projects that ship them */}
        {leadShot && (
          <div className="reveal reveal-d3 mb-4">
            <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[rgba(26,22,18,0.32)]">
              <span className="meta uppercase tracking-[0.2em]">{t.projects.screenshots}</span>
              <span className="meta uppercase tracking-[0.2em]">{meta.domain ?? `${slug}.aurimas.io`}</span>
            </div>
            <Plate {...plateProps(leadShot, 0)} />
            {moreShots.length > 0 && (
              <div className={`grid grid-cols-1 ${gridCols} gap-4 mt-4 items-start`}>
                {moreShots.map((src, k) => (
                  <Plate key={src} {...plateProps(src, k + 1)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sections */}
        <div>
          <Section index="i" title={t.projects.problem}>
            <p>{item.problem}</p>
          </Section>

          <Section index="ii" title={t.projects.approach}>
            <p>{item.approach}</p>
          </Section>

          <Section index="iii" title={t.projects.myRole}>
            <p>{item.role}</p>
          </Section>

          <Section index="iv" title={t.projects.techStack}>
            <div className="flex flex-wrap gap-2 not-prose">
              {item.tech.map((tech: string) => (
                <span key={tech} className="tag">{tech}</span>
              ))}
            </div>
          </Section>

          <Section index="v" title={t.projects.outcome}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[rgba(26,22,18,0.14)] border border-[rgba(26,22,18,0.14)] mb-6">
              {item.metrics.map((m: { value: string; label: string }) => (
                <div key={m.label} className="bg-paper p-5 text-center">
                  <p
                    className="display-sm text-ink mb-1"
                    style={{ fontSize: '32px', fontVariationSettings: '"opsz" 36, "wght" 520' }}
                  >
                    {m.value}
                  </p>
                  <p className="meta uppercase tracking-[0.2em]">{m.label}</p>
                </div>
              ))}
            </div>
            <p>{item.outcome}</p>
          </Section>

          <Section index="vi" title={t.projects.whatsNovel}>
            <p>{item.novel}</p>
          </Section>
        </div>

        {/* CTA */}
        <div className="mt-16 surface-deep p-8 sm:p-12 border border-[rgba(26,22,18,0.14)]">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <h2
              className="display-md text-ink"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontVariationSettings: '"opsz" 60, "wght" 440' }}
            >
              {t.projects.liveDemo}
            </h2>
            <span className="meta uppercase tracking-[0.2em]">colophon</span>
          </div>
          <p className="text-ink-soft mb-6 max-w-[560px]">{t.projects.exploreLive}</p>
          <div className="flex flex-wrap gap-3">
            <a href={meta.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {t.projects.viewProject}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href={meta.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <Github className="w-3.5 h-3.5" />
              {t.projects.viewSource}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
