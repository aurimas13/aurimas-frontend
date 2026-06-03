import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'lt', name: 'Lietuvių' },
    { code: 'fr', name: 'Français' },
  ] as const;

  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-mono uppercase text-[11px] tracking-[0.22em] text-ink-soft hover:text-ink transition-colors py-2 px-1"
        aria-label="Switch language"
      >
        {languages.map((l, i) => (
          <span key={l.code}>
            <span className={l.code === currentLanguage ? 'text-ink' : ''}>{l.code.toUpperCase()}</span>
            {i < languages.length - 1 && <span className="text-ink-faint mx-1">·</span>}
          </span>
        ))}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-paper border border-[rgba(26,22,18,0.32)] py-1 shadow-[0_18px_40px_-20px_rgba(26,22,18,0.35)] z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                changeLanguage(language.code as 'en' | 'lt' | 'fr');
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 flex items-baseline justify-between transition-colors hover:bg-paper-deep ${
                currentLanguage === language.code ? 'text-ink' : 'text-ink-soft'
              }`}
            >
              <span className="font-display text-[15px]" style={{ fontVariationSettings: '"opsz" 18, "wght" 480' }}>
                {language.name}
              </span>
              <span className="font-mono uppercase text-[10px] tracking-[0.22em] text-ink-mute">
                {language.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
