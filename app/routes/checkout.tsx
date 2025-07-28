import { useEffect, useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router';
import { useCart } from '~/contexts/CartContext';

// Get Stripe publishable key from Vite environment
const stripePublishableKey = process.env.VITE_STRIPE_PUBLIC_KEY!

// Initialize Stripe
const stripePromise = loadStripe(stripePublishableKey);

export default function EmbeddedCheckoutPage() {
  const { items, getTotalQuantity } = useCart();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get order notes from session storage (passed from checkout page)
  const orderNotes = typeof window !== 'undefined' ? 
    window.sessionStorage.getItem('orderNotes') || '' : '';

  const fetchClientSecret = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const totalQuantity = getTotalQuantity();
      if (totalQuantity === 0) {
        navigate('/checkout-cart');
        return;
      }

      // Create checkout session with embedded mode
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          totalQuantity: getTotalQuantity(),
          mode: 'embedded', // Signal embedded mode
          orderNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      setClientSecret(data.client_secret);
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to initialize checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [items, getTotalQuantity, navigate]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  const options = {
    clientSecret,
    onComplete: async () => {
      // Clear cart and redirect to success page
      navigate('/books/success');
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Setting up checkout...</p>
        </div>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-destructive mb-2">Checkout Error</h2>
          <p className="text-muted-foreground mb-4">{error || 'Unable to initialize checkout'}</p>
          <button
            onClick={() => navigate('/checkout-cart')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Complete Your Order</h1>
          <p className="text-muted-foreground mt-2">
            Enter your details below to complete your purchase
          </p>
        </div>
        
        <div id="checkout" className="bg-card rounded-lg shadow-lg p-6">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={options}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}