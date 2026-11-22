import { brandConfig } from '../config/brandConfig';

export default function VisualFeatureSection() {
  const { visualFeature } = brandConfig;

  return (
    <section 
      aria-label="Brand Visual Feature"
      className="relative py-28 sm:py-36 bg-[#0E0E0E] border-b border-[#222222] overflow-hidden"
    >
      {/* Background Cinematic Texture & Vignette */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {/* Subtle radial red glow from center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(200,32,43,0.15),rgba(14,14,14,0))]" />
        
        {/* Molecular micro-grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5F4F2_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Red accent editorial diagonal bars */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-15"
          viewBox="0 0 1440 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="600" x2="600" y2="0" stroke="#E11D2E" strokeWidth="1.5" strokeDasharray="12 12" />
          <line x1="1440" y1="0" x2="840" y2="600" stroke="#E11D2E" strokeWidth="1.5" strokeDasharray="12 12" />
        </svg>

        {/* Horizontal Red Accent Lines */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E11D2E]/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E11D2E]/60 to-transparent" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#181818] border border-[#2A2A2A] text-xs font-heading uppercase tracking-[0.25em] text-[#E11D2E] font-bold mb-8">
          <span className="w-1.5 h-1.5 bg-[#E11D2E]" />
          {visualFeature.badge}
          <span className="w-1.5 h-1.5 bg-[#E11D2E]" />
        </div>

        {/* Large Editorial Headline */}
        <h2 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.9] mb-8">
          <span className="block drop-shadow-md">{visualFeature.line1}</span>
          <span className="block text-[#E11D2E] text-glow-red mt-2">{visualFeature.line2}</span>
        </h2>

        {/* Subtext */}
        <p className="max-w-xl mx-auto text-base sm:text-lg text-[#F5F4F2]/75 font-normal leading-relaxed">
          {visualFeature.subtext}
        </p>

        {/* Center Geometric Accent Bar */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="w-16 h-[2px] bg-[#E11D2E]" />
          <div className="w-3 h-3 rotate-45 border border-[#E11D2E] bg-[#111111]" />
          <div className="w-16 h-[2px] bg-[#E11D2E]" />
        </div>

      </div>
    </section>
  );
}
