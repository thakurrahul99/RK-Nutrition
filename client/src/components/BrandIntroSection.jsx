import { Link } from 'react-router-dom';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { FlaskConical, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BrandIntroSection() {
  const { content } = useContent();
  const rawIntro = content?.intro || brandConfig.intro;
  const intro = {
    ...brandConfig.intro,
    ...rawIntro
  };

  return (
    <section 
      id="brand-intro-section" 
      aria-label="Brand Philosophy and Nutrition Science"
      className="relative py-14 sm:py-20 lg:py-24 bg-[#0B0B0B] border-t border-[#1F1F1F] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Typography Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-heading uppercase tracking-[0.16em] text-[#8C8C8C] block">
              {intro.label || 'OUR PHILOSOPHY'}
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold leading-[1.02] tracking-tight">
              <span>{intro.headingLine1 || 'PURE SPORTS NUTRITION.'}</span>{' '}
              <span className="text-[#E11D2E]">{intro.headingLine2 || 'ZERO COMPROMISE.'}</span>
            </h2>

            <div className="space-y-3 text-sm sm:text-base text-[#8C8C8C] leading-relaxed font-body">
              <p>
                We believe dedicated athletes deserve honest formulations built with verified ingredients and full disclosure.
              </p>
              <p>
                Micro-filtered protein, active compounds calibrated to proven dosing, and zero deceptive filler blends.
              </p>
            </div>

            {/* Core Pillars Mini-Row */}
            <div className="pt-4 border-t border-[#1F1F1F] grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#E11D2E]">
                  <FlaskConical className="w-4 h-4" />
                  <span className="font-heading text-sm uppercase text-[#F5F4F2] font-semibold tracking-wider">Pure Sourcing</span>
                </div>
                <p className="text-xs text-[#8C8C8C] leading-normal font-body">
                  Micro-filtered whey and micronized amino compounds.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#E11D2E]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-heading text-sm uppercase text-[#F5F4F2] font-semibold tracking-wider">Clean Digestion</span>
                </div>
                <p className="text-xs text-[#8C8C8C] leading-normal font-body">
                  Minimal lactose and instantized powders for bloat-free mixing.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#E11D2E]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-heading text-sm uppercase text-[#F5F4F2] font-semibold tracking-wider">Proven Dosing</span>
                </div>
                <p className="text-xs text-[#8C8C8C] leading-normal font-body">
                  Active compounds calibrated to evidence-based nutritional standards.
                </p>
              </div>
            </div>

            {/* Navigation CTA to Dedicated About Page */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#F5F4F2] hover:text-[#E11D2E] transition-colors font-bold"
              >
                <span>Read Full Brand & Formulation Story</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E]" />
              </Link>
            </div>
          </div>

          {/* Clean Graphic Composition Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none bg-[#121212] border border-[#1F1F1F] p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
                  <span className="font-mono text-[11px] text-[#E11D2E] uppercase tracking-wider">
                    PURITY STANDARD
                  </span>
                  <span className="font-mono text-[11px] text-[#8C8C8C]">
                    RK NUTRITION
                  </span>
                </div>

                <div className="py-6 flex flex-col items-center justify-center text-center">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-[#F5F4F2] tracking-wider block">
                    RK-NUTRITION
                  </span>
                  <span className="text-[11px] font-mono tracking-widest text-[#E11D2E] uppercase font-bold mt-1 block">
                    FORMULATION INTEGRITY
                  </span>
                </div>

                <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-[#8C8C8C]">
                  <span>PURITY OVER SHORTCUTS</span>
                  <span className="text-[#F5F4F2]">FULL DISCLOSURE</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
