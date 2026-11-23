import { Check, X } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function WhyRKComparisonSection() {
  const containerRef = useScrollReveal();

  const comparisonRows = [
    {
      metric: "Protein Sourcing",
      rk: "100% Micro-filtered pure whey isolate from certified grass-fed dairy.",
      industry: "Low-cost whey concentrate blended with dairy solids and maltodextrin."
    },
    {
      metric: "Nitrogen / Amino Integrity",
      rk: "Guaranteed zero amino spiking. Every gram comes strictly from whole intact protein.",
      industry: "Spiked with inexpensive free-form glycine or taurine to artificially inflate test scores."
    },
    {
      metric: "Label Transparency",
      rk: "100% full disclosure. Every active ingredient and exact milligram dosage is printed on the tub.",
      industry: "Concealed behind vague 'proprietary blends' and undisclosed micro-doses."
    },
    {
      metric: "Fillers & Thickeners",
      rk: "Zero maltodextrin, zero artificial gums, and zero useless bulking agents.",
      industry: "Packed with thickeners, cellulose gums, and sugar alcohols to mimic richness."
    },
    {
      metric: "Digestibility & Bloat",
      rk: "Ultra-low lactose with instant micro-dispersion for zero digestive distress.",
      industry: "Heavy lactose content and poor solubility frequently causing severe bloating."
    }
  ];

  return (
    <section 
      id="why-rk"
      ref={containerRef}
      aria-label="RK Nutrition Formulation Standards Comparison"
      className="py-16 sm:py-20 lg:py-24 bg-[#0B0B0B] border-t border-[#1C1C1C] relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle,rgba(225,29,46,0.08)_0%,transparent_70%)] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="reveal-init text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9CA3AF] font-bold">
              THE HONEST DIFFERENCE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E]" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold tracking-tight">
            WHY DEDICATED ATHLETES <span className="text-[#E11D2E]">CHOOSE RK.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#8C8C8C] font-body leading-relaxed max-w-2xl mx-auto">
            The sports supplement industry is saturated with deceptive labeling and filler blends. Here is how RK Nutrition engineering contrasts against standard retail formulations.
          </p>
        </div>

        {/* 2-Column Comparison Layout */}
        <div className="reveal-init grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* RK Nutrition Column (Highlighted) */}
          <div className="bg-[#131313] border-2 border-[#E11D2E]/60 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Ambient Highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E11D2E]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#242424] mb-6">
                <div>
                  <span className="text-[10px] font-mono text-[#E11D2E] uppercase tracking-widest font-bold block">
                    THE GOLD ATHLETIC BENCHMARK
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#F5F4F2] uppercase tracking-tight mt-1">
                    RK NUTRITION FORMULATIONS
                  </h3>
                </div>
                <span className="w-8 h-8 rounded-full bg-[#E11D2E]/20 border border-[#E11D2E] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#E11D2E]" />
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-5">
                {comparisonRows.map((row, idx) => (
                  <div key={idx} className="space-y-1 pb-4 border-b border-[#1E1E1E] last:border-0 last:pb-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF] font-bold block">
                      {row.metric}
                    </span>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-[#F5F4F2] font-body leading-relaxed font-medium">
                        {row.rk}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#222222] text-center">
              <span className="text-[11px] font-mono text-[#22C55E] uppercase tracking-wider font-bold">
                ✓ 100% Verified Batch Lab Reports Available
              </span>
            </div>
          </div>

          {/* Industry Standard Column (Muted) */}
          <div className="bg-[#101010] border border-[#222222] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Column Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#202020] mb-6">
                <div>
                  <span className="text-[10px] font-mono text-[#777777] uppercase tracking-widest font-bold block">
                    COMMON RETAIL PRACTICES
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#8C8C8C] uppercase tracking-tight mt-1">
                    GENERIC INDUSTRY STANDARD
                  </h3>
                </div>
                <span className="w-8 h-8 rounded-full bg-[#202020] border border-[#333333] flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 text-[#777777]" />
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-5">
                {comparisonRows.map((row, idx) => (
                  <div key={idx} className="space-y-1 pb-4 border-b border-[#1A1A1A] last:border-0 last:pb-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#666666] font-semibold block">
                      {row.metric}
                    </span>
                    <div className="flex items-start gap-2.5">
                      <X className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-[#777777] font-body leading-relaxed">
                        {row.industry}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1C1C1C] text-center">
              <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider">
                ✕ Hidden dosages & unverified claims
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
