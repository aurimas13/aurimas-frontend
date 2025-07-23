import React, { useState } from 'react';
import { Heart, Coffee, DollarSign, CreditCard, Loader2 } from 'lucide-react';

interface SupportSectionProps {
  language: 'en' | 'lt';
}

const SupportSection: React.FC<SupportSectionProps> = ({ language }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const translations = {
    en: {
      title: "Support My Work",
      subtitle: "Help me continue creating content and sharing knowledge",
      description: "Your support helps me dedicate more time to writing, research, and creating valuable content for the community.",
      oneTime: "One-time support",
      monthly: "Monthly support",
      amount: "Amount",
      custom: "Custom",
      supportButton: "Support with",
      processing: "Processing...",
      thankYou: "Thank you for your support! 🙏"
    },
    lt: {
      title: "Paremk Mano Darbą",
      subtitle: "Padėk man toliau kurti turinį ir dalintis žiniomis",
      description: "Jūsų parama padeda man skirti daugiau laiko rašymui, tyrimams ir vertingo turinio kūrimui bendruomenei.",
      oneTime: "Vienkartinė parama",
      monthly: "Mėnesinė parama",
      amount: "Suma",
      custom: "Pasirinktinė",
      supportButton: "Paremti su",
      processing: "Apdorojama...",
      thankYou: "Ačiū už paramą! 🙏"
    }
  };

  const t = translations[language];
  const predefinedAmounts = [5, 10, 25, 50];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(0);
    }
  };

  const getCurrentAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  const handleSupport = async (type: 'one-time' | 'monthly') => {
    const amount = getCurrentAmount();
    if (!amount || amount <= 0) return;

    setIsLoading(true);
    
    try {
      // Here you would integrate with your payment processor
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message or redirect to payment
      console.log(`${type} support of €${amount}`);
      
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-amber-100 rounded-full">
              <Heart className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            {t.subtitle}
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          {/* Amount Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t.amount}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedAmount === amount && !customAmount
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 hover:border-amber-300 text-gray-700'
                  }`}
                >
                  €{amount}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="number"
                placeholder={`${t.custom} (€)`}
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                min="1"
                step="0.01"
              />
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Support Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleSupport('one-time')}
              disabled={isLoading || getCurrentAmount() <= 0}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.processing}</span>
                </>
              ) : (
                <>
                  <Coffee className="w-5 h-5" />
                  <span>{t.supportButton} €{getCurrentAmount().toFixed(2)} - {t.oneTime}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleSupport('monthly')}
              disabled={isLoading || getCurrentAmount() <= 0}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.processing}</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>{t.supportButton} €{getCurrentAmount().toFixed(2)} - {t.monthly}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>{t.thankYou}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;