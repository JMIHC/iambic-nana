import { useEffect, useState } from "react";
import type { Route } from "./+types/books.success";
import { Link, useSearchParams } from "react-router";
import { useCart } from "~/contexts/CartContext";
import { books } from "~/data/books";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Order Successful - Iambic Nana" },
    { name: "description", content: "Thank you for your order" },
  ];
}

interface OrderData {
  customerEmail: string;
  customerName: string;
  shippingAddress: any;
  totalAmount: number;
  totalQuantity: string;
  pricePerUnit: string;
  orderNotes: string;
  sessionId: string;
  paymentStatus: string;
  lineItems: any[];
}

export default function BookSuccess() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sessionId = searchParams.get("session_id");
  const paymentIntentId = searchParams.get("payment_intent");

  // Fetch order data and clear cart on successful order
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!sessionId && !paymentIntentId) {
        setError("Missing order ID");
        setLoading(false);
        return;
      }

      try {
        // Use different endpoint based on checkout type
        const endpoint = sessionId 
          ? `/.netlify/functions/get-checkout-session?session_id=${sessionId}`
          : `/.netlify/functions/get-payment-intent?payment_intent_id=${paymentIntentId}`;
          
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error("Failed to retrieve order details");
        }
        
        const orderData = await response.json();
        setData(orderData);
        clearCart(); // Clear cart on successful order
      } catch (err) {
        console.error("Failed to fetch order data:", err);
        setError("Failed to retrieve order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [sessionId, paymentIntentId, clearCart]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <div className="text-2xl">Loading order details...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-lg text-gray-600 mb-4">{error}</p>
        <Link
          to="/tiny-books"
          className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const totalQuantity = parseInt(data.totalQuantity);
  const unitPrice = parseFloat(data.pricePerUnit);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
        <p className="text-lg text-gray-600">
          Thank you for your order, {data.customerName}!
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        
        {/* Books Ordered */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Books Ordered:</h3>
          <div className="space-y-2">
            {data.lineItems.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p>${(item.amount_total / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Details */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Total Books:</span>
            <span className="font-semibold">{totalQuantity}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Price per Unit:</span>
            <span>${unitPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total Paid:</span>
            <span className="text-purple-600">${data.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      {data.shippingAddress && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          <div className="text-gray-600">
            <p>{data.shippingAddress.line1}</p>
            {data.shippingAddress.line2 && <p>{data.shippingAddress.line2}</p>}
            <p>
              {data.shippingAddress.city}, {data.shippingAddress.state} {data.shippingAddress.postal_code}
            </p>
            <p>{data.shippingAddress.country}</p>
          </div>
        </div>
      )}

      {/* What's Next */}
      <div className="bg-coral-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-coral-700">What's Next?</h2>
        <ul className="space-y-2 text-coral-700">
          <li>• You'll receive an order confirmation email at {data.customerEmail}</li>
          <li>• Your books will be printed and shipped within 5-7 business days</li>
          <li>• You'll receive tracking information once your order ships</li>
          <li>• Questions? Email us at <a href="mailto:mytinybooks919@gmail.com" className="underline">mytinybooks919@gmail.com</a></li>
        </ul>
      </div>

      {/* Pricing Tier Achievement */}
      {totalQuantity >= 10 && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
          <p className="text-green-700 font-semibold">
            🎯 Great job! You unlocked bulk pricing at ${unitPrice.toFixed(2)} per book!
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="text-center">
        <Link
          to="/tiny-books"
          className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
        >
          Back to tiny books
        </Link>
        
        <p className="mt-4 text-sm text-gray-600">
          Order ID: {data.sessionId}
        </p>
      </div>
    </div>
  );
}