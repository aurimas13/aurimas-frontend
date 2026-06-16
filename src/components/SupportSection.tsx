import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, CheckCircle, XCircle, ExternalLink, Lock, Loader2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';
const PRESET_AMOUNTS = [5, 10, 25, 50];

export const SupportSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const s = t.support as any;
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Stripe card-checkout state
  const [paymentType, setPaymentType] = useState<'one-time' | 'subscription'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const stripeEnabled = Boolean(API_URL);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('payment') === 'success' || urlParams.get('success') === 'true';
    const cancelled =
      urlParams.get('payment') === 'cancelled' ||
      urlParams.get('canceled') === 'true' ||
      urlParams.get('cancelled') === 'true';

    if (success) {
      setPaymentSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' });
    }
    if (cancelled) {
      setPaymentError('Payment was canceled. You can try again whenever you like.');
      window.history.replaceState({}, document.title, window.location.pathname);
      document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleCardCheckout = async () => {
    const amountEuros = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!amountEuros || isNaN(amountEuros) || amountEuros < 1) {
      setCheckoutError('Please choose an amount of €1 or more.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCheckoutError('Please enter a valid email address, or leave it blank.');
      return;
    }

    setProcessing(true);
    setCheckoutError(null);
    try {
      const res = await fetch(`${API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amountEuros * 100),
          currency: 'eur',
          payment_type: paymentType,
          customer_email: email || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || s.checkoutError);
      }
      window.location.href = data.url as string;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : s.checkoutError);
      setProcessing(false);
    }
  };

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

        {/* Featured: card payment via Stripe Checkout */}
        {stripeEnabled && (
          <div className="panel-strong p-8 mb-6">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="display-sm text-ink" style={{ fontSize: '22px', fontVariationSettings: '"opsz" 36, "wght" 480' }}>
                {s.cardTitle}
              </h3>
              <CreditCard className="w-4 h-4 text-ink-soft" />
            </div>
            <p className="text-ink-soft text-[14px] mb-6">{s.cardDescription}</p>

            {/* One-time / Monthly toggle */}
            <div className="inline-flex border border-[rgba(26,22,18,0.32)] mb-6" role="group" aria-label={s.cardTitle}>
              <button
                type="button"
                onClick={() => setPaymentType('one-time')}
                className={`px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors ${
                  paymentType === 'one-time' ? 'bg-ink text-paper' : 'text-ink hover:bg-[rgba(26,22,18,0.04)]'
                }`}
                aria-pressed={paymentType === 'one-time'}
              >
                {s.oneTimeLabel}
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('subscription')}
                className={`px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] border-l border-[rgba(26,22,18,0.32)] transition-colors ${
                  paymentType === 'subscription' ? 'bg-ink text-paper' : 'text-ink hover:bg-[rgba(26,22,18,0.04)]'
                }`}
                aria-pressed={paymentType === 'subscription'}
              >
                {s.monthlyLabel}
              </button>
            </div>

            {/* Preset amounts */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {PRESET_AMOUNTS.map((amount) => {
                const active = !customAmount && selectedAmount === amount;
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                      setCheckoutError(null);
                    }}
                    className={`border py-3 text-center font-mono text-[13px] transition-colors ${
                      active
                        ? 'border-ink bg-ink text-paper'
                        : 'border-[rgba(26,22,18,0.32)] text-ink hover:bg-ink hover:text-paper'
                    }`}
                  >
                    €{amount}{paymentType === 'subscription' ? '/mo' : ''}
                  </button>
                );
              })}
            </div>

            {/* Custom amount + optional email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="field-label" htmlFor="card-custom-amount">{t.support.customAmount}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute font-mono">€</span>
                  <input
                    id="card-custom-amount"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="decimal"
                    value={customAmount}
                    placeholder={t.support.enterAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setCheckoutError(null);
                    }}
                    className="field pl-8"
                  />
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="card-email">{s.optionalEmail}</label>
                <input
                  id="card-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="field"
                />
              </div>
            </div>

            {checkoutError && (
              <p className="mb-4 text-[13px] text-oxblood flex items-baseline gap-2">
                <XCircle className="w-3.5 h-3.5 self-center" />
                {checkoutError}
              </p>
            )}

            <button
              type="button"
              onClick={handleCardCheckout}
              disabled={processing}
              className="btn btn-primary w-full !justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {s.processing}
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  {s.payByCard}
                </>
              )}
            </button>
            <p className="text-[12px] text-ink-mute mt-4 leading-relaxed flex items-baseline gap-2">
              <Lock className="w-3 h-3 self-center" />
              {s.cardSecurePromise}
            </p>
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
