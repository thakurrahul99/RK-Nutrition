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
        {/* Soft Radial Red Studio Flare at Top-Right on Mobile & Desktop */}
        <div className="absolute right-0 top-0 w-[260px] sm:w-[480px] lg:w-[640px] h-[260px] sm:h-[480px] lg:h-[640px] bg-[radial-gradient(circle_at_top_right,rgba(225,29,46,0.20)_0%,rgba(11,11,11,0)_70%)] pointer-events-none" />
      </div>

      {/* 2. Main Hero Grid Container: padding 18px 16px 28px on mobile */}
      <div className="relative max-w-7xl mx-auto px-4 py-[18px] pb-[28px] sm:px-6 lg:px-8 sm:py-12 lg:py-18 z-10 w-full overflow-hidden sm:overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center">
          
          {/* Left Column (Desktop) / Main Stack (Mobile) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left w-full relative">
            
            {/* 1. Tag Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-[10px] py-[6px] sm:px-3 sm:py-1 bg-[#121212] border border-[#242424] mb-[16px] sm:mb-5 max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E] shrink-0" aria-hidden="true" />
              <span className="text-[9px] sm:text-xs font-mono font-bold tracking-[1.2px] sm:tracking-[0.22em] text-[#A1A1A1] uppercase truncate">
                {eyebrow}
              </span>
            </div>

            {/* STEP 1: Hero Visual Wrapper (wraps Headline + Mobile Tub) */}
            <div className="hero-visual relative w-full">
              {/* Product Tub (Mobile Only: clamp(112px, 36vw, 160px), right: 0, top: -1vw, bottom fade ~18%, halo glow) */}
              <div 
                className="absolute right-0 top-[-1vw] w-[clamp(112px,36vw,160px)] aspect-[4/5] z-[1] sm:hidden pointer-events-none flex items-center justify-center overflow-visible [mask-image:linear-gradient(to_bottom,#000_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_82%,transparent_100%)]"
                aria-hidden="true"
              >
                {/* 1.4x radial halo glow behind tub */}
                <div className="absolute inset-[-20%] bg-[radial-gradient(circle,rgba(225,29,46,0.28)_0%,transparent_65%)] pointer-events-none -z-10" />
                <HeroProduct3D className="!w-full !h-full !max-w-none drop-shadow-[0_10px_28px_rgba(225,29,46,0.4)]" />
              </div>

              {/* STEP 2: Main Headline */}
              <h1 className="font-heading font-extrabold sm:font-bold text-[clamp(36px,11.6vw,50px)] sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl tracking-[-0.3px] sm:tracking-tight uppercase leading-[0.95] sm:leading-[0.92] text-[#F2F2F2] flex flex-col gap-0 sm:block mb-[calc(1.28em+16px)] sm:mb-6 select-none [transform:scaleY(1.45)] origin-top-left sm:[transform:none] max-w-full relative z-[2]">
                <span className="block whitespace-nowrap text-[#F2F2F2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{headingLine1}</span>
                <span className="block whitespace-nowrap text-[#E11D2E] drop-shadow-[0_0_16px_rgba(225,29,46,0.45)]">{headingLine2}</span>
                <span className="block whitespace-nowrap text-[#F2F2F2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{headingLine3}</span>
              </h1>
            </div>

            {/* Mobile-Only "BUILT FOR YOUR ROUTINE." Block (Immediately below headline+tub) */}
            <div className="block sm:hidden w-full pt-2.5 border-t border-[#1F1F1F] mb-[18px] text-left relative z-[2]">
              <div>
                <span className="text-[14px] font-heading font-extrabold text-[#FFFFFF] tracking-[0.5px] uppercase block">
                  {supportingLabel}
                </span>
                <span className="text-[8px] min-[360px]:text-[8.5px] min-[390px]:text-[9px] font-mono text-[#9CA3AF] tracking-[0.8px] min-[360px]:tracking-[1px] uppercase mt-0.5 block whitespace-nowrap">
                  ZERO AMINO SPIKING • TRANSPARENT LABELS • CLINICALLY DOSED
                </span>
              </div>
              <div className="flex items-center gap-2 text-[8px] min-[360px]:text-[8.5px] min-[390px]:text-[9px] font-mono text-[#9CA3AF] uppercase tracking-[0.8px] min-[360px]:tracking-[1px] mt-[6px] whitespace-nowrap">
                <span>EST. 2026</span>
                <span>•</span>
                <span className="text-[#E11D2E]">100% PURE FORMULATION</span>
              </div>
            </div>

            {/* Paragraph / Supporting Text */}
            <div className="w-full relative z-[2]">
              <p className="max-w-xl text-[14px] sm:text-base md:text-lg text-[#B8BCC4] font-normal leading-[1.55] sm:leading-relaxed mb-[20px] sm:mb-8 font-body">
                {subtext}
              </p>
            </div>

            {/* Buttons: Full width & 48px on mobile, auto width & side-by-side on desktop */}
            <div className="w-full sm:w-auto relative z-[2] mb-2 sm:mb-8">
              <div className="flex flex-col min-[360px]:flex-row items-stretch min-[360px]:items-center gap-[10px] sm:gap-4 w-full sm:w-auto">
                <Link
                  to={primaryCtaHref.startsWith('#') ? '/products' : primaryCtaHref}
                  className="w-full min-[360px]:flex-1 sm:w-auto sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-9 h-[48px] sm:h-auto sm:py-3.5 bg-[#E11D2E] hover:bg-[#C81827] active:bg-[#AC1721] text-[#F2F2F2] font-heading text-[12px] sm:text-lg font-bold tracking-[1px] sm:tracking-widest uppercase transition-colors duration-200 shadow-xl shadow-[#E11D2E]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2F2F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] group cursor-pointer text-center whitespace-nowrap"
                >
                  <span>{primaryCtaText}</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                </Link>

                <Link
                  to={secondaryCtaHref.startsWith('#') ? '/categories' : secondaryCtaHref}
                  className="w-full min-[360px]:flex-1 sm:w-auto sm:flex-none inline-flex items-center justify-center px-3 sm:px-9 h-[48px] sm:h-auto sm:py-3.5 bg-[#121212] hover:bg-[#1A1A1A] active:bg-[#161616] text-[#F2F2F2] border border-[#282828] hover:border-[#E11D2E] font-heading text-[12px] sm:text-lg font-bold tracking-[1px] sm:tracking-widest uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] cursor-pointer text-center whitespace-nowrap"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              </div>
            </div>

            {/* Desktop-Only "BUILT FOR YOUR ROUTINE." Footer Bar */}
            <div className="hidden sm:flex pt-6 border-t border-[#1F1F1F] w-full flex-row items-center justify-between gap-3 text-left relative z-[2]">
              <div>
                <span className="text-sm font-heading font-bold text-[#F2F2F2] tracking-wider uppercase block">
                  {supportingLabel}
                </span>
                <span className="text-[11px] font-mono text-[#8C8C8C] tracking-wider uppercase mt-0.5 block">
                  ZERO AMINO SPIKING • TRANSPARENT LABELS • CLINICALLY DOSED
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#666666] uppercase tracking-widest">
                <span>EST. 2026</span>
                <span>•</span>
                <span className="text-[#E11D2E]">100% PURE FORMULATION</span>
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
