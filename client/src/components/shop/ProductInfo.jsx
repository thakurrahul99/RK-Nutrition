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
      setFeedbackMessage({ type: 'success', text: `Added ${quantity} × ${name} to your cart.` });
      setTimeout(() => setFeedbackMessage(null), 2500);
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
        <span className="text-xs font-mono uppercase tracking-widest text-[#C8202B] font-semibold bg-[#1F1F1F] px-2.5 py-1 border border-[#2E2E2E]">
          {category}
        </span>

        <div className="flex items-center gap-2">
          {paymentRule === 'PREPAID_ONLY' && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5">
              Prepaid Only
            </span>
          )}

          {isComingSoon ? (
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5F4F2] bg-[#1A1A1A] px-2.5 py-1 border border-[#C8202B]/60">
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
                <span className="text-xs font-mono text-[#C8202B] uppercase font-bold bg-[#C8202B]/10 border border-[#C8202B]/30 px-2 py-0.5">
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
              <Layers className="w-3.5 h-3.5 text-[#C8202B]" />
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
                  className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider border transition-colors flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#C8202B] text-[#F5F4F2] border-[#C8202B] font-bold shadow-md shadow-[#C8202B]/20'
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between border border-[#2E2E2E] bg-[#161616] px-2 py-1 h-12 w-full sm:w-36 shrink-0">
            <button
              type="button"
              disabled={isOutOfStock || isComingSoon || quantity <= 1}
              onClick={() => handleQuantityChange(-1)}
              className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
              className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={isOutOfStock || isComingSoon}
            onClick={handleAddToCart}
            className="flex-1 h-12 px-6 bg-[#1F1F1F] hover:bg-[#282828] text-[#F5F4F2] hover:text-white border border-[#333333] hover:border-[#F5F4F2] disabled:opacity-40 disabled:cursor-not-allowed font-heading uppercase text-sm tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-[#C8202B]" />
            <span>{isOutOfStock ? 'Out of Stock' : isComingSoon ? 'Coming Soon' : 'Add To Cart'}</span>
          </button>

          {/* Buy Now Button */}
          <button
            type="button"
            disabled={isOutOfStock || isComingSoon}
            onClick={handleBuyNow}
            className="flex-1 h-12 px-6 bg-[#C8202B] hover:bg-[#AC1721] text-[#F5F4F2] disabled:opacity-40 disabled:cursor-not-allowed font-heading uppercase text-sm tracking-widest font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C8202B]/20 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Buy Now</span>
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(id)}
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`h-12 w-12 shrink-0 border flex items-center justify-center transition-colors cursor-pointer ${
              isSaved
                ? 'bg-[#C8202B] text-[#F5F4F2] border-[#C8202B] shadow-lg shadow-[#C8202B]/20'
                : 'bg-[#181818] text-[#8C8C8C] border-[#2C2C2C] hover:text-[#C8202B] hover:border-[#C8202B]'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Guarantees Strip */}
        <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono text-[#8C8C8C]">
          <div className="flex items-center gap-2 p-2 bg-[#141414] border border-[#222222]">
            <ShieldCheck className="w-4 h-4 text-[#C8202B] shrink-0" />
            <span>100% Label Transparency</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-[#141414] border border-[#222222]">
            <CheckCircle2 className="w-4 h-4 text-[#C8202B] shrink-0" />
            <span>Free Shipping Above ₹999</span>
          </div>
        </div>
      </div>

    </div>
  );
}
