import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const projectLinks = [
  { slug: 'cleartrace', url: 'https://cleartrace.aurimas.io', github: 'https://github.com/aurimas13/ClearTrace', stack: 'PYTHON · NEO4J · LLM' },
  { slug: 'aegis',      url: 'https://aegis.aurimas.io',      github: 'https://github.com/aurimas13/Aegis_AI',      stack: 'NEXT.JS · POSTGRES' },
  { slug: 'gateway',    url: 'https://gateway.aurimas.io',    github: 'https://github.com/aurimas13/AI_Platform',   stack: 'REACT · SUPABASE · A/B' },
  { slug: 'agentic',    url: 'https://agentic.aurimas.io',    github: 'https://github.com/aurimas13/web_application', stack: 'EXPO · OPENAI' },
];

interface HeroProps {
  onSectionChange: (section: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSectionChange }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const items = (t.projects as any).items;

  const handleScrollTo = (id: string) => {
    onSectionChange(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Hero — asymmetric grid: type column + portrait/margin-note column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20 items-end pt-10">
          {/* Left: type */}
          <div>
            <div className="reveal reveal-d2 flex items-center gap-3 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-oxblood shadow-[0_0_0_4px_rgba(122,31,31,0.12)]" />
              <span className="eyebrow">— Field notes from the lab bench</span>
            </div>

            <h1
              className="reveal reveal-d3 display-xl text-ink"
              style={{ fontSize: 'clamp(56px, 9vw, 132px)', fontVariationSettings: '"opsz" 144, "wght" 360, "SOFT" 30, "WONK" 1' }}
            >
              {t.hero.greeting} <span className="italic-accent" style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 100, "WONK" 1' }}>I'm</span><br />
              <span style={{ display: 'inline-block' }}>Aurimas.</span>
            </h1>

            <p
              className="reveal reveal-d4 mt-7 max-w-[640px] text-ink-soft"
              style={{ fontFamily: 'var(--font-display)', fontVariationSettings: '"opsz" 18, "wght" 400', fontSize: 'clamp(20px, 2.4vw, 26px)', lineHeight: 1.45 }}
            >
              {t.hero.subtitle}.
            </p>

            <p className="reveal reveal-d5 mt-5 max-w-[620px] text-ink-soft text-[16px] leading-[1.6]">
              {t.hero.description}
            </p>

            <div className="reveal reveal-d6 mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => handleScrollTo('about')}
                className="btn btn-primary"
              >
                {t.hero.cta}
                <span aria-hidden>→</span>
              </button>
              <Link to="/projects" className="btn btn-ghost">
                {t.projects.title}
              </Link>
            </div>
          </div>

          {/* Right: framed portrait + margin note */}
          <div className="reveal reveal-d4 relative">
            <div className="relative">
              {/* Frame */}
              <div className="border border-[rgba(26,22,18,0.32)] bg-paper p-3">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/basketball.jpg"
                    alt="Aurimas Nausėdas"
                    className="w-full h-full object-cover object-center grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                    style={{ filter: 'sepia(8%) contrast(1.02)' }}
                  />
                </div>
                <div className="flex items-center justify-between pt-3 px-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                  <span>Plate i</span>
                  <span>Aurimas · 2026</span>
                </div>
              </div>

              {/* Caption / margin-note below */}
              <aside className="marginnote mt-8 ml-0">
                <h4>Currently</h4>
                <div className="row"><span>Open to</span><b>AI Engineer roles</b></div>
                <div className="row"><span>Based in</span><b>Vilnius / Remote</b></div>
                <div className="row"><span>Stack</span><b>Py · TS · LLMs</b></div>
                <div className="row"><span>Reading</span><b>Stoner</b></div>
              </aside>
            </div>
          </div>
        </div>

        {/* Project Index */}
        <div className="mt-28 reveal reveal-d7">
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[rgba(26,22,18,0.32)]">
            <h2 className="display-md text-ink" style={{ fontVariationSettings: '"opsz" 60, "wght" 440' }}>
              The Project Index
            </h2>
            <span className="meta uppercase tracking-[0.2em]">{projectLinks.length} entries · live</span>
          </div>

          <div className="index-list">
            {projectLinks.map((p, i) => {
              const item = items[p.slug];
              const [first, ...rest] = item.name.split(' ');
              return (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="index-row group"
                >
                  <div className="num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="name">
                    {first}{rest.length > 0 && <> <em>{rest.join(' ')}</em></>}
                  </div>
                  <div className="desc">{item.tagline}</div>
                  <div className="stack">{p.stack}</div>
                  <div className="go">Read ↗</div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
            <span>Tip:</span>
            <a href={projectLinks[0].url} target="_blank" rel="noopener noreferrer" className="text-ink-soft hover:text-ink border-b border-transparent hover:border-ink transition-colors">Open live site ↗</a>
            <Link to="/projects" className="text-ink-soft hover:text-ink border-b border-transparent hover:border-ink transition-colors">All projects →</Link>
          </div>
        </div>
      </div>
    </section>
  );
};
