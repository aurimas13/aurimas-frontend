import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const projectSlugs = ['cleartrace', 'aegis', 'gateway', 'agentic'] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const location = useLocation();
  const projects = (t.projects as any).items;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleNavigation = (sectionId: string) => {
    setIsMenuOpen(false);
    if (typeof window === 'undefined') {
      scrollToSection(sectionId);
      return;
    }
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    const targetHash = `#${sectionId}`;
    if (!isHomePage) {
      window.location.href = `/${targetHash}`;
      return;
    }
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
    scrollToSection(sectionId);
  };

  const navItem = (label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      className="relative font-mono uppercase text-[11px] tracking-[0.18em] text-ink-soft hover:text-ink transition-colors py-2 group"
    >
      {label}
      <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-ink scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
    </button>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/90 backdrop-blur-md border-b border-[rgba(26,22,18,0.14)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Mark */}
          <Link to="/" className="flex items-baseline gap-2 group">
            <span className="font-display text-[18px] font-semibold text-ink" style={{ fontVariationSettings: '"opsz" 14, "wght" 600, "SOFT" 50, "WONK" 1' }}>
              A
            </span>
            <span className="font-mono uppercase text-[10px] tracking-[0.22em] text-ink-mute group-hover:text-ink transition-colors">
              · Nausėdas
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navItem(t.navigation.home, () => handleNavigation('hero'))}
            {navItem(t.navigation.about, () => handleNavigation('about'))}
            {navItem(t.navigation.blog, () => handleNavigation('blog'))}
            {navItem(t.navigation.gallery, () => handleNavigation('gallery'))}
            {navItem(t.navigation.contact, () => handleNavigation('contact'))}
            {navItem(t.navigation.support, () => handleNavigation('support'))}

            {/* Projects */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                setProjectsDropdownOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimeout.current = setTimeout(() => setProjectsDropdownOpen(false), 150);
              }}
            >
              <Link
                to="/projects"
                className="relative font-mono uppercase text-[11px] tracking-[0.18em] text-ink-soft hover:text-ink transition-colors py-2 inline-flex items-center group"
              >
                {t.navigation.projects}
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${projectsDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-ink scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
              {projectsDropdownOpen && (
                <div className="absolute top-full right-0 pt-3 z-50">
                  <div className="bg-paper border border-[rgba(26,22,18,0.32)] py-2 w-72 shadow-[0_18px_40px_-20px_rgba(26,22,18,0.35)]">
                    <div className="px-4 py-2 font-mono uppercase text-[10px] tracking-[0.22em] text-ink-mute border-b border-[rgba(26,22,18,0.14)]">
                      The Project Index
                    </div>
                    {projectSlugs.map((slug, i) => (
                      <Link
                        key={slug}
                        to={`/projects/${slug}`}
                        className="flex items-baseline gap-3 px-4 py-3 hover:bg-paper-deep transition-colors group/item"
                        onClick={() => setProjectsDropdownOpen(false)}
                      >
                        <span className="font-mono text-[11px] text-ink-mute w-5">{String(i + 1).padStart(2, '0')}</span>
                        <span>
                          <span className="font-display text-[16px] text-ink block leading-tight" style={{ fontVariationSettings: '"opsz" 24, "wght" 500' }}>
                            {projects[slug].name}
                          </span>
                          <span className="text-[12px] text-ink-mute block mt-0.5">{projects[slug].tagline}</span>
                        </span>
                      </Link>
                    ))}
                    <div className="border-t border-[rgba(26,22,18,0.14)] mt-1">
                      <Link
                        to="/projects"
                        className="flex items-center justify-between px-4 py-2.5 font-mono uppercase text-[11px] tracking-[0.18em] text-ink hover:bg-paper-deep transition-colors"
                        onClick={() => setProjectsDropdownOpen(false)}
                      >
                        <span>All Projects</span>
                        <span>↗</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-ink-soft hover:text-ink transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[rgba(26,22,18,0.14)] py-3">
            <div className="flex flex-col">
              {[
                ['hero', t.navigation.home],
                ['about', t.navigation.about],
                ['blog', t.navigation.blog],
                ['gallery', t.navigation.gallery],
                ['contact', t.navigation.contact],
                ['support', t.navigation.support],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => handleNavigation(id as string)}
                  className="text-left font-mono uppercase text-[11px] tracking-[0.18em] text-ink-soft hover:text-ink py-3 border-b border-[rgba(26,22,18,0.06)] transition-colors"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                className="flex items-center justify-between font-mono uppercase text-[11px] tracking-[0.18em] text-ink-soft hover:text-ink py-3 border-b border-[rgba(26,22,18,0.06)] transition-colors"
              >
                {t.navigation.projects}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${mobileProjectsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileProjectsOpen && (
                <div className="pl-4 py-2 border-b border-[rgba(26,22,18,0.06)]">
                  {projectSlugs.map((slug, i) => (
                    <Link
                      key={slug}
                      to={`/projects/${slug}`}
                      className="flex items-baseline gap-3 py-2 group"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setMobileProjectsOpen(false);
                      }}
                    >
                      <span className="font-mono text-[10px] text-ink-mute">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-[15px] text-ink group-hover:text-oxblood transition-colors" style={{ fontVariationSettings: '"opsz" 24, "wght" 500' }}>
                        {projects[slug].name}
                      </span>
                    </Link>
                  ))}
                  <Link
                    to="/projects"
                    className="block py-2 font-mono uppercase text-[11px] tracking-[0.18em] text-ink"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setMobileProjectsOpen(false);
                    }}
                  >
                    All Projects ↗
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
