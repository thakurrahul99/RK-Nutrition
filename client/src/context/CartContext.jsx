/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'rk_customer_cart';
const COUPON_STORAGE_KEY = 'rk_applied_coupon';
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

export function CartProvider({ children }) {
  // Initialize cart from localStorage
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Slide-over cart drawer open state
  const [isOpen, setIsOpen] = useState(false);

  // Applied coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to persist cart items to localStorage:', err);
    }
  }, [items]);

  // Persist applied coupon
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to persist coupon to localStorage:', err);
    }
  }, [appliedCoupon]);

  // Total quantity count
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, [items]);

  // Subtotal before discounts & shipping
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  }, [items]);

  // Coupon discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;

    // Check minimum cart value if defined
    if (appliedCoupon.minCartValue && subtotal < appliedCoupon.minCartValue) {
      return 0;
    }

    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(appliedCoupon.discountValue, subtotal);
  }, [appliedCoupon, subtotal]);

  // Shipping calculation
  const shippingFee = useMemo(() => {
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }
    return STANDARD_SHIPPING_FEE;
  }, [subtotal]);

  // Final total
  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  // Amount needed for free shipping
  const amountToFreeShipping = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return FREE_SHIPPING_THRESHOLD - subtotal;
  }, [subtotal]);

  // Add product to cart with variant support
  const addToCart = useCallback((product, variant = null, requestedQuantity = 1) => {
    if (!product) return { success: false, error: 'Product is required' };

    const variantId = variant?.id || 'standard';
    const cartItemId = `${product.id}__${variantId}`;

    const effectivePrice = variant?.salePrice || variant?.price || product.salePrice || product.price || 0;
    const originalPrice = variant?.price || product.price || effectivePrice;
    const hasSale = originalPrice > effectivePrice;

    const availableStock = variant?.stock !== undefined ? variant.stock : (product.stock ?? 999);
    const productImage = product.image || (product.images && product.images[0]) || '';

    let success = true;
    let message = 'Added to cart';

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === cartItemId);

      if (existingIndex > -1) {
        const existingItem = prevItems[existingIndex];
        const newQty = existingItem.quantity + requestedQuantity;

        if (newQty > availableStock) {
          success = false;
          message = `Cannot add more. Maximum available stock is ${availableStock}.`;
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQty
        };
        return updated;
      }

      if (requestedQuantity > availableStock) {
        success = false;
        message = `Requested quantity exceeds available stock (${availableStock}).`;
        return prevItems;
      }

      const newItem = {
        id: cartItemId,
        productId: product.id,
        slug: product.slug || product.id,
        name: product.name,
        image: productImage,
        category: product.category || 'Supplements',
        sku: variant?.sku || product.sku || '',
        price: effectivePrice,
        originalPrice,
        hasSale,
        quantity: requestedQuantity,
        stock: availableStock,
        paymentRule: product.paymentRule || 'ALL',
        variant: variant
          ? {
              id: variant.id,
              name: variant.name,
              sku: variant.sku || '',
              price: variant.price,
              salePrice: variant.salePrice,
              stock: variant.stock
            }
          : null
      };

      return [...prevItems, newItem];
    });

    // Auto open drawer on success
    if (success) {
      setIsOpen(true);
    }

    return { success, message };
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((cartItemId, newQuantity) => {
    const qty = Number(newQuantity);
    if (isNaN(qty) || qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== cartItemId));
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const clampedQty = item.stock ? Math.min(qty, item.stock) : qty;
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  }, []);

  // Remove individual item
  const removeFromCart = useCallback((cartItemId) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Apply coupon code via backend validation
  const applyCoupon = useCallback(async (code) => {
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code.');
      return { success: false, error: 'Please enter a coupon code.' };
    }

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          cartSubtotal: subtotal
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Invalid or expired coupon code.';
        setCouponError(errMsg);
        setCouponLoading(false);
        return { success: false, error: errMsg };
      }

      setAppliedCoupon({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        discountAmount: data.discountAmount,
        description: data.description,
        minCartValue: data.minCartValue || 0
      });

      setCouponLoading(false);
      return { success: true, coupon: data };
    } catch {
      const errMsg = 'Network error verifying coupon code.';
      setCouponError(errMsg);
      setCouponLoading(false);
      return { success: false, error: errMsg };
    }
  }, [subtotal]);

  // Remove applied coupon
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError(null);
  }, []);

  // Drawer controls
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  // Check mixed-cart payment rules
  const validateCartPayments = useCallback(async () => {
    if (items.length === 0) {
      return {
        success: true,
        codAllowed: true,
        codBlockedReason: null,
        allowedMethods: ['COD', 'UPI', 'CARD'],
        isGatewayReady: false
      };
    }

    try {
      const res = await fetch('/api/payments/validate-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
        })
      });
      return await res.json();
    } catch {
      return {
        success: false,
        codAllowed: true,
        codBlockedReason: null,
        allowedMethods: ['COD'],
        isGatewayReady: false
      };
    }
  }, [items]);

  const value = {
    items,
    isOpen,
    itemCount,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    amountToFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    appliedCoupon,
    couponError,
    couponLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    openCart,
    closeCart,
    toggleCart,
    validateCartPayments
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
