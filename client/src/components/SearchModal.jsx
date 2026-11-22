import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Package } from 'lucide-react';
import { useCategories } from '../context/CategoryContext';
import { useProducts } from '../context/ProductContext';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { publicProducts } = useProducts();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredCategories = categories.filter((cat) =>
    (cat.name || cat.title || '').toLowerCase().includes(normalizedQuery) ||
    (cat.description || '').toLowerCase().includes(normalizedQuery) ||
    (cat.tagline || '').toLowerCase().includes(normalizedQuery) ||
    (cat.slug || '').toLowerCase().includes(normalizedQuery)
  );

  const filteredProducts = normalizedQuery
    ? publicProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.category.toLowerCase().includes(normalizedQuery) ||
          p.shortDescription?.toLowerCase().includes(normalizedQuery) ||
          p.sku?.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const routeShortcuts = [
    { label: 'All Products', path: '/products' },
    { label: 'Product Categories', path: '/categories' },
    { label: 'About RK Nutrition', path: '/about' },
    { label: 'Frequently Asked Questions', path: '/faq' },
    { label: 'Contact Us', path: '/contact' }
  ];

  const handleCategoryClick = (catSlug) => {
    onClose();
    navigate(`/categories/${catSlug}`);
  };

  const handleProductClick = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleShortcutClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Search RK Nutrition"
    >
      <div 
        className="w-full max-w-2xl bg-[#141414] border border-[#2A2A2A] shadow-2xl shadow-black overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-[#E11D2E]" />

        {/* Input Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#262626]">
          <Search className="w-5 h-5 text-[#E11D2E] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories, products, or destination pages..."
            className="w-full bg-transparent text-[#F5F4F2] placeholder-[#666666] text-base sm:text-lg focus:outline-none font-body"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-[#8C8C8C] hover:text-[#F5F4F2] uppercase font-mono px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2] bg-[#1F1F1F] hover:bg-[#2A2A2A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
          
          {/* Matching Products */}
          {normalizedQuery && (
            <div>
              <div className="flex items-center justify-between text-xs font-heading uppercase tracking-widest text-[#8C8C8C] mb-3">
                <span>Matching Formulations ({filteredProducts.length})</span>
                <span>Open Specification</span>
              </div>
              {filteredProducts.length > 0 ? (
                <div className="space-y-2">
                  {filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProductClick(p.id)}
                      className="w-full p-3 bg-[#1A1A1A] hover:bg-[#202020] border border-[#262626] hover:border-[#E11D2E] text-left transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#141414] border border-[#2D2D2D] flex items-center justify-center text-[#E11D2E] shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-heading text-base text-[#F5F4F2] uppercase tracking-wider group-hover:text-[#E11D2E] transition-colors block">
                            {p.name}
                          </span>
                          <span className="text-xs font-mono text-[#8C8C8C]">
                            {p.category.toUpperCase()} • {p.price ? `₹${p.price}` : 'Catalogue'}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C8C8C] group-hover:text-[#E11D2E] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-[#181818] text-xs font-mono text-[#8C8C8C] text-center">
                  No product formulations matching "{query}".
                </div>
              )}
            </div>
          )}

          {/* Categories matches */}
          <div>
            <div className="flex items-center justify-between text-xs font-heading uppercase tracking-widest text-[#8C8C8C] mb-3">
              <span>Categories ({filteredCategories.length})</span>
              <span>Open Category Page</span>
            </div>
            {filteredCategories.length > 0 ? (
              <div className="space-y-2">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id || cat.slug}
                    type="button"
                    onClick={() => handleCategoryClick(cat.slug || cat.id)}
                    className="w-full p-3.5 bg-[#1A1A1A] hover:bg-[#202020] border border-[#262626] hover:border-[#E11D2E] text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-heading text-lg text-[#F5F4F2] uppercase tracking-wider group-hover:text-[#E11D2E] transition-colors block">
                        {cat.name || cat.title}
                      </span>
                      <span className="text-xs text-[#8C8C8C] line-clamp-1 mt-0.5 font-body">
                        {cat.tagline || cat.description}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8C8C8C] group-hover:text-[#E11D2E] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#181818] text-xs font-mono text-[#8C8C8C] text-center">
                No matching product categories found.
              </div>
            )}
          </div>

          {/* Quick Route Shortcuts */}
          <div>
            <span className="text-xs font-heading uppercase tracking-widest text-[#8C8C8C] block mb-3">
              Site Destination Pages
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {routeShortcuts.map((sc) => (
                <button
                  key={sc.path}
                  type="button"
                  onClick={() => handleShortcutClick(sc.path)}
                  className="p-3 bg-[#181818] hover:bg-[#1E1E1E] border border-[#242424] hover:border-[#E11D2E] text-left text-xs font-heading uppercase tracking-wider text-[#F5F4F2] flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <span>{sc.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#E11D2E] transition-colors" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0E0E0E] border-t border-[#222222] flex items-center justify-between text-xs font-mono text-[#555555]">
          <span>ESC to close</span>
          <span>RK NUTRITION CATALOGUE</span>
        </div>
      </div>
    </div>
  );
}
