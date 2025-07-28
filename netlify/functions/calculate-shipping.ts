import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import Stripe from "stripe";
import { calculateShippingRates } from "../../app/lib/easypost.server";

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
    const { checkoutSessionId, shippingAddress } = JSON.parse(event.body || '{}');

    if (!checkoutSessionId || !shippingAddress) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    
    // Get quantity from metadata
    const totalQuantity = parseInt(session.metadata?.totalQuantity || '1');

    // Calculate shipping rates using EasyPost
    const rates = await calculateShippingRates(
      {
        street1: shippingAddress.line1,
        street2: shippingAddress.line2 || undefined,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      totalQuantity
    );

    // Convert to Stripe shipping options format
    const shippingOptions = rates.map(rate => ({
      id: rate.id,
      label: `${rate.carrier} ${rate.service}`,
      detail: rate.deliveryDays ? `${rate.deliveryDays}-${rate.deliveryDays + 2} business days` : null,
      amount: rate.rate, // Already in cents
    }));

    // Update the checkout session with new shipping options
    await stripe.checkout.sessions.update(checkoutSessionId, {
      shipping_options: shippingOptions.map(option => ({
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: {
            amount: option.amount,
            currency: 'usd',
          },
          display_name: option.label,
          delivery_estimate: option.detail ? {
            minimum: {
              unit: 'business_day' as const,
              value: parseInt(option.detail.split('-')[0]),
            },
            maximum: {
              unit: 'business_day' as const,
              value: parseInt(option.detail.split('-')[1].split(' ')[0]),
            },
          } : undefined,
        },
      })),
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true,
        shippingOptions,
      }),
    };
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to calculate shipping',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};