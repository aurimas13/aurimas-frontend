import React, { useState, useEffect } from 'react';
import { Heart, CreditCard, Banknote, Coffee, Star, Shield, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

export const SupportSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Check for payment success/cancel from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get('payment') === 'cancelled') {
      setPaymentError('Payment was canceled. Please try again.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <section id="support" className="py-20 bg-gradient-to-br from-yellow-25 to-orange-25">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.support.title}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {paymentSuccess && (
            <div className="mb-8 p-6 bg-green-100 border border-green-300 rounded-2xl text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-green-600 mr-2" />
                <h3 className="text-2xl font-bold text-green-800">Payment Successful!</h3>
              </div>
              <p className="text-green-700">Thank you for supporting my work! Your contribution means a lot.</p>
            </div>
          )}

          {/* Error Message */}
          {paymentError && (
            <div className="mb-8 p-6 bg-red-100 border border-red-300 rounded-2xl text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="w-6 h-6 text-red-600 mr-2" />
                <h3 className="text-xl font-bold text-red-800">Payment Error</h3>
              </div>
              <p className="text-red-700">{paymentError}</p>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-8">
            {/* PayPal Payment */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center mb-6">
                <CreditCard className="w-8 h-8 text-white mr-3" />
                <h3 className="text-2xl font-bold text-white">{t.support.paypal}</h3>
              </div>
              <p className="text-blue-100 mb-6">
                {t.support.paypalDirectMessage}
              </p>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[5, 10, 25, 50].map((amount) => (
                  <a
                    key={amount}
                    href={`https://www.paypal.com/paypalme/aurimasaleksandras/${amount}EUR`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-blue-600 py-3 px-4 rounded-lg font-bold text-center hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
                  >
                    €{amount}
                  </a>
                ))}
              </div>
              
              {/* Custom Amount */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.support.customAmount}</label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      id="paypal-custom-amount"
                      placeholder={t.support.enterAmount}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Send
                  </button>
                </div>
              </div>
              
              {/* General PayPal Link */}
              <a
                href="https://www.paypal.com/paypalme/aurimasaleksandras"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white text-blue-600 py-3 rounded-lg font-bold text-center hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Open PayPal.me</span>
              </a>
            </div>

            {/* Bank Transfer - N26 */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 shadow-lg text-white">
              <div className="flex items-center mb-6">
                <Banknote className="w-8 h-8 text-white mr-3" />
                <h3 className="text-2xl font-bold text-white">{t.support.bankTransferTitle}</h3>
              </div>
              <p className="text-green-100 mb-6">
                {t.support.bankTransferDescription}
              </p>
              <div className="bg-white rounded-lg p-6 text-gray-800">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-600">Account Holder:</span>
                    <p className="font-mono text-sm">Aurimas Aleksandras Nausedas</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">IBAN:</span>
                    <p className="font-mono text-sm">DE50100110012072920439</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">BIC:</span>
                    <p className="font-mono text-sm">NTSBDEB1XXX</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Bank:</span>
                    <p className="text-sm">N26 Bank</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    {t.support.bankTransferNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};