import { PRICING_TIERS } from '~/types/book';
import { BUNDLE_DEAL } from '~/data/books';

export interface CartItem {
  bookId: string;
  quantity: number;
}

export function calculateBookPrice(quantity: number): number {
  const tier = PRICING_TIERS.find(
    t => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );
  return tier ? tier.pricePerUnit : PRICING_TIERS[0].pricePerUnit;
}

/**
 * Check if cart qualifies for the Community-Building Stimulus Package
 * Requirements: Contains at least one of each of the 4 different tiny books
 * The stimulus package discount applies once, even if extra books are added
 */
function qualifiesForStimulusPackage(cartItems: CartItem[]): boolean {
  const requiredBookIds = BUNDLE_DEAL.bookIds;

  // Check that each required book is present with at least quantity of 1
  // This allows the discount to remain even when extra books are added
  return requiredBookIds.every(requiredId =>
    cartItems.some(item => item.bookId === requiredId && item.quantity >= 1)
  );
}

/**
 * Count how many books beyond the 4-book stimulus package are in the cart
 */
function countExtraBooksAfterStimulus(cartItems: CartItem[]): number {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // The first occurrence of each of the 4 required books counts toward the stimulus package
  // Any quantity beyond 1 for those books, or any other books, count as extras
  const requiredBookIds = BUNDLE_DEAL.bookIds;

  let extraBooks = 0;
  for (const item of cartItems) {
    if (requiredBookIds.includes(item.bookId)) {
      // For required books, quantities beyond 1 are extras
      if (item.quantity > 1) {
        extraBooks += item.quantity - 1;
      }
    } else {
      // Books not in the required set are all extras
      extraBooks += item.quantity;
    }
  }

  return extraBooks;
}

export function calculateTotalPrice(quantity: number, cartItems?: CartItem[]): number {
  // Check if cart qualifies for the Community-Building Stimulus Package
  // The package can only be claimed once, but the discount is retained when extra books are added
  if (cartItems && qualifiesForStimulusPackage(cartItems)) {
    const extraBooks = countExtraBooksAfterStimulus(cartItems);

    // Apply bundle price for the 4-book stimulus package
    let total = BUNDLE_DEAL.price;

    // Add regular tiered pricing for any extra books
    if (extraBooks > 0) {
      const extraPrice = extraBooks * calculateBookPrice(extraBooks);
      total += extraPrice;
    }

    return total;
  }

  // Regular tiered pricing (doesn't qualify for stimulus package)
  return quantity * calculateBookPrice(quantity);
}

export function getSavings(quantity: number, cartItems?: CartItem[]): number {
  const basePrice = PRICING_TIERS[0].pricePerUnit;
  const baseTotalPrice = quantity * basePrice;
  const actualTotalPrice = calculateTotalPrice(quantity, cartItems);
  return baseTotalPrice - actualTotalPrice;
}

export function getBundleDeals(quantity: number, cartItems?: CartItem[]) {
  if (cartItems && qualifiesForStimulusPackage(cartItems)) {
    const regularPrice = 4 * calculateBookPrice(4);
    const bundlePrice = BUNDLE_DEAL.price;
    const savings = regularPrice - bundlePrice;

    // Build appropriate message based on whether there are extra books
    let message = `Save $${savings.toFixed(2)} with the Community-Building Stimulus Package!`;
    if (quantity > 4) {
      const extraBooks = quantity - 4;
      message += ` (Plus ${extraBooks} additional book${extraBooks > 1 ? 's' : ''} at regular pricing)`;
    }

    return {
      available: true,
      bundlePrice,
      regularPrice,
      savings,
      message
    };
  }

  return {
    available: false,
    bundlePrice: 0,
    regularPrice: 0,
    savings: 0,
    message: ''
  };
}

export function getCurrentTier(quantity: number) {
  return PRICING_TIERS.find(
    t => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );
}
