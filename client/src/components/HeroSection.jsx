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
      {/* 1. Subtle Studio Ambient Lighting & High-Tech Atmosphere */}
      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        {/* Soft Animated Breathing Red Studio Flare at Top-Right */}
        <div className="absolute right-0 top-0 w-[260px] sm:w-[480px] lg:w-[680px] h-[260px] sm:h-[480px] lg:h-[680px] bg-[radial-gradient(circle_at_top_right,rgba(225,29,46,0.22)_0%,rgba(11,11,11,0)_72%)] pointer-events-none animate-ambient-breath" />
        
        {/* Fine Technical Grid Matrix */}
        <div className="absolute inset-0 bg-tech-grid opacity-40 pointer-events-none" />
      </div>

      {/* 2. Main Hero Grid Container */}
      <div className="relative max-w-7xl mx-auto px-4 py-[18px] pb-[28px] sm:px-6 lg:px-8 sm:py-12 lg:py-18 z-10 w-full overflow-hidden sm:overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center">
          
          {/* Left Column (Desktop) / Main Stack (Mobile) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left w-full relative">
            
            {/* 1. Tag Pill with Beacon Indicator */}
            <div className="hero-anim-pill inline-flex items-center gap-1.5 sm:gap-2 px-[10px] py-[6px] sm:px-3 sm:py-1.5 bg-[#121212]/90 backdrop-blur-md border border-[#242424] hover:border-[#E11D2E]/40 transition-colors mb-[22px] sm:mb-6 max-w-full shadow-lg shadow-black/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E] shrink-0 animate-pulse" aria-hidden="true" />
              <span className="text-[9px] sm:text-xs font-mono font-bold tracking-[1.2px] sm:tracking-[0.22em] text-[#C4C4C4] uppercase truncate">
                {eyebrow}
              </span>
            </div>

            {/* STEP 1: Hero Visual Wrapper (wraps Headline + Mobile Tub) */}
            <div className="hero-visual relative w-full">
              {/* Soft ambient radial halo behind mobile tub - completely unclipped and feathering smoothly into pure black */}
              <div 
                className="absolute right-[-2vw] top-[-3vw] w-[46vw] max-w-[180px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(225,29,46,0.22)_0%,rgba(225,29,46,0.05)_45%,transparent_70%)] pointer-events-none -z-0 sm:hidden"
                aria-hidden="true" 
              />

              {/* Product Tub (Mobile Only: clamp(100px, 32vw, 144px), right: 0, top: -1vw, animated floating motion + seamless bottom fade) */}
              <div 
                className="absolute right-0 top-[-1vw] w-[clamp(100px,32vw,144px)] aspect-[4/5] z-[1] sm:hidden pointer-events-none flex items-center justify-center overflow-visible"
                aria-hidden="true"
              >
                <div className="w-full h-full animate-tub-mobile flex items-center justify-center [mask-image:linear-gradient(to_bottom,#000_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_78%,transparent_100%)]">
                  <HeroProduct3D className="!w-full !h-full !max-w-none" />
                </div>
              </div>

              {/* STEP 2: Main Headline with Staggered Line Reveals */}
              <h1 className="font-heading font-black text-4xl min-[360px]:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl tracking-tight uppercase leading-[0.92] text-[#F5F4F2] flex flex-col gap-0.5 sm:block mb-6 sm:mb-8 select-none max-w-full relative z-[2]">
                <span className="hero-anim-line-1 block whitespace-nowrap text-[#F5F4F2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {headingLine1}
                </span>
                <span className="hero-anim-line-2 block whitespace-nowrap text-[#E11D2E] drop-shadow-[0_0_16px_rgba(225,29,46,0.45)]">
                  {headingLine2}
                </span>
                <span className="hero-anim-line-3 block whitespace-nowrap text-[#F5F4F2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {headingLine3}
                </span>
              </h1>
            </div>

            {/* Mobile-Only "BUILT FOR YOUR ROUTINE." Block (Immediately below headline+tub) */}
            <div className="hero-anim-footer block sm:hidden w-full pt-3.5 border-t border-[#1F1F1F] mb-6 text-left relative z-[2]">
              <div>
                <span className="text-[13px] font-heading font-bold text-[#F5F4F2] tracking-wider uppercase block">
                  {supportingLabel}
                </span>
                <span className="text-[10px] min-[360px]:text-[11px] font-mono text-[#9CA3AF] tracking-wide uppercase mt-1 block">
                  ZERO AMINO SPIKING • TRANSPARENT LABELS • CLINICALLY DOSED
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] min-[360px]:text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wide mt-2">
                <span>EST. 2026</span>
                <span>•</span>
                <span className="text-[#E11D2E] font-bold">100% PURE FORMULATION</span>
              </div>
            </div>

            {/* Paragraph / Supporting Text with Smooth Reveal */}
            <div className="hero-anim-desc w-full relative z-[2]">
              <p className="max-w-xl text-[14px] sm:text-base md:text-lg text-[#B8BCC4] font-normal leading-[1.55] sm:leading-relaxed mb-[28px] sm:mb-9 font-body">
                {subtext}
              </p>
            </div>

            {/* Buttons: Full width & 48px on mobile, auto width & side-by-side on desktop */}
            <div className="hero-anim-cta w-full sm:w-auto relative z-[2] mb-4 sm:mb-8">
              <div className="flex flex-col min-[360px]:flex-row items-stretch min-[360px]:items-center gap-[10px] sm:gap-4 w-full sm:w-auto">
                <Link
                  to={primaryCtaHref.startsWith('#') ? '/products' : primaryCtaHref}
                  className="btn-shimmer w-full min-[360px]:flex-1 sm:w-auto sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-9 h-[48px] sm:h-auto sm:py-3.5 bg-[#E11D2E] hover:bg-[#C81827] active:scale-[0.98] text-[#F2F2F2] font-heading text-[12px] sm:text-lg font-bold tracking-[1px] sm:tracking-widest uppercase transition-all duration-200 shadow-xl shadow-[#E11D2E]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2F2F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] group cursor-pointer text-center whitespace-nowrap"
                >
                  <span>{primaryCtaText}</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1.5 shrink-0" />
                </Link>

                <Link
                  to={secondaryCtaHref.startsWith('#') ? '/categories' : secondaryCtaHref}
                  className="w-full min-[360px]:flex-1 sm:w-auto sm:flex-none inline-flex items-center justify-center px-3 sm:px-9 h-[48px] sm:h-auto sm:py-3.5 bg-[#121212]/90 hover:bg-[#1A1A1A] active:scale-[0.98] text-[#F2F2F2] border border-[#282828] hover:border-[#E11D2E]/80 font-heading text-[12px] sm:text-lg font-bold tracking-[1px] sm:tracking-widest uppercase transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] cursor-pointer text-center whitespace-nowrap backdrop-blur-sm"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              </div>
            </div>

            {/* Desktop-Only "BUILT FOR YOUR ROUTINE." Footer Bar */}
            <div className="hero-anim-footer hidden sm:flex pt-6 border-t border-[#1F1F1F] w-full flex-row items-center justify-between gap-3 text-left relative z-[2]">
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
                <span className="text-[#E11D2E] font-bold">100% PURE FORMULATION</span>
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
