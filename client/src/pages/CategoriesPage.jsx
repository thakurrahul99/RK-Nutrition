import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { ArrowRight, Dumbbell, Flame, Sparkles, Layers, Package } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function CategoriesPage() {
  const { categories } = useCategories();
  const revealContainerRef = useScrollReveal();

  const getCategoryIcon = (slug = '') => {
    const s = slug.toLowerCase();
    if (s.includes('protein')) return <Dumbbell className="w-8 h-8 text-[#E11D2E]" />;
    if (s.includes('mass') || s.includes('gainer')) return <Sparkles className="w-8 h-8 text-[#E11D2E]" />;
    if (s.includes('pre') || s.includes('workout') || s.includes('energy')) return <Flame className="w-8 h-8 text-[#E11D2E]" />;
    return <Layers className="w-8 h-8 text-[#E11D2E]" />;
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#F5F4F2] page-enter" ref={revealContainerRef}>
      
      {/* Categories Dedicated Hero */}
      <section className="relative bg-[#111111] border-b border-[#222222] pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#E11D2E]/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.05] bg-tech-grid" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#8C8C8C] mb-6 uppercase">
            <Link to="/" className="hover:text-[#F5F4F2] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-[#E11D2E]">CATEGORIES</span>
          </nav>

          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#E11D2E] font-bold mb-4">
            <span className="w-6 h-[2px] bg-[#E11D2E]" />
            NUTRITIONAL ARCHITECTURE
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95] mb-6">
            THE NUTRITIONAL <span className="text-[#E11D2E]">PILLARS.</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-[#8C8C8C] leading-relaxed font-body">
            RK Nutrition organizes its athletic formulations around specialized physical objectives. Explore each category below to find the exact formulation your training demands.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 pt-6 border-t border-[#222222] grid grid-cols-3 max-w-lg gap-2 sm:gap-6 text-xs font-mono text-[#8C8C8C]">
            <div>
              <span className="block font-heading text-xl sm:text-2xl text-[#F5F4F2] font-bold">
                {String(categories.length).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider block">Active Categories</span>
            </div>
            <div className="border-x border-[#222222] px-2 sm:px-4">
              <span className="block font-heading text-xl sm:text-2xl text-[#E11D2E] font-bold">100%</span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider block">Athletic Standard</span>
            </div>
            <div>
              <span className="block font-heading text-xl sm:text-2xl text-[#F5F4F2] font-bold">ZERO</span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider block">Proprietary Blends</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Category Showcase Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {categories.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Layers className="w-12 h-12 text-[#444444] mx-auto" />
            <h3 className="font-heading text-2xl uppercase tracking-wider text-[#F5F4F2] font-bold">
              Catalogue Categories Updating
            </h3>
            <p className="text-sm text-[#8C8C8C] max-w-md mx-auto">
              Our formulation categories are being updated. You can view all currently published products in the catalogue.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E11D2E] hover:bg-[#C81A27] text-xs font-heading uppercase tracking-wider text-[#F5F4F2] transition-colors btn-shimmer"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          categories.map((category, index) => {
            const isEven = index % 2 === 0;

            return (
              <article 
                key={category.id || category.slug}
                id={category.slug}
                className="bg-[#141414] border border-[#242424] hover:border-[#E11D2E]/60 transition-all duration-300 p-8 sm:p-12 shadow-2xl relative overflow-hidden group card-hover-lift reveal-init"
              >
                {/* Signature Red Corner Accent */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#E11D2E] z-10 transition-transform duration-300 group-hover:scale-125" />

                {/* Ambient Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E11D2E]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Category Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#242424] mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#E11D2E] flex items-center justify-center transition-colors shrink-0">
                      {getCategoryIcon(category.slug)}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#E11D2E] block font-semibold">
                        {category.tagline || 'ATHLETIC PERFORMANCE PILLAR'}
                      </span>
                      <h2 className="font-heading text-3xl sm:text-4xl text-[#F5F4F2] uppercase font-black tracking-tight">
                        {category.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-[#777777] uppercase flex items-center gap-1.5 bg-[#181818] px-3 py-1.5 border border-[#282828]">
                      <Package className="w-3.5 h-3.5 text-[#E11D2E]" />
                      <span>{category.productCount || 0} {category.productCount === 1 ? 'Product' : 'Products'}</span>
                    </span>

                    <Link
                      to={`/categories/${category.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E11D2E] hover:bg-[#C81A27] text-[#F5F4F2] font-heading text-xs tracking-widest uppercase font-bold transition-all shadow-lg shadow-[#E11D2E]/20 btn-shimmer relative overflow-hidden group/btn active:scale-95"
                    >
                      <span>Explore {category.name}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* 2-Column Editorial Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                  
                  {/* Information Column (7 cols) */}
                  <div className={`lg:col-span-7 space-y-6 ${!isEven ? 'lg:order-2' : ''}`}>
                    <h3 className="font-heading text-xl sm:text-2xl text-[#F5F4F2] uppercase font-bold tracking-wide">
                      {category.tagline || `Targeted Formulations for ${category.name}`}
                    </h3>

                    <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed font-body">
                      {category.description || 'Engineered under uncompromising standards to support peak athletic conditioning, clean nutrient delivery, and dedicated strength training cycles.'}
                    </p>

                    <div className="p-4 bg-[#181818] border border-[#242424] space-y-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#E11D2E] font-semibold block">
                        Athletic Standards:
                      </span>
                      <p className="text-xs text-[#8C8C8C] leading-relaxed font-body">
                        Verified raw materials • 100% label transparency • Tested for banned substances • Zero fillers
                      </p>
                    </div>
                  </div>

                  {/* Artwork / Image Column (5 cols) */}
                  <div className={`lg:col-span-5 ${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="h-64 sm:h-72 bg-[#181818] border border-[#282828] relative overflow-hidden flex flex-col items-center justify-center p-0 text-center shadow-inner group-hover:border-[#E11D2E]/50 transition-colors">
                      <img
                        src={category.image || `/images/category-${category.slug}.webp`}
                        alt={category.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#111111]/80 backdrop-blur-sm px-3 py-1.5 border border-[#282828]">
                        {getCategoryIcon(category.slug)}
                        <span className="font-heading text-xs text-[#F5F4F2] uppercase tracking-wider">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Direct Route Link */}
                <div className="mt-8 pt-4 border-t border-[#242424] flex items-center justify-between text-xs font-mono text-[#8C8C8C] relative z-10">
                  <span>ROUTE: /categories/{category.slug}</span>
                  <Link
                    to={`/categories/${category.slug}`}
                    className="text-[#E11D2E] hover:text-[#F5F4F2] transition-colors flex items-center gap-1.5 font-semibold group/link"
                  >
                    <span>View All {category.name} Formulations</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </article>
            );
          })
        )}
      </div>

    </div>
  );
}
