import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  CheckCircle2, 
  ShoppingCart, 
  Zap, 
  Minus, 
  Plus, 
  AlertCircle, 
  ShieldCheck, 
  Heart 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductInfo({ product }) {
  const {
    id,
    name,
    category,
    description,
    price,
    salePrice,
    variants = [],
    availability,
    stock = 10,
    paymentRule = 'ALL'
  } = product;

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(id);

  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.length > 0 ? variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  // Active selected variant
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || null;

  // Active price calculations
  const effectivePrice = selectedVariant?.salePrice || selectedVariant?.price || salePrice || price || 0;
  const originalPrice = selectedVariant?.price || price || effectivePrice;
  const hasSale = originalPrice > effectivePrice;
  const discountPercent = hasSale ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100) : 0;

  // Active stock calculation
  const availableStock = selectedVariant?.stock !== undefined ? selectedVariant.stock : (stock ?? 10);
  const isOutOfStock = availability === 'out-of-stock' || availableStock <= 0;
  const isComingSoon = availability === 'coming-soon';
  const isLowStock = !isOutOfStock && !isComingSoon && availableStock > 0 && availableStock <= 5;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > availableStock) return availableStock;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (isOutOfStock || isComingSoon) return;
    const res = addToCart(product, selectedVariant, quantity);
    if (!res.success) {
      setFeedbackMessage({ type: 'error', text: res.message });
      setTimeout(() => setFeedbackMessage(null), 3000);
    } else {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2200);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock || isComingSoon) return;
    const res = addToCart(product, selectedVariant, quantity);
    if (res.success) {
      navigate('/checkout');
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Category Tag & Stock Status Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E11D2E] font-semibold bg-[#181818] px-2.5 py-1 border border-[#282828]">
          {category}
        </span>

        <div className="flex items-center gap-2">
          {paymentRule === 'PREPAID_ONLY' && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5">
              Prepaid Only
            </span>
          )}

          {isComingSoon ? (
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5F4F2] bg-[#1A1A1A] px-2.5 py-1 border border-[#E11D2E]/60">
              Coming Soon
            </span>
          ) : isOutOfStock ? (
            <span className="text-xs font-mono uppercase tracking-widest text-red-400 bg-red-950/40 px-2.5 py-1 border border-red-800/60 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-950/40 px-2.5 py-1 border border-amber-800/60">
              Only {availableStock} Left In Stock
            </span>
          ) : (
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/30 px-2.5 py-1 border border-emerald-800/50 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Title */}
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-black tracking-tight leading-tight">
        {name}
      </h1>

      {/* Price Display */}
      <div className="py-3.5 border-y border-[#262626] flex flex-wrap items-baseline gap-3">
        {effectivePrice > 0 ? (
          <>
            <span className="font-heading text-3xl sm:text-4xl text-[#F5F4F2] font-black">
              {formatCurrency(effectivePrice)}
            </span>
            {hasSale && (
              <>
                <span className="text-lg text-[#666666] line-through font-mono">
                  {formatCurrency(originalPrice)}
                </span>
                <span className="text-xs font-mono text-[#E11D2E] uppercase font-bold bg-[#E11D2E]/10 border border-[#E11D2E]/30 px-2 py-0.5">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </>
        ) : (
          <span className="text-sm font-mono text-[#8C8C8C] uppercase tracking-wider">
            Price available upon release
          </span>
        )}
      </div>

      {/* Description when available */}
      {description && (
        <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed font-body">
          {description}
        </p>
      )}

      {/* Variants Selection (Only if configured) */}
      {variants && variants.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8C8C8C]">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#E11D2E]" />
              Select Variant
            </span>
            {selectedVariant && (
              <span className="text-[#F5F4F2] font-semibold">{selectedVariant.name}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {variants.map((variant) => {
              const isSelected = selectedVariantId === variant.id;
              const variantStock = variant.stock !== undefined ? variant.stock : stock;
              const variantOutOfStock = variantStock <= 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variantOutOfStock}
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setQuantity(1);
                  }}
                  className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-[#E11D2E] text-[#F5F4F2] border-[#E11D2E] font-bold shadow-md shadow-[#E11D2E]/30'
                      : variantOutOfStock
                      ? 'bg-[#141414] text-[#444444] border-[#222222] line-through cursor-not-allowed'
                      : 'bg-[#181818] text-[#8C8C8C] border-[#2C2C2C] hover:border-[#F5F4F2] hover:text-[#F5F4F2]'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{variant.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & Purchasing CTA Section */}
      <div className="pt-4 space-y-4">
        {feedbackMessage && (
          <div className={`p-3 text-xs font-mono border ${feedbackMessage.type === 'error' ? 'bg-red-950/30 text-red-400 border-red-900/50' : 'bg-green-950/30 text-green-400 border-green-900/50'}`}>
            {feedbackMessage.text}
          </div>
        )}

        <div className="space-y-3">
          {/* Mobile Top Controls: Quantity Selector + Wishlist Button */}
          <div className="flex sm:hidden items-center gap-2.5 w-full">
            <div className="flex-1 flex items-center justify-between border border-[#2E2E2E] bg-[#161616] px-1 h-12">
              <button
                type="button"
                disabled={isOutOfStock || isComingSoon || quantity <= 1}
                onClick={() => handleQuantityChange(-1)}
                className="w-11 h-11 flex items-center justify-center text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-mono font-bold text-[#F5F4F2]">
                {quantity}
              </span>
              <button
                type="button"
                disabled={isOutOfStock || isComingSoon || quantity >= availableStock}
                onClick={() => handleQuantityChange(1)}
                className="w-11 h-11 flex items-center justify-center text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(id)}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`h-12 w-12 shrink-0 border flex items-center justify-center transition-all duration-200 active:scale-75 cursor-pointer ${
                isSaved
                  ? 'bg-[#E11D2E] text-[#F5F4F2] border-[#E11D2E] shadow-lg shadow-[#E11D2E]/30'
                  : 'bg-[#181818] text-[#8C8C8C] border-[#2C2C2C] hover:text-[#E11D2E] hover:border-[#E11D2E]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Desktop & Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quantity Selector (Desktop only) */}
            <div className="hidden sm:flex items-center justify-between border border-[#2E2E2E] bg-[#161616] px-1 h-12 w-36 shrink-0">
              <button
                type="button"
                disabled={isOutOfStock || isComingSoon || quantity <= 1}
                onClick={() => handleQuantityChange(-1)}
                className="w-11 h-11 flex items-center justify-center text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-mono font-bold text-[#F5F4F2]">
                {quantity}
              </span>
              <button
                type="button"
                disabled={isOutOfStock || isComingSoon || quantity >= availableStock}
                onClick={() => handleQuantityChange(1)}
                className="w-11 h-11 flex items-center justify-center text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button with tactile success feedback */}
            <button
              type="button"
              disabled={isOutOfStock || isComingSoon}
              onClick={handleAddToCart}
              className={`flex-1 h-12 px-6 border disabled:opacity-40 disabled:cursor-not-allowed font-heading uppercase text-sm tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                justAdded
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-600/80 shadow-lg shadow-emerald-950/50'
                  : 'bg-[#181818] hover:bg-[#222222] text-[#F5F4F2] hover:text-white border-[#333333] hover:border-[#8C8C8C]'
              }`}
            >
              {justAdded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Added To Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 text-[#E11D2E]" />
                  <span>{isOutOfStock ? 'Out of Stock' : isComingSoon ? 'Coming Soon' : 'Add To Cart'}</span>
                </>
              )}
            </button>

            {/* Buy Now Button */}
            <button
              type="button"
              disabled={isOutOfStock || isComingSoon}
              onClick={handleBuyNow}
              className="flex-1 h-12 px-6 bg-[#E11D2E] hover:bg-[#C81A27] text-[#F5F4F2] disabled:opacity-40 disabled:cursor-not-allowed font-heading uppercase text-sm tracking-widest font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E11D2E]/25 btn-shimmer relative overflow-hidden group/btn active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>

            {/* Wishlist Button (Desktop only) */}
            <button
              type="button"
              onClick={() => toggleWishlist(id)}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`hidden sm:flex h-12 w-12 shrink-0 border items-center justify-center transition-all duration-200 active:scale-75 cursor-pointer ${
                isSaved
                  ? 'bg-[#E11D2E] text-[#F5F4F2] border-[#E11D2E] shadow-lg shadow-[#E11D2E]/30'
                  : 'bg-[#181818] text-[#8C8C8C] border-[#2C2C2C] hover:text-[#E11D2E] hover:border-[#E11D2E]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* WhatsApp Direct Product Inquiry */}
          <div className="pt-2">
            <a
              href={`https://wa.me/918630663134?text=${encodeURIComponent(`Hi RK Nutrition, I have an inquiry about ${name}${selectedVariant ? ` (${selectedVariant.name || selectedVariant.flavor || ''})` : ''}. Could you please assist me?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#141414] hover:bg-[#1A1A1A] border border-[#282828] hover:border-[#25D366] text-xs font-mono text-[#8C8C8C] hover:text-[#25D366] transition-colors flex items-center justify-center gap-2 group cursor-pointer"
            >
              <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.75 6.67C8.58 6.67 8.31 6.74 8.08 6.99C7.85 7.24 7.2 7.85 7.2 9.07C7.2 10.29 8.09 11.46 8.21 11.63C8.33 11.8 9.94 14.42 12.48 15.42C14.07 16.05 14.75 15.93 15.35 15.82C16.05 15.69 17.1 14.83 17.33 14.18C17.56 13.53 17.56 12.98 17.49 12.86C17.42 12.74 17.25 12.67 16.99 12.54C16.74 12.42 15.49 11.8 15.26 11.72C15.03 11.64 14.87 11.6 14.7 11.85C14.53 12.1 14.06 12.67 13.91 12.84C13.77 13.01 13.62 13.03 13.37 12.91C13.12 12.78 12.31 12.52 11.36 11.67C10.62 11.01 10.12 10.19 9.98 9.94C9.83 9.69 9.96 9.55 10.09 9.42C10.2 9.31 10.34 9.13 10.46 8.99C10.59 8.84 10.63 8.74 10.71 8.57C10.79 8.41 10.75 8.26 10.69 8.14C10.63 8.01 10.16 6.87 9.97 6.4C9.78 5.95 9.58 6.01 9.43 6C9.29 6 9.12 6 8.95 6C8.78 6 8.75 6.67 8.75 6.67Z"/>
              </svg>
              <span>Have formulation questions? <strong className="text-[#F5F4F2] group-hover:text-[#25D366]">Ask on WhatsApp</strong></span>
            </a>
          </div>
        </div>

        {/* Guarantees Strip */}
        <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono text-[#8C8C8C]">
          <div className="flex items-center gap-2 p-2 bg-[#141414] border border-[#222222]">
            <ShieldCheck className="w-4 h-4 text-[#E11D2E] shrink-0" />
            <span>Label Transparency</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-[#141414] border border-[#222222]">
            <CheckCircle2 className="w-4 h-4 text-[#E11D2E] shrink-0" />
            <span>Free Shipping Above ₹999</span>
          </div>
        </div>

        {/* FSSAI Statutory Dietary Supplement Disclaimer */}
        <div className="pt-2">
          <p className="text-[11px] text-[#666666] font-body leading-relaxed border-t border-[#1F1F1F] pt-3">
            * Disclaimer: These products are dietary supplements, not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>

    </div>
  );
}
