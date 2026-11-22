import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import HeroProduct3D from './home/HeroProduct3D';

export default function HeroSection() {
  const { content } = useContent();
  const rawHero = content?.homepage?.hero || content?.hero || {};

  const eyebrow = rawHero.badge || 'RK NUTRITION / PERFORMANCE SERIES';
  const headingLine1 = rawHero.headingLine1 || rawHero.headlineWhite || 'FUEL YOUR';
  const headingLine2 = rawHero.headingLine2 || rawHero.headlineRed || 'POTENTIAL.';
  const headingLine3 = rawHero.headingLine3 || 'NOT THE NOISE.';
  const subtext = rawHero.subtext || 'Straightforward sports nutrition. Transparent ingredients. No unnecessary hype. Find the essentials to support your training and everyday routine.';
  const primaryCtaText = rawHero.primaryCtaText || rawHero.primaryCta?.text || 'SHOP SUPPLEMENTS';
  const primaryCtaHref = rawHero.primaryCtaLink || rawHero.primaryCtaHref || rawHero.primaryCta?.href || '/products';
  const secondaryCtaText = rawHero.secondaryCtaText || rawHero.secondaryCta?.text || 'EXPLORE THE RANGE';
  const secondaryCtaHref = rawHero.secondaryCtaLink || rawHero.secondaryCtaHref || rawHero.secondaryCta?.href || '/categories';
  const supportingLabel = rawHero.supportingLabel || 'BUILT FOR YOUR ROUTINE.';

  return (
    <section 
      id="hero" 
      aria-label="Hero Section"
      className="relative bg-[#0B0B0B] border-b border-[#1A1A1A] overflow-hidden"
    >
      {/* 1. Subtle Studio Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        {/* Soft Radial Red Studio Flare behind Product on Desktop */}
        <div className="absolute right-0 lg:right-1/12 top-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] lg:w-[640px] h-[300px] sm:h-[480px] lg:h-[640px] bg-[radial-gradient(circle_at_center,rgba(213,31,50,0.11)_0%,rgba(11,11,11,0)_72%)] pointer-events-none" />
      </div>

      {/* 2. Main Hero Grid Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-12 lg:py-18 z-10 w-full overflow-hidden sm:overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center">
          
          {/* Left Column (Desktop) / Main Stack (Mobile) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left w-full relative">
            
            {/* Mobile Product Tub: Absolute positioned at right 10px, top 25px, width 150px, z-index 1, subtle red glow */}
            <div 
              className="absolute right-[10px] top-[25px] w-[150px] h-[190px] z-[1] sm:hidden pointer-events-none drop-shadow-[0_10px_30px_rgba(225,29,46,0.35)] flex items-center justify-center overflow-visible"
              aria-hidden="true"
            >
              <HeroProduct3D className="!w-[150px] !h-[190px] !max-w-none drop-shadow-[0_10px_30px_rgba(225,29,46,0.35)]" />
            </div>

            {/* Top Composition: Eyebrow + Headline */}
            <div className="w-full relative z-10 order-1 min-h-[190px] sm:min-h-0">
              <div className="flex flex-col items-start py-0.5 sm:py-0 min-w-0 w-full">
                {/* 1. Eyebrow */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#121212] border border-[#242424] mb-2 sm:mb-5 max-w-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E] shrink-0" aria-hidden="true" />
                  <span className="text-[7.5px] min-[360px]:text-[8px] sm:text-xs font-mono font-bold tracking-[0.06em] sm:tracking-[0.22em] text-[#A1A1A1] uppercase truncate">
                    {eyebrow}
                  </span>
                </div>

                {/* 2. Main Headline: 44px, line-height 0.95, letter-spacing -0.5px, weight 800, scaleY(1.25), max-width 280px, margin-bottom 28px clearance */}
                <div className="max-w-[280px] sm:max-w-none pb-7 sm:pb-0 mb-0 sm:mb-6">
                  <h1 className="font-heading font-extrabold sm:font-bold text-[44px] sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl tracking-[-0.5px] sm:tracking-tight uppercase leading-[0.95] sm:leading-[0.92] text-[#F2F2F2] flex flex-col gap-0 sm:block mb-0 select-none [transform:scaleY(1.25)] origin-top-left sm:[transform:none]">
                    <span className="block text-[#F2F2F2] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{headingLine1}</span>
                    <span className="block text-[#E11D2E] whitespace-nowrap drop-shadow-[0_0_16px_rgba(225,29,46,0.45)]">{headingLine2}</span>
                    <span className="block text-[#F2F2F2] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{headingLine3}</span>
                  </h1>
                </div>
              </div>
            </div>

            {/* 3. "BUILT FOR YOUR ROUTINE." SECTION:
                Placed right under the tub/headline block on mobile (order-2 on mobile, order-4 at bottom on desktop) */}
            <div className="order-2 sm:order-4 w-full pt-2 sm:pt-6 border-t border-[#1F1F1F] mt-[-10px] sm:mt-auto mb-2.5 sm:mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 text-left relative z-10">
              <div>
                <span className="text-[14px] sm:text-sm font-heading font-extrabold sm:font-bold text-[#FFFFFF] sm:text-[#F2F2F2] tracking-wider uppercase block">
                  {supportingLabel}
                </span>
                <span className="text-[9px] sm:text-[11px] font-mono text-[#9CA3AF] sm:text-[#8C8C8C] tracking-[1px] sm:tracking-wider uppercase mt-0.5 block">
                  ZERO AMINO SPIKING • TRANSPARENT LABELS • CLINICALLY DOSED
                </span>
              </div>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-[#9CA3AF] sm:text-[#666666] uppercase tracking-[1px] sm:tracking-widest mt-0.5 sm:mt-0">
                <span>EST. 2026</span>
                <span>•</span>
                <span className="text-[#E11D2E]">100% PURE FORMULATION</span>
              </div>
            </div>

            {/* 4. Supporting Text / Subtext (order-3 on mobile, order-2 on desktop) */}
            <div className="order-3 sm:order-2 w-full relative z-10">
              <p className="max-w-xl text-[12.5px] min-[390px]:text-[13px] sm:text-base md:text-lg text-[#B5B5B5] font-normal leading-[1.48] sm:leading-relaxed mt-1 sm:mt-0 mb-3 sm:mb-8 font-body">
                {subtext}
              </p>
            </div>

            {/* 5. Action CTA Buttons (order-4 on mobile, order-3 on desktop): Full width, 48px height on mobile */}
            <div className="order-4 sm:order-3 w-full relative z-10 mb-2 sm:mb-8">
              <div className="flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <Link
                  to={primaryCtaHref.startsWith('#') ? '/products' : primaryCtaHref}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-9 h-[48px] sm:h-auto sm:py-3.5 bg-[#E11D2E] hover:bg-[#C81827] active:bg-[#AC1721] text-[#F2F2F2] font-heading text-[11px] min-[360px]:text-[11.5px] min-[390px]:text-[12px] sm:text-lg font-bold tracking-wider sm:tracking-widest uppercase transition-colors duration-200 shadow-xl shadow-[#E11D2E]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2F2F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] group cursor-pointer text-center whitespace-nowrap"
                >
                  <span>{primaryCtaText}</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                </Link>

                <Link
                  to={secondaryCtaHref.startsWith('#') ? '/categories' : secondaryCtaHref}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-2 sm:px-9 h-[48px] sm:h-auto sm:py-3.5 bg-[#121212] hover:bg-[#1A1A1A] active:bg-[#161616] text-[#F2F2F2] border border-[#282828] hover:border-[#E11D2E] font-heading text-[11px] min-[360px]:text-[11.5px] min-[390px]:text-[12px] sm:text-lg font-bold tracking-wider sm:tracking-widest uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] cursor-pointer text-center whitespace-nowrap"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column (Desktop Product Visual Showcase) */}
          <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center">
            <HeroProduct3D />
          </div>

        </div>
      </div>
    </section>
  );
}
