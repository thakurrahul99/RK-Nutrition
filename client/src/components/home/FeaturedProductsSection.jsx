import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../shop/ProductCard';
import { useProducts } from '../../context/ProductContext';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeaturedProductsSection() {
  const navigate = useNavigate();
  const { featuredProducts } = useProducts();
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
  }, [featuredProducts]);

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

  if (featuredProducts.length === 0) return null;

  return (
    <section 
      id="featured-products"
      aria-label="Featured Products Showcase"
      className="py-12 sm:py-20 bg-[#111111] border-b border-[#222222] relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8202B]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Clean Section Header with Distinct RK Brand Details & Carousel Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-3">
              <span className="w-6 h-[2px] bg-[#C8202B]" />
              RK NUTRITION • FOUNDATIONAL SERIES
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95]">
              FEATURED <span className="text-[#C8202B]">PRODUCTS.</span>
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8202B] hover:text-[#F5F4F2] transition-colors font-bold whitespace-nowrap"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Carousel Navigation Arrow Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous products"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#161616] border border-[#2A2A2A] hover:border-[#C8202B] hover:bg-[#C8202B] text-[#F5F4F2] disabled:opacity-25 disabled:hover:bg-[#161616] disabled:hover:border-[#2A2A2A] disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Next products"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#161616] border border-[#2A2A2A] hover:border-[#C8202B] hover:bg-[#C8202B] text-[#F5F4F2] disabled:opacity-25 disabled:hover:bg-[#161616] disabled:hover:border-[#2A2A2A] disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
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
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClickCapture={(e) => {
                if (hasDragged) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="shrink-0 w-[270px] min-[360px]:w-[290px] sm:w-[350px] lg:w-[420px] snap-start"
            >
              <ProductCard
                product={product}
                onSelectProduct={(p) => {
                  if (!hasDragged) {
                    navigate(`/product/${p.id}`);
                  }
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
