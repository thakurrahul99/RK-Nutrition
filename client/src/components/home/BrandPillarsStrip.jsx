import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function BrandPillarsStrip() {
  const containerRef = useScrollReveal();

  const pillars = [
    {
      number: "01",
      title: "100% PURE PROTEIN",
      subtitle: "MICRO-FILTERED SOURCING",
      description: "High biological value whey isolate and concentrate with verified amino profiles."
    },
    {
      number: "02",
      title: "UNCOMPROMISED PURITY",
      subtitle: "TRUE NITROGEN SOURCING",
      description: "Every gram comes strictly from whole dairy sources without non-protein nitrogen additives."
    },
    {
      number: "03",
      title: "FULL INGREDIENT DISCLOSURE",
      subtitle: "ZERO PROPRIETARY BLENDS",
      description: "Complete active compound and milligram disclosure calibrated to effective standards."
    }
  ];

  return (
    <section 
      ref={containerRef}
      aria-label="Supplement Quality Pillars"
      className="bg-[#0A0A0A] border-y border-[#1A1A1A] py-6 sm:py-8 md:py-10 relative z-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible divide-y-0 md:divide-y-0 md:divide-x divide-[#1E1E1E] gap-3 md:gap-0 scroll-smooth snap-x snap-mandatory horizontal-scroll-track pb-2 md:pb-0">
          {pillars.map((pillar, idx) => (
            <div 
              key={pillar.number}
              className={`reveal-init stagger-${idx + 1} shrink-0 md:shrink w-[270px] min-[360px]:w-[290px] sm:w-[330px] md:w-auto snap-start relative py-3 md:py-1 px-4 md:px-8 first:pl-4 md:first:pl-0 last:pr-4 md:last:pr-0 flex items-start gap-3 sm:gap-4 md:gap-5 group bg-[#111111] md:bg-transparent border border-[#202020] md:border-0 p-4 md:p-0 transition-all duration-300 hover:border-[#E11D2E]/40`}
            >
              <span 
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight shrink-0 text-[#E11D2E] transition-transform duration-300 group-hover:scale-105"
              >
                {pillar.number}
              </span>

              <div className="space-y-1.5">
                <h3 
                  className="font-heading text-base sm:text-lg md:text-xl font-bold tracking-wider uppercase text-[#F5F4F2] group-hover:text-white transition-colors"
                >
                  {pillar.title}
                </h3>

                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#9CA3AF] block font-semibold">
                  {pillar.subtitle}
                </span>

                <p className="text-xs text-[#8C8C8C] font-body leading-relaxed max-w-sm line-clamp-2 md:line-clamp-none">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
