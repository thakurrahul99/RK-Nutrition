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
            <div className="flex-1 flex items-center justify-between border border-[#2E2E2E] bg-[#161616] px-3 h-12">
              <button
                type="button"
                disabled={isOutOfStock || isComingSoon || quantity <= 1}
                onClick={() => handleQuantityChange(-1)}
                className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90 cursor-pointer"
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
                className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90 cursor-pointer"
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
            <div className="hidden sm:flex items-center justify-between border border-[#2E2E2E] bg-[#161616] px-2 py-1 h-12 w-36 shrink-0">
              <button
                type="button"
                disabled={isOutOfStock || isComingSoon || quantity <= 1}
                onClick={() => handleQuantityChange(-1)}
                className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90 cursor-pointer"
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
                className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-90 cursor-pointer"
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
              href={`https://wa.me/917452013333?text=${encodeURIComponent(`Hi RK Nutrition, I have an inquiry about ${name}${selectedVariant ? ` (${selectedVariant.name || selectedVariant.flavor || ''})` : ''}. Could you please assist me?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#141414] hover:bg-[#1A1A1A] border border-[#282828] hover:border-[#25D366] text-xs font-mono text-[#8C8C8C] hover:text-[#25D366] transition-colors flex items-center justify-center gap-2 group cursor-pointer"
            >
              <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.072-.493-1.611-.667-2.616-2.316-2.696-2.423-.08-.108-.649-.864-.649-1.649 0-.785.409-1.17.554-1.328.144-.159.317-.198.423-.198.106 0 .212.002.304.006.098.005.228-.037.357.272.132.317.45 1.096.489 1.176.04.08.066.173.013.28-.053.107-.08.173-.16.265-.08.093-.167.208-.239.28-.08.08-.163.167-.07.327.093.159.413.682.887 1.103.61.543 1.124.71 1.284.79.16.08.253.067.346-.04.093-.107.4-4.66.507-.626.107-.159.213-.133.359-.08.146.053.928.438 1.087.518.16.08.266.12.306.186.04.066.04.385-.104.79zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.98-1.306A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.044c-1.637 0-3.15-.49-4.42-1.332l-.317-.209-2.96.776.79-2.885-.229-.364A7.994 7.994 0 0 1 4.044 12c0-4.387 3.569-7.956 7.956-7.956 4.387 0 7.956 3.569 7.956 7.956 0 4.387-3.569 7.956-7.956 7.956z"/>
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
