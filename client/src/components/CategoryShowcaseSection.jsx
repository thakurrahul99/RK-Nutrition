import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { Dumbbell, Flame, Sparkles, Layers, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryShowcaseSection() {
  const { categories } = useCategories();
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [categories]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    if (Math.abs(walk) > 6) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setHasDragged(false), 50);
  };

  const getCategoryIcon = (slug = '') => {
    const s = slug.toLowerCase();
    if (s.includes('protein')) return <Dumbbell className="w-6 h-6 text-[#C8202B]" />;
    if (s.includes('mass') || s.includes('gainer')) return <Sparkles className="w-6 h-6 text-[#C8202B]" />;
    if (s.includes('pre') || s.includes('workout') || s.includes('energy')) return <Flame className="w-6 h-6 text-[#C8202B]" />;
    return <Layers className="w-6 h-6 text-[#C8202B]" />;
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section 
      id="categories" 
      aria-label="Product Category Showcase"
      className="relative py-12 sm:py-28 bg-[#141414] border-b border-[#222222]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Carousel Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-3">
              <span className="w-8 h-[2px] bg-[#C8202B]" />
              RK NUTRITION • CATEGORIES
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95]">
              PURPOSE-DRIVEN <span className="text-[#C8202B]">CATEGORIES.</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <p className="text-xs sm:text-sm text-[#8C8C8C] max-w-md font-body leading-relaxed hidden lg:block">
              Explore our core nutritional categories. Structured strictly around the physical demands of high-performance training.
            </p>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <Link
                to="/categories"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C8202B] hover:text-[#F5F4F2] transition-colors font-bold whitespace-nowrap"
              >
                <span>Category Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Carousel Navigation Arrow Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous categories"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-[#161616] border border-[#2A2A2A] hover:border-[#C8202B] hover:bg-[#C8202B] text-[#F5F4F2] disabled:opacity-25 disabled:hover:bg-[#161616] disabled:hover:border-[#2A2A2A] disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next categories"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-[#161616] border border-[#2A2A2A] hover:border-[#C8202B] hover:bg-[#C8202B] text-[#F5F4F2] disabled:opacity-25 disabled:hover:bg-[#161616] disabled:hover:border-[#2A2A2A] disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory horizontal-scroll-track ${isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        >
          {categories.map((category) => (
            <Link 
              key={category.id || category.slug} 
              id={`cat-${category.slug}`}
              to={`/categories/${category.slug}`}
              onClickCapture={(e) => {
                if (hasDragged) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="shrink-0 w-[270px] min-[360px]:w-[290px] sm:w-[350px] lg:w-[420px] snap-start relative bg-[#1A1A1A] border border-[#282828] hover:border-[#C8202B] transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl cursor-pointer"
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
              <div className="p-5 sm:p-7 pb-4 relative z-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
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
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#F5F4F2] uppercase font-black tracking-tight group-hover:text-[#F5F4F2] transition-colors">
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
              <div className="p-5 sm:p-7 pt-4 border-t border-[#242424] flex items-center justify-between text-xs font-heading uppercase tracking-widest text-[#F5F4F2] group-hover:text-[#C8202B] transition-colors relative z-10">
                <span>View {category.name} Products</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Destination Link Strip */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-[#8C8C8C] uppercase tracking-wider">
            SHOWCASING {categories.length} PERFORMANCE CATEGORIES • SWIPE OR USE ARROWS
          </span>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] hover:border-[#C8202B] text-xs font-heading tracking-widest uppercase text-[#F5F4F2] transition-colors"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8202B]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
