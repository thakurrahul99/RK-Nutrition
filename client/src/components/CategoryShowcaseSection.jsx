import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Dumbbell, Flame, Sparkles, Layers, ArrowRight, Zap } from 'lucide-react';

export default function CategoryShowcaseSection() {
  const { categories } = useCategories();
  const containerRef = useScrollReveal();

  const getCategoryIcon = (slug = '') => {
    const s = slug.toLowerCase();
    if (s.includes('protein')) return <Dumbbell className="w-5 h-5 text-[#E11D2E]" />;
    if (s.includes('mass') || s.includes('gainer')) return <Sparkles className="w-5 h-5 text-[#E11D2E]" />;
    if (s.includes('pre') || s.includes('workout') || s.includes('energy')) return <Flame className="w-5 h-5 text-[#E11D2E]" />;
    if (s.includes('creatine')) return <Zap className="w-5 h-5 text-[#E11D2E]" />;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {categories.map((category, idx) => (
            <Link 
              key={category.id || category.slug} 
              id={`cat-${category.slug}`}
              to={`/categories/${category.slug}`}
              className={`reveal-init stagger-${(idx % 4) + 1} card-hover-lift group relative bg-[#131313] border border-[#202020] hover:border-[#E11D2E]/50 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300`}
            >
              {/* Cover Banner (4:3 aspect ratio) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181818]">
                <img
                  src={category.image || `/images/category-${category.slug}.webp`}
                  alt={category.name}
                  loading="lazy"
                  width="400"
                  height="300"
                  onError={(e) => {
                    const fallback = `/images/category-${category.slug}.webp`;
                    if (!e.currentTarget.src.includes(fallback)) {
                      e.currentTarget.src = fallback;
                    } else {
                      e.currentTarget.style.display = 'none';
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-transparent" 
                  aria-hidden="true" 
                />
                <div className="absolute top-3 left-3 w-9 h-9 bg-[#111111]/85 backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center shadow-lg group-hover:border-[#E11D2E]/50 transition-colors">
                  {getCategoryIcon(category.slug)}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-mono text-[#D1D5DB] uppercase bg-[#111111]/85 backdrop-blur-md px-2 py-0.5 border border-[#2A2A2A]">
                    {category.productCount ? `${category.productCount} Items` : 'Explore'}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow relative z-10">
                <div>
                  <h3 className="font-heading text-lg sm:text-xl text-[#F5F4F2] uppercase font-bold tracking-tight group-hover:text-white transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#8C8C8C] font-body mt-1.5 leading-relaxed line-clamp-2">
                    {category.description || 'Targeted formulations engineered strictly around the physical demands of athletic training.'}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#8C8C8C] group-hover:text-[#F5F4F2] transition-colors">
                  <span>Explore Category</span>
                  <span className="text-[#E11D2E] transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
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
