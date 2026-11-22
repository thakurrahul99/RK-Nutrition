import { Link } from 'react-router-dom';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FlaskConical, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BrandIntroSection() {
  const { content } = useContent();
  const containerRef = useScrollReveal();
  const rawIntro = content?.intro || brandConfig.intro;
  const intro = {
    ...brandConfig.intro,
    ...rawIntro
  };

  return (
    <section 
      id="brand-intro-section" 
      ref={containerRef}
      aria-label="Brand Philosophy and Nutrition Science"
      className="relative py-16 sm:py-20 lg:py-24 bg-[#0B0B0B] border-t border-[#1A1A1A] overflow-hidden"
    >
      {/* Background Matrix & Subtle Gradient */}
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(225,29,46,0.10)_0%,transparent_70%)] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Typography Column (7 cols) */}
          <div className="reveal-init lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9CA3AF] font-bold">
                {intro.label || 'OUR PHILOSOPHY'}
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold leading-[1.02] tracking-tight">
              <span>{intro.headingLine1 || 'PURE SPORTS NUTRITION.'}</span>{' '}
              <span className="text-[#E11D2E]">{intro.headingLine2 || 'ZERO COMPROMISE.'}</span>
            </h2>

            <div className="space-y-3 text-sm sm:text-base text-[#9CA3AF] leading-relaxed font-body">
              <p>
                We believe dedicated athletes deserve honest formulations built with verified ingredients and full disclosure.
              </p>
              <p>
                Micro-filtered protein, active compounds calibrated to proven dosing, and zero deceptive filler blends.
              </p>
            </div>

            {/* Core Pillars Mini-Row */}
            <div className="pt-5 border-t border-[#1C1C1C] grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-[#121212] border border-[#1E1E1E] hover:border-[#E11D2E]/40 transition-colors space-y-1.5">
                <div className="flex items-center gap-2 text-[#E11D2E]">
                  <FlaskConical className="w-4 h-4" />
                  <span className="font-heading text-sm uppercase text-[#F5F4F2] font-bold tracking-wider">Pure Sourcing</span>
                </div>
                <p className="text-xs text-[#8C8C8C] leading-normal font-body">
                  Micro-filtered whey and micronized amino compounds.
                </p>
              </div>

              <div className="p-3.5 bg-[#121212] border border-[#1E1E1E] hover:border-[#E11D2E]/40 transition-colors space-y-1.5">
                <div className="flex items-center gap-2 text-[#E11D2E]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-heading text-sm uppercase text-[#F5F4F2] font-bold tracking-wider">Clean Digestion</span>
                </div>
                <p className="text-xs text-[#8C8C8C] leading-normal font-body">
                  Minimal lactose and instantized powders for bloat-free mixing.
                </p>
              </div>

              <div className="p-3.5 bg-[#121212] border border-[#1E1E1E] hover:border-[#E11D2E]/40 transition-colors space-y-1.5">
                <div className="flex items-center gap-2 text-[#E11D2E]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-heading text-sm uppercase text-[#F5F4F2] font-bold tracking-wider">Proven Dosing</span>
                </div>
                <p className="text-xs text-[#8C8C8C] leading-normal font-body">
                  Active compounds calibrated to evidence-based standards.
                </p>
              </div>
            </div>

            {/* Navigation CTA to Dedicated About Page */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#F5F4F2] hover:text-[#E11D2E] transition-colors font-bold py-1"
              >
                <span>Read Full Brand & Formulation Story</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E] transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>

          {/* Clean Graphic Composition Column (5 cols) */}
          <div className="reveal-init stagger-2 lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none bg-[#121212] border border-[#222222] hover:border-[#E11D2E]/40 p-6 sm:p-8 transition-all duration-300 shadow-2xl shadow-black/80">
              
              {/* Corner Accent Pips */}
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#E11D2E]" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-[#E11D2E]" />

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
                  <span className="font-mono text-[11px] text-[#E11D2E] uppercase tracking-wider font-bold">
                    PURITY STANDARD
                  </span>
                  <span className="font-mono text-[11px] text-[#8C8C8C]">
                    RK NUTRITION
                  </span>
                </div>

                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-[#F5F4F2] tracking-wider block">
                    RK-NUTRITION
                  </span>
                  <span className="text-[11px] font-mono tracking-widest text-[#E11D2E] uppercase font-bold mt-2 block">
                    FORMULATION INTEGRITY
                  </span>
                </div>

                <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-[#8C8C8C]">
                  <span>PURITY OVER SHORTCUTS</span>
                  <span className="text-[#F5F4F2] font-semibold">FULL DISCLOSURE</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
