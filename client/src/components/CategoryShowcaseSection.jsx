import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { Dumbbell, Flame, Sparkles, Layers, ArrowRight } from 'lucide-react';

export default function CategoryShowcaseSection() {
  const { categories } = useCategories();

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
      aria-label="Product Category Showcase"
      className="py-14 sm:py-20 lg:py-24 bg-[#0E0E0E] border-t border-[#1F1F1F] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-heading uppercase tracking-[0.16em] text-[#8C8C8C] block mb-2">
              TRAINING CATEGORIES
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold tracking-tight">
              PURPOSE-DRIVEN <span className="text-[#E11D2E]">CATEGORIES.</span>
            </h2>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#F5F4F2] hover:text-[#E11D2E] transition-colors font-bold whitespace-nowrap self-start sm:self-end"
          >
            <span>Category Overview</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E]" />
          </Link>
        </div>

        {/* Responsive Grid: 2-column mobile, 3-4 column desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id || category.slug} 
              id={`cat-${category.slug}`}
              to={`/categories/${category.slug}`}
              className="bg-[#141414] border border-[#1F1F1F] hover:border-[#333333] transition-all p-4 sm:p-6 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 bg-[#1A1A1A] border border-[#242424] flex items-center justify-center group-hover:border-[#333333] transition-colors">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      getCategoryIcon(category.slug)
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#666666] uppercase">
                    {category.productCount ? `${category.productCount} Formulations` : 'Explore'}
                  </span>
                </div>

                <h3 className="font-heading text-base sm:text-xl text-[#F5F4F2] uppercase font-bold tracking-tight group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-[#8C8C8C] font-body mt-1 leading-relaxed line-clamp-2">
                  {category.description || 'Targeted formulations engineered strictly around the physical demands of athletic training.'}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#666666] group-hover:text-[#F5F4F2] transition-colors">
                <span>View Products</span>
                <span className="text-[#E11D2E]">→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
