import { useState } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, onSelectProduct }) {
  const {
    id,
    name,
    category,
    images = [],
    price,
    salePrice,
    variants = []
  } = product;

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(id);
  const [imageError, setImageError] = useState(false);

  const mainImage = images && images.length > 0 ? images[0] : null;
  const hasSale = typeof salePrice === 'number' && typeof price === 'number' && salePrice < price;
  const discountPercent = hasSale ? Math.round(((price - salePrice) / price) * 100) : 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(id);
  };

  // Derive initials for fallback placeholder
  const getInitials = (str = '') => {
    return str
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 3)
      .join('')
      .toUpperCase() || 'RK';
  };

  return (
    <article
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative bg-[#141414] border border-[#1F1F1F] hover:border-[#333333] transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Media Container: Square 1:1 Aspect Ratio */}
      <div className="relative aspect-square w-full bg-[#121212] overflow-hidden flex items-center justify-center p-3 sm:p-4 border-b border-[#1A1A1A]">
        
        {mainImage && !imageError ? (
          <img
            src={mainImage}
            alt={name}
            loading="lazy"
            decoding="async"
            width="300"
            height="300"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-sm bg-[#1A1A1A] border border-[#242424] flex items-center justify-center text-center">
            <span className="font-heading font-black text-base sm:text-lg text-[#666666] tracking-wider">
              {getInitials(name)}
            </span>
          </div>
        )}

        {/* Save Badge: Top Left */}
        {hasSale && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-white bg-[#E11D2E] px-1.5 py-0.5 font-bold">
              Save {discountPercent}%
            </span>
          </div>
        )}

        {/* Wishlist Button: Top Right */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isSaved ? `Remove ${name} from saved items` : `Save ${name} to wishlist`}
          className={`absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border transition-colors cursor-pointer ${
            isSaved 
              ? 'bg-[#E11D2E] text-white border-[#E11D2E]' 
              : 'bg-[#181818]/90 text-[#8C8C8C] border-[#262626] hover:text-[#E11D2E] hover:border-[#383838]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Desktop Quick Specs Overlay on Hover */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 py-2 bg-[#111111]/90 backdrop-blur-xs border-t border-[#222222] translate-y-full group-hover:translate-y-0 transition-transform duration-200 items-center justify-center gap-1.5 text-xs font-heading uppercase tracking-wider text-[#F5F4F2]">
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E]" />
        </div>
      </div>

      {/* Product Information Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <span className="text-[11px] font-heading uppercase tracking-wider text-[#8C8C8C] block truncate mb-1">
            {category || 'Supplement'}
          </span>
          <h3 className="text-xs sm:text-sm font-body font-semibold text-[#F5F4F2] leading-tight line-clamp-2 group-hover:text-white transition-colors">
            {name}
          </h3>
        </div>

        {/* Price Row */}
        <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            {typeof price === 'number' ? (
              hasSale ? (
                <>
                  <span className="font-heading text-sm sm:text-base text-[#E11D2E] font-bold">
                    {formatCurrency(salePrice)}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#666666] line-through font-mono">
                    {formatCurrency(price)}
                  </span>
                </>
              ) : (
                <span className="font-heading text-sm sm:text-base text-[#F5F4F2] font-bold">
                  {formatCurrency(price)}
                </span>
              )
            ) : (
              <span className="text-xs font-mono text-[#8C8C8C]">
                Pricing on Launch
              </span>
            )}
          </div>

          {/* Desktop Variants Count */}
          {variants.length > 1 && (
            <span className="hidden sm:inline-block text-[10px] font-mono text-[#666666] uppercase">
              {variants.length} Sizes
            </span>
          )}
        </div>

      </div>
    </article>
  );
}
