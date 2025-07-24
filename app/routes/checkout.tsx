import { useState } from "react";
import type { Route } from "./+types/checkout";
import { Link, useNavigate } from "react-router";
import { useCart } from "~/contexts/CartContext";
import { books } from "~/data/books";
import { PRICING_TIERS } from "~/types/book";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout - Iambic.Nana" },
    { name: "description", content: "Complete your tiny books order" },
  ];
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getCartSummary } = useCart();
  const [orderNotes, setOrderNotes] = useState("");
  const [isInternational, setIsInternational] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  const summary = getCartSummary();
  const basePrice = PRICING_TIERS[0].pricePerUnit;

  // Get book details for each item
  const cartItemsWithDetails = items.map(item => {
    const book = books.find(b => b.id === item.bookId);
    return {
      ...item,
      book: book!
    };
  });

  const canProcessWithStripe = summary.totalQuantity < 100;

  const handleCheckout = async () => {
    setError("");
    setIsProcessing(true);

    if (!canProcessWithStripe || isInternational) {
      setError("Please contact us directly for orders of 100+ books or international shipping quotes.");
      setIsProcessing(false);
      return;
    }

    try {
      // Call our Netlify function to create the Stripe checkout session
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          totalQuantity: summary.totalQuantity,
          orderNotes,
          isInternational
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError("Failed to create checkout session. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/tiny-books" className="text-purple-600 hover:underline">
          Browse our tiny books
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Order Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Order Breakdown</h2>
        
        {/* Item List */}
        <div className="space-y-3 mb-6">
          {cartItemsWithDetails.map(({ bookId, quantity, book }) => (
            <div key={bookId} className="flex justify-between items-center py-2 border-b">
              <div className="flex-1">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">Quantity: {quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{quantity} × ${summary.pricePerUnit.toFixed(2)}</p>
                <p className="text-sm">${(quantity * summary.pricePerUnit).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-lg">
            <span>Total Books:</span>
            <span className="font-bold">{summary.totalQuantity}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Price per unit:</span>
            <span>${summary.pricePerUnit.toFixed(2)}</span>
          </div>
          
          {summary.savings > 0 && (
            <>
              <div className="flex justify-between text-gray-600">
                <span>Regular price:</span>
                <span>${(summary.totalQuantity * basePrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold">
                <span>You save:</span>
                <span>-${summary.savings.toFixed(2)}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between text-2xl font-bold pt-2 border-t">
            <span>Total:</span>
            <span className="text-purple-600">${summary.subtotal.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Order Options */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Order Options</h2>
        

        {/* International Shipping */}
        <div className="mb-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isInternational}
              onChange={(e) => setIsInternational(e.target.checked)}
              className="mt-1"
            />
            <div>
              <span className="font-semibold">International shipping needed</span>
              <p className="text-sm text-gray-600">
                We'll contact you with a shipping quote
              </p>
            </div>
          </label>
        </div>

        {/* Order Notes */}
        <div>
          <label htmlFor="notes" className="block font-semibold mb-2">
            Order Notes (optional)
          </label>
          <textarea
            id="notes"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Special requests, delivery instructions, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={3}
          />
        </div>
      </div>

      {/* Warnings/Messages */}
      {summary.totalQuantity >= 100 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-semibold">
            📧 Custom Invoice Required
          </p>
          <p className="text-yellow-700 mt-1">
            For orders of 100+ books, please contact us at{" "}
            <a href="mailto:mytinybooks919@gmail.com" className="underline">
              mytinybooks919@gmail.com
            </a>{" "}
            for custom pricing and invoice options.
          </p>
        </div>
      )}

      {isInternational && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-semibold">
            🌍 International Shipping Required
          </p>
          <p className="text-blue-700 mt-1">
            For international orders, please contact us directly for a shipping quote. 
            We ship worldwide and will provide accurate shipping costs based on your location.
          </p>
          <p className="text-blue-600 mt-2 font-medium">
            Click "Get International Quote" below to send us your order details.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {canProcessWithStripe && !isInternational ? (
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </button>
        ) : (
          <a
            href={`mailto:mytinybooks919@gmail.com?subject=${isInternational ? 'International Shipping Quote Request' : 'Bulk Order Request'}&body=I would like to order ${summary.totalQuantity} books.${isInternational ? '%0A%0AShipping Country: [Please specify your country]%0AShipping Address: [Please provide your full shipping address]' : ''}${orderNotes ? '%0A%0AOrder Notes: ' + encodeURIComponent(orderNotes) : ''}%0A%0AOrder Details:%0A${cartItemsWithDetails.map(item => `- ${item.book.title}: ${item.quantity} copies`).join('%0A')}`}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-center hover:bg-blue-700 transition-colors"
          >
            {isInternational ? '🌍 Get International Quote' : '📧 Contact for Quote'}
          </a>
        )}
        
        <Link
          to="/tiny-books"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-sm text-gray-600 text-center">
        <p>Questions? Email me at{" "}
          <a href="mytinybooks919@gmail.com" className="text-purple-600 underline">
            mytinybooks919@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}