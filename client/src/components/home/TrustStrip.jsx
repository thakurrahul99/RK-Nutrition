import { ShieldCheck, Award, FileText, Truck } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function TrustStrip() {
  const containerRef = useScrollReveal();

  const trustBadges = [
    {
      icon: Award,
      title: "FSSAI & GMP COMPLIANT",
      description: "Manufactured in accredited facilities following strict safety regulations."
    },
    {
      icon: ShieldCheck,
      title: "ZERO AMINO SPIKING",
      description: "100% true protein yield verified by nitrogen combustion assays."
    },
    {
      icon: FileText,
      title: "100% LABEL ACCURACY",
      description: "Full milligram transparency with zero hidden proprietary matrices."
    },
    {
      icon: Truck,
      title: "EXPRESS DISPATCH",
      description: "Orders dispatched within 24 hours with real-time end-to-end tracking."
    }
  ];

  return (
    <section 
      ref={containerRef}
      aria-label="Athletic Trust and Quality Certifications"
      className="bg-[#0D0D0D] border-b border-[#1C1C1C] py-8 sm:py-10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx}
                className={`reveal-init stagger-${idx + 1} flex items-start gap-3.5 p-4 bg-[#121212] border border-[#202020] hover:border-[#E11D2E]/40 transition-colors group`}
              >
                <div className="w-10 h-10 rounded-sm bg-[#181818] border border-[#282828] flex items-center justify-center shrink-0 group-hover:border-[#E11D2E]/60 transition-colors">
                  <Icon className="w-5 h-5 text-[#E11D2E]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-[#F5F4F2] group-hover:text-white transition-colors">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] font-body text-[#8C8C8C] leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
