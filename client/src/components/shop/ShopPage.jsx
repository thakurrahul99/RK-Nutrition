import { useState, useMemo } from 'react';
import ShopHero from './ShopHero';
import CategoryNavigation from './CategoryNavigation';
import ProductSearch from './ProductSearch';
import ProductSort from './ProductSort';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';
import { useProducts } from '../../context/ProductContext';
import { SlidersHorizontal, Eye } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Products' },
  { id: 'protein', label: 'Protein' },
  { id: 'mass-gainer', label: 'Mass Gainer' },
  { id: 'pre-workout', label: 'Pre-Workout' }
];

export default function ShopPage({
  initialCategory = 'all',
  onSelectProduct,
  onBackToHome
}) {
  const { publicProducts, products } = useProducts();
  // Use sample verification products toggle for QA/development if needed
  const [useSampleData, setUseSampleData] = useState(false);

  // Active dataset
  const activeCatalogue = useSampleData ? products : publicProducts;

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Derive available variants dynamically from active catalogue
  const availableVariants = useMemo(() => {
    const variantsSet = new Set();
    activeCatalogue.forEach((p) => {
      if (Array.isArray(p.variants)) {
        p.variants.forEach((v) => variantsSet.add(v.name));
      }
    });
    return Array.from(variantsSet);
  }, [activeCatalogue]);

  // Check if any product in active catalogue has a price
  const hasPrices = activeCatalogue.some((p) => typeof p.price === 'number');

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts = { all: activeCatalogue.length };
    CATEGORY_TABS.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = activeCatalogue.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [activeCatalogue]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return activeCatalogue.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesCat = product.category?.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) {
          return false;
        }
      }

      // Variant filter
      if (selectedVariant) {
        const hasMatch = product.variants?.some((v) => v.name === selectedVariant);
        if (!hasMatch) return false;
      }

      // Price filter
      if (selectedPriceRange !== 'all' && typeof product.price === 'number') {
        const effectivePrice = product.salePrice ?? product.price;
        if (selectedPriceRange === 'under-3000' && effectivePrice >= 3000) return false;
        if (selectedPriceRange === '3000-plus' && effectivePrice < 3000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'alpha-asc') {
        return a.name.localeCompare(b.name);
      }
      if (selectedSort === 'alpha-desc') {
        return b.name.localeCompare(a.name);
      }
      if (selectedSort === 'price-asc') {
        const pA = a.salePrice ?? a.price ?? 0;
        const pB = b.salePrice ?? b.price ?? 0;
        return pA - pB;
      }
      if (selectedSort === 'price-desc') {
        const pA = a.salePrice ?? a.price ?? 0;
        const pB = b.salePrice ?? b.price ?? 0;
        return pB - pA;
      }
      return 0; // featured
    });
  }, [activeCatalogue, selectedCategory, searchQuery, selectedVariant, selectedPriceRange, selectedSort]);

  // Active filters flag
  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    Boolean(searchQuery.trim()) || 
    Boolean(selectedVariant) || 
    selectedPriceRange !== 'all';

  // Reset filters handler
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedVariant('');
    setSelectedPriceRange('all');
    setSelectedSort('featured');
  };

  // Determine empty state type
  const getEmptyStateType = () => {
    if (searchQuery.trim()) return 'search';
    if (selectedCategory !== 'all' && categoryCounts[selectedCategory] === 0) return 'category';
    if (hasActiveFilters) return 'filter';
    return 'empty';
  };

  const activeCategoryObj = CATEGORY_TABS.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2]">
      
      {/* Shop Hero */}
      <ShopHero
        onBackToHome={onBackToHome}
        activeCategoryLabel={activeCategoryObj ? activeCategoryObj.label : ''}
      />

      {/* Category Tabs Navigation */}
      <CategoryNavigation
        categories={CATEGORY_TABS}
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => setSelectedCategory(id)}
        categoryCounts={categoryCounts}
      />

      {/* Main Shop Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Control Bar: Search, Mobile Filter Toggle, Sort, Result Count */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#222222]">
          
          {/* Search Bar */}
          <ProductSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
          />

          {/* Right Controls: Filter Trigger, Sort, Dev Toggle */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
            
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#161616] border border-[#2E2E2E] hover:border-[#C8202B] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8202B]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 bg-[#C8202B] rounded-full" />
              )}
            </button>

            {/* Sort Dropdown */}
            <ProductSort
              selectedSort={selectedSort}
              onSelectSort={setSelectedSort}
              hasPrices={hasPrices}
            />

            {/* QA / Architecture Preview Toggle (For verifying populated grid and detail views) */}
            <button
              type="button"
              onClick={() => setUseSampleData(!useSampleData)}
              title="Toggle architectural test data to test populated grid and product detail views"
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono uppercase tracking-wider border transition-colors ${
                useSampleData
                  ? 'bg-[#C8202B]/20 text-[#C8202B] border-[#C8202B]'
                  : 'bg-[#181818] text-[#8C8C8C] border-[#2E2E2E] hover:text-[#F5F4F2]'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{useSampleData ? 'Previewing Sample Data' : 'Test Populated Grid'}</span>
            </button>
          </div>

        </div>

        {/* Content Layout: Sidebar Filters + Products Grid */}
        <div className="flex items-start gap-10">
          
          {/* Desktop Filter Sidebar */}
          <ProductFilters
            categories={CATEGORY_TABS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            availableVariants={availableVariants}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
            hasPrices={hasPrices}
            priceRange={{ min: 0, max: 5000 }}
            selectedPriceRange={selectedPriceRange}
            onSelectPriceRange={setSelectedPriceRange}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            isMobileDrawerOpen={isMobileFiltersOpen}
            onCloseMobileDrawer={() => setIsMobileFiltersOpen(false)}
          />

          {/* Product Grid / Empty State Area */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Summary Bar */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1E1E1E] text-xs font-mono text-[#8C8C8C]">
              <span>
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                {useSampleData && ' (QA Sample Preview)'}
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[#C8202B] hover:text-[#F5F4F2] transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Responsive Grid */}
            <ProductGrid
              products={filteredProducts}
              onSelectProduct={onSelectProduct}
              emptyStateType={getEmptyStateType()}
              onResetFilters={handleResetFilters}
              onBackToHome={onBackToHome}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
