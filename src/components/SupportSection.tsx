import React, { useState } from 'react';
import { useEffect } from 'react';
import { Heart, CreditCard, Banknote, Coffee, Star, Shield } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { StripePayment } from './StripePayment';

export const SupportSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'subscription' | 'one-time'>('subscription');
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Check for payment success/cancel from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setPaymentSuccess(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get('canceled') === 'true') {
      setPaymentError('Payment was canceled. Please try again.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const subscriptionAmounts = [0.1, 1, 5, 10, 20, 30];
  const oneTimeAmounts = [1, 5, 10, 25, 50, 100];
  
  const predefinedAmounts = paymentType === 'subscription' ? subscriptionAmounts : oneTimeAmounts;

  const getCurrentAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  const handleStripePayment = () => {
    const amount = getCurrentAmount();
    if (!amount || amount < 0.5) {
      setPaymentError('Minimum payment amount is €0.50');
      return;
    }
    setShowStripePayment(true);
    setPaymentError(null);
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setShowStripePayment(false);
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 5000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setShowStripePayment(false);
  };

  return (
    <section id="support" className="py-20 bg-gradient-to-br from-yellow-25 to-orange-25">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.support.title}
          </h2>
          <p className="text-xl text-gray-800 mb-8">{t.support.subtitle}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {paymentSuccess && (
            <div className="mb-8 p-6 bg-green-100 border border-green-300 rounded-2xl text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-8 h-8 text-green-600 mr-2" />
                <h3 className="text-2xl font-bold text-green-800">Payment Successful!</h3>
              </div>
              <p className="text-green-700">Thank you for supporting my work! Your contribution means a lot.</p>
            </div>
          )}

          {/* Error Message */}
          {paymentError && (
            <div className="mb-8 p-6 bg-red-100 border border-red-300 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-red-800 mb-2">Payment Error</h3>
              <p className="text-red-700">{paymentError}</p>
            </div>
          )}

          {/* Payment Type Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => setPaymentType('subscription')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  paymentType === 'subscription'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {t.support.subscription}
              </button>
              <button
                onClick={() => setPaymentType('one-time')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  paymentType === 'one-time'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {t.support.oneTime}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Amount Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative">
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Secured by Stripe</span>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Choose Your Support for <span className="text-yellow-300">Au</span><span className="text-gray-800">rimas</span></h3>
              </div>

              <div className="space-y-6">
                {/* Predefined Amounts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {paymentType === 'subscription' ? t.support.minAmount : t.support.sixMonths}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-lg border-2 font-medium transition-all duration-300 ${
                          selectedAmount === amount && !customAmount
                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                            : 'border-gray-200 hover:border-purple-300 text-gray-700'
                        }`}
                      >
                        €{amount === 0.1 ? '0.10' : amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      min="0.5"
                      step="0.1"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      placeholder="Min €0.50"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-2">What you get:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Star className="w-4 h-4 text-blue-500 mr-2" />
                      Access to premium blog content
                    </li>
                    <li className="flex items-center">
                      <Star className="w-4 h-4 text-blue-500 mr-2" />
                      Early access to new posts
                    </li>
                    <li className="flex items-center">
                      <Star className="w-4 h-4 text-blue-500 mr-2" />
                      Support independent writing
                    </li>
                    {paymentType === 'one-time' && (
                      <li className="flex items-center">
                        <Star className="w-4 h-4 text-blue-500 mr-2" />
                        6 months of premium access
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-6">
              {/* Stripe Payment */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">Secure Payment</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Secure payment processing with credit/debit cards via Stripe
                </p>
                
                {showStripePayment ? (
                  <StripePayment
                    amount={getCurrentAmount()}
                    currency="EUR"
                    paymentType={paymentType}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  <button
                    onClick={handleStripePayment}
                    disabled={!getCurrentAmount() || getCurrentAmount() < 0.5}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Pay Securely with Stripe</span>
                  </button>
                )}
              </div>

              {/* Bank Transfer */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Banknote className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">{t.support.bank}</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div>
                    <span className="font-medium">IBAN:</span> [Your IBAN here]
                  </div>
                  <div>
                    <span className="font-medium">BIC:</span> [Your BIC here]
                  </div>
                  <div>
                    <span className="font-medium">Bank:</span> [Your Bank Name]
                  </div>
                </div>
                <button
                  onClick={() => alert('Bank transfer details: Please contact aurimas.nausedas@proton.me for bank transfer information.')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Banknote className="w-5 h-5" />
                  <span>Bank Transfer Details</span>
                </button>
              </div>

              {/* Ko-fi Link */}
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-6 text-white relative">
                <div className="absolute top-2 right-2 text-xs opacity-75">Alternative</div>
                <div className="flex items-center mb-4">
                  <Coffee className="w-6 h-6 mr-2" />
                  <h4 className="text-lg font-bold">Support on Ko-fi</h4>
                </div>
                <p className="mb-4 text-orange-100 text-sm">
                  Alternative platform for one-time donations and tips
                </p>
                <a
                  href="https://ko-fi.com/aurimas13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Coffee className="w-5 h-5 mr-2" />
                  Visit Ko-fi
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};