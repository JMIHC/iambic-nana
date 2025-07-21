import { PRICING_TIERS } from '~/types/book';
import { BUNDLE_DEAL } from '~/data/books';

export function calculateBookPrice(quantity: number): number {
  const tier = PRICING_TIERS.find(
    t => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );
  return tier ? tier.pricePerUnit : PRICING_TIERS[0].pricePerUnit;
}

export function calculateTotalPrice(quantity: number): number {
  // Special case: exactly 4 books get bundle pricing
  if (quantity === 4) {
    return BUNDLE_DEAL.price;
  }
  
  // For more than 4 books: bundle price + regular tiered pricing for extras
  if (quantity > 4) {
    const extraBooks = quantity - 4;
    const extraPrice = extraBooks * calculateBookPrice(extraBooks);
    return BUNDLE_DEAL.price + extraPrice;
  }
  
  // Less than 4 books: regular tiered pricing
  return quantity * calculateBookPrice(quantity);
}

export function getSavings(quantity: number): number {
  const basePrice = PRICING_TIERS[0].pricePerUnit;
  const baseTotalPrice = quantity * basePrice;
  const actualTotalPrice = calculateTotalPrice(quantity);
  return baseTotalPrice - actualTotalPrice;
}

export function getBundleDeals(quantity: number) {
  if (quantity === 4) {
    const regularPrice = 4 * calculateBookPrice(4); // Calculate without bundle pricing
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
