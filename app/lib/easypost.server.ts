import EasyPostClient from '@easypost/api';

const client = new EasyPostClient(process.env.EASYPOST_API_KEY!);

// Standard package dimensions for books (in inches)
const BOOK_PARCEL = {
  length: 9,
  width: 6,
  height: 2,
  weight: 16, // in ounces
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

    // Calculate parcel size based on quantity
    const parcel = await client.Parcel.create({
      length: BOOK_PARCEL.length,
      width: BOOK_PARCEL.width,
      height: Math.min(BOOK_PARCEL.height * quantity, 12), // Cap height at 12 inches
      weight: BOOK_PARCEL.weight * quantity,
    });

    // Create shipment
    const shipment = await client.Shipment.create({
      from_address: fromAddress,
      to_address: toAddress,
      parcel: parcel,
    });

    // Get rates
    const rates = shipment.rates || [];
    
    // Format rates for Stripe
    return rates.map(rate => ({
      carrier: rate.carrier,
      service: rate.service,
      rate: Math.round(parseFloat(rate.rate) * 100), // Convert to cents
      deliveryDays: rate.delivery_days,
      deliveryDate: rate.delivery_date,
      id: rate.id,
    }));
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    // Return fallback rates if EasyPost fails
    return getFallbackRates();
  }
}

function getFallbackRates() {
  return [
    {
      carrier: 'USPS',
      service: 'Standard',
      rate: 799, // $7.99
      deliveryDays: 5,
      deliveryDate: null,
      id: 'fallback-standard',
    },
    {
      carrier: 'USPS',
      service: 'Express',
      rate: 1500, // $15.00
      deliveryDays: 2,
      deliveryDate: null,
      id: 'fallback-express',
    },
  ];
}

export { client as easypostClient };