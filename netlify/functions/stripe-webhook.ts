import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// CORS headers for preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Handle preflight OPTIONS requests
const handleOptions = () => ({
  statusCode: 200,
  headers: corsHeaders,
  body: '',
});

// Send email notification (you can replace this with your preferred email service)
const sendOrderNotification = async (orderData: any) => {
  // For now, just log the order data
  // You can integrate with services like SendGrid, Mailgun, or Netlify Forms
  console.log('=== NEW ORDER RECEIVED ===');
  console.log('Order Details:', JSON.stringify(orderData, null, 2));
  console.log('========================');
  
  // TODO: Replace with actual email sending logic
  // Example services:
  // - SendGrid API
  // - Mailgun API  
  // - Netlify Forms
  // - Resend API
  
  return true;
};

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log('Stripe webhook received:', {
    httpMethod: event.httpMethod,
    headers: event.headers,
    hasBody: !!event.body
  });

  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Verify required environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing required environment variables');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Get the signature from headers
    const signature = event.headers['stripe-signature'];
    if (!signature) {
      console.error('Missing stripe-signature header');
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing signature' }),
      };
    }

    // Verify the webhook signature
    let stripeEvent: Stripe.Event;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body!,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    console.log('Webhook event type:', stripeEvent.type);

    // Handle the checkout.session.completed event
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      
      console.log('Checkout session completed:', session.id);

      // Extract order information
      const orderData = {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        customerPhone: session.customer_details?.phone,
        shippingAddress: session.shipping_details?.address,
        amountTotal: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
        currency: session.currency,
        orderNotes: session.metadata?.orderNotes || '',
        totalQuantity: session.metadata?.totalQuantity || '',
        pricePerUnit: session.metadata?.pricePerUnit || '',
        createdAt: new Date(session.created * 1000).toISOString(),
        lineItems: [], // We'll populate this next
      };

      // Get the line items to see what was ordered
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product']
        });
        
        orderData.lineItems = lineItems.data.map(item => ({
          productName: (item.price?.product as Stripe.Product)?.name || 'Unknown Product',
          quantity: item.quantity,
          unitAmount: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          totalAmount: item.amount_total ? item.amount_total / 100 : 0,
        }));
      } catch (err) {
        console.error('Failed to fetch line items:', err);
      }

      // Send notification email
      await sendOrderNotification(orderData);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ received: true }),
      };
    }

    // Handle other webhook events if needed
    console.log(`Unhandled event type: ${stripeEvent.type}`);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};