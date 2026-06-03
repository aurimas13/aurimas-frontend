import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertCircle, Github } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const projectMeta: Record<string, { url: string; github: string; index: string }> = {
  cleartrace: { url: 'https://cleartrace.aurimas.io', github: 'https://github.com/aurimas13/ClearTrace',    index: '01' },
  aegis:      { url: 'https://aegis.aurimas.io',      github: 'https://github.com/aurimas13/Aegis_AI',        index: '02' },
  gateway:    { url: 'https://gateway.aurimas.io',    github: 'https://github.com/aurimas13/AI_Platform',     index: '03' },
  agentic:    { url: 'https://agentic.aurimas.io',    github: 'https://github.com/aurimas13/web_application', index: '04' },
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
            <span className="meta uppercase tracking-[0.2em]">{slug}.aurimas.io</span>
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
