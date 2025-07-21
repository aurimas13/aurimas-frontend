import React, { useState } from 'react';
import { useEffect } from 'react';
import { Heart, CreditCard, Banknote, Coffee, Star, Shield, CheckCircle, Clock, XCircle } from 'lucide-react';
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const subscriptionAmounts = [1, 3, 5, 10, 30, 50];
  const oneTimeAmounts = [5, 10, 30, 50, 100, 300];
  
  const predefinedAmounts = paymentType === 'subscription' ? subscriptionAmounts : oneTimeAmounts;

  const getCurrentAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  const handlePaymentStart = async () => {
    const amount = getCurrentAmount();
    if (paymentType === 'subscription' && (!amount || amount < 0.5)) {
      setPaymentError('Minimum monthly amount is €0.50');
      return;
    }

    if (paymentType === 'one-time' && (!amount || amount < 0.5)) {
      setPaymentError('Minimum one-time amount is €0.50');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    setShowStripePayment(true);
    setIsProcessingPayment(false);
  };
  const handleStripePayment = () => {
    handlePaymentStart();
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
    setIsProcessingPayment(false);
  };

  return (
    <section id="support" className="py-20 bg-gradient-to-br from-yellow-25 to-orange-25">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Processing Message */}
          {isProcessingPayment && (
            <div className="mb-8 p-6 bg-blue-100 border border-blue-300 rounded-2xl text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-blue-600 mr-2 animate-spin" />
                <h3 className="text-xl font-bold text-blue-800">Processing Payment</h3>
              </div>
              <p className="text-blue-700">Please wait while we prepare your payment...</p>
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
                  Send money directly via PayPal - no PayPal account required! Just use your credit/debit card.
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        id="paypal-custom-amount"
                        placeholder="Enter amount"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
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
                  <h3 className="text-2xl font-bold text-white">Bank Transfer</h3>
                </div>
                <p className="text-green-100 mb-6">
                  Direct bank transfer to N26 account
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
                      💡 Please include your email in the transfer reference so I can thank you!
                    </p>
                  </div>
                </div>
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
    </section>
  );
};