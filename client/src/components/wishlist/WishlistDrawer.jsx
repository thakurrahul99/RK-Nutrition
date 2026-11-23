import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function WishlistDrawer() {
  const {
    wishlistProducts,
    wishlistCount,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlist,
    clearWishlist
  } = useWishlist();

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Close on ESC key & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isWishlistOpen) {
        closeWishlist();
      }
    };

    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWishlistOpen, closeWishlist]);

  if (!isWishlistOpen) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleMoveToCart = (product) => {
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    addToCart(product, variant, 1);
    removeFromWishlist(product.id);
  };

  const handleProductClick = (productId) => {
    closeWishlist();
    navigate(`/product/${productId}`);
  };

  return (
    <div
      className="fixed inset-0 z-[70] overflow-hidden"
      aria-labelledby="wishlist-drawer-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Dark backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:max-w-md bg-[#111111] border-l border-[#262626] shadow-2xl flex flex-col justify-between text-[#F5F4F2] relative">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#222222] flex items-center justify-between bg-[#141414]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1C1C1C] border border-[#2E2E2E] text-[#E11D2E]">
                <Heart className="w-5 h-5 fill-current animate-pulse" />
              </div>
              <div>
                <h2 id="wishlist-drawer-title" className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#F5F4F2]">
                  Saved Formulations
                </h2>
                <span className="text-xs font-mono text-[#8C8C8C]">
                  {wishlistCount} {wishlistCount === 1 ? 'Item' : 'Items'} Saved
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeWishlist}
              className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#E11D2E] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E11D2E] cursor-pointer"
              aria-label="Close wishlist drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {wishlistCount === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#161616] border border-[#262626] flex items-center justify-center text-[#444444] relative group">
                  <Heart className="w-8 h-8 text-[#E11D2E]/60 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-[#E11D2E]/10 blur-xl pointer-events-none" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-xl uppercase tracking-wider text-[#F5F4F2] font-bold">
                    Your Wishlist Is Empty
                  </h3>
                  <p className="text-xs text-[#8C8C8C] max-w-xs font-body leading-relaxed">
                    Save formulations you are interested in while browsing the catalogue to easily find or purchase them later.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeWishlist();
                    navigate('/products');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E11D2E] hover:bg-[#C81A27] text-[#F5F4F2] font-heading uppercase tracking-wider text-xs font-bold transition-all shadow-lg shadow-[#E11D2E]/20 btn-shimmer relative overflow-hidden group cursor-pointer active:scale-95"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistProducts.map((product) => {
                  const effectivePrice = product.salePrice ?? product.price ?? 0;
                  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

                  return (
                    <div
                      key={product.id}
                      className="p-4 bg-[#161616] border border-[#262626] hover:border-[#383838] transition-all flex gap-4 items-center group relative"
                    >
                      {/* Product Thumbnail */}
                      <button
                        type="button"
                        onClick={() => handleProductClick(product.id)}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1C1C1C] border border-[#2E2E2E] group-hover:border-[#E11D2E]/50 shrink-0 flex items-center justify-center overflow-hidden cursor-pointer transition-colors"
                      >
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="font-heading font-black text-xs text-[#8C8C8C]">
                            RK
                          </span>
                        )}
                      </button>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#E11D2E] block">
                          {product.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleProductClick(product.id)}
                          className="font-heading text-base font-bold text-[#F5F4F2] hover:text-[#E11D2E] transition-colors truncate block w-full text-left cursor-pointer"
                        >
                          {product.name}
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-black text-sm text-[#F5F4F2]">
                            {formatCurrency(effectivePrice)}
                          </span>
                          {product.salePrice && product.price > product.salePrice && (
                            <span className="text-xs text-[#666666] line-through font-mono">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleMoveToCart(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E11D2E] hover:bg-[#C81A27] text-[#F5F4F2] font-heading uppercase text-xs font-bold transition-all shadow-md shadow-[#E11D2E]/20 cursor-pointer active:scale-95"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add To Cart</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(product.id)}
                            className="text-[#8C8C8C] hover:text-red-400 p-1 transition-colors cursor-pointer active:scale-90"
                            aria-label={`Remove ${product.name} from wishlist`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          {wishlistCount > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#222222] bg-[#141414] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#8C8C8C]">TOTAL SAVED</span>
                <span className="text-[#F5F4F2] font-bold">{wishlistCount} Formulations</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    closeWishlist();
                    navigate('/products');
                  }}
                  className="flex-1 py-3 bg-[#1F1F1F] hover:bg-[#282828] text-[#F5F4F2] border border-[#333333] font-heading uppercase text-xs tracking-wider font-bold transition-colors text-center cursor-pointer"
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="px-4 py-3 bg-[#181818] hover:bg-red-950/40 text-[#8C8C8C] hover:text-red-400 border border-[#2E2E2E] font-mono uppercase text-xs transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
