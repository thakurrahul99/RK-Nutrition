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
      className="relative bg-[#0B0B0B] border-b border-[#1A1A1A] overflow-hidden min-h-[calc(100svh-5.25rem)] lg:min-h-0 flex flex-col"
    >
      {/* 1. Subtle Studio Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        {/* Soft Radial Red Studio Flare behind Product on Desktop */}
        <div className="absolute right-0 lg:right-1/12 top-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] lg:w-[640px] h-[300px] sm:h-[480px] lg:h-[640px] bg-[radial-gradient(circle_at_center,rgba(213,31,50,0.11)_0%,rgba(11,11,11,0)_72%)] pointer-events-none" />
      </div>

      {/* 2. Main Hero Grid Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 min-[390px]:py-4 sm:py-12 lg:py-18 z-10 w-full flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-12 items-center flex-1">
          
          {/* Left Column (Desktop) / Main Stack (Mobile) */}
          <div className="lg:col-span-7 flex flex-col items-start justify-between text-left w-full h-full flex-1">
            
            {/* Top Composition: Eyebrow + Headline & Tub */}
            <div className="w-full">
              {/* Mobile compact side-by-side top composition; desktop retains its original left column */}
              <div className="grid grid-cols-[1fr_auto] gap-2.5 min-[360px]:gap-3 items-start lg:block min-w-0 w-full">
                <div className="min-w-0 flex flex-col items-start py-0.5 sm:py-0">
                  {/* 1. Eyebrow */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#121212] border border-[#242424] mb-2.5 min-[360px]:mb-3 min-[390px]:mb-3.5 sm:mb-5 max-w-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D51F32] shrink-0" aria-hidden="true" />
                    <span className="text-[7.5px] min-[360px]:text-[8px] sm:text-xs font-mono font-bold tracking-[0.06em] sm:tracking-[0.22em] text-[#A1A1A1] uppercase truncate">
                      {eyebrow}
                    </span>
                  </div>

                  {/* 2. Main Headline (Significantly vertically stretched, bold athletic poster typography, filling mobile space) */}
                  <h1 className="font-heading font-black text-[clamp(1.40rem,6.8vw,1.75rem)] min-[360px]:text-[clamp(1.54rem,7.0vw,1.95rem)] sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl tracking-[-0.045em] sm:tracking-tight uppercase leading-[0.90] sm:leading-[0.92] text-[#F2F2F2] flex flex-col gap-1 min-[360px]:gap-1.5 min-[390px]:gap-2 sm:gap-0 sm:block scale-y-[1.48] min-[360px]:scale-y-[1.56] min-[390px]:scale-y-[1.62] sm:scale-y-100 origin-top-left mb-1 min-[360px]:mb-2 min-[390px]:mb-3 sm:mb-6 select-none [-webkit-text-stroke:0.7px_currentColor] sm:[-webkit-text-stroke:0]">
                    <span className="block text-[#F2F2F2] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{headingLine1}</span>
                    <span className="block text-[#D51F32] whitespace-nowrap drop-shadow-[0_0_16px_rgba(213,31,50,0.45)]">{headingLine2}</span>
                    <span className="block text-[#F2F2F2] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{headingLine3}</span>
                  </h1>
                </div>

                {/* Mobile product visual sits cleanly beside headline with larger prominent sizing */}
                <div className="flex lg:hidden items-center justify-end min-w-0 self-start pt-0 min-[360px]:pt-0.5 min-[390px]:pt-1 shrink-0">
                  <HeroProduct3D className="!w-[110px] min-[360px]:!w-[124px] min-[375px]:!w-[132px] min-[390px]:!w-[138px] min-[430px]:!w-[150px] !max-w-none drop-shadow-2xl" />
                </div>
              </div>
            </div>

            {/* Middle Section on Mobile: Subtext & Action CTA Buttons (Proportionally balanced across viewport) */}
            <div className="w-full my-auto py-1.5 min-[390px]:py-2 sm:py-0">
              {/* 3. Supporting Text */}
              <p className="max-w-xl text-[12.5px] min-[360px]:text-[13.5px] min-[390px]:text-[14px] sm:text-base md:text-lg text-[#B5B5B5] font-normal leading-relaxed mb-3.5 min-[390px]:mb-4.5 sm:mb-8 font-body">
                {subtext}
              </p>

              {/* 4. Action CTA Buttons (Properly fitted, equal height, no text clipping) */}
              <div className="flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <Link
                  to={primaryCtaHref.startsWith('#') ? '/products' : primaryCtaHref}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-9 py-3 min-[390px]:py-3.5 sm:py-3.5 bg-[#D51F32] hover:bg-[#B81727] active:bg-[#9E1220] text-[#F2F2F2] font-heading text-xs min-[360px]:text-[13px] sm:text-lg font-bold tracking-wider sm:tracking-widest uppercase transition-colors duration-200 shadow-xl shadow-[#D51F32]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2F2F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] group cursor-pointer text-center whitespace-nowrap"
                >
                  <span>{primaryCtaText}</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                </Link>

                <Link
                  to={secondaryCtaHref.startsWith('#') ? '/categories' : secondaryCtaHref}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-2.5 sm:px-9 py-3 min-[390px]:py-3.5 sm:py-3.5 bg-[#121212] hover:bg-[#1A1A1A] active:bg-[#161616] text-[#F2F2F2] border border-[#282828] hover:border-[#D51F32] font-heading text-xs min-[360px]:text-[13px] sm:text-lg font-bold tracking-wider sm:tracking-widest uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D51F32] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] cursor-pointer text-center whitespace-nowrap"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              </div>
            </div>

            {/* 6. Supporting Brand Details (Touches Bottom of Screen Viewport) */}
            <div className="pt-2.5 min-[390px]:pt-3 sm:pt-6 border-t border-[#1F1F1F] w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-left">
              <div>
                <span className="text-[11px] min-[360px]:text-xs sm:text-sm font-heading font-bold text-[#F2F2F2] tracking-wider uppercase block">
                  {supportingLabel}
                </span>
                <span className="text-[8px] min-[360px]:text-[9px] sm:text-[11px] font-mono text-[#8C8C8C] tracking-wider uppercase mt-0.5 block">
                  ZERO AMINO SPIKING • TRANSPARENT LABELS • CLINICALLY DOSED
                </span>
              </div>
              <div className="flex items-center gap-2 text-[9px] min-[360px]:text-[10px] sm:text-[10px] font-mono text-[#666666] uppercase tracking-widest mt-0.5 sm:mt-0">
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
