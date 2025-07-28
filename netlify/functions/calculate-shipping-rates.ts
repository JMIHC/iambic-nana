import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import { calculateShippingRates } from "../../app/lib/easypost.server";

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
    const { address, quantity } = JSON.parse(event.body || '{}');

    if (!address || !quantity) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Calculate shipping rates using EasyPost
    const rates = await calculateShippingRates(
      {
        street1: address.street1,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
      quantity
    );

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true,
        rates,
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