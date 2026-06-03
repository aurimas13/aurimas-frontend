import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

export const SupportSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get('payment') === 'cancelled') {
      setPaymentError('Payment was canceled. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <section id="support" className="py-28 surface-deep border-t border-b border-[rgba(26,22,18,0.32)]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 mb-12">
          <div>
            <p className="eyebrow mb-3">{(t.support as any).eyebrow}</p>
            <h2 className="display-md text-ink" style={{ fontVariationSettings: '"opsz" 60, "wght" 440' }}>
              {t.support.title}
            </h2>
          </div>
          <div className="hidden md:block self-end">
            <div className="hairline-strong w-full" />
            <p className="meta uppercase tracking-[0.2em] mt-3">{(t.support as any).patronage}</p>
          </div>
        </div>

        {/* Status */}
        {paymentSuccess && (
          <div className="mb-8 p-5 border border-moss/40 bg-moss/5 flex items-baseline gap-3">
            <CheckCircle className="w-4 h-4 text-moss self-center" />
            <div>
              <p className="font-mono uppercase text-[11px] tracking-[0.22em] text-moss mb-1">Payment received</p>
              <p className="text-[14px] text-ink-soft">Thank you for supporting the work — your contribution means a lot.</p>
            </div>
          </div>
        )}
        {paymentError && (
          <div className="mb-8 p-5 border border-oxblood/40 bg-oxblood/5 flex items-baseline gap-3">
            <XCircle className="w-4 h-4 text-oxblood self-center" />
            <div>
              <p className="font-mono uppercase text-[11px] tracking-[0.22em] text-oxblood mb-1">Payment error</p>
              <p className="text-[14px] text-ink-soft">{paymentError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PayPal */}
          <div className="panel-strong p-8">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="display-sm text-ink" style={{ fontSize: '22px', fontVariationSettings: '"opsz" 36, "wght" 480' }}>
                {t.support.paypal}
              </h3>
              <CreditCard className="w-4 h-4 text-ink-soft" />
            </div>
            <p className="text-ink-soft text-[14px] mb-5">{t.support.paypalDirectMessage}</p>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {[5, 10, 25, 50].map((amount) => (
                <a
                  key={amount}
                  href={`https://www.paypal.com/paypalme/aurimasaleksandras/${amount}EUR`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[rgba(26,22,18,0.32)] py-3 text-center font-mono text-[13px] text-ink hover:bg-ink hover:text-paper transition-colors"
                >
                  €{amount}
                </a>
              ))}
            </div>

            <div className="mb-5">
              <label className="field-label" htmlFor="paypal-custom-amount">{t.support.customAmount}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute font-mono">€</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    id="paypal-custom-amount"
                    placeholder={t.support.enterAmount}
                    className="field pl-8"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const amount = input.value;
                        if (amount && parseFloat(amount) >= 1) {
                          window.open(`https://www.paypal.com/paypalme/aurimasaleksandras/${amount}EUR`, '_blank');
                        } else {
                          alert('Please enter an amount of €1 or more');
                        }
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    const input = document.getElementById('paypal-custom-amount') as HTMLInputElement;
                    const amount = input?.value;
                    if (amount && parseFloat(amount) >= 1) {
                      window.open(`https://www.paypal.com/paypalme/aurimasaleksandras/${amount}EUR`, '_blank');
                    } else {
                      alert('Please enter an amount of €1 or more');
                    }
                  }}
                  className="btn btn-primary !px-5"
                >
                  Send
                </button>
              </div>
            </div>

            <a
              href="https://www.paypal.com/paypalme/aurimasaleksandras"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full !justify-center"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Open PayPal.me
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Bank transfer */}
          <div className="panel-strong p-8">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="display-sm text-ink" style={{ fontSize: '22px', fontVariationSettings: '"opsz" 36, "wght" 480' }}>
                {t.support.bankTransferTitle}
              </h3>
              <Banknote className="w-4 h-4 text-ink-soft" />
            </div>
            <p className="text-ink-soft text-[14px] mb-5">{t.support.bankTransferDescription}</p>

            <dl className="border border-[rgba(26,22,18,0.32)]">
              {[
                ['Account', 'Aurimas Aleksandras Nausedas'],
                ['IBAN',    'DE50100110012072920439'],
                ['BIC',     'NTSBDEB1XXX'],
                ['Bank',    'N26 Bank'],
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  className={`grid grid-cols-[80px_1fr] gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-[rgba(26,22,18,0.14)]' : ''}`}
                >
                  <dt className="meta uppercase tracking-[0.18em] self-center">{label}</dt>
                  <dd className="font-mono text-[13px] text-ink break-all">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="text-[12px] text-ink-mute mt-4 leading-relaxed">{t.support.bankTransferNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
