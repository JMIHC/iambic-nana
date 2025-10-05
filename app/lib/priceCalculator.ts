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
 * Requirements: exactly 4 books total, with one of each of the 4 different tiny books
 */
function qualifiesForStimulusPackage(cartItems: CartItem[]): boolean {
  // Must have exactly 4 items total
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity !== 4) return false;

  // Must have all 4 different books, each with quantity of 1
  const requiredBookIds = BUNDLE_DEAL.bookIds;
  if (cartItems.length !== requiredBookIds.length) return false;

  // Check that each required book is present with quantity 1
  return requiredBookIds.every(requiredId =>
    cartItems.some(item => item.bookId === requiredId && item.quantity === 1)
  );
}

export function calculateTotalPrice(quantity: number, cartItems?: CartItem[]): number {
  // Special case: Community-Building Stimulus Package
  // Only applies if cart has exactly one of each of the 4 different tiny books
  if (quantity === 4 && cartItems && qualifiesForStimulusPackage(cartItems)) {
    return BUNDLE_DEAL.price;
  }

  // Regular tiered pricing
  return quantity * calculateBookPrice(quantity);
}

export function getSavings(quantity: number, cartItems?: CartItem[]): number {
  const basePrice = PRICING_TIERS[0].pricePerUnit;
  const baseTotalPrice = quantity * basePrice;
  const actualTotalPrice = calculateTotalPrice(quantity, cartItems);
  return baseTotalPrice - actualTotalPrice;
}

export function getBundleDeals(quantity: number, cartItems?: CartItem[]) {
  if (quantity === 4 && cartItems && qualifiesForStimulusPackage(cartItems)) {
    const regularPrice = 4 * calculateBookPrice(4);
    const bundlePrice = BUNDLE_DEAL.price;
    const savings = regularPrice - bundlePrice;

    return {
      available: true,
      bundlePrice,
      regularPrice,
      savings,
      message: `Save $${savings.toFixed(2)} with the Community-Building Stimulus Package!`
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
