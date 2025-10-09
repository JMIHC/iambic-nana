import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const {
      items,
      totalQuantity,
      orderNotes,
      shippingAddress,
      shippingRate,
      subtotal
    } = JSON.parse(event.body || '{}');

    console.log('Received payment intent request:', {
      items,
      totalQuantity,
      shippingAddress,
      shippingRate,
      subtotal
    });

    if (!items || !totalQuantity || !shippingAddress || !shippingRate || subtotal === undefined || subtotal === null) {
      console.error('Missing required parameters:', {
        hasItems: !!items,
        hasTotalQuantity: !!totalQuantity,
        hasShippingAddress: !!shippingAddress,
        hasShippingRate: !!shippingRate,
        hasSubtotal: subtotal !== undefined && subtotal !== null,
        subtotalValue: subtotal
      });
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Missing required parameters',
          details: {
            hasItems: !!items,
            hasTotalQuantity: !!totalQuantity,
            hasShippingAddress: !!shippingAddress,
            hasShippingRate: !!shippingRate,
            hasSubtotal: subtotal !== undefined && subtotal !== null
          }
        }),
      };
    }

    // Calculate total amount (subtotal + shipping) in cents
    const totalAmount = Math.round((subtotal + shippingRate.rate / 100) * 100);

    console.log('Calculated total amount:', {
      subtotal,
      shippingRateCents: shippingRate.rate,
      totalAmountCents: totalAmount
    });

    // Validate total amount
    if (isNaN(totalAmount) || totalAmount < 50) {
      console.error('Invalid total amount:', {
        totalAmount,
        subtotal,
        shippingRate: shippingRate.rate
      });
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Invalid total amount',
          details: {
            totalAmount,
            subtotal,
            shippingRate: shippingRate.rate
          }
        }),
      };
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderNotes: orderNotes || '',
        totalQuantity: totalQuantity.toString(),
        subtotal: subtotal.toFixed(2),
        shippingCarrier: shippingRate.carrier,
        shippingService: shippingRate.service,
        shippingRate: (shippingRate.rate / 100).toFixed(2),
        customerName: shippingAddress.name,
        customerEmail: shippingAddress.email,
        customerPhone: shippingAddress.phone,
        shippingAddress: JSON.stringify({
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country,
        }),
        items: JSON.stringify(items),
        easypostRateId: shippingRate.id,
      },
      shipping: {
        name: shippingAddress.name,
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
    });

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to create payment intent',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};