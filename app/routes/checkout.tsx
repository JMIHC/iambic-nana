import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from '~/contexts/CartContext';
import { books } from '~/data/books';
import { calculateBookPrice, getCurrentTier, getBundleDeals } from '~/lib/priceCalculator';

// Initialize Stripe with the publishable key (same pattern as secret key in functions)
declare global {
  interface Window {
    ENV?: {
      STRIPE_PUBLIC_KEY: string;
    };
  }
}

// For now, use the key directly (since it's safe to expose publishable keys)
const stripePublishableKey = 'pk_test_51RoB8T9HBJe7pfHmTzw1v06Ci9eur1nLx2Gf6L6pL7cvyL41d49ekcjIrkKvYSRbqdKUo7McVTLuPjsfMHJcj7lt00rFb60Tii';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

type CheckoutStep = 'shipping' | 'shipping-method' | 'payment';

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  rate: number;
  deliveryDays: number | null;
  deliveryDate: string | null;
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, getTotalQuantity, clearCart } = useCart();
  
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });
  
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [paymentIntentSecret, setPaymentIntentSecret] = useState<string | null>(null);

  // Get order notes from session storage
  const orderNotes = typeof window !== 'undefined' ? 
    window.sessionStorage.getItem('orderNotes') || '' : '';

  // Calculate order total
  const totalQuantity = getTotalQuantity();
  const unitPrice = calculateBookPrice(totalQuantity);
  const bundleDeal = getBundleDeals(totalQuantity, items);
  const isBundle = totalQuantity === 4 && bundleDeal.available;
  const subtotal = isBundle ? bundleDeal.bundlePrice : unitPrice * totalQuantity;

  // Handle shipping address submission
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Calculate shipping rates
      const response = await fetch('/.netlify/functions/calculate-shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            street1: shippingAddress.line1,
            street2: shippingAddress.line2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zip: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
          quantity: totalQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate shipping rates');
      }

      const data = await response.json();
      setShippingRates(data.rates);
      setStep('shipping-method');
    } catch (err) {
      console.error('Error calculating shipping:', err);
      setError('Failed to calculate shipping rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle shipping method selection
  const handleShippingMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShippingRate) {
      setError('Please select a shipping method');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent with selected shipping
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalQuantity,
          orderNotes,
          shippingAddress,
          shippingRate: selectedShippingRate,
          subtotal,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setPaymentIntentSecret(data.clientSecret);
      setStep('payment');
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !paymentIntentSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setLoading(false);
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(paymentIntentSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: {
              line1: shippingAddress.line1,
              line2: shippingAddress.line2 || undefined,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country,
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else {
        // Payment successful - don't clear cart here to avoid redirect
        window.sessionStorage.removeItem('orderNotes');
        navigate(`/books/success?payment_intent=${result.paymentIntent.id}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total with shipping
  const total = subtotal + (selectedShippingRate?.rate || 0) / 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        <div className={`flex-1 text-center pb-2 ${step === 'shipping' ? 'border-b-2 border-primary font-semibold' : 'text-muted-foreground'}`}>
          1. Shipping
        </div>
        <div className={`flex-1 text-center pb-2 ${step === 'shipping-method' ? 'border-b-2 border-primary font-semibold' : 'text-muted-foreground'}`}>
          2. Delivery
        </div>
        <div className={`flex-1 text-center pb-2 ${step === 'payment' ? 'border-b-2 border-primary font-semibold' : 'text-muted-foreground'}`}>
          3. Payment
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Shipping Address Form */}
      {step === 'shipping' && (
        <form onSubmit={handleShippingSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                autoComplete="name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={shippingAddress.email}
                onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              required
              autoComplete="tel"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input
              type="text"
              required
              autoComplete="address-line1"
              value={shippingAddress.line1}
              onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Apartment, Suite, etc. (optional)</label>
            <input
              type="text"
              autoComplete="address-line2"
              value={shippingAddress.line2}
              onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                required
                autoComplete="address-level2"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                required
                autoComplete="address-level1"
                maxLength={2}
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input
                type="text"
                required
                autoComplete="postal-code"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              autoComplete="country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="NZ">New Zealand</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Calculating Shipping...' : 'Continue to Delivery'}
          </button>
        </form>
      )}

      {/* Shipping Method Selection */}
      {step === 'shipping-method' && (
        <form onSubmit={handleShippingMethodSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Select Delivery Method</h2>
          
          <div className="space-y-3">
            {shippingRates.map((rate) => (
              <label
                key={rate.id}
                className={`block p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedShippingRate?.id === rate.id ? 'border-primary bg-blue-50' : ''
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={rate.id}
                  checked={selectedShippingRate?.id === rate.id}
                  onChange={() => setSelectedShippingRate(rate)}
                  className="sr-only"
                />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{rate.carrier} - {rate.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {rate.deliveryDays ? `${rate.deliveryDays} business days` : 'Delivery time varies'}
                    </p>
                  </div>
                  <p className="font-semibold">${(rate.rate / 100).toFixed(2)}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('shipping')}
              className="flex-1 border border-gray-300 py-3 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !selectedShippingRate}
              className="flex-1 bg-purple-600 text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      )}

      {/* Payment Form */}
      {step === 'payment' && (
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
          
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({totalQuantity} books)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {selectedShippingRate && (
                <div className="flex justify-between">
                  <span>Shipping ({selectedShippingRate.carrier} {selectedShippingRate.service})</span>
                  <span>${(selectedShippingRate.rate / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('shipping-method')}
              className="flex-1 border border-gray-300 py-3 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !stripe}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useCart();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/tiny-books');
    }
  }, [items, navigate]);

  if (!stripePublishableKey || !stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-destructive mb-2">Configuration Error</h2>
          <p className="text-muted-foreground mb-4">
            Stripe is not configured properly. Please ensure STRIPE_PUBLIC_KEY is set.
          </p>
          <button
            onClick={() => navigate('/checkout-cart')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 cursor-pointer"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}