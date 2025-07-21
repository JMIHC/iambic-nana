import { useEffect } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getCheckoutSession } from "~/lib/stripe.server";
import { useCart } from "~/contexts/CartContext";
import { books } from "~/data/books";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  
  if (!sessionId) {
    throw new Response("Missing session ID", { status: 400 });
  }
  
  try {
    const session = await getCheckoutSession(sessionId);
    
    // Parse metadata
    const items = JSON.parse(session.metadata?.items || "[]");
    const totalQuantity = parseInt(session.metadata?.totalQuantity || "0");
    const unitPrice = parseFloat(session.metadata?.unitPrice || "0");
    const isBundle = session.metadata?.isBundle === "true";
    
    // Get book details
    const orderItems = items.map((item: any) => {
      const book = books.find(b => b.id === item.bookId);
      return {
        ...item,
        book: book!
      };
    });
    
    return json({
      customerEmail: session.customer_details?.email || "",
      customerName: session.customer_details?.name || "",
      shippingAddress: session.shipping_details?.address || null,
      totalAmount: (session.amount_total || 0) / 100, // Convert from cents
      totalQuantity,
      unitPrice,
      isBundle,
      orderItems,
      sessionId,
    });
  } catch (error) {
    console.error("Failed to retrieve session:", error);
    throw new Response("Failed to retrieve order details", { status: 500 });
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "Order Successful - Iambic.Nana" },
    { name: "description", content: "Thank you for your order" },
  ];
};

export default function BookSuccess() {
  const data = useLoaderData<typeof loader>();
  const { clearCart } = useCart();
  
  // Clear cart on successful order
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  
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
            {data.orderItems.map((item: any) => (
              <div key={item.bookId} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.book.title}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p>${(item.quantity * data.unitPrice).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Details */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Total Books:</span>
            <span className="font-semibold">{data.totalQuantity}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Price per Unit:</span>
            <span>${data.unitPrice.toFixed(2)}</span>
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
          <li>• Questions? Email us at <a href="mailto:orders@iambic.nana" className="underline">orders@iambic.nana</a></li>
        </ul>
      </div>

      {/* Pricing Tier Achievement */}
      {data.totalQuantity >= 10 && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
          <p className="text-green-700 font-semibold">
            🎯 Great job! You unlocked bulk pricing at ${data.unitPrice.toFixed(2)} per book!
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="text-center">
        <Link
          to="/books"
          className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
        >
          Order More Books
        </Link>
        
        <p className="mt-4 text-sm text-gray-600">
          Order ID: {data.sessionId}
        </p>
      </div>
    </div>
  );
}