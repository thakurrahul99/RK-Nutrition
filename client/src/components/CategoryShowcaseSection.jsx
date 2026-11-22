import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Dumbbell, Flame, Sparkles, Layers, ArrowRight } from 'lucide-react';

export default function CategoryShowcaseSection() {
  const { categories } = useCategories();
  const containerRef = useScrollReveal();

  const getCategoryIcon = (slug = '') => {
    const s = slug.toLowerCase();
    if (s.includes('protein')) return <Dumbbell className="w-5 h-5 text-[#E11D2E]" />;
    if (s.includes('mass') || s.includes('gainer')) return <Sparkles className="w-5 h-5 text-[#E11D2E]" />;
    if (s.includes('pre') || s.includes('workout') || s.includes('energy')) return <Flame className="w-5 h-5 text-[#E11D2E]" />;
    return <Layers className="w-5 h-5 text-[#E11D2E]" />;
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section 
      id="categories" 
      ref={containerRef}
      aria-label="Product Category Showcase"
      className="py-16 sm:py-20 lg:py-24 bg-[#0E0E0E] border-t border-[#1A1A1A] relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div 
        className="absolute right-0 bottom-0 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(225,29,46,0.10)_0%,transparent_70%)] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="reveal-init flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9CA3AF] font-bold">
                TRAINING CATEGORIES
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold tracking-tight">
              PURPOSE-DRIVEN <span className="text-[#E11D2E]">CATEGORIES.</span>
            </h2>
          </div>

          <Link
            to="/categories"
            className="group inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#F5F4F2] hover:text-[#E11D2E] transition-colors font-bold whitespace-nowrap self-start sm:self-end py-1"
          >
            <span>Category Overview</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E] transition-transform duration-200 group-hover:translate-x-1.5" />
          </Link>
        </div>

        {/* Responsive Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {categories.map((category, idx) => (
            <Link 
              key={category.id || category.slug} 
              id={`cat-${category.slug}`}
              to={`/categories/${category.slug}`}
              className={`reveal-init stagger-${(idx % 4) + 1} card-hover-lift group relative bg-[#131313] border border-[#202020] hover:border-[#E11D2E]/50 p-4 sm:p-6 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300`}
            >
              {/* Subtle hover background glow */}
              <div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,46,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                aria-hidden="true" 
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center group-hover:border-[#E11D2E]/50 transition-colors shadow-md">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      getCategoryIcon(category.slug)
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#777777] uppercase bg-[#181818] px-2 py-0.5 border border-[#222222]">
                    {category.productCount ? `${category.productCount} Items` : 'Explore'}
                  </span>
                </div>

                <h3 className="font-heading text-base sm:text-xl text-[#F5F4F2] uppercase font-bold tracking-tight group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-[#8C8C8C] font-body mt-1 leading-relaxed line-clamp-2">
                  {category.description || 'Targeted formulations engineered strictly around the physical demands of athletic training.'}
                </p>
              </div>

              <div className="relative z-10 pt-3 mt-4 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#777777] group-hover:text-[#F5F4F2] transition-colors">
                <span>View Products</span>
                <span className="text-[#E11D2E] transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>

              {/* Bottom Hairline Red Accent */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-[#E11D2E] transition-all duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
