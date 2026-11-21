/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useProducts } from './ProductContext';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'rk_nutrition_wishlist';

export function WishlistProvider({ children }) {
  const { publicProducts: products } = useProducts();
  
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const toggleWishlist = useCallback((productId) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  }, []);

  const addToWishlist = useCallback((productId) => {
    setWishlistIds((prev) => {
      if (!prev.includes(productId)) {
        return [...prev, productId];
      }
      return prev;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
  }, []);

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  const value = {
    wishlistIds,
    wishlistProducts,
    wishlistCount: wishlistIds.length,
    isWishlistOpen,
    openWishlist: () => setIsWishlistOpen(true),
    closeWishlist: () => setIsWishlistOpen(false),
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
