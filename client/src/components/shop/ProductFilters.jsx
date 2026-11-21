import { X, RotateCcw, Filter } from 'lucide-react';

export default function ProductFilters({
  categories = [],
  selectedCategory,
  onSelectCategory,
  availableVariants = [],
  selectedVariant,
  onSelectVariant,
  hasPrices = false,
  priceRange,
  selectedPriceRange,
  onSelectPriceRange,
  onResetFilters,
  hasActiveFilters,
  isMobileDrawerOpen,
  onCloseMobileDrawer
}) {
  const content = (
    <div className="space-y-8 font-body">
      
      {/* Header & Reset Action */}
      <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C8202B]" />
          <span className="font-heading uppercase text-sm tracking-widest text-[#F5F4F2] font-bold">
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-[#C8202B] hover:text-[#F5F4F2] font-mono uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C]">
          Category
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-heading uppercase tracking-wider transition-colors text-left ${
                selectedCategory === cat.id
                  ? 'bg-[#1E1E1E] text-[#F5F4F2] border-l-2 border-[#C8202B]'
                  : 'text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#161616]'
              }`}
            >
              <span>{cat.label}</span>
              {selectedCategory === cat.id && (
                <span className="w-1.5 h-1.5 bg-[#C8202B]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Variant Filter (Only if actual variants exist in available data) */}
      {availableVariants.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C]">
            Available Sizes / Variants
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableVariants.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onSelectVariant(selectedVariant === v ? '' : v)}
                className={`px-3 py-1.5 text-xs font-mono transition-colors border ${
                  selectedVariant === v
                    ? 'bg-[#C8202B] text-[#F5F4F2] border-[#C8202B]'
                    : 'bg-[#161616] text-[#8C8C8C] border-[#2E2E2E] hover:border-[#8C8C8C] hover:text-[#F5F4F2]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter (Only if prices exist in data) */}
      {hasPrices && priceRange && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C]">
            Price Threshold
          </h4>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onSelectPriceRange('all')}
              className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                selectedPriceRange === 'all'
                  ? 'bg-[#1E1E1E] text-[#F5F4F2] border-l-2 border-[#C8202B]'
                  : 'text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#161616]'
              }`}
            >
              All Prices
            </button>
            <button
              type="button"
              onClick={() => onSelectPriceRange('under-3000')}
              className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                selectedPriceRange === 'under-3000'
                  ? 'bg-[#1E1E1E] text-[#F5F4F2] border-l-2 border-[#C8202B]'
                  : 'text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#161616]'
              }`}
            >
              Under ₹3,000
            </button>
            <button
              type="button"
              onClick={() => onSelectPriceRange('3000-plus')}
              className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                selectedPriceRange === '3000-plus'
                  ? 'bg-[#1E1E1E] text-[#F5F4F2] border-l-2 border-[#C8202B]'
                  : 'text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#161616]'
              }`}
            >
              ₹3,000 & Above
            </button>
          </div>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Filters */}
      <aside 
        aria-label="Catalogue filters" 
        className="hidden lg:block w-64 shrink-0 bg-[#141414] border border-[#242424] p-6 h-fit"
      >
        {content}
      </aside>

      {/* Mobile Filters Drawer */}
      {isMobileDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-[#141414] border-l border-[#262626] p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-6">
                <span className="font-heading uppercase text-lg text-[#F5F4F2] font-bold tracking-wider">
                  Filter Products
                </span>
                <button
                  type="button"
                  onClick={onCloseMobileDrawer}
                  aria-label="Close filters"
                  className="p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2] bg-[#1E1E1E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-[#262626]">
              <button
                type="button"
                onClick={onCloseMobileDrawer}
                className="w-full py-3 bg-[#C8202B] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase text-sm tracking-wider transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
