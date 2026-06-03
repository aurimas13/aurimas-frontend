import React, { useState } from 'react';
import { Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

export const ContactSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert(t.contact.fillAllFields);
      return;
    }
    setIsSubmitting(true);
    setShowError(false);
    try {
      const response = await fetch('https://formspree.io/f/xzzvbzwg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email,
          _subject: `Contact Form: ${formData.subject}`,
        }),
      });
      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 mb-12">
          <div>
            <p className="eyebrow mb-3">{(t.contact as any).eyebrow}</p>
            <h2 className="display-md text-ink" style={{ fontVariationSettings: '"opsz" 60, "wght" 440' }}>
              {t.contact.title}
            </h2>
          </div>
          <div className="hidden md:block self-end">
            <div className="hairline-strong w-full" />
            <p className="meta uppercase tracking-[0.2em] mt-3">{t.contact.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16">
          {/* Left: contact info */}
          <div>
            <h3 className="display-sm text-ink mb-6" style={{ fontSize: '24px', fontVariationSettings: '"opsz" 36, "wght" 480' }}>
              {t.contact.getInTouch}
            </h3>

            <div className="space-y-8">
              {[
                { Icon: Mail,           label: t.contact.email,         value: 'aurimas.nausedas@proton.me', href: 'mailto:aurimas.nausedas@proton.me' },
                { Icon: MapPin,         label: t.contact.location,      value: t.contact.locationValue },
                { Icon: MessageCircle,  label: t.contact.responseTime,  value: t.contact.responseTimeValue },
              ].map(({ Icon, label, value, href }, i) => (
                <div key={i} className="flex items-start gap-4 pb-6 border-b border-[rgba(26,22,18,0.14)]">
                  <Icon className="w-4 h-4 mt-1.5 text-ink-soft" />
                  <div>
                    <p className="meta uppercase tracking-[0.22em] mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="link-ink text-[15px]">{value}</a>
                    ) : (
                      <p className="text-ink text-[15px]">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="panel-strong p-8 sm:p-10">
            <h3 className="display-sm text-ink mb-2" style={{ fontSize: '24px', fontVariationSettings: '"opsz" 36, "wght" 480' }}>
              {t.contact.sendMessage}
            </h3>
            <p className="text-ink-soft text-[14px] mb-7">{(t.contact as any).noteArrives}</p>

            {showSuccess && (
              <div className="mb-6 p-4 border border-moss/40 bg-moss/5">
                <p className="font-mono uppercase text-[11px] tracking-[0.18em] text-moss mb-1">✓ {t.contact.messageSent}</p>
                <p className="text-[14px] text-ink-soft">{t.contact.confirmationMessage}</p>
              </div>
            )}
            {showError && (
              <div className="mb-6 p-4 border border-oxblood/40 bg-oxblood/5">
                <p className="font-mono uppercase text-[11px] tracking-[0.18em] text-oxblood">{t.contact.errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="field-label">{t.contact.name}</label>
                  <input
                    type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                    required disabled={isSubmitting} placeholder={t.contact.yourName}
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="field-label">{t.contact.email}</label>
                  <input
                    type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                    required disabled={isSubmitting} placeholder={t.contact.yourEmail}
                    className="field"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="field-label">{t.contact.subject}</label>
                <input
                  type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange}
                  required disabled={isSubmitting} placeholder={t.contact.subjectPlaceholder}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="message" className="field-label">{t.contact.message}</label>
                <textarea
                  id="message" name="message" value={formData.message} onChange={handleChange}
                  required disabled={isSubmitting} rows={6} placeholder={t.contact.messagePlaceholder}
                  className="field resize-none"
                />
              </div>
              <button
                type="submit" disabled={isSubmitting}
                className={`btn ${isSubmitting ? 'btn-ghost opacity-60 cursor-not-allowed' : 'btn-primary'}`}
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? t.contact.sending : t.contact.sendMessageButton}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
