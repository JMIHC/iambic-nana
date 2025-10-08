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

    // For Media Mail, USPS charges a minimum rate for packages under 1 lb (16 oz)
    // So we round up to 16 oz to get accurate Media Mail pricing from EasyPost
    const weightForRating = Math.max(totalWeight, 16);

    const parcel = await client.Parcel.create({
      length: PACKAGING.length,
      width: PACKAGING.width,
      height: Math.min(totalHeight, 12), // Cap height at 12 inches for USPS limits
      weight: weightForRating, // Use 1 lb minimum for accurate Media Mail pricing
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
    
    console.log('EasyPost returned rates:', rates.map(r => ({ 
      carrier: r.carrier, 
      service: r.service, 
      rate: r.rate 
    })));
    
    // Filter and sort rates - prioritize Media Mail for books
    const formattedRates = rates
      .map(rate => ({
        carrier: rate.carrier,
        service: rate.service,
        rate: Math.round(parseFloat(rate.rate) * 100), // Convert to cents
        deliveryDays: rate.delivery_days,
        deliveryDate: rate.delivery_date,
        id: rate.id,
        isMediaMail: rate.service?.toLowerCase().includes('media'),
      }))
      .sort((a, b) => {
        // Sort Media Mail first, then by price
        if (a.isMediaMail && !b.isMediaMail) return -1;
        if (!a.isMediaMail && b.isMediaMail) return 1;
        return a.rate - b.rate;
      });

    // Always include fallback Media Mail if EasyPost doesn't provide it
    const hasMediaMail = formattedRates.some(rate => rate.isMediaMail);
    const finalRates = [...formattedRates];
    
    if (!hasMediaMail) {
      // Add our own Media Mail option at the beginning
      // USPS Media Mail minimum is $4.13 for packages under 1 lb (as of 2025)
      // Media Mail scales in 1 lb increments, but for small books we use the base rate
      const mediaMailRate = {
        carrier: 'USPS',
        service: 'Media Mail',
        rate: 413, // $4.13 - USPS minimum for under 1 lb
        deliveryDays: 8,
        deliveryDate: null,
        id: 'custom-media-mail',
        isMediaMail: true,
      };
      finalRates.unshift(mediaMailRate);
    }

    // If we have any rates, return them, otherwise return full fallback
    return finalRates.length > 0 ? finalRates : getFallbackRates(quantity);
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    // Return fallback rates if EasyPost fails
    return getFallbackRates(quantity);
  }
}

function getFallbackRates(quantity: number = 1) {
  // Calculate actual package weight for fallback rate estimation
  const totalWeight = PACKAGING.packagingWeight + (PACKAGING.bookWeight * quantity);

  // USPS Media Mail minimum is $4.13 for packages under 1 lb (as of 2025)
  // Since our books are very light (1 oz each), we always use the base rate
  const mediaMailRate = 413; // $4.13 - USPS minimum

  // First-Class Mail and Priority Mail estimates for lightweight packages
  const firstClassRate = 420 + (quantity > 1 ? (quantity - 1) * 25 : 0); // 25¢ per additional
  const priorityRate = 520 + (quantity > 1 ? (quantity - 1) * 35 : 0); // 35¢ per additional

  return [
    {
      carrier: 'USPS',
      service: 'Media Mail',
      rate: mediaMailRate,
      deliveryDays: 8, // Media Mail is slower but cheaper
      deliveryDate: null,
      id: 'fallback-media-mail',
      isMediaMail: true,
    },
    {
      carrier: 'USPS',
      service: 'First-Class Mail',
      rate: Math.round(firstClassRate),
      deliveryDays: 3,
      deliveryDate: null,
      id: 'fallback-first-class',
      isMediaMail: false,
    },
    {
      carrier: 'USPS',
      service: 'Priority Mail',
      rate: Math.round(priorityRate),
      deliveryDays: 3,
      deliveryDate: null,
      id: 'fallback-priority',
      isMediaMail: false,
    },
  ];
}

export { client as easypostClient };