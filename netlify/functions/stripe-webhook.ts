import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import Stripe from "stripe";
import { calculateShippingRates } from "../../app/lib/easypost.server";

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

// Send order notification via Netlify Forms
const sendOrderNotification = async (orderData: any) => {
  console.log('=== NEW ORDER RECEIVED ===');
  console.log('Order Details:', JSON.stringify(orderData, null, 2));
  console.log('========================');
  
  try {
    // Format order details for the form
    const orderDetails = orderData.lineItems.length > 0 
      ? orderData.lineItems.map((item: any) => `${item.productName}: ${item.quantity} x $${item.unitAmount} = $${item.totalAmount}`).join(' | ')
      : 'No line items available';
    
    // Format shipping address
    const shippingAddress = orderData.shippingAddress 
      ? `${orderData.shippingAddress.line1 || ''}${orderData.shippingAddress.line2 ? ', ' + orderData.shippingAddress.line2 : ''}, ${orderData.shippingAddress.city || ''}, ${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.postal_code || ''}, ${orderData.shippingAddress.country || ''}`
      : 'No shipping address provided';

    // Prepare form data for Netlify Forms
    const formData = new URLSearchParams({
      'form-name': 'order-notifications',
      'customerName': orderData.customerName || 'Not provided',
      'customerEmail': orderData.customerEmail || 'Not provided',
      'customerPhone': orderData.customerPhone || 'Not provided',
      'orderTotal': `$${orderData.amountTotal}`,
      'totalQuantity': orderData.totalQuantity.toString(),
      'pricePerUnit': `$${orderData.pricePerUnit}`,
      'orderDetails': orderDetails,
      'shippingAddress': shippingAddress,
      'orderNotes': orderData.orderNotes || 'No notes provided',
      'sessionId': orderData.sessionId,
      'orderDate': orderData.createdAt
    });

    console.log('Submitting form to Netlify:', formData.toString());

    // Submit to Netlify Forms
    const response = await fetch('https://iambic-nana.netlify.app/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (response.ok) {
      console.log('Order notification submitted to Netlify Forms successfully');
      return true;
    } else {
      console.error('Failed to submit to Netlify Forms:', response.status, await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error submitting order notification:', error);
    return false;
  }
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

    // Handle shipping rate calculation
    if (stripeEvent.type === 'checkout.session.async_payment_intent_created') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      
      if (session.shipping_details?.address) {
        try {
          // Get quantity from metadata
          const totalQuantity = parseInt(session.metadata?.totalQuantity || '1');
          
          // Calculate shipping rates using EasyPost
          const rates = await calculateShippingRates(
            {
              street1: session.shipping_details.address.line1!,
              street2: session.shipping_details.address.line2 || undefined,
              city: session.shipping_details.address.city!,
              state: session.shipping_details.address.state!,
              zip: session.shipping_details.address.postal_code!,
              country: session.shipping_details.address.country!,
            },
            totalQuantity
          );

          // Convert EasyPost rates to Stripe shipping options
          const shippingOptions = rates.map(rate => ({
            shipping_rate_data: {
              type: 'fixed_amount' as const,
              fixed_amount: {
                amount: rate.rate,
                currency: 'usd',
              },
              display_name: `${rate.carrier} ${rate.service}`,
              delivery_estimate: rate.deliveryDays ? {
                minimum: {
                  unit: 'business_day' as const,
                  value: rate.deliveryDays,
                },
                maximum: {
                  unit: 'business_day' as const,
                  value: rate.deliveryDays + 2,
                },
              } : undefined,
              metadata: {
                carrier: rate.carrier,
                service: rate.service,
                easypost_rate_id: rate.id,
              },
            },
          }));

          // Update the checkout session with shipping options
          await stripe.checkout.sessions.update(session.id, {
            shipping_options: shippingOptions,
          });

          console.log('Shipping rates calculated and updated successfully');
        } catch (error) {
          console.error('Error calculating shipping rates:', error);
          // Use fallback rates if something goes wrong
          await stripe.checkout.sessions.update(session.id, {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: {
                    amount: 799,
                    currency: 'usd',
                  },
                  display_name: 'Standard Shipping (5-7 business days)',
                },
              },
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: {
                    amount: 1500,
                    currency: 'usd',
                  },
                  display_name: 'Express Shipping (2-3 business days)',
                },
              },
            ],
          });
        }
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ received: true }),
      };
    }

    // Handle the checkout.session.completed event
    if (stripeEvent.type === 'checkout.session.completed') {
      const sessionFromWebhook = stripeEvent.data.object as Stripe.Checkout.Session;
      
      console.log('Checkout session completed:', sessionFromWebhook.id);
      
      // Retrieve the full session with expanded fields
      const session = await stripe.checkout.sessions.retrieve(
        sessionFromWebhook.id,
        {
          expand: ['line_items', 'line_items.data.price.product']
        }
      );
      
      console.log('Full session shipping_details:', JSON.stringify(session.shipping_details, null, 2));
      console.log('Full session customer_details:', JSON.stringify(session.customer_details, null, 2));

      // Extract order information
      const orderData = {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        customerPhone: session.customer_details?.phone,
        shippingAddress: session.shipping_details?.address || session.customer_details?.address,
        amountTotal: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
        currency: session.currency,
        orderNotes: session.metadata?.orderNotes || '',
        totalQuantity: session.metadata?.totalQuantity || '',
        pricePerUnit: session.metadata?.pricePerUnit || '',
        createdAt: new Date(session.created * 1000).toISOString(),
        lineItems: [] as Array<{
          productName: string;
          quantity: number | null;
          unitAmount: number;
          totalAmount: number;
        }>,
      };

      // Process the line items (already expanded)
      if (session.line_items && 'data' in session.line_items) {
        orderData.lineItems = session.line_items.data.map(item => ({
          productName: (item.price?.product as Stripe.Product)?.name || 'Unknown Product',
          quantity: item.quantity,
          unitAmount: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          totalAmount: item.amount_total ? item.amount_total / 100 : 0,
        }));
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