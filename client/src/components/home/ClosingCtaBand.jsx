import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function ClosingCtaBand() {
  const containerRef = useScrollReveal();

  return (
    <section 
      ref={containerRef}
      aria-label="Call to Action Banner"
      className="relative py-16 sm:py-20 lg:py-24 bg-[#0B0B0B] border-t border-[#1C1C1C] overflow-hidden"
    >
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,46,0.12)_0%,transparent_70%)] pointer-events-none" 
        aria-hidden="true" 
      />
      <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-[#131313] border border-[#242424] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Signature RK Corner Notches */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-[#E11D2E] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#E11D2E] pointer-events-none" />

          {/* Watermark RK */}
          <span 
            className="absolute right-0 bottom-0 font-heading font-black text-9xl sm:text-[180px] text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter"
            aria-hidden="true"
          >
            RK
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Text & CTAs (8 cols) */}
            <div className="reveal-init lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#E11D2E] font-bold">
                  COMMENCE YOUR TRAINING EVOLUTION
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95]">
                UPGRADE YOUR <span className="text-[#E11D2E]">SUPPLEMENT</span> PROTOCOL TODAY.
              </h2>

              <p className="max-w-2xl text-sm sm:text-base text-[#9CA3AF] font-body leading-relaxed">
                Zero proprietary fillers. Zero amino spiking. Pure athletic formulations engineered strictly for disciplined recovery, strength, and physical output.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-br from-[#E11D2E] to-[#B91422] hover:from-[#F02839] hover:to-[#C81927] text-[#F5F4F2] font-heading text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E11D2E]/25 btn-shimmer active:scale-[0.98] cursor-pointer"
                >
                  <span>Build Your Stack</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#181818] hover:bg-[#202020] border border-[#2A2A2A] hover:border-[#E11D2E]/60 text-[#F5F4F2] font-heading text-xs sm:text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Explore Categories</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Product Tub (4 cols) */}
            <div className="reveal-init lg:col-span-4 flex items-center justify-center">
              <div className="relative w-48 sm:w-56 lg:w-64 aspect-[4/5] flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,46,0.3)_0%,transparent_70%)] pointer-events-none" 
                  aria-hidden="true" 
                />
                <img
                  src="/images/hero-tub.webp"
                  alt="RK Nutrition Premium Tub"
                  width="256"
                  height="320"
                  loading="lazy"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
