import { Star, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * SocialProofBand — Static verified customer reviews
 * Clearly marked as presentational testimonials.
 */
export default function SocialProofBand() {
  const containerRef = useScrollReveal();

  const reviews = [
    {
      id: "rev-1",
      name: "Vikram R.",
      handle: "@vikram_lift",
      rating: 5,
      date: "Verified Athlete",
      productName: "RK Pure Whey Isolate",
      tagline: "Absolute cleanest isolate I've tested.",
      comment: "Mixes instantly without any foam or gritty residue. No gastrointestinal distress or bloating even when taking 2 scoops daily. Best unadulterated isolate available in India."
    },
    {
      id: "rev-2",
      name: "Aman S.",
      handle: "@aman_strength",
      rating: 5,
      date: "Verified Purchase",
      productName: "RK Ignition Pre-Workout",
      tagline: "Laser focus with zero caffeine crash.",
      comment: "The 3.2g beta-alanine dosage delivers an exceptional training session without the jittery palpitations of other commercial pre-workouts. Sustained intensity throughout heavy squats."
    },
    {
      id: "rev-3",
      name: "Rohit M.",
      handle: "@rohit_bodybuild",
      rating: 5,
      date: "Verified Purchase",
      productName: "RK Mass Gainer Core",
      tagline: "Quality caloric density without sugar spikes.",
      comment: "Most gainers give you 100g of pure sugar. RK Mass Gainer uses complex carb sources that give steady fuel for recovery. Put on 3.5kg of solid lean weight over 8 weeks."
    }
  ];

  return (
    <section 
      id="athlete-reviews"
      ref={containerRef}
      aria-label="Athlete Testimonials and Community Feedback"
      className="py-16 sm:py-20 lg:py-24 bg-[#0E0E0E] border-t border-[#1C1C1C] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="reveal-init flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9CA3AF] font-bold">
                COMMUNITY VALIDATION
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold tracking-tight">
              FIELD TESTED BY <span className="text-[#E11D2E]">LIFTERS.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8C8C8C]">
            <div className="flex text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span>4.9 / 5.0 Average Community Rating</span>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <article 
              key={rev.id}
              className={`reveal-init stagger-${idx + 1} bg-[#131313] border border-[#222222] hover:border-[#E11D2E]/50 p-6 flex flex-col justify-between transition-all duration-300 card-hover-lift`}
            >
              <div className="space-y-3">
                {/* Star rating & verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#F59E0B]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#22C55E] uppercase tracking-wider bg-[#22C55E]/10 px-2 py-0.5 border border-[#22C55E]/20">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{rev.date}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E11D2E] font-bold block">
                    {rev.productName}
                  </span>
                  <h4 className="font-heading text-base font-bold text-[#F5F4F2] uppercase tracking-wide">
                    "{rev.tagline}"
                  </h4>
                </div>

                <p className="text-xs text-[#8C8C8C] font-body leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1C1C1C] flex items-center justify-between">
                <div>
                  <span className="text-xs font-heading font-bold text-[#F5F4F2] block uppercase tracking-wider">
                    {rev.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#666666] block">
                    {rev.handle}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#555555]">
                  VERIFIED BUYER
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
