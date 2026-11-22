export default function BrandPillarsStrip() {
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
      aria-label="Supplement Quality Pillars"
      className="bg-[#0C0C0C] border-y border-[#1F1F1F] py-5 sm:py-7 md:py-8 relative z-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible divide-y-0 md:divide-y-0 md:divide-x divide-[#1F1F1F] gap-3 md:gap-0 scroll-smooth snap-x snap-mandatory horizontal-scroll-track pb-2 md:pb-0">
          {pillars.map((pillar) => (
            <div 
              key={pillar.number}
              className="shrink-0 md:shrink w-[260px] min-[360px]:w-[280px] sm:w-[320px] md:w-auto snap-start relative py-2 md:py-0 px-3 md:px-8 first:pl-3 md:first:pl-0 last:pr-3 md:last:pr-0 flex items-start gap-3 sm:gap-4 md:gap-5 group bg-[#121212] md:bg-transparent border border-[#1F1F1F] md:border-0 p-3.5 md:p-0"
            >
              <span 
                className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight shrink-0 text-[#E11D2E]"
              >
                {pillar.number}
              </span>

              <div className="space-y-1">
                <h3 
                  className="font-heading text-base sm:text-lg md:text-xl font-bold tracking-wider uppercase text-[#F5F4F2]"
                >
                  {pillar.title}
                </h3>

                <span className="text-[11px] font-mono tracking-widest uppercase text-[#8C8C8C] block">
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
