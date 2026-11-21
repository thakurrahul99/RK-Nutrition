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
      title: "ZERO AMINO SPIKING",
      subtitle: "TRUE NITROGEN TESTING",
      description: "Every gram of protein comes strictly from whole dairy sources, never cheap free glycine or taurine."
    },
    {
      number: "03",
      title: "LABEL TRANSPARENCY",
      subtitle: "ZERO PROPRIETARY BLENDS",
      description: "Full active ingredient and milligram disclosure. Effective nutritional doses you can trust."
    }
  ];

  return (
    <section 
      aria-label="Supplement Quality Pillars"
      className="bg-[#0C0C0C] border-y border-[#222222] py-8 sm:py-10 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#222222]">
          {pillars.map((pillar) => (
            <div 
              key={pillar.number}
              className="relative py-4 md:py-0 px-2 md:px-8 first:pl-0 last:pr-0 flex items-start gap-4 sm:gap-5 group"
            >
              {/* Pillar Index Number in Brand Red */}
              <span 
                className="font-heading text-3xl sm:text-4xl font-black tracking-tight shrink-0 text-[#D51F32]"
              >
                {pillar.number}
              </span>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {/* Pillar Title in Pure Warm White */}
                  <h3 
                    className="font-heading text-lg sm:text-xl font-bold tracking-wider uppercase text-[#F5F4F2]"
                  >
                    {pillar.title}
                  </h3>
                </div>

                <span className="text-[10px] font-mono tracking-widest uppercase text-[#8C8C8C] block">
                  {pillar.subtitle}
                </span>

                <p className="text-xs text-[#8C8C8C] font-body leading-relaxed max-w-sm">
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
