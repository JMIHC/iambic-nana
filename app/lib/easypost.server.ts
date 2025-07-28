import EasyPostClient from '@easypost/api';

const client = new EasyPostClient(process.env.EASYPOST_API_KEY!);

// Packaging and content specifications
const PACKAGING = {
  // Padded envelope dimensions (in inches)
  length: 8.5,
  width: 5.5,
  baseHeight: 0.25, // Base thickness of padded envelope
  
  // Weight components (in ounces)
  bookWeight: 0.1, // Each individual book
  packagingWeight: 0.6, // Padded envelope + packing slip + card
  heightPerBook: 0.1, // Additional height per book in stack
};

export async function calculateShippingRates(
  destination: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  },
  quantity: number
) {
  try {
    // Create from address (you'll need to set these in env vars)
    const fromAddress = await client.Address.create({
      street1: process.env.SHIP_FROM_STREET1!,
      city: process.env.SHIP_FROM_CITY!,
      state: process.env.SHIP_FROM_STATE!,
      zip: process.env.SHIP_FROM_ZIP!,
      country: process.env.SHIP_FROM_COUNTRY || 'US',
      company: process.env.SHIP_FROM_COMPANY,
      phone: process.env.SHIP_FROM_PHONE,
    });

    // Create to address
    const toAddress = await client.Address.create({
      street1: destination.street1,
      street2: destination.street2,
      city: destination.city,
      state: destination.state,
      zip: destination.zip,
      country: destination.country,
    });

    // Calculate parcel dimensions and weight based on actual specifications
    const totalWeight = PACKAGING.packagingWeight + (PACKAGING.bookWeight * quantity);
    const totalHeight = PACKAGING.baseHeight + (PACKAGING.heightPerBook * quantity);
    
    const parcel = await client.Parcel.create({
      length: PACKAGING.length,
      width: PACKAGING.width,
      height: Math.min(totalHeight, 12), // Cap height at 12 inches for USPS limits
      weight: Math.max(totalWeight, 1), // Minimum 1 oz for shipping calculations
    });

    // Create shipment with carrier accounts to ensure we get Media Mail
    const shipment = await client.Shipment.create({
      from_address: fromAddress,
      to_address: toAddress,
      parcel: parcel,
      options: {
        print_custom_1: 'Books - Media Mail Eligible'
      }
    });

    // Get rates
    const rates = shipment.rates || [];
    
    // Filter and sort rates - prioritize Media Mail for books
    const formattedRates = rates
      .map(rate => ({
        carrier: rate.carrier,
        service: rate.service,
        rate: Math.round(parseFloat(rate.rate) * 100), // Convert to cents
        deliveryDays: rate.delivery_days,
        deliveryDate: rate.delivery_date,
        id: rate.id,
        isMediaMail: rate.service?.toLowerCase().includes('media') || rate.service?.toLowerCase().includes('book'),
      }))
      .sort((a, b) => {
        // Sort Media Mail first, then by price
        if (a.isMediaMail && !b.isMediaMail) return -1;
        if (!a.isMediaMail && b.isMediaMail) return 1;
        return a.rate - b.rate;
      });

    // If we have rates, return them, otherwise return fallback with Media Mail
    return formattedRates.length > 0 ? formattedRates : getFallbackRates(quantity);
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    // Return fallback rates if EasyPost fails
    return getFallbackRates(quantity);
  }
}

function getFallbackRates(quantity: number = 1) {
  // Calculate actual package weight for fallback rate estimation
  const totalWeight = PACKAGING.packagingWeight + (PACKAGING.bookWeight * quantity);
  const weightInOz = Math.max(totalWeight, 1);
  
  // USPS Media Mail rates based on weight (very lightweight packages)
  // For under 1 oz packages, these are approximate base rates
  const mediaMailBase = weightInOz <= 1 ? 320 : 350; // $3.20-$3.50 for tiny packages
  const groundBase = weightInOz <= 1 ? 420 : 480; // $4.20-$4.80 for tiny packages  
  const priorityBase = weightInOz <= 1 ? 520 : 580; // $5.20-$5.80 for tiny packages
  
  return [
    {
      carrier: 'USPS',
      service: 'Media Mail',
      rate: Math.round(mediaMailBase + (quantity > 1 ? (quantity - 1) * 10 : 0)), // Minimal increment
      deliveryDays: 8, // Media Mail is slower but much cheaper
      deliveryDate: null,
      id: 'fallback-media-mail',
      isMediaMail: true,
    },
    {
      carrier: 'USPS',
      service: 'Ground Advantage',
      rate: Math.round(groundBase + (quantity > 1 ? (quantity - 1) * 20 : 0)),
      deliveryDays: 5,
      deliveryDate: null,
      id: 'fallback-ground',
      isMediaMail: false,
    },
    {
      carrier: 'USPS',
      service: 'Priority Mail',
      rate: Math.round(priorityBase + (quantity > 1 ? (quantity - 1) * 30 : 0)),
      deliveryDays: 3,
      deliveryDate: null,
      id: 'fallback-priority',
      isMediaMail: false,
    },
  ];
}

export { client as easypostClient };