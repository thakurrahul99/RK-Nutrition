import { Link } from 'react-router-dom';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { ArrowRight, CheckCircle2, ShieldCheck, Flame, Compass, HelpCircle, Mail } from 'lucide-react';

export default function AboutPage() {
  const { tagline } = brandConfig;
  const { content } = useContent();
  const about = content?.pages?.about || {};

  const heroHeadline = about.headline || 'PURE SPORTS NUTRITION. BACKED BY SCIENCE.';
  const heroSubheadline = about.subheadline || 'RK Nutrition was established to eliminate deceptive marketing, proprietary filler blends, and amino spiking from sports supplements.';
  const storyText = about.story || 'At RK Nutrition, we believe nutrition is the bedrock of athletic vitality. Whether you are aiming to hit daily protein macros, support post-training recovery, or optimize nutritional intake, you deserve supplements made with integrity.';
  const missionText = about.mission || 'We started with a straightforward realization: the sports nutrition industry is filled with exaggerated claims, proprietary filler blends, and superficial promises. We believe dedicated athletes deserve honest formulations built with verified ingredients and total label transparency.';
  const visionText = about.vision || `"${tagline}" — This is not merely a slogan; it is the non-negotiable standard applied to our formulations, our ingredient purity, and our commitment to every athlete who trusts RK Nutrition.`;

  const mindsetCards = [
    {
      number: '01',
      title: 'CONSISTENCY',
      description: 'Small steps repeated over time. Progress starts with showing up.',
      detail: 'The foundation of real physical adaptation is the work done when motivation fades. Day in, day out—honoring the daily schedule.'
    },
    {
      number: '02',
      title: 'COMMITMENT',
      description: 'Stay dedicated to the goals you set and the standards you choose to uphold.',
      detail: 'Rejecting shortcuts and quick fixes. Holding yourself accountable to uncompromising standards in training, nutrition, and recovery.'
    },
    {
      number: '03',
      title: 'PROGRESS',
      description: 'Focus on your own journey and keep moving forward at your own pace.',
      detail: 'Personal excellence measured against who you were yesterday. Comparison is distraction; deliberate progress is victory.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2] page-enter">
      
      {/* Section A — About Hero */}
      <section className="relative bg-[#141414] border-b border-[#222222] pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8202B]/12 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#F5F4F2_1px,transparent_1px),linear-gradient(to_bottom,#F5F4F2_1px,transparent_1px)] [background-size:48px_48px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#8C8C8C] mb-6 uppercase">
            <Link to="/" className="hover:text-[#F5F4F2] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-[#C8202B]">ABOUT</span>
          </nav>

          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-4">
            <span className="w-6 h-[2px] bg-[#C8202B]" />
            THE RK NUTRITION MINDSET
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95] mb-6">
            {heroHeadline}
          </h1>

          <p className="max-w-3xl text-base sm:text-lg text-[#8C8C8C] leading-relaxed font-body">
            {heroSubheadline}
          </p>
        </div>
      </section>

      {/* Section B — Philosophy & Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#222222]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-[#C8202B] font-semibold">
              <span className="w-1.5 h-1.5 bg-[#C8202B]" />
              PHILOSOPHY & MISSION
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl text-[#F5F4F2] uppercase font-black leading-tight">
              BUILT ON <span className="text-[#C8202B]">INTEGRITY.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#F5F4F2] leading-relaxed font-body font-medium">
              {storyText}
            </p>

            <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed font-body">
              {missionText}
            </p>

            <div className="p-6 bg-[#161616] border-l-2 border-[#C8202B] space-y-2 mt-6">
              <span className="font-heading text-lg text-[#F5F4F2] uppercase tracking-wide block">
                The RK Creed
              </span>
              <p className="text-xs sm:text-sm text-[#8C8C8C] leading-relaxed font-body">
                {visionText}
              </p>
            </div>
          </div>

          {/* Editorial Detail Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#161616] border border-[#282828] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#C8202B]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#C8202B]" />
              
              <div className="space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C8202B] block">
                  STANDARDS OF EXCELLENCE
                </span>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C8202B] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-heading text-lg text-[#F5F4F2] uppercase block">
                        Transparent Macro Profiles
                      </span>
                      <p className="text-xs text-[#8C8C8C] mt-0.5">
                        Clear, unadulterated nutritional breakdowns with zero deceptive amino spiking or hidden filler blends.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#C8202B] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-heading text-lg text-[#F5F4F2] uppercase block">
                        Functional Dosing
                      </span>
                      <p className="text-xs text-[#8C8C8C] mt-0.5">
                        Ingredients included in amounts that genuinely support athletic performance and recovery.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Flame className="w-5 h-5 text-[#C8202B] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-heading text-lg text-[#F5F4F2] uppercase block">
                        Athletic Integrity
                      </span>
                      <p className="text-xs text-[#8C8C8C] mt-0.5">
                        Built for those who put in the daily sweat. No gimmicks, no fake influencer hype.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#262626] text-center">
                  <span className="font-heading text-3xl font-black text-[#F5F4F2] tracking-wider block">
                    RK NUTRITION
                  </span>
                  <span className="text-[11px] font-mono tracking-widest text-[#C8202B] uppercase font-bold mt-0.5 block">
                    PURE NUTRITION • ZERO COMPROMISE
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section C — The RK Mindset (3 Interactive Cards) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#222222]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-[#C8202B] font-bold mb-3">
            <span className="w-6 h-[2px] bg-[#C8202B]" />
            THE CORE PILLARS
            <span className="w-6 h-[2px] bg-[#C8202B]" />
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#F5F4F2] uppercase font-black tracking-tight">
            THE RK STANDARD
          </h2>
          <p className="text-sm sm:text-base text-[#8C8C8C] mt-3 font-body">
            Three principles that govern how we formulate, test purity, and deliver sports nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mindsetCards.map((card) => (
            <div
              key={card.number}
              className="p-8 bg-[#161616] border border-[#262626] hover:border-[#C8202B] transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-[#333333] group-hover:text-[#C8202B] transition-colors">
                    {card.number}
                  </span>
                  <div className="w-2 h-2 bg-[#2E2E2E] group-hover:bg-[#C8202B] transition-colors" />
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl text-[#F5F4F2] uppercase font-bold tracking-tight mb-3">
                  {card.title}
                </h3>

                <p className="text-base text-[#F5F4F2] font-semibold leading-snug mb-3 font-body">
                  "{card.description}"
                </p>

                <p className="text-xs sm:text-sm text-[#8C8C8C] leading-relaxed font-body">
                  {card.detail}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#242424] flex items-center justify-between text-xs font-mono text-[#555555] uppercase">
                <span>Pillar Standard</span>
                <span className="text-[#C8202B] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section D — Visual Storytelling (Nutrition Science & Integrity) */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-b border-[#222222] overflow-hidden bg-black">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
          <div className="absolute inset-0 [background:radial-gradient(circle_at_center,_#C8202B_0%,_transparent_70%)] opacity-30" />
          <div className="absolute inset-0 [background-image:linear-gradient(45deg,#111111_25%,transparent_25%),linear-gradient(-45deg,#111111_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#111111_75%),linear-gradient(-45deg,transparent_75%,#111111_75%)] [background-size:20px_20px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Frame 1: High-Contrast Monochromatic Editorial */}
            <div className="lg:col-span-7 bg-[#141414] border border-[#2B2B2B] p-8 sm:p-12 relative overflow-hidden">
              <div className="text-xs font-mono text-[#C8202B] uppercase tracking-widest mb-3">
                EVIDENCE & INTEGRITY • NO SHORTCUTS
              </div>
              <h3 className="font-heading text-3xl sm:text-5xl text-[#F5F4F2] uppercase font-black leading-tight tracking-tight mb-6">
                WHERE SCIENCE MEETS PERFORMANCE.
              </h3>
              <p className="text-sm sm:text-base text-[#9A9A9A] leading-relaxed font-body max-w-xl mb-6">
                True athletic vitality is built on foundational dietary discipline. Supplements are not shortcuts or magic formulas—they are targeted nutritional tools designed to support your daily protein requirements, muscular recovery, and cellular hydration.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#242424] text-xs font-mono">
                <div>
                  <span className="text-[#C8202B] block font-bold text-lg font-heading">01</span>
                  <span className="text-[#8C8C8C] uppercase">Zero Amino Spiking</span>
                </div>
                <div>
                  <span className="text-[#C8202B] block font-bold text-lg font-heading">02</span>
                  <span className="text-[#8C8C8C] uppercase">Pure Micro-Filtration</span>
                </div>
                <div>
                  <span className="text-[#C8202B] block font-bold text-lg font-heading">03</span>
                  <span className="text-[#8C8C8C] uppercase">100% Label Disclosure</span>
                </div>
              </div>
            </div>

            {/* Visual Frame 2: Editorial Quote Block */}
            <div className="lg:col-span-5 bg-[#171717] border border-[#2E2E2E] p-8 sm:p-10 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C]">
                  NUTRITIONAL CODE OF INTEGRITY
                </span>
                <blockquote className="font-heading text-2xl sm:text-3xl text-[#F5F4F2] uppercase font-bold tracking-wide leading-snug">
                  "WE DO NOT PROMISE UNREALISTIC SHORTCUTS. WE PROVIDE PURE, SCIENCE-INFORMED NUTRITION TO SUPPORT YOUR DEDICATED ATHLETIC JOURNEY."
                </blockquote>
              </div>

              <div className="pt-8 mt-8 border-t border-[#282828] flex items-center justify-between">
                <div>
                  <span className="font-heading text-base text-[#F5F4F2] uppercase block font-bold">
                    RK NUTRITION
                  </span>
                  <span className="text-xs text-[#8C8C8C] font-mono">
                    Performance Nutrition
                  </span>
                </div>
                <div className="w-10 h-10 bg-[#C8202B]/10 border border-[#C8202B]/40 flex items-center justify-center">
                  <span className="font-heading font-black text-[#C8202B]">RK</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section E — Return Navigation (No Dead Ends, No Misleading Buy Now) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-2xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-[#C8202B] font-bold">
            <Compass className="w-4 h-4" />
            <span>CONTINUE EXPLORING</span>
          </div>
          <h3 className="font-heading text-3xl sm:text-4xl text-[#F5F4F2] uppercase font-bold tracking-tight">
            DISCOVER THE RK NUTRITION ECOSYSTEM
          </h3>
          <p className="text-sm sm:text-base text-[#8C8C8C] font-body">
            Explore our foundational formulations, browse targeted training categories, or reach out to our team.
          </p>
        </div>

        {/* Informational Navigation Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Link
            to="/products"
            className="p-5 bg-[#161616] border border-[#282828] hover:border-[#C8202B] text-left transition-colors group flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase text-[#C8202B] block mb-1">01 • CATALOGUE</span>
              <span className="font-heading text-xl text-[#F5F4F2] uppercase font-bold block group-hover:text-[#C8202B] transition-colors">
                All Products
              </span>
              <p className="text-xs text-[#8C8C8C] mt-2 font-body">
                View our complete foundational product lineup.
              </p>
            </div>
            <div className="pt-4 mt-2 flex items-center justify-between text-xs font-mono text-[#555555]">
              <span>Explore</span>
              <ArrowRight className="w-4 h-4 text-[#C8202B] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/categories"
            className="p-5 bg-[#161616] border border-[#282828] hover:border-[#C8202B] text-left transition-colors group flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase text-[#C8202B] block mb-1">02 • CATEGORIES</span>
              <span className="font-heading text-xl text-[#F5F4F2] uppercase font-bold block group-hover:text-[#C8202B] transition-colors">
                Browse Categories
              </span>
              <p className="text-xs text-[#8C8C8C] mt-2 font-body">
                Protein, Mass Gainer, and Pre-Workout ranges.
              </p>
            </div>
            <div className="pt-4 mt-2 flex items-center justify-between text-xs font-mono text-[#555555]">
              <span>Browse</span>
              <ArrowRight className="w-4 h-4 text-[#C8202B] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/faq"
            className="p-5 bg-[#161616] border border-[#282828] hover:border-[#C8202B] text-left transition-colors group flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase text-[#C8202B] block mb-1">03 • KNOWLEDGE</span>
              <span className="font-heading text-xl text-[#F5F4F2] uppercase font-bold block group-hover:text-[#C8202B] transition-colors">
                FAQ & Answers
              </span>
              <p className="text-xs text-[#8C8C8C] mt-2 font-body">
                Formulation standards and common questions.
              </p>
            </div>
            <div className="pt-4 mt-2 flex items-center justify-between text-xs font-mono text-[#555555]">
              <span>Learn</span>
              <HelpCircle className="w-4 h-4 text-[#C8202B] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/contact"
            className="p-5 bg-[#161616] border border-[#282828] hover:border-[#C8202B] text-left transition-colors group flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase text-[#C8202B] block mb-1">04 • CONNECT</span>
              <span className="font-heading text-xl text-[#F5F4F2] uppercase font-bold block group-hover:text-[#C8202B] transition-colors">
                Contact Us
              </span>
              <p className="text-xs text-[#8C8C8C] mt-2 font-body">
                Official inquiries and brand communication.
              </p>
            </div>
            <div className="pt-4 mt-2 flex items-center justify-between text-xs font-mono text-[#555555]">
              <span>Connect</span>
              <Mail className="w-4 h-4 text-[#C8202B] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
          >
            ← Return to Home Page
          </Link>
        </div>
      </section>

    </div>
  );
}
