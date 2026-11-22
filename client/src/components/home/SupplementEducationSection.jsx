import { Link } from 'react-router-dom';
import { Dumbbell, Sparkles, Zap, Flame, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

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
  const containerRef = useScrollReveal();

  return (
    <section 
      id="supplement-education"
      ref={containerRef}
      aria-label="Supplement Education Teaser"
      className="py-16 sm:py-20 lg:py-24 bg-[#0D0D0D] border-t border-[#1A1A1A] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="reveal-init flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9CA3AF] font-bold">
                SUPPLEMENT SCIENCE
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-bold tracking-tight">
              UNDERSTAND YOUR <span className="text-[#E11D2E]">SUPPLEMENTS.</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#8C8C8C] font-body leading-relaxed">
              Targeted nutritional tools designed to complement your training—not replace real food.
            </p>
          </div>

          <Link
            to="/learn"
            className="group inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#F5F4F2] hover:text-[#E11D2E] transition-colors font-bold self-start md:self-end py-1"
          >
            <span>Learn More in Our Guide</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E11D2E] transition-transform duration-200 group-hover:translate-x-1.5" />
          </Link>
        </div>

        {/* 4 Compact Interactive Tiles with Staggered Scroll Reveal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {TEASER_TILES.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.title}
                to="/learn"
                className={`reveal-init stagger-${idx + 1} card-hover-lift group relative p-4 sm:p-5 bg-[#121212] border border-[#202020] hover:border-[#E11D2E]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 bg-[#1A1A1A] border border-[#262626] text-[#8C8C8C] group-hover:text-[#E11D2E] group-hover:border-[#E11D2E]/40 flex items-center justify-center transition-colors shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] bg-[#181818] px-2 py-0.5 border border-[#222222]">
                      {tile.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg uppercase font-bold text-[#F5F4F2] tracking-tight group-hover:text-white transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-xs text-[#8C8C8C] font-body mt-1.5 leading-relaxed line-clamp-2">
                    {tile.benefit}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#777777] group-hover:text-[#F5F4F2] transition-colors">
                  <span>Explore Science</span>
                  <span className="text-[#E11D2E] transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>

                {/* Bottom Hairline Red Accent */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-[#E11D2E] transition-all duration-300 pointer-events-none" />
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
