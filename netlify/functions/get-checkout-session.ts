import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const sessionId = event.queryStringParameters?.session_id;

    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing session_id parameter" }),
      };
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer", "shipping_cost"],
    });

    // Extract shipping details
    const shippingDetails = session.shipping_details;
    const shippingCost = session.shipping_cost;
    const shippingOptions = session.shipping_options?.[0];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerEmail: session.customer_details?.email || "",
        customerName: session.customer_details?.name || "",
        shippingAddress: shippingDetails?.address || null,
        shippingName: shippingDetails?.name || "",
        shippingCarrier: shippingOptions?.shipping_rate ?
          (typeof shippingOptions.shipping_rate === 'object' ? shippingOptions.shipping_rate.display_name : '') : '',
        shippingAmount: shippingCost?.amount_total ? (shippingCost.amount_total / 100) : 0,
        totalAmount: (session.amount_total || 0) / 100, // Convert from cents
        subtotalAmount: (session.amount_subtotal || 0) / 100,
        totalQuantity: session.metadata?.totalQuantity || "0",
        pricePerUnit: session.metadata?.pricePerUnit || "0",
        orderNotes: session.metadata?.orderNotes || "",
        sessionId: session.id,
        paymentStatus: session.payment_status,
        lineItems: session.line_items?.data || [],
      }),
    };
  } catch (error) {
    console.error("Failed to retrieve checkout session:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};