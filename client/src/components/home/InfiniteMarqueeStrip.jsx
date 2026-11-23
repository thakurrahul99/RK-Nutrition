export default function InfiniteMarqueeStrip() {
  const items = [
    "ZERO AMINO SPIKING",
    "LAB TESTED ATHLETIC GRADE",
    "100% LABEL TRANSPARENCY",
    "FREE NATIONWIDE SHIPPING OVER ₹999",
    "NO PROPRIETARY BLENDS",
    "MICRO-FILTERED PURITY",
    "CLINICALLY BACKED DOSAGES"
  ];

  return (
    <div 
      className="relative w-full bg-[#111111] border-y border-[#202020] py-3 overflow-hidden select-none group"
      aria-hidden="true"
    >
      {/* Subtle red edge vignettes */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#0B0B0B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#0B0B0B] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center gap-6 sm:gap-10 shrink-0 pr-6 sm:pr-10">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-6 sm:gap-10">
                <span className="font-heading font-bold text-xs sm:text-sm tracking-[0.2em] uppercase text-[#F5F4F2] whitespace-nowrap">
                  {item}
                </span>
                <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#E11D2E] shadow-sm shadow-[#E11D2E]/50" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
