import { useState, useEffect } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { books } from "~/data/books";
import { useCart } from "~/contexts/CartContext";
import { 
  calculateBookPrice, 
  calculateTotalPrice,
  getCurrentTier,
} from "~/lib/priceCalculator";
import { PRICING_TIERS } from "~/types/book";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const book = books.find(b => b.id === params.bookId);
  
  if (!book) {
    throw new Response("Book not found", { status: 404 });
  }
  
  return json({ book });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.book) {
    return [{ title: "Book not found" }];
  }
  
  return [
    { title: `${data.book.title} - Iambic.Nana` },
    { name: "description", content: data.book.description },
  ];
};

export default function BookDetail() {
  const { book } = useLoaderData<typeof loader>();
  const { addToCart, getTotalQuantity, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  
  const currentCartQuantity = getTotalQuantity();
  const itemQuantityInCart = getItemQuantity(book.id);
  const projectedTotalQuantity = currentCartQuantity + quantity;
  const unitPrice = calculateBookPrice(projectedTotalQuantity);
  const totalPrice = quantity * unitPrice;
  
  const currentTier = getCurrentTier(projectedTotalQuantity);
  const basePrice = PRICING_TIERS[0].pricePerUnit;
  const savingsPerUnit = basePrice - unitPrice;
  const totalSavings = savingsPerUnit * quantity;

  const handleAddToCart = () => {
    addToCart(book.id, quantity);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const handleQuickAdd = (qty: number) => {
    setQuantity(qty);
  };

  useEffect(() => {
    // Update price when cart changes
  }, [currentCartQuantity]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link to="/books" className="text-purple-600 hover:underline mb-4 inline-block">
        ← Back to all books
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Book Image */}
        <div>
          <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src={book.image} 
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Book Details and Order Form */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{book.description}</p>
          
          {itemQuantityInCart > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-blue-700">
                You already have {itemQuantityInCart} of this book in your cart
              </p>
            </div>
          )}

          {/* Price Display */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="mb-4">
              <div className="text-3xl font-bold text-purple-600">
                Unit price: ${unitPrice.toFixed(2)}
              </div>
              {savingsPerUnit > 0 && (
                <div className="text-sm text-green-600">
                  Save ${savingsPerUnit.toFixed(2)} per book at this quantity!
                </div>
              )}
            </div>

            {/* Quantity Input */}
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg"
              />
            </div>

            {/* Quick Add Buttons */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {[10, 25, 50, 100].map(qty => (
                  <button
                    key={qty}
                    onClick={() => handleQuickAdd(qty)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Price */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg">Total for {quantity} books:</span>
                <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-purple-700 transition-colors"
              >
                Add to Cart
              </button>
              
              {showAddedMessage && (
                <div className="mt-2 text-green-600 text-center font-semibold">
                  Added to cart!
                </div>
              )}
            </div>
          </div>

          {/* Bulk Order Section */}
          <div className="bg-coral-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-coral-700">Bulk Order?</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Pricing Tiers</h3>
            </div>

            {currentTier && projectedTotalQuantity > 1 && (
              <div className="mb-4 p-3 bg-white rounded">
                <p className="font-semibold text-green-600">
                  Current tier: {currentTier.minQty}-{currentTier.maxQty || '500+'} books
                </p>
                {totalSavings > 0 && (
                  <p className="text-sm">
                    You're saving ${totalSavings.toFixed(2)} on this order!
                  </p>
                )}
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <p className="font-semibold text-lg">Ordering 100+ books?</p>
              <p className="mb-3">Contact us for a custom invoice.</p>
              <a 
                href="mailto:orders@iambic.nana?subject=Bulk Order Inquiry"
                className="inline-block bg-coral-600 text-white px-6 py-2 rounded-lg hover:bg-coral-700 transition-colors"
              >
                Contact for Bulk Orders
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-600">
            <p className="mb-2">• Free shipping on orders over $35</p>
            <p className="mb-2">• International shipping available</p>
            <p>• All books are printed on demand</p>
          </div>
        </div>
      </div>
    </div>
  );
}