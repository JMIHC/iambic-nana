import { useState } from "react";
import type { Route } from "./+types/tiny-books";
import { Link } from "react-router";
import { books } from "~/data/books";
import { PRICING_TIERS } from "~/types/book";
import type { Book } from "~/types/book";
import { useCart } from "~/contexts/CartContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tiny Books - Iambic Nana" },
    { name: "description", content: "Tiny book collection by Susan Engle - Order with bulk pricing discounts" },
  ];
}

function BookCard({ book }: { book: Book }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  
  // Generate different gradient backgrounds for each book
  const gradients = {
    'bahai-faith-english': 'from-purple-400 to-blue-500',
    'bahai-faith-spanish': 'from-coral-400 to-pink-500',
    'tiny-book-prayers': 'from-emerald-400 to-teal-500',
    'soul-is-forever': 'from-amber-400 to-orange-500'
  };
  
  const gradient = gradients[book.id as keyof typeof gradients] || 'from-gray-400 to-gray-500';
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(book.id, quantity);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
    setQuantity(1);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all flex flex-col h-full">
      <Link to={`/books/${book.id}`} className="block">
        <div className={`aspect-[3/4] bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
          <div className="text-white text-center p-4">
            <div className="text-6xl mb-2">📚</div>
            <div className="text-sm font-medium opacity-90">Tiny Book</div>
          </div>
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/books/${book.id}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400">{book.title}</h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 flex-1">{book.description}</p>
        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">$2.00</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Base price</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-sm font-medium"
            >
              {showAdded ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TinyBooks() {
  const { getTotalQuantity, getCartSummary, addToCart, items, updateQuantity, removeFromCart } = useCart();
  const [isCartMinimized, setIsCartMinimized] = useState(false);
  const totalQuantity = getTotalQuantity();
  const summary = getCartSummary();
  
  const handleAddBundle = () => {
    books.forEach(book => addToCart(book.id, 1));
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Tiny Books</h1>
      
      {/* Floating Cart Summary */}
      {totalQuantity > 0 && (
        <div className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          isCartMinimized ? 'w-auto' : 'w-80 max-h-96'
        }`}>
          {/* Header with minimize button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsCartMinimized(!isCartMinimized)}
              className="flex items-center gap-2 text-left text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label={isCartMinimized ? "Expand cart" : "Minimize cart"}
            >
              <h3 className="font-bold text-lg">
                Shopping Cart {isCartMinimized && `(${totalQuantity})`}
              </h3>
              {isCartMinimized ? (
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Minimized view */}
          {isCartMinimized ? (
            <div className="p-4 flex items-center gap-4">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">${summary.subtotal.toFixed(2)}</span>
              <Link
                to="/checkout"
                className="bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-sm font-medium"
              >
                Checkout
              </Link>
            </div>
          ) : (
            <div className="p-4 overflow-y-auto max-h-80">
          
          {/* Cart Items */}
          <div className="space-y-3 mb-3">
            {items.map(item => {
              const book = books.find(b => b.id === item.bookId);
              if (!book) return null;
              
              return (
                <div key={item.bookId} className="border-b border-gray-200 dark:border-gray-600 pb-2 last:border-b-0">
                  <div className="flex justify-between items-start text-sm mb-2">
                    <div className="flex-1 pr-2">
                      <p className="font-medium line-clamp-1 text-gray-900 dark:text-gray-100">{book.title}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.bookId)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.bookId, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-sm transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = Math.max(1, parseInt(e.target.value) || 1);
                          updateQuantity(item.bookId, newQty);
                        }}
                        className="w-12 h-6 text-center text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-1"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${(item.quantity * summary.pricePerUnit).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Summary */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-1">
            <div className="flex justify-between text-sm text-gray-900 dark:text-gray-100">
              <span>Total ({totalQuantity} books):</span>
              <span className="font-bold">${summary.subtotal.toFixed(2)}</span>
            </div>
            {totalQuantity === 4 ? (
              <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                Bundle pricing applied: $7.00 for all 4 books!
              </div>
            ) : (
              <div className="flex justify-between text-sm text-gray-900 dark:text-gray-100">
                <span>Average per book:</span>
                <span>${summary.pricePerUnit.toFixed(2)}</span>
              </div>
            )}
            {summary.savings > 0 && (
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                You're saving ${summary.savings.toFixed(2)}!
              </p>
            )}
          </div>
          
          
          <Link
            to="/checkout"
            className="block w-full bg-purple-600 dark:bg-purple-700 text-white text-center py-2 rounded hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors mt-4 font-medium"
          >
            Proceed to Checkout
          </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Bundle Deal Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 mb-12 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">🎉 Community-Building Stimulus Package</h2>
          <p className="text-xl mb-4">Get all 4 tiny books for just $7.00!</p>
          <button
            onClick={handleAddBundle}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            Add All 4 Books to Cart
          </button>
        </div>
      </div>

      {/* Pricing Banner */}
      <div className="bg-coral-50 dark:bg-gray-800 border-2 border-coral-200 dark:border-gray-600 rounded-xl p-6 mb-12">
        <div className="grid md:grid-cols-4 gap-4">
          {PRICING_TIERS.map((tier, index) => (
            <div 
              key={index}
              className={`text-center p-4 rounded-lg ${
                index === 0 ? 'bg-white dark:bg-gray-700' : 'bg-coral-100 dark:bg-gray-600'
              }`}
            >
              <div className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">
                {tier.maxQty ? `${tier.minQty}-${tier.maxQty}` : `${tier.minQty}+`} books
              </div>
              <div className="text-2xl font-bold text-coral-600 dark:text-coral-400">
                ${tier.pricePerUnit.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">per book</div>
              {index > 0 && (
                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-2">
                  Save ${(PRICING_TIERS[0].pricePerUnit - tier.pricePerUnit).toFixed(2)} each!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Available Books</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>International Shipping:</strong> We ship worldwide! International shipping rates will be calculated at checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>All prices are in USD. Shipping calculated at checkout.</p>
        <p>Questions? Email me at{" "}
          <a href="mytinybooks919@gmail.com" className="text-purple-600 underline">
            mytinybooks919@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}