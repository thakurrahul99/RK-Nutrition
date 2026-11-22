import { useRef, useState, useEffect } from 'react';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { FileText, ShieldCheck, Scale, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BrandValuesSection() {
  const { content } = useContent();
  const values = content?.values || brandConfig.values;
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, [values]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const getValueIcon = (index) => {
    switch (index) {
      case 0:
        return <FileText className="w-6 h-6 text-[#C8202B]" />;
      case 1:
        return <ShieldCheck className="w-6 h-6 text-[#C8202B]" />;
      case 2:
        return <Scale className="w-6 h-6 text-[#C8202B]" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-[#C8202B]" />;
    }
  };

  return (
    <section 
      aria-label="Supplement Quality Values"
      className="py-14 sm:py-24 md:py-32 bg-[#111111] border-b border-[#222222] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-3">
            <span className="w-6 h-[2px] bg-[#C8202B]" />
            FORMULATION STANDARDS
            <span className="w-6 h-[2px] bg-[#C8202B]" />
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.98]">
            OUR QUALITY <span className="text-[#C8202B]">PILLARS.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8C8C8C] leading-relaxed">
            The non-negotiable principles that dictate how we source raw materials, test purity, and formulate every container.
          </p>

          {/* Mobile Carousel Navigation Arrows (visible only on mobile md:hidden) */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-5">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous quality pillar"
              className="w-8 h-8 bg-[#161616] border border-[#2A2A2A] hover:border-[#C8202B] hover:bg-[#C8202B] text-[#F5F4F2] disabled:opacity-25 disabled:hover:bg-[#161616] disabled:hover:border-[#2A2A2A] disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next quality pillar"
              className="w-8 h-8 bg-[#161616] border border-[#2A2A2A] hover:border-[#C8202B] hover:bg-[#C8202B] text-[#F5F4F2] disabled:opacity-25 disabled:hover:bg-[#161616] disabled:hover:border-[#2A2A2A] disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Values: Mobile Horizontal Scroll Track & Desktop 3-Column Grid */}
        <div 
          ref={scrollRef}
          className="flex md:grid md:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 pt-1 scroll-smooth snap-x snap-mandatory horizontal-scroll-track"
        >
          {values.map((val, idx) => (
            <div 
              key={val.title}
              className="shrink-0 md:shrink w-[280px] min-[360px]:w-[300px] sm:w-[360px] md:w-auto snap-start relative bg-[#161616] border border-[#262626] hover:border-[#C8202B] p-6 sm:p-8 md:p-10 flex flex-col justify-between transition-all duration-300 group shadow-lg overflow-hidden"
            >
              {/* Signature RK red corner block accent */}
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#C8202B] z-10" />

              {/* Subtle background RK watermark */}
              <span 
                className="absolute -bottom-6 -right-3 font-heading font-black text-8xl text-white/[0.02] select-none pointer-events-none tracking-tighter"
                aria-hidden="true"
              >
                RK
              </span>

              {/* Header with Number and Icon */}
              <div>
                <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-[#242424]">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-[#3A3A3A] group-hover:text-[#C8202B] transition-colors">
                    {val.number}
                  </span>
                  <div className="p-2.5 sm:p-3 bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#C8202B] transition-colors">
                    {getValueIcon(idx)}
                  </div>
                </div>

                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#C8202B] block mb-1">
                  {val.subheading}
                </span>

                <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#F5F4F2] uppercase font-bold tracking-tight mb-3 sm:mb-4">
                  {val.title}
                </h3>

                <p className="text-xs sm:text-sm md:text-base text-[#F5F4F2]/75 leading-relaxed font-body">
                  {val.description}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-6 sm:mt-8 pt-4 border-t border-[#242424] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#5A5A5A] uppercase">
                <span>RK STANDARD</span>
                <span className="group-hover:text-[#C8202B] transition-colors">STANDARD #{val.number}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
