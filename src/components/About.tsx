import React from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

export const About: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handlePDFDownload = async (pdfPath: string, filename: string) => {
    try {
      const response = await fetch(pdfPath, {
        method: 'GET',
        headers: { Accept: 'application/pdf,*/*', 'Cache-Control': 'no-cache' },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(pdfBlob);
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      const newWindow = window.open(pdfPath, '_blank');
      if (!newWindow) {
        alert('Please allow popups to view the PDF, or right-click the button and "Save link as…".');
      }
    }
  };

  const paragraphs = t.about.bio.split('\n\n');
  const [firstParagraph, ...restParagraphs] = paragraphs;

  return (
    <section id="about" className="relative py-28 surface-deep border-t border-b border-[rgba(26,22,18,0.32)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 mb-12">
          <div>
            <p className="eyebrow mb-3">{t.about.eyebrow}</p>
            <h2 className="display-md text-ink" style={{ fontVariationSettings: '"opsz" 60, "wght" 440' }}>
              {t.about.title}
            </h2>
          </div>
          <div className="hidden md:block self-end">
            <div className="hairline-strong w-full" />
            <p className="meta uppercase tracking-[0.2em] mt-3">{t.about.myStory}</p>
          </div>
        </div>

        {/* Letter body */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
          {/* Left: pull-quote */}
          <aside className="md:sticky md:top-28 self-start">
            <p
              className="font-display italic text-ink-soft"
              style={{ fontVariationSettings: '"opsz" 36, "wght" 400, "SOFT" 80, "WONK" 1', fontSize: 'clamp(20px, 2.2vw, 26px)', lineHeight: 1.4 }}
            >
              "{t.about.quoteMantra}"
            </p>
            <p className="meta uppercase tracking-[0.2em] mt-4">{t.about.fromTheDesk}</p>
          </aside>

          {/* Right: text + CV card */}
          <div>
            <div className="space-y-6 max-w-[68ch]">
              <p
                className="font-sans text-ink-soft"
                style={{ fontSize: '17px', lineHeight: 1.75, fontWeight: 400 }}
              >
                {firstParagraph}
              </p>
              {restParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-sans text-ink-soft"
                  style={{ fontSize: '17px', lineHeight: 1.75, fontWeight: 400 }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* CV download — sober box, not a gradient */}
            <div className="mt-12 panel-strong p-6 sm:p-8">
              <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                <h4 className="display-sm" style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}>
                  {t.about.downloadCVShort}
                </h4>
                <span className="meta uppercase tracking-[0.2em]">PDF · 07 Jul 2026</span>
              </div>
              <p className="text-ink-soft text-[15px] mb-6">{t.about.downloadDescription}</p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    handlePDFDownload('/Aurimas_Nausedas_CV_English.pdf', 'Aurimas_Nausedas_CV_English.pdf')
                  }
                  className="btn btn-primary"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.about.download} (EN)
                </button>
                <button
                  onClick={() =>
                    handlePDFDownload('/Aurimas_Nausedas_CV_Lithuanian.pdf', 'Aurimas_Nausedas_CV_Lithuanian.pdf')
                  }
                  className="btn btn-ghost"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.about.download} (LT)
                </button>
                <button
                  onClick={() =>
                    handlePDFDownload('/Aurimas_Nausedas_CV_French.pdf', 'Aurimas_Nausedas_CV_French.pdf')
                  }
                  className="btn btn-ghost"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.about.download} (FR)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
