import React, { useState } from 'react';
import { Github, Linkedin, Mail, Facebook, Instagram, Twitter, Youtube, Camera, Music, Activity, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const projectSlugs = ['cleartrace', 'aegis', 'gateway', 'agentic'];

const socials = [
  { Icon: Github,    url: 'https://github.com/aurimas13',                   label: 'GitHub' },
  { Icon: Linkedin,  url: 'https://www.linkedin.com/in/aurimasnausedas/',   label: 'LinkedIn' },
  { Icon: Twitter,   url: 'https://x.com/reksas13',                          label: 'X' },
  { Icon: Instagram, url: 'https://www.instagram.com/reksas13/',             label: 'Instagram' },
  { Icon: Facebook,  url: 'https://www.facebook.com/auris13/',               label: 'Facebook' },
  { Icon: Youtube,   url: 'https://www.youtube.com/@aurimas13',              label: 'YouTube' },
  { Icon: Camera,    url: 'https://unsplash.com/@aurimas13',                 label: 'Unsplash' },
  { Icon: Music,     url: 'https://open.spotify.com/user/aurimas.n',         label: 'Spotify' },
  { Icon: Activity,  url: 'https://www.strava.com/athletes/aurimas13',       label: 'Strava' },
];

export function Footer() {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <footer className="border-t border-[rgba(26,22,18,0.32)] mt-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <h3
              className="display-md text-ink mb-4"
              style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontVariationSettings: '"opsz" 60, "wght" 480' }}
            >
              Aurimas Nausėdas
            </h3>
            <p className="text-ink-soft max-w-[42ch] leading-relaxed text-[15px]">
              {t.footer.description}
            </p>

            <div className="hairline-strong mt-8 mb-4 max-w-md" />
            <a href="mailto:aurimas.nausedas@proton.me" className="link-ink font-mono uppercase text-[11px] tracking-[0.22em]">
              aurimas.nausedas@proton.me ↗
            </a>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <h5 className="meta uppercase tracking-[0.22em] mb-4">{t.footer.quickLinks}</h5>
            <ul className="flex flex-col gap-2.5">
              <li><a href="/#about" className="text-[14px] text-ink-soft hover:text-ink transition-colors">{t.navigation.about}</a></li>
              <li><a href="/#blog" className="text-[14px] text-ink-soft hover:text-ink transition-colors">{t.navigation.blog}</a></li>
              <li><a href="/#gallery" className="text-[14px] text-ink-soft hover:text-ink transition-colors">{t.navigation.gallery}</a></li>
              <li><a href="/#contact" className="text-[14px] text-ink-soft hover:text-ink transition-colors">{t.navigation.contact}</a></li>
              <li><a href="/#support" className="text-[14px] text-ink-soft hover:text-ink transition-colors">{t.navigation.support}</a></li>
            </ul>
          </div>

          {/* Projects */}
          <div className="md:col-span-2">
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="meta uppercase tracking-[0.22em] mb-4 flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              {t.navigation.projects}
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${projectsOpen ? 'rotate-180' : ''}`} />
            </button>
            {projectsOpen && (
              <ul className="flex flex-col gap-2.5">
                {projectSlugs.map((slug) => {
                  const item = (t.projects as any).items[slug];
                  return (
                    <li key={slug}>
                      <Link to={`/projects/${slug}`} className="text-[14px] text-ink-soft hover:text-ink transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
                <li className="pt-1">
                  <Link to="/projects" className="font-mono uppercase text-[11px] tracking-[0.18em] text-ink hover:text-oxblood transition-colors">
                    All projects ↗
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Elsewhere */}
          <div className="md:col-span-3">
            <h5 className="meta uppercase tracking-[0.22em] mb-4">{t.footer.connect}</h5>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
              {socials.map(({ Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target={url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="group inline-flex items-baseline gap-2 text-ink-soft hover:text-ink transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 self-center" />
                  <span className="text-[13px] border-b border-transparent group-hover:border-ink transition-colors">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-16 pt-6 border-t border-[rgba(26,22,18,0.14)] flex flex-col md:flex-row justify-between gap-4 font-mono uppercase text-[10px] tracking-[0.22em] text-ink-mute">
          <span>© {new Date().getFullYear()} Aurimas Nausėdas · {t.footer.allRights}</span>
          <span>Set in Fraunces · General Sans · JetBrains Mono</span>
          <span>Vol. 01 · Cream paper edition</span>
        </div>
      </div>
    </footer>
  );
}
