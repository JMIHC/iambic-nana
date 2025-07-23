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
      expand: ["line_items", "customer"],
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerEmail: session.customer_details?.email || "",
        customerName: session.customer_details?.name || "",
        shippingAddress: session.shipping_details?.address || null,
        totalAmount: (session.amount_total || 0) / 100, // Convert from cents
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