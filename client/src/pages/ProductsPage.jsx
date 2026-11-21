import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ShopHero from '../components/shop/ShopHero';
import CategoryNavigation from '../components/shop/CategoryNavigation';
import ProductSearch from '../components/shop/ProductSearch';
import ProductSort from '../components/shop/ProductSort';
import ProductFilters from '../components/shop/ProductFilters';
import ProductGrid from '../components/shop/ProductGrid';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const { publicProducts: products } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Dynamic category tabs derived from backend categories
  const categoryTabs = useMemo(() => [
    { id: 'all', label: 'All Products' },
    ...categories.map((c) => ({ id: c.slug, label: c.name }))
  ], [categories]);

  // URL query parameter for category
  const categoryParam = searchParams.get('category') || 'all';

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Available variants from catalogue
  const availableVariants = useMemo(() => {
    const variantsSet = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.variants)) {
        p.variants.forEach((v) => variantsSet.add(v.name));
      }
    });
    return Array.from(variantsSet);
  }, [products]);

  // Check if any product has a price
  const hasPrices = products.some((p) => typeof p.price === 'number');

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    categoryTabs.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = products.filter(
          (p) => p.category?.toLowerCase() === cat.id.toLowerCase() || p.categoryId === cat.id
        ).length;
      }
    });
    return counts;
  }, [products, categoryTabs]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (categoryParam !== 'all') {
        const prodCat = product.category?.toLowerCase();
        const targetCat = categoryParam.toLowerCase();
        if (prodCat !== targetCat && product.categoryId !== categoryParam) {
          return false;
        }
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
      return 0;
    });
  }, [products, categoryParam, searchQuery, selectedVariant, selectedPriceRange, selectedSort]);

  // Category switch handler
  const handleSelectCategory = (id) => {
    if (id === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      searchParams.set('category', id);
      setSearchParams(searchParams);
    }
  };

  // Active filters flag
  const hasActiveFilters = 
    categoryParam !== 'all' || 
    Boolean(searchQuery.trim()) || 
    Boolean(selectedVariant) || 
    selectedPriceRange !== 'all';

  // Reset filters
  const handleResetFilters = () => {
    searchParams.delete('category');
    setSearchParams(searchParams);
    setSearchQuery('');
    setSelectedVariant('');
    setSelectedPriceRange('all');
    setSelectedSort('featured');
  };

  // Determine empty state type
  const getEmptyStateType = () => {
    if (searchQuery.trim()) return 'search';
    if (categoryParam !== 'all' && categoryCounts[categoryParam] === 0) return 'category';
    if (hasActiveFilters) return 'filter';
    return 'empty';
  };

  const activeCategoryObj = categoryTabs.find((c) => c.id === categoryParam);

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2]">
      
      {/* Products Page Hero */}
      <ShopHero
        onBackToHome={() => navigate('/')}
        activeCategoryLabel={activeCategoryObj ? activeCategoryObj.label : ''}
      />

      {/* Category Navigation Tabs */}
      <CategoryNavigation
        categories={categoryTabs}
        selectedCategory={categoryParam}
        onSelectCategory={handleSelectCategory}
        categoryCounts={categoryCounts}
      />

      {/* Products Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Control Bar: Search, Mobile Filters, Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#222222]">
          
          <ProductSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
          />

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
            
            {/* Mobile Filters Drawer Trigger */}
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

            {/* Sorting Dropdown */}
            <ProductSort
              selectedSort={selectedSort}
              onSelectSort={setSelectedSort}
              hasPrices={hasPrices}
            />
          </div>

        </div>

        {/* Content Layout: Sidebar Filters + Products Grid */}
        <div className="flex items-start gap-10">
          
          <ProductFilters
            categories={categoryTabs}
            selectedCategory={categoryParam}
            onSelectCategory={handleSelectCategory}
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

          <div className="flex-1 min-w-0">
            {/* Active Summary */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1E1E1E] text-xs font-mono text-[#8C8C8C]">
              <span>
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
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

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              onSelectProduct={(p) => navigate(`/product/${p.id}`)}
              emptyStateType={getEmptyStateType()}
              onResetFilters={handleResetFilters}
              onBackToHome={() => navigate('/')}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
