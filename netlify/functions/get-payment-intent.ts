import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const paymentIntentId = event.queryStringParameters?.payment_intent_id;

    if (!paymentIntentId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing payment_intent_id parameter' }),
      };
    }

    // Retrieve the payment intent with shipping details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Payment intent not found' }),
      };
    }

    // Format the response to match the checkout session format
    const orderData = {
      customerEmail: paymentIntent.metadata?.customerEmail || '',
      customerName: paymentIntent.metadata?.customerName || '',
      customerPhone: paymentIntent.metadata?.customerPhone || '',
      shippingAddress: paymentIntent.metadata?.shippingAddress ? 
        JSON.parse(paymentIntent.metadata.shippingAddress) : null,
      totalAmount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      totalQuantity: paymentIntent.metadata?.totalQuantity || '',
      subtotal: paymentIntent.metadata?.subtotal || '',
      shippingCarrier: paymentIntent.metadata?.shippingCarrier || '',
      shippingService: paymentIntent.metadata?.shippingService || '',
      shippingRate: paymentIntent.metadata?.shippingRate || '',
      orderNotes: paymentIntent.metadata?.orderNotes || '',
      sessionId: paymentIntent.id, // Use payment intent ID as session ID
      paymentStatus: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
      createdAt: new Date(paymentIntent.created * 1000).toISOString(),
      items: paymentIntent.metadata?.items ? 
        JSON.parse(paymentIntent.metadata.items) : [],
      // Format line items from the items metadata
      lineItems: paymentIntent.metadata?.items ? 
        JSON.parse(paymentIntent.metadata.items).map((item: any) => ({
          productName: `Book ID: ${item.bookId}`,
          quantity: item.quantity,
          unitAmount: 0, // Will be calculated from subtotal
          totalAmount: 0,
        })) : [],
    };

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    };
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to retrieve payment intent',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};