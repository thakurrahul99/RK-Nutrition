import { Link } from 'react-router-dom';
import { Dumbbell, Sparkles, Zap, Flame, ArrowRight } from 'lucide-react';

const TEASER_TILES = [
  {
    title: 'Whey Isolate',
    benefit: 'Rapidly absorbed, micro-filtered protein for lean recovery.',
    icon: Dumbbell,
    badge: 'Recovery'
  },
  {
    title: 'Mass Gainer',
    benefit: 'Clean complex carbs and multi-stage proteins for caloric surplus.',
    icon: Sparkles,
    badge: 'Hypertrophy'
  },
  {
    title: 'Creatine',
    benefit: 'Ultra-fine 200-mesh micronized powder for explosive power output.',
    icon: Zap,
    badge: 'Strength'
  },
  {
    title: 'Pre-Workout',
    benefit: 'Transparent amino dosing for clean focus, blood flow, and stamina.',
    icon: Flame,
    badge: 'Energy'
  }
];

export default function SupplementEducationSection() {
  return (
    <section 
      id="supplement-education"
      aria-label="Supplement Education Teaser"
      className="py-14 sm:py-20 lg:py-24 bg-[#0F0F0F] border-t border-[#1F1F1F] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="text-[11px] font-heading uppercase tracking-[0.16em] text-[#8C8C8C] block mb-2">
              SUPPLEMENT SCIENCE
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold tracking-tight">
              UNDERSTAND YOUR <span className="text-[#E11D2E]">SUPPLEMENTS.</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#8C8C8C] font-body leading-relaxed">
              Targeted nutritional tools designed to complement your training—not replace real food.
            </p>
          </div>

          <Link
            to="/learn"
            className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#F5F4F2] hover:text-[#E11D2E] transition-colors font-bold self-start md:self-end pt-1"
          >
            <span>Learn More in Our Guide</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E]" />
          </Link>
        </div>

        {/* 4 Compact Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {TEASER_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.title}
                to="/learn"
                className="p-4 sm:p-5 bg-[#141414] border border-[#1F1F1F] hover:border-[#2E2E2E] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-sm bg-[#1A1A1A] text-[#8C8C8C] group-hover:text-[#E11D2E] flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#666666]">
                      {tile.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg uppercase font-bold text-[#F5F4F2] tracking-tight group-hover:text-[#E11D2E] transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-xs text-[#8C8C8C] font-body mt-1.5 leading-relaxed line-clamp-2">
                    {tile.benefit}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#666666] group-hover:text-[#F5F4F2] transition-colors">
                  <span>Explore Science</span>
                  <span className="text-[#E11D2E]">→</span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
