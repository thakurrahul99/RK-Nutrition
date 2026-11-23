import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, onSelectProduct }) {
  const navigate = useNavigate();
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

  const targetIdentifier = product?.slug || product?.id || product?._id;
  const productDetailPageUrl = `/product/${targetIdentifier}`;

  const handleProductNavigation = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (targetIdentifier) {
      navigate(productDetailPageUrl);
    }
  };

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
      onClick={handleProductNavigation}
      className="card-hover-lift group relative bg-[#131313] border border-[#202020] hover:border-[#E11D2E]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Media Container: Square 1:1 Aspect Ratio with Dynamic Ambient Glow */}
      <div className="relative aspect-square w-full bg-[#101010] overflow-hidden flex items-center justify-center p-3 sm:p-5 border-b border-[#1A1A1A]">
        
        {/* Soft Radial Ambient Glow that breathes on card hover */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,46,0.22)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
          aria-hidden="true"
        />

        {/* Technical Watermark Monogram */}
        <span 
          className="absolute font-heading font-black text-7xl sm:text-8xl text-white/[0.02] select-none pointer-events-none tracking-tighter"
          aria-hidden="true"
        >
          RK
        </span>

        {mainImage && !imageError ? (
          <img
            src={mainImage}
            alt={name}
            loading="lazy"
            decoding="async"
            width="320"
            height="320"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 filter drop-shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 rounded-sm bg-[#161616] border border-[#2A2A2A] flex flex-col items-center justify-center text-center p-2 group-hover:border-[#E11D2E]/40 transition-colors">
            <span className="font-heading font-black text-base sm:text-lg text-[#F5F4F2] tracking-wider">
              {getInitials(name)}
            </span>
            <span className="text-[9px] font-mono text-[#8C8C8C] uppercase tracking-wider">
              FORMULA
            </span>
          </div>
        )}

        {/* Save Discount Badge: Top Left */}
        {hasSale && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-white bg-[#E11D2E] px-2 py-0.5 font-bold shadow-md shadow-[#E11D2E]/20">
              Save {discountPercent}%
            </span>
          </div>
        )}

        {/* Wishlist Button: Top Right with tactile feedback */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isSaved ? `Remove ${name} from saved items` : `Save ${name} to wishlist`}
          className={`absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center border transition-all duration-200 active:scale-90 cursor-pointer ${
            isSaved 
              ? 'bg-[#E11D2E] text-white border-[#E11D2E] shadow-md shadow-[#E11D2E]/30' 
              : 'bg-[#181818]/90 text-[#8C8C8C] border-[#2A2A2A] hover:text-[#E11D2E] hover:border-[#E11D2E]/60 backdrop-blur-sm'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Desktop Quick Specs Overlay on Hover */}
        <div 
          onClick={handleProductNavigation}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleProductNavigation();
            }
          }}
          className="hidden sm:flex absolute inset-x-0 bottom-0 py-2.5 bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#222222] translate-y-full group-hover:translate-y-0 transition-transform duration-250 ease-out items-center justify-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] hover:text-[#E11D2E] cursor-pointer"
        >
          <span>View Formulation</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E] transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Product Information Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 relative">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#8C8C8C] block truncate mb-1">
            {category || 'Performance Formulation'}
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
            <span className="hidden sm:inline-block text-[10px] font-mono text-[#777777] uppercase bg-[#181818] px-1.5 py-0.5 border border-[#242424]">
              {variants.length} Sizes
            </span>
          )}
        </div>

        {/* Subtle Bottom Accent Indicator on Hover */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-[#E11D2E] transition-all duration-300 pointer-events-none" />
      </div>
    </article>
  );
}
