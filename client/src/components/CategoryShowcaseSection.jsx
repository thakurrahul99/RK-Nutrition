import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { Dumbbell, Flame, Sparkles, Layers, ArrowRight } from 'lucide-react';

export default function CategoryShowcaseSection() {
  const { categories } = useCategories();

  const getCategoryIcon = (slug = '') => {
    const s = slug.toLowerCase();
    if (s.includes('protein')) return <Dumbbell className="w-6 h-6 text-[#C8202B]" />;
    if (s.includes('mass') || s.includes('gainer')) return <Sparkles className="w-6 h-6 text-[#C8202B]" />;
    if (s.includes('pre') || s.includes('workout') || s.includes('energy')) return <Flame className="w-6 h-6 text-[#C8202B]" />;
    return <Layers className="w-6 h-6 text-[#C8202B]" />;
  };

  return (
    <section 
      id="categories" 
      aria-label="Product Category Showcase"
      className="relative py-24 sm:py-32 bg-[#141414] border-b border-[#222222]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-3">
              <span className="w-8 h-[2px] bg-[#C8202B]" />
              RK NUTRITION • CATEGORIES
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95]">
              PURPOSE-DRIVEN <span className="text-[#C8202B]">CATEGORIES.</span>
            </h2>
          </div>
          <div className="max-w-md space-y-2">
            <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed font-body">
              Explore our core nutritional categories. Structured strictly around the physical demands of high-performance training.
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C8202B] hover:text-[#F5F4F2] transition-colors font-bold"
            >
              <span>Explore Dedicated Category Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Categories Grid (Dynamic Columns) */}
        <div className={`grid grid-cols-1 ${categories.length === 1 ? 'md:grid-cols-1 max-w-xl mx-auto' : categories.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8`}>
          {categories.map((category) => (
            <Link 
              key={category.id || category.slug} 
              id={`cat-${category.slug}`}
              to={`/categories/${category.slug}`}
              className="relative bg-[#1A1A1A] border border-[#282828] hover:border-[#C8202B] transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl cursor-pointer"
            >
              {/* Signature RK red corner block accent */}
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#C8202B] z-10" />

              {/* Subtle background RK watermark */}
              <span 
                className="absolute -bottom-8 -right-4 font-heading font-black text-9xl text-white/[0.02] select-none pointer-events-none tracking-tighter"
                aria-hidden="true"
              >
                RK
              </span>

              {/* Category Card Header */}
              <div className="p-8 pb-4 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-[#202020] border border-[#2E2E2E] group-hover:border-[#C8202B] flex items-center justify-center transition-colors">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      getCategoryIcon(category.slug)
                    )}
                  </div>
                  <span className="font-mono text-sm text-[#C8202B] font-bold">
                    RK-{category.slug.toUpperCase().slice(0, 4)}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#8C8C8C] bg-[#222222] px-2.5 py-1">
                    {category.productCount ? `${category.productCount} Formulation${category.productCount === 1 ? '' : 's'}` : 'Performance Pillar'}
                  </span>
                  <h3 className="font-heading text-3xl sm:text-4xl text-[#F5F4F2] uppercase font-black tracking-tight group-hover:text-[#F5F4F2] transition-colors">
                    {category.name}
                  </h3>
                  <p className="font-heading text-sm text-[#C8202B] uppercase tracking-wider font-semibold">
                    {category.tagline || 'Athletic Standard'}
                  </p>
                </div>

                <p className="text-sm text-[#8C8C8C] leading-relaxed mt-4 font-body line-clamp-3">
                  {category.description || 'Targeted formulations engineered strictly around the physical demands of high-performance athletic training.'}
                </p>
              </div>

              {/* Category Card Footer CTA */}
              <div className="p-8 pt-4 border-t border-[#242424] flex items-center justify-between text-xs font-heading uppercase tracking-widest text-[#F5F4F2] group-hover:text-[#C8202B] transition-colors relative z-10">
                <span>View {category.name} Products</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
