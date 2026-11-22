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
      className="relative py-14 sm:py-32 bg-[#111111] border-b border-[#222222] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#C8202B]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Typography Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold">
              <span className="w-8 h-[2px] bg-[#C8202B]" />
              {intro.label}
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black leading-[0.98] tracking-tight">
              <span>{intro.headingLine1}</span>
              <br />
              <span className="text-[#C8202B]">{intro.headingLine2}</span>
            </h2>

            <div className="space-y-5 text-base sm:text-lg text-[#F5F4F2]/80 leading-relaxed font-body">
              <p>{intro.bodyP1}</p>
              <p>{intro.bodyP2}</p>
            </div>

            {/* Core Pillars Mini-Row */}
            <div className="pt-6 border-t border-[#242424] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#C8202B]">
                  <FlaskConical className="w-4 h-4" />
                  <span className="font-heading text-base uppercase text-[#F5F4F2] font-semibold tracking-wider">Pure Sourcing</span>
                </div>
                <p className="text-xs text-[#8C8C8C] leading-normal font-body">
                  Micro-filtered whey and pharmaceutical-grade micronized aminos.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#C8202B]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-heading text-base uppercase text-[#F5F4F2] font-semibold tracking-wider">Clean Digestion</span>
                </div>
                <p className="text-xs text-[#8C8C8C] leading-normal font-body">
                  Minimal lactose and instantized powders that dissolve effortlessly.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#C8202B]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-heading text-base uppercase text-[#F5F4F2] font-semibold tracking-wider">Proven Dosing</span>
                </div>
                <p className="text-xs text-[#8C8C8C] leading-normal font-body">
                  Active compounds calibrated to evidence-based nutritional standards.
                </p>
              </div>
            </div>

            {/* Navigation CTA to Dedicated About Page */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs font-mono tracking-widest text-[#5A5A5A] uppercase">
                {intro.taglineEmphasis}
              </span>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8202B] hover:text-[#F5F4F2] transition-colors font-bold"
              >
                <span>Read Full Brand & Formulation Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Supplement Graphic Composition Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="relative bg-[#161616] border border-[#2A2A2A] p-5 sm:p-10 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#C8202B]" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#C8202B]" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between border-b border-[#282828] pb-4">
                    <span className="font-mono text-xs text-[#C8202B] uppercase tracking-wider">
                      LABORATORY ARCHIVE • 01
                    </span>
                    <span className="font-mono text-xs text-[#8C8C8C]">
                      PURITY STANDARD
                    </span>
                  </div>

                  <div className="h-52 sm:h-72 bg-[#1A1A1A] border border-[#2E2E2E] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F5F4F2_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    {/* Nutritional Molecule Lattice SVG */}
                    <svg className="w-48 h-48 text-[#F5F4F2]/10" viewBox="0 0 200 200" fill="none">
                      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                      <circle cx="100" cy="100" r="40" stroke="#C8202B" strokeWidth="2" strokeOpacity="0.5" />
                      <circle cx="100" cy="100" r="12" fill="#C8202B" />
                      <circle cx="50" cy="65" r="8" fill="currentColor" />
                      <circle cx="150" cy="65" r="8" fill="currentColor" />
                      <circle cx="50" cy="135" r="8" fill="currentColor" />
                      <circle cx="150" cy="135" r="8" fill="currentColor" />
                      <line x1="50" y1="65" x2="100" y2="100" stroke="#C8202B" strokeWidth="1.5" strokeOpacity="0.4" />
                      <line x1="150" y1="65" x2="100" y2="100" stroke="#C8202B" strokeWidth="1.5" strokeOpacity="0.4" />
                      <line x1="50" y1="135" x2="100" y2="100" stroke="#C8202B" strokeWidth="1.5" strokeOpacity="0.4" />
                      <line x1="150" y1="135" x2="100" y2="100" stroke="#C8202B" strokeWidth="1.5" strokeOpacity="0.4" />
                    </svg>

                    <div className="relative text-center mt-2 z-10">
                      <span className="font-heading text-4xl sm:text-5xl font-black text-[#F5F4F2] tracking-wider block">
                        RK-NUTRITION
                      </span>
                      <span className="text-[11px] font-mono tracking-widest text-[#C8202B] uppercase font-bold mt-1 block">
                        FORMULATION INTEGRITY
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#8C8C8C]">
                    <span>PURITY OVER SHORTCUTS</span>
                    <span className="text-[#F5F4F2]">100% TRANSPARENT</span>
                  </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C8202B]/20 rounded-full blur-2xl group-hover:bg-[#C8202B]/30 transition-all duration-500" />
              </div>

              <div className="hidden sm:block absolute -inset-2 border border-[#242424] -z-10 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
