import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { FileText, ShieldCheck, Scale } from 'lucide-react';

export default function BrandValuesSection() {
  const { content } = useContent();
  const values = content?.values || brandConfig.values;

  const getValueIcon = (index) => {
    switch (index) {
      case 0:
        return <FileText className="w-6 h-6 text-[#C8202B]" />;
      case 1:
        return <ShieldCheck className="w-6 h-6 text-[#C8202B]" />;
      case 2:
        return <Scale className="w-6 h-6 text-[#C8202B]" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-[#C8202B]" />;
    }
  };

  return (
    <section 
      aria-label="Supplement Quality Values"
      className="py-24 sm:py-32 bg-[#111111] border-b border-[#222222] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-3">
            <span className="w-6 h-[2px] bg-[#C8202B]" />
            FORMULATION STANDARDS
            <span className="w-6 h-[2px] bg-[#C8202B]" />
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.98]">
            OUR QUALITY <span className="text-[#C8202B]">PILLARS.</span>
          </h2>
          <p className="mt-4 text-base text-[#8C8C8C] leading-relaxed">
            The non-negotiable principles that dictate how we source raw materials, test purity, and formulate every container.
          </p>
        </div>

        {/* 3-Column Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
            <div 
              key={val.title}
              className="relative bg-[#161616] border border-[#262626] hover:border-[#C8202B] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 group shadow-lg overflow-hidden"
            >
              {/* Signature RK red corner block accent */}
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#C8202B] z-10" />

              {/* Subtle background RK watermark */}
              <span 
                className="absolute -bottom-6 -right-3 font-heading font-black text-8xl text-white/[0.02] select-none pointer-events-none tracking-tighter"
                aria-hidden="true"
              >
                RK
              </span>

              {/* Header with Number and Icon */}
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#242424]">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-[#3A3A3A] group-hover:text-[#C8202B] transition-colors">
                    {val.number}
                  </span>
                  <div className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#C8202B] transition-colors">
                    {getValueIcon(idx)}
                  </div>
                </div>

                <span className="text-xs font-mono uppercase tracking-widest text-[#C8202B] block mb-1">
                  {val.subheading}
                </span>

                <h3 className="font-heading text-3xl sm:text-4xl text-[#F5F4F2] uppercase font-bold tracking-tight mb-4">
                  {val.title}
                </h3>

                <p className="text-sm sm:text-base text-[#F5F4F2]/75 leading-relaxed font-body">
                  {val.description}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-8 pt-4 border-t border-[#242424] flex items-center justify-between text-[11px] font-mono text-[#5A5A5A] uppercase">
                <span>RK STANDARD</span>
                <span className="group-hover:text-[#C8202B] transition-colors">STANDARD #{val.number}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
