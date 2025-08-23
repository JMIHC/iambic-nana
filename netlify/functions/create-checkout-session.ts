import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// Book pricing tiers (should match your frontend)
const PRICING_TIERS = [
  { minQty: 1, maxQty: 99, pricePerUnit: 2.00 },
  { minQty: 100, maxQty: 299, pricePerUnit: 1.75 },
  { minQty: 300, maxQty: 499, pricePerUnit: 1.50 },
  { minQty: 500, maxQty: null, pricePerUnit: 1.10 }
];

// Book details (should match your frontend)
const BOOKS = {
  "bahai-faith-english": { title: "The Bahá'í Faith (English)", description: "An introduction to the Bahá'í Faith" },
  "bahai-faith-spanish": { title: "The Bahá'í Faith (Spanish)", description: "Una introducción a la Fe Bahá'í" },
  "tiny-book-prayers": { title: "Tiny Book of Prayers", description: "A collection of prayers and meditations" },
  "soul-is-forever": { title: "A Soul Is Forever", description: "Reflections on the eternal nature of the soul" }
};

function calculatePricing(totalQuantity: number) {
  const tier = PRICING_TIERS.find(tier => 
    totalQuantity >= tier.minQty && (tier.maxQty === null || totalQuantity <= tier.maxQty)
  ) || PRICING_TIERS[0];
  
  return {
    pricePerUnit: tier.pricePerUnit,
    subtotal: totalQuantity * tier.pricePerUnit,
    currentTier: tier
  };
}

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { items, orderNotes, needs100Plus, isInternational, mode } = JSON.parse(event.body || "{}");

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid cart items" }),
      };
    }

    // Calculate total quantity
    const totalQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

    // Don't process international orders through Stripe
    if (isInternational) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: "International shipping requires manual processing. Please contact us directly." 
        }),
      };
    }

    // Calculate pricing (check for bundle deal first)
    const isBundle = totalQuantity === 4;
    const pricing = isBundle 
      ? { pricePerUnit: 1.75, subtotal: 7.00, currentTier: { minQty: 4, maxQty: 4, pricePerUnit: 1.75 } }
      : calculatePricing(totalQuantity);

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      const book = BOOKS[item.bookId as keyof typeof BOOKS];
      if (!book) {
        throw new Error(`Invalid book ID: ${item.bookId}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: book.title,
            description: book.description,
          },
          unit_amount: Math.round(pricing.pricePerUnit * 100), // Apply tier pricing consistently
        },
        quantity: item.quantity,
      };
    });

    // Get the site URL for redirects
    const siteUrl = process.env.URL || "http://localhost:8888";

    // Create checkout session config
    const sessionConfig: any = {
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteUrl}/books/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout-cart`,
      metadata: {
        orderNotes: orderNotes || "",
        totalQuantity: totalQuantity.toString(),
        pricePerUnit: pricing.pricePerUnit.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ'],
      },
    };

    // Configure for embedded or hosted mode
    if (mode === 'embedded') {
      // For embedded mode, start with minimal shipping to be updated dynamically
      sessionConfig.ui_mode = 'embedded';
      sessionConfig.return_url = `${siteUrl}/books/success?session_id={CHECKOUT_SESSION_ID}`;
      sessionConfig.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Calculating shipping...",
          },
        },
      ];
      // Note: permissions field may not be supported in current API version
      // Will rely on webhook for shipping updates instead
    } else {
      // Standard hosted checkout with fixed rates
      sessionConfig.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 799, // $7.99
              currency: "usd",
            },
            display_name: "Standard Shipping (5-7 business days)",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500, // $15.00
              currency: "usd",
            },
            display_name: "Express Shipping (2-3 business days)",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 3,
              },
            },
          },
        },
      ];
    }

    // Add additional config
    sessionConfig.customer_creation = "always";
    sessionConfig.payment_intent_data = {
      metadata: {
        orderNotes: orderNotes || "",
        totalQuantity: totalQuantity.toString(),
      },
    };

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: session.url,
        sessionId: session.id,
        client_secret: mode === 'embedded' ? session.client_secret : undefined,
      }),
    };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};