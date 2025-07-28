import Stripe from 'stripe';
import { calculateBookPrice, getBundleDeals, getCurrentTier } from '~/lib/priceCalculator';
import { books, BUNDLE_DEAL } from '~/data/books';
import type { CartItem } from '~/contexts/CartContext';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession(
  items: CartItem[],
  totalQuantity: number,
  orderNotes?: string
) {
  // Check if this qualifies for bundle deal
  const bundleDeal = getBundleDeals(totalQuantity);
  const isBundle = totalQuantity === 4 && bundleDeal.available;
  
  // Get current pricing tier
  const unitPrice = calculateBookPrice(totalQuantity);
  const currentTier = getCurrentTier(totalQuantity);
  
  // Build line items
  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  
  if (isBundle) {
    // Use bundle pricing
    lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: BUNDLE_DEAL.title,
          description: BUNDLE_DEAL.description,
          metadata: {
            type: 'bundle',
            bookIds: BUNDLE_DEAL.bookIds.join(','),
          }
        },
        unit_amount: Math.round(BUNDLE_DEAL.price * 100), // Convert to cents
      },
      quantity: 1,
    }];
  } else {
    // Create single line item with dynamic pricing
    const bookTitles = items.map(item => {
      const book = books.find(b => b.id === item.bookId);
      return `${book?.title} (×${item.quantity})`;
    }).join(', ');
    
    lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Tiny Books Order (${totalQuantity} books)`,
          description: bookTitles,
          metadata: {
            type: 'bulk_order',
            totalQuantity: totalQuantity.toString(),
            pricePerUnit: unitPrice.toFixed(2),
            tierRange: currentTier ? 
              `${currentTier.minQty}-${currentTier.maxQty || '500+'}` : 
              'base',
          }
        },
        unit_amount: Math.round(unitPrice * 100), // Convert to cents
      },
      quantity: totalQuantity,
    }];
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.APP_URL}/books/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/checkout`,
    metadata: {
      orderNotes: orderNotes || '',
      items: JSON.stringify(items),
      totalQuantity: totalQuantity.toString(),
      unitPrice: unitPrice.toFixed(2),
      isBundle: isBundle.toString(),
    },
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ'], // Add more as needed
    },
    // No shipping_options - they'll be dynamically calculated
    async_workflows: {
      inputs: {
        tax_calculation: {
          enabled: false,
        },
        shipping_cost: {
          enabled: true,
        },
      },
    },
  });

  return session;
}

export async function getCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'customer'],
  });
}

export { stripe };