import React, { useState } from 'react';
import { CreditCard, Lock, Shield } from 'lucide-react';

interface StripePaymentProps {
  amount: number;
  currency: string;
  paymentType: 'subscription' | 'one-time';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  currency,
  paymentType,
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePayment = async () => {
    if (!amount || amount < 0.5) {
      onError?.('Minimum payment amount is €0.50');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Determine API URL based on environment
      const isDevelopment = window.location.hostname === 'localhost';
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      console.log('Environment:', isDevelopment ? 'development' : 'production');
      console.log('Using API URL:', apiUrl);
      
      // Test backend connectivity first
      try {
        const healthResponse = await fetch(`${apiUrl}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!healthResponse.ok) {
          throw new Error(`Backend not accessible: ${healthResponse.status}`);
        }
        
        console.log('Backend health check passed');
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
        if (isDevelopment) {
          throw new Error(`Backend server not running. Please start it by running:\n\ncd backend\nnpm install\nnpm run dev\n\nThen verify it's working at: http://localhost:3001/api/health`);
        } else {
          throw new Error('Cannot connect to payment server. Please try again later.');
        }
      }
      
      const response = await fetch(`${apiUrl}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          payment_type: paymentType,
          customer_email: 'support@aurimas.io', // You can make this dynamic later
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Payment processing failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        console.error('API Error:', response.status, errorMessage);
        
        if (response.status === 500) {
          throw new Error('Payment service configuration error. Please contact support.');
        } else if (response.status === 400) {
          throw new Error(errorMessage);
        } else {
          throw new Error(`Payment failed (${response.status}). Please try again.`);
        }
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
      
      setPaymentStatus('success');
      onSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (paymentType === 'subscription') return `Subscribe €${amount}/month`;
    return `Pay €${amount}`;
  };

  const getButtonColor = () => {
    if (paymentStatus === 'success') return 'bg-green-600 hover:bg-green-700';
    if (paymentStatus === 'error') return 'bg-red-600 hover:bg-red-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
        <Shield className="w-4 h-4" />
        <span>Secured by Stripe</span>
        <Lock className="w-4 h-4" />
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing || !amount}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg text-white transition-all duration-300 flex items-center justify-center space-x-2 ${getButtonColor()} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <CreditCard className="w-5 h-5" />
        <span>{getButtonText()}</span>
      </button>

      {paymentStatus === 'error' && (
        <div className="text-red-600 text-sm text-center">
          Payment failed. Please try again or contact support.
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="text-green-600 text-sm text-center">
          Payment successful! Thank you for your support.
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        <p>Secure payment processing by Stripe</p>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};