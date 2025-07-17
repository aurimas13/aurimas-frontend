import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

export const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const validateAmount = (amount: number, paymentType: 'subscription' | 'one-time') => {
  const minAmount = 0.5; // Minimum €0.50
  const maxAmount = paymentType === 'subscription' ? 1000 : 10000;
  
  if (amount < minAmount) {
    return `Minimum amount is €${minAmount}`;
  }
  
  if (amount > maxAmount) {
    return `Maximum amount is €${maxAmount}`;
  }
  
  return null;
};