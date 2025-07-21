export interface Book {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface PricingTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
  stripePriceId: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    minQty: 1,
    maxQty: 99,
    pricePerUnit: 2.00,
    stripePriceId: 'price_1_99'
  },
  {
    minQty: 100,
    maxQty: 299,
    pricePerUnit: 1.75,
    stripePriceId: 'price_100_299'
  },
  {
    minQty: 300,
    maxQty: 499,
    pricePerUnit: 1.50,
    stripePriceId: 'price_300_499'
  },
  {
    minQty: 500,
    maxQty: null,
    pricePerUnit: 1.10,
    stripePriceId: 'price_500_plus'
  }
];