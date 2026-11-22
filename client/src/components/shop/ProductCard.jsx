import { ArrowRight, Layers, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, onSelectProduct }) {
  const {
    id,
    name,
    category,
    images = [],
    price,
    salePrice,
    variants = [],
    availability
  } = product;

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(id);

  const mainImage = images && images.length > 0 ? images[0] : null;
  const hasVariants = variants && variants.length > 0;
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

  return (
    <article
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative bg-[#161616] border border-[#262626] hover:border-[#C8202B] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer shadow-lg"
    >
      {/* Signature RK red corner block accent */}
      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#C8202B] z-20 pointer-events-none" />

      {/* Top Media Area with Aspect Ratio & Subtle Zoom */}
      <div className="relative aspect-[4/5] bg-[#1A1A1A] overflow-hidden flex items-center justify-center border-b border-[#222222]">
        
        {/* Subtle RK Monogram Watermark */}
        <span 
          className="absolute font-heading font-black text-8xl text-white/[0.025] select-none pointer-events-none tracking-tighter"
          aria-hidden="true"
        >
          RK
        </span>

        {/* Abstract Athletic Steel Backdrop Graphic */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F5F4F2_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {mainImage ? (
          <img
            src={mainImage}
            alt={name}
            loading="lazy"
            className="relative w-3/4 h-3/4 object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-xl"
          />
        ) : (
          <div className="relative flex flex-col items-center justify-center text-center p-6 space-y-3 z-10">
            <div className="w-16 h-16 bg-[#141414] border border-[#282828] group-hover:border-[#C8202B] transition-colors flex items-center justify-center relative overflow-hidden shadow-xl">
              <span className="font-heading font-black text-2xl text-[#F5F4F2]">RK</span>
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#C8202B]" />
            </div>
            <span className="font-heading text-xs tracking-widest text-[#8C8C8C] group-hover:text-[#F5F4F2] uppercase transition-colors">
              ATHLETIC GRADE
            </span>
          </div>
        )}

        {/* Category Tag with Brand Accent */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#F5F4F2] bg-[#111111]/90 border border-[#2E2E2E] px-2.5 py-1">
            <span className="w-1 h-1 bg-[#C8202B]" />
            {category}
          </span>
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isSaved ? `Remove ${name} from saved items` : `Save ${name} to wishlist`}
          className={`absolute top-3 right-3 z-20 p-2 rounded-none transition-all duration-200 border cursor-pointer ${
            isSaved 
              ? 'bg-[#C8202B] text-[#F5F4F2] border-[#C8202B] shadow-lg shadow-[#C8202B]/30' 
              : 'bg-[#111111]/80 text-[#8C8C8C] border-[#2E2E2E] hover:text-[#C8202B] hover:border-[#C8202B]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Discount Badge if on sale */}
        {hasSale && (
          <div className="absolute bottom-12 left-3 z-10">
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-[#F5F4F2] bg-[#C8202B] px-2 py-0.5 font-bold shadow-md">
              SAVE {discountPercent}%
            </span>
          </div>
        )}

        {/* Availability Badge if explicitly coming soon */}
        {availability === 'coming-soon' && (
          <div className="absolute bottom-12 right-3 z-10">
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-[#C8202B] bg-[#111111]/90 border border-[#C8202B]/60 px-2 py-0.5 font-semibold">
              COMING SOON
            </span>
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-x-0 bottom-0 py-2.5 bg-[#111111]/90 backdrop-blur-sm border-t border-[#262626] translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5 text-xs font-heading uppercase tracking-wider text-[#F5F4F2]">
          <span>View Specifications</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C8202B]" />
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="text-[10px] font-mono uppercase text-[#C8202B] tracking-wider mb-1 block">
            RK NUTRITION • FORMULATION
          </div>
          <h3 className="font-heading text-lg sm:text-xl text-[#F5F4F2] uppercase font-bold tracking-wide group-hover:text-[#F5F4F2] transition-colors line-clamp-2">
            {name}
          </h3>

          {/* Variants info when available */}
          {hasVariants && (
            <div className="flex items-center gap-1.5 text-xs text-[#8C8C8C] font-mono mt-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C8202B]" />
              <span>{variants.length} {variants.length === 1 ? 'Variant' : 'Variants'}</span>
            </div>
          )}
        </div>

        {/* Price Area: Only when real price is available */}
        <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
          <div>
            {typeof price === 'number' ? (
              <div className="flex items-baseline gap-2">
                {hasSale ? (
                  <>
                    <span className="font-heading text-xl text-[#C8202B] font-bold">
                      {formatCurrency(salePrice)}
                    </span>
                    <span className="text-xs text-[#666666] line-through font-mono">
                      {formatCurrency(price)}
                    </span>
                  </>
                ) : (
                  <span className="font-heading text-xl text-[#F5F4F2] font-bold">
                    {formatCurrency(price)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-mono uppercase text-[#8C8C8C]">
                Pricing on Launch
              </span>
            )}
          </div>

          <div className="w-8 h-8 rounded-none bg-[#1F1F1F] group-hover:bg-[#C8202B] transition-colors flex items-center justify-center text-[#8C8C8C] group-hover:text-[#F5F4F2]">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>
    </article>
  );
}
