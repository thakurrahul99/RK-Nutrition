import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    itemCount,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    amountToFreeShipping,
    freeShippingThreshold,
    appliedCoupon,
    couponError,
    couponLoading,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    closeCart
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  // Close on ESC key & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate('/products');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="cart-drawer-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Dark backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:max-w-md bg-[#111111] border-l border-[#262626] shadow-2xl flex flex-col justify-between text-[#F5F4F2] relative">
          
          {/* 1. Header */}
          <div className="p-4 sm:p-6 border-b border-[#222222] flex items-center justify-between bg-[#141414]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center font-heading font-black text-xs text-[#F5F4F2]">
                RK
              </div>
              <div>
                <h2 id="cart-drawer-title" className="font-heading font-bold text-lg uppercase tracking-wider text-[#F5F4F2] leading-none">
                  Your Cart
                </h2>
                <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-widest mt-0.5 block">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#1E1E1E] transition-colors border border-transparent hover:border-[#333333]"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="bg-[#161616] border-b border-[#222222] px-5 py-3 text-xs font-mono">
              <div className="flex items-center justify-between mb-1.5 text-[#CCCCCC]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#E11D2E]" />
                  {amountToFreeShipping > 0 ? (
                    <span>Add <strong className="text-[#F5F4F2]">{formatCurrency(amountToFreeShipping)}</strong> for <strong>FREE Delivery</strong></span>
                  ) : (
                    <span className="text-emerald-400 font-bold">You have earned FREE Standard Delivery!</span>
                  )}
                </span>
                <span className="text-[#888888] font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#262626] overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#E11D2E] via-[#FF3B4E] to-[#E11D2E] bg-[length:200%_100%] transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* 3. Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-[#1F1F1F]">
            {items.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#161616] border border-[#2E2E2E] flex items-center justify-center text-[#444444] relative group">
                  <ShoppingBag className="w-8 h-8 text-[#E11D2E]/70 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-[#E11D2E]/10 blur-xl pointer-events-none" />
                </div>
                <div className="space-y-1">
                  <p className="font-heading text-lg uppercase tracking-wider text-[#F5F4F2] font-bold">
                    Your Cart Is Empty
                  </p>
                  <p className="text-xs text-[#8C8C8C] max-w-xs leading-relaxed font-body">
                    Explore our athlete-grade formulations and upgrade your daily nutrition performance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleContinueShopping}
                  className="mt-4 px-6 py-2.5 bg-[#E11D2E] hover:bg-[#C81A27] text-[#F5F4F2] font-heading uppercase text-xs tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-[#E11D2E]/20 btn-shimmer relative overflow-hidden group cursor-pointer active:scale-95"
                >
                  <span>Explore Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 group/item hover:bg-[#141414]/50 p-2 -mx-2 transition-colors">
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={closeCart}
                    className="w-20 h-20 bg-[#161616] border border-[#2A2A2A] group-hover/item:border-[#383838] shrink-0 overflow-hidden flex items-center justify-center relative group"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="font-heading font-black text-xl text-[#333333]">RK</span>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="font-heading font-bold text-sm uppercase tracking-wide text-[#F5F4F2] hover:text-[#E11D2E] transition-colors truncate block"
                          title={item.name}
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-[#666666] hover:text-[#E11D2E] transition-colors shrink-0 active:scale-90"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variant && (
                        <div className="mt-0.5">
                          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#E11D2E] bg-[#1A1A1A] px-1.5 py-0.5 border border-[#2B2B2B]">
                            {item.variant.name}
                          </span>
                        </div>
                      )}

                      {item.paymentRule === 'PREPAID_ONLY' && (
                        <span className="text-[9px] font-mono uppercase tracking-wider text-amber-500 block mt-0.5">
                          Prepaid Only
                        </span>
                      )}
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#2E2E2E] bg-[#161616]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#202020] transition-transform active:scale-90"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-[#F5F4F2]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.stock !== undefined && item.quantity >= item.stock}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#202020] disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="font-heading text-sm font-bold text-[#F5F4F2]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] font-mono text-[#666666]">
                            {formatCurrency(item.price)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. Footer & Summary Section */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#141414] border-t border-[#222222] space-y-4">
              
              {/* Coupon Code Input */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#1A1A1A] border border-emerald-500/40 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-emerald-400 uppercase tracking-wider">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[#888888]">
                        (-{formatCurrency(discountAmount)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[11px] text-[#E11D2E] hover:underline uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="COUPON (e.g. RKLAUNCH10)"
                        className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] text-xs font-mono pl-9 pr-3 py-2 text-[#F5F4F2] placeholder-[#666666] uppercase focus:outline-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2 bg-[#222222] hover:bg-[#2C2C2C] disabled:opacity-40 text-xs font-mono uppercase tracking-wider text-[#F5F4F2] border border-[#333333] transition-colors cursor-pointer"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] font-mono text-[#E11D2E]">
                    {couponError}
                  </p>
                )}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-2 text-xs font-mono border-t border-[#222222] pt-3">
                <div className="flex justify-between text-[#AAAAAA]">
                  <span>Subtotal</span>
                  <span className="text-[#F5F4F2] font-semibold">{formatCurrency(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#AAAAAA]">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 uppercase font-bold">Free</span>
                  ) : (
                    <span className="text-[#F5F4F2]">{formatCurrency(shippingFee)}</span>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-[#262626] text-sm">
                  <span className="font-heading uppercase font-bold text-base text-[#F5F4F2] tracking-wider">
                    Total
                  </span>
                  <span className="font-heading font-black text-xl text-[#F5F4F2] tracking-tight">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA with shimmer effect */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-[#E11D2E] hover:bg-[#C81A27] text-[#F5F4F2] font-heading uppercase text-sm tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E11D2E]/25 btn-shimmer relative overflow-hidden group/btn active:scale-[0.99] cursor-pointer"
                >
                  <span>Proceed To Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                </button>

                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full py-2.5 bg-transparent hover:bg-[#1A1A1A] text-[#8C8C8C] hover:text-[#F5F4F2] text-xs font-mono uppercase tracking-wider transition-colors text-center cursor-pointer"
                >
                  Continue Shopping
                </button>

                {/* Instant Order Assistance */}
                <div className="pt-2 text-center text-[10px] font-mono text-[#777777] border-t border-[#1F1F1F]">
                  Order assistance? WhatsApp <a href="https://wa.me/918630663134" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-bold">8630663134</a> or Call <a href="tel:+918630663134" className="text-[#F5F4F2] hover:underline font-bold">8630663134</a>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
