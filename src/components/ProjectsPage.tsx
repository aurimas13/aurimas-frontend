import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const projectLinks = [
  { slug: '100-days-with-ai', url: 'https://github.com/aurimas13/100-Days-With-AI', github: 'https://github.com/aurimas13/100-Days-With-AI', stack: 'LLMs · AGENTS · DAILY' },
  { slug: 'cleartrace', url: 'https://cleartrace.aurimas.io', github: 'https://github.com/aurimas13/ClearTrace',     stack: 'PYTHON · NEO4J · LLM' },
  { slug: 'aegis',      url: 'https://aegis.aurimas.io',      github: 'https://github.com/aurimas13/Aegis_AI',         stack: 'NEXT.JS · POSTGRES' },
  { slug: 'gateway',    url: 'https://gateway.aurimas.io',    github: 'https://github.com/aurimas13/AI_Platform',      stack: 'REACT · SUPABASE · A/B' },
  { slug: 'agentic',    url: 'https://agentic.aurimas.io',    github: 'https://github.com/aurimas13/web_application',  stack: 'EXPO · OPENAI' },
  { slug: 'machine-learning-goodness', url: 'https://github.com/aurimas13/Machine-Learning-Goodness', github: 'https://github.com/aurimas13/Machine-Learning-Goodness', stack: 'PYTHON · ML/DL · 285★' },
  { slug: 'solutions-to-problems', url: 'https://github.com/aurimas13/Solutions-To-Problems', github: 'https://github.com/aurimas13/Solutions-To-Problems', stack: 'PY · JAVA · SQL' },
];

export const ProjectsPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const projects = (t.projects as any).items;

  return (
    <section className="pt-32 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 reveal reveal-d2">
          <p className="eyebrow mb-3">No. 03 · {projectLinks.length} entries</p>
          <h1 className="display-lg text-ink" style={{ fontSize: 'clamp(48px, 7vw, 96px)', fontVariationSettings: '"opsz" 96, "wght" 420' }}>
            {t.projects.title}.
          </h1>
          <p
            className="font-display text-ink-soft mt-6 max-w-[640px]"
            style={{ fontSize: 'clamp(18px, 2vw, 22px)', lineHeight: 1.5, fontVariationSettings: '"opsz" 18, "wght" 400' }}
          >
            {t.projects.subtitle}
          </p>
        </div>

        {/* Index */}
        <div className="reveal reveal-d3">
          <div className="flex items-baseline justify-between mb-2 pb-3 border-b border-[rgba(26,22,18,0.32)]">
            <span className="meta uppercase tracking-[0.2em]">№</span>
            <span className="meta uppercase tracking-[0.2em] hidden md:block">Project · Tagline</span>
            <span className="meta uppercase tracking-[0.2em] hidden md:block">Description</span>
            <span className="meta uppercase tracking-[0.2em] hidden md:block">Stack</span>
            <span className="meta uppercase tracking-[0.2em]">Open</span>
          </div>

          <div>
            {projectLinks.map((p, i) => {
              const item = projects[p.slug];
              const [first, ...rest] = item.name.split(' ');
              return (
                <div key={p.slug} className="border-b border-[rgba(26,22,18,0.14)]">
                  <Link
                    to={`/projects/${p.slug}`}
                    className="index-row group !border-b-0"
                  >
                    <div className="num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="name">
                      {first}{rest.length > 0 && <> <em>{rest.join(' ')}</em></>}
                      <span className="block text-[12px] font-mono uppercase tracking-[0.18em] text-ink-mute mt-1">
                        {item.tagline}
                      </span>
                    </div>
                    <div className="desc">{item.description}</div>
                    <div className="stack">{p.stack}</div>
                    <div className="go">Read ↗</div>
                  </Link>
                  <div className="px-2 pb-5 -mt-2 flex flex-wrap gap-3 text-[11px]">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em] text-ink-soft hover:text-ink border-b border-transparent hover:border-ink transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {t.projects.viewProject}
                    </a>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em] text-ink-soft hover:text-ink border-b border-transparent hover:border-ink transition-colors"
                    >
                      <Github className="w-3 h-3" />
                      Source
                    </a>
                    <Link
                      to={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em] text-ink-soft hover:text-ink border-b border-transparent hover:border-ink transition-colors"
                    >
                      {t.projects.viewCaseStudy}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
