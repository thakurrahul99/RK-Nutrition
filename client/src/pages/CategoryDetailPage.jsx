import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/shop/ProductGrid';
import { ArrowLeft, Dumbbell, Flame, Sparkles, Layers, Package, Zap } from 'lucide-react';

export default function CategoryDetailPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { getCategoryBySlug } = useCategories();
  const { publicProducts } = useProducts();

  // Find matching dynamic category metadata
  const categoryMeta = getCategoryBySlug(categoryId);

  // Filter actual products for this category (matching slug or id)
  const categoryProducts = publicProducts.filter((p) => {
    const pCat = p.category?.toLowerCase();
    const targetSlug = categoryId?.toLowerCase();
    const metaSlug = categoryMeta?.slug?.toLowerCase();
    const metaId = categoryMeta?.id?.toLowerCase();
    return pCat === targetSlug || pCat === metaSlug || pCat === metaId || p.categoryId === categoryMeta?.id;
  });

  const getCategoryIcon = (slug = '') => {
    const s = slug.toLowerCase();
    if (s.includes('protein')) return <Dumbbell className="w-6 h-6 text-[#E11D2E]" />;
    if (s.includes('mass') || s.includes('gainer')) return <Sparkles className="w-6 h-6 text-[#E11D2E]" />;
    if (s.includes('pre') || s.includes('workout') || s.includes('energy')) return <Flame className="w-6 h-6 text-[#E11D2E]" />;
    if (s.includes('creatine')) return <Zap className="w-6 h-6 text-[#E11D2E]" />;
    return <Layers className="w-6 h-6 text-[#E11D2E]" />;
  };

  if (!categoryMeta) {
    return (
      <div className="min-h-[70vh] bg-[#111111] text-[#F5F4F2] flex items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-4">
          <Layers className="w-12 h-12 text-[#E11D2E] mx-auto" />
          <h2 className="font-heading text-3xl uppercase font-bold text-[#F5F4F2]">
            Category Not Found
          </h2>
          <p className="text-sm text-[#8C8C8C]">
            The requested category does not exist or is currently unlisted.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E11D2E] text-[#F5F4F2] font-heading uppercase tracking-wider text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Categories</span>
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-[#8C8C8C] hover:text-[#F5F4F2] border border-[#2E2E2E] font-mono uppercase tracking-wider text-xs"
            >
              <span>View All Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2]">
      
      {/* Category Header */}
      <section className="bg-[#141414] border-b border-[#222222] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#8C8C8C] mb-6 uppercase">
            <Link to="/" className="hover:text-[#F5F4F2] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-[#F5F4F2] transition-colors">
              CATEGORIES
            </Link>
            <span>/</span>
            <span className="text-[#E11D2E]">{categoryMeta.name.toUpperCase()}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-6">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E1E1E] border border-[#2E2E2E] flex items-center justify-center">
                  {getCategoryIcon(categoryMeta.slug)}
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#E11D2E] font-semibold">
                  CATEGORY // {categoryMeta.slug.toUpperCase()}
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95]">
                {categoryMeta.name}
              </h1>

              {categoryMeta.tagline && (
                <p className="font-heading text-base text-[#E11D2E] uppercase tracking-wider font-semibold">
                  {categoryMeta.tagline}
                </p>
              )}

              <p className="text-sm sm:text-base text-[#8C8C8C] max-w-2xl font-body leading-relaxed">
                {categoryMeta.description || 'Targeted nutritional formulations engineered strictly around the physical demands of high-performance athletic training.'}
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="aspect-[4/3] w-full max-w-sm rounded border border-[#282828] overflow-hidden bg-[#181818] relative shadow-xl">
                <img
                  src={categoryMeta.image || `/images/category-${categoryMeta.slug}.webp`}
                  alt={categoryMeta.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const fallback = `/images/category-${categoryMeta.slug}.webp`;
                    if (!e.currentTarget.src.includes(fallback)) {
                      e.currentTarget.src = fallback;
                    } else {
                      e.currentTarget.style.display = 'none';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Product Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-[#222222] text-xs font-mono text-[#8C8C8C]">
          <span className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#E11D2E]" />
            <strong className="text-[#F5F4F2]">{categoryProducts.length}</strong> {categoryProducts.length === 1 ? 'Product' : 'Products'} available in {categoryMeta.name}
          </span>

          <div className="flex items-center gap-4">
            <Link
              to="/categories"
              className="hover:text-[#F5F4F2] transition-colors"
            >
              ← Other Categories
            </Link>
            <span className="text-[#333333]">|</span>
            <Link
              to="/products"
              className="text-[#E11D2E] hover:text-[#F5F4F2] transition-colors"
            >
              View Full Catalogue →
            </Link>
          </div>
        </div>

        <ProductGrid
          products={categoryProducts}
          onSelectProduct={(p) => navigate(`/product/${p.slug || p.id}`)}
          emptyStateType="category"
          onResetFilters={() => navigate('/products')}
          onBackToHome={() => navigate('/')}
        />
      </div>

    </div>
  );
}
