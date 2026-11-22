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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 min-[360px]:py-4 min-[390px]:py-5 sm:py-12 lg:py-18 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-12 items-center">
          
          {/* Left Column (Desktop) / Main Stack (Mobile) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left w-full">
            
            {/* Top Composition: Eyebrow + Headline & Tub */}
            <div className="w-full">
              {/* Mobile compact side-by-side top composition; desktop retains its original left column */}
              <div className="grid grid-cols-[1fr_auto] gap-2 min-[360px]:gap-3 sm:gap-6 items-start lg:block min-w-0 w-full">
                <div className="min-w-0 flex flex-col items-start py-0.5 sm:py-0">
                  {/* 1. Eyebrow */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#121212] border border-[#242424] mb-2 min-[360px]:mb-2.5 sm:mb-5 max-w-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D51F32] shrink-0" aria-hidden="true" />
                    <span className="text-[7.5px] min-[360px]:text-[8px] sm:text-xs font-mono font-bold tracking-[0.06em] sm:tracking-[0.22em] text-[#A1A1A1] uppercase truncate">
                      {eyebrow}
                    </span>
                  </div>

                  {/* 2. Main Headline (Glyph stretched scale(1.04, 1.17) on mobile, font size 29.5px, line-height 0.95, letter spacing -0.7px) */}
                  <div className="max-w-[190px] min-[360px]:max-w-[210px] min-[390px]:max-w-[230px] sm:max-w-none pb-3 sm:pb-0 mb-1 sm:mb-6">
                    <h1 className="font-heading font-extrabold sm:font-bold text-[29.5px] min-[360px]:text-[31.5px] min-[390px]:text-[33.5px] sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl tracking-[-0.7px] sm:tracking-tight uppercase leading-[0.95] sm:leading-[0.92] text-[#F2F2F2] flex flex-col gap-0 sm:gap-0 sm:block mb-0 select-none [transform:scale(1.04,1.17)] origin-top-left sm:[transform:none]">
                      <span className="block text-[#F2F2F2] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{headingLine1}</span>
                      <span className="block text-[#D51F32] whitespace-nowrap drop-shadow-[0_0_16px_rgba(213,31,50,0.45)]">{headingLine2}</span>
                      <span className="block text-[#F2F2F2] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{headingLine3}</span>
                    </h1>
                  </div>
                </div>

                {/* Mobile product visual: Target width 68-72px, height 125-130px at 322px, offset 12px down, right aligned */}
                <div className="flex lg:hidden items-center justify-end min-w-0 shrink-0 translate-y-3 sm:translate-y-0 mr-0 ml-auto">
                  <HeroProduct3D className="!w-[70px] !h-[128px] min-[360px]:!w-[78px] min-[360px]:!h-[142px] min-[375px]:!w-[82px] min-[375px]:!h-[150px] min-[390px]:!w-[88px] min-[390px]:!h-[158px] min-[430px]:!w-[96px] min-[430px]:!h-[172px] !max-w-none drop-shadow-2xl" />
                </div>
              </div>
            </div>

            {/* Middle Section on Mobile: Subtext & Action CTA Buttons (Proportionally balanced across viewport) */}
            <div className="w-full">
              {/* 3. Supporting Text (12.5-13px, line-height 1.48, comfortable readability) */}
              <p className="max-w-xl text-[12.5px] min-[390px]:text-[13px] sm:text-base md:text-lg text-[#B5B5B5] font-normal leading-[1.48] sm:leading-relaxed mt-2 min-[360px]:mt-2.5 min-[390px]:mt-3 mb-2.5 min-[360px]:mb-3 min-[390px]:mb-3.5 sm:mb-8 font-body">
                {subtext}
              </p>

              {/* 4. Action CTA Buttons (Height 40-44px, font size 10.5-11.5px, equal width, 8-10px spacing) */}
              <div className="flex flex-row items-center gap-2 min-[360px]:gap-2.5 sm:gap-4 w-full sm:w-auto mb-2.5 min-[360px]:mb-3 min-[390px]:mb-3.5 sm:mb-8">
                <Link
                  to={primaryCtaHref.startsWith('#') ? '/products' : primaryCtaHref}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-9 h-[40px] min-[360px]:h-[42px] min-[390px]:h-[44px] sm:h-auto sm:py-3.5 bg-[#D51F32] hover:bg-[#B81727] active:bg-[#9E1220] text-[#F2F2F2] font-heading text-[10.5px] min-[360px]:text-[11px] min-[390px]:text-[11.5px] sm:text-lg font-bold tracking-wider sm:tracking-widest uppercase transition-colors duration-200 shadow-xl shadow-[#D51F32]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2F2F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] group cursor-pointer text-center whitespace-nowrap"
                >
                  <span>{primaryCtaText}</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                </Link>

                <Link
                  to={secondaryCtaHref.startsWith('#') ? '/categories' : secondaryCtaHref}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-2 sm:px-9 h-[40px] min-[360px]:h-[42px] min-[390px]:h-[44px] sm:h-auto sm:py-3.5 bg-[#121212] hover:bg-[#1A1A1A] active:bg-[#161616] text-[#F2F2F2] border border-[#282828] hover:border-[#D51F32] font-heading text-[10.5px] min-[360px]:text-[11px] min-[390px]:text-[11.5px] sm:text-lg font-bold tracking-wider sm:tracking-widest uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D51F32] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] cursor-pointer text-center whitespace-nowrap"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              </div>
            </div>

            {/* 6. Supporting Brand Details (Anchored at Hero Bottom with mt-auto) */}
            <div className="pt-2 min-[390px]:pt-2.5 sm:pt-6 border-t border-[#1F1F1F] w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 text-left mt-auto">
              <div>
                <span className="text-[10.5px] min-[360px]:text-xs sm:text-sm font-heading font-bold text-[#F2F2F2] tracking-wider uppercase block">
                  {supportingLabel}
                </span>
                <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[11px] font-mono text-[#8C8C8C] tracking-wider uppercase mt-0.5 block">
                  ZERO AMINO SPIKING • TRANSPARENT LABELS • CLINICALLY DOSED
                </span>
              </div>
              <div className="flex items-center gap-2 text-[8.5px] min-[360px]:text-[9.5px] sm:text-[10px] font-mono text-[#666666] uppercase tracking-widest mt-0.5 sm:mt-0">
                <span>EST. 2026</span>
                <span>•</span>
                <span className="text-[#D51F32]">100% PURE FORMULATION</span>
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
