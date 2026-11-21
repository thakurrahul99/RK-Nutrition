import { ArrowLeft } from 'lucide-react';

export default function ShopHero({ onBackToHome, activeCategoryLabel }) {
  return (
    <section 
      aria-label="Shop Hero" 
      className="relative bg-[#111111] border-b border-[#222222] pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Subtle Atmospheric Grid & Ambient Red Accent */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8202B]/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#F5F4F2_1px,transparent_1px),linear-gradient(to_bottom,#F5F4F2_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#8C8C8C] mb-6 uppercase tracking-wider">
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-[#F5F4F2] transition-colors inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C8202B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HOME</span>
          </button>
          <span>/</span>
          <span className="text-[#F5F4F2]">SHOP</span>
          {activeCategoryLabel && activeCategoryLabel !== 'All Products' && (
            <>
              <span>/</span>
              <span className="text-[#C8202B]">{activeCategoryLabel.toUpperCase()}</span>
            </>
          )}
        </nav>

        {/* Small Red Accent Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-4">
          <span className="w-6 h-[2px] bg-[#C8202B]" />
          SPORTS NUTRITION CATALOGUE
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95] mb-4">
          PREMIUM <span className="text-[#C8202B]">SUPPLEMENTS.</span>
        </h1>

        {/* Supporting text */}
        <p className="max-w-2xl text-base sm:text-lg text-[#8C8C8C] leading-relaxed font-body">
          Explore RK Nutrition's pure, lab-tested formulations. Built with transparent active ingredients, balanced macros, and zero proprietary blends to support your recovery and daily intake.
        </p>
      </div>
    </section>
  );
}
