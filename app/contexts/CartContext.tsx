import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Book } from '~/types/book';
import { 
  calculateBookPrice, 
  calculateTotalPrice, 
  getSavings, 
  getBundleDeals,
  getCurrentTier
} from '~/lib/priceCalculator';

export interface CartItem {
  bookId: string;
  quantity: number;
}

interface CartSummary {
  totalQuantity: number;
  pricePerUnit: number;
  subtotal: number;
  savings: number;
  bundleDeal: ReturnType<typeof getBundleDeals>;
  currentTier: ReturnType<typeof getCurrentTier>;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (bookId: string, quantity: number) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  getCartSummary: () => CartSummary;
  getTotalQuantity: () => number;
  getItemQuantity: (bookId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const getTotalQuantity = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getItemQuantity = useCallback((bookId: string) => {
    const item = items.find(i => i.bookId === bookId);
    return item ? item.quantity : 0;
  }, [items]);

  const getCartSummary = useCallback((): CartSummary => {
    const totalQuantity = getTotalQuantity();
    const subtotal = calculateTotalPrice(totalQuantity);
    const savings = getSavings(totalQuantity);
    const bundleDeal = getBundleDeals(totalQuantity);
    const currentTier = getCurrentTier(totalQuantity);
    
    // For display purposes, calculate effective price per unit
    const pricePerUnit = totalQuantity > 0 ? subtotal / totalQuantity : 0;

    return {
      totalQuantity,
      pricePerUnit,
      subtotal,
      savings,
      bundleDeal,
      currentTier
    };
  }, [getTotalQuantity]);

  const addToCart = useCallback((bookId: string, quantity: number) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.bookId === bookId);
      
      if (existingIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }
      
      return [...prevItems, { bookId, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    setItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => item.bookId !== bookId);
      }
      
      const existingIndex = prevItems.findIndex(item => item.bookId === bookId);
      if (existingIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity = quantity;
        return newItems;
      }
      
      return [...prevItems, { bookId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((bookId: string) => {
    setItems(prevItems => prevItems.filter(item => item.bookId !== bookId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value: CartContextType = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartSummary,
    getTotalQuantity,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Cart display component
export function CartSummaryDisplay() {
  const { getCartSummary, items } = useCart();
  const summary = getCartSummary();

  if (summary.totalQuantity === 0) return null;

  const reachedNewTier = summary.currentTier && 
    summary.currentTier.minQty === summary.totalQuantity;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-4">Cart Summary</h3>
      
      {/* Current pricing */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="text-2xl font-bold">
          {summary.totalQuantity} books @ ${summary.pricePerUnit.toFixed(2)} each
        </div>
        <div className="text-3xl font-bold text-purple-600">
          Total: ${summary.subtotal.toFixed(2)}
        </div>
        {summary.savings > 0 && (
          <div className="text-green-600 font-semibold mt-1">
            You're saving ${summary.savings.toFixed(2)}!
          </div>
        )}
      </div>

      {/* New tier reached notification */}
      {reachedNewTier && summary.currentTier && summary.currentTier.minQty > 1 && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
          <div className="text-green-700 font-semibold">
            🎉 Congrats! You've reached a new pricing tier!
          </div>
        </div>
      )}

      {/* Bundle deal suggestion */}
      {summary.totalQuantity === 4 && !summary.bundleDeal.available && (
        <div className="mb-4 p-3 bg-purple-100 border border-purple-300 rounded">
          <div className="text-purple-700">
            <div className="font-semibold mb-1">💡 Special Bundle Available!</div>
            <div>Get all 4 different books for just $7.00</div>
            <div className="text-sm">(Save ${summary.bundleDeal.savings?.toFixed(2) || '1.00'})</div>
          </div>
        </div>
      )}


      {/* Item breakdown */}
      <div className="border-t pt-3 mt-4">
        <h4 className="font-semibold mb-2">Items in cart:</h4>
        <div className="space-y-1 text-sm">
          {items.map(item => (
            <div key={item.bookId} className="flex justify-between">
              <span>{item.bookId}</span>
              <span>× {item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}