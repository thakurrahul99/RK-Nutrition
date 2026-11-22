import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Flame, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';

const SUPPLEMENT_TOPICS = [
  {
    id: 'protein',
    title: 'Whey Protein Isolate',
    category: 'Muscle Recovery & Repair',
    badge: 'FOUNDATIONAL MACRO',
    icon: Dumbbell,
    tagline: 'Rapidly absorbed, micro-filtered protein for lean muscle repair and daily protein targets.',
    whatItIs: 'Whey protein isolate is created through cross-flow micro-filtration that removes nearly all fats, carbohydrates, and lactose, yielding a pure 90%+ protein concentration.',
    howItWorks: 'Supplies high concentrations of Essential Amino Acids (EAAs), particularly Leucine, which activates the mTOR pathway to initiate Muscle Protein Synthesis (MPS) post-exercise.',
    keyBenefits: [
      'Accelerates muscular tissue repair after intense physical exertion',
      'Convenient, lean way to hit recommended daily protein intake (1.6g–2.2g per kg body weight)',
      'Ultra-low lactose profile for easy, bloat-free gastric digestion',
      'Preserves lean muscle mass during caloric deficits or weight management phases'
    ],
    timing: 'Consume within 30–60 minutes post-training or between meals to maintain steady amino acid availability.',
    metrics: [
      { label: 'PROTEIN YIELD', value: '27g / Scoop' },
      { label: 'ADDED SUGAR', value: '0g' },
      { label: 'NATURAL BCAAs', value: '6.2g' },
      { label: 'AMINO SPIKING', value: '0%' }
    ],
    ctaText: 'Explore Whey Protein',
    ctaLink: '/categories/protein'
  },
  {
    id: 'mass-gainer',
    title: 'Advanced Mass Fuel',
    category: 'Caloric & Nutrient Support',
    badge: 'HYPERTROPHY FUEL',
    icon: Sparkles,
    tagline: 'High-density complex carbohydrates and multi-stage proteins for elevated caloric needs.',
    whatItIs: 'A nutritionally balanced formula combining slow and fast-digesting carbohydrates (milled oats, sweet potato) with multi-phase proteins (whey isolate, concentrate, casein).',
    howItWorks: 'Creates a sustained positive energy and nitrogen balance for athletes with high metabolic burn who cannot feasibly consume sufficient calories through solid food alone.',
    keyBenefits: [
      'Provides 380+ clean calories per serving without relying on cheap dextrose or sugar',
      'Supports muscle glycogen repletion and prevents catabolic breakdown after grueling sessions',
      'Multi-stage protein ensures immediate and prolonged amino acid release over 4–6 hours',
      'Ideal for hardgainers and high-volume athletes needing convenient caloric surplus'
    ],
    timing: 'Consume as a post-training shake or as a nutrient-dense nutritional bridge between main meals.',
    metrics: [
      { label: 'ENERGY DENSITY', value: '380 kcal' },
      { label: 'COMPLEX CARBS', value: '56g' },
      { label: 'STAGE PROTEIN', value: '32g' },
      { label: 'CHEAP SUGARS', value: '0g Added' }
    ],
    ctaText: 'Explore Mass Gainers',
    ctaLink: '/categories/mass-gainer'
  },
  {
    id: 'creatine',
    title: 'Micronized Creatine',
    category: 'Strength & Cellular ATP',
    badge: 'GOLD-STANDARD COMPOUND',
    icon: Zap,
    tagline: 'The most scientifically validated sports supplement for explosive power and strength.',
    whatItIs: 'A naturally occurring organic compound synthesized in the body and stored in skeletal muscle as phosphocreatine.',
    howItWorks: 'Donates a phosphate molecule to rapidly regenerate Adenosine Diphosphate (ADP) into Adenosine Triphosphate (ATP), the primary energy currency for explosive muscular contractions.',
    keyBenefits: [
      'Proven to increase peak strength and explosive power output during heavy lifting',
      'Promotes intracellular water retention (cell volumization), signaling an anabolic state',
      'Enhances muscular endurance across repeated high-intensity sprint or resistance sets',
      'Supports cognitive alertness and mental stamina under physical fatigue'
    ],
    timing: 'Take 3g–5g daily, consistently, at any time of day with water, juice, or your post-workout protein shake.',
    metrics: [
      { label: 'PURITY LEVEL', value: '100% Micronized' },
      { label: 'DAILY DOSE', value: '3g–5g' },
      { label: 'CELL HYDRATION', value: 'Intracellular' },
      { label: 'SOLUBILITY', value: 'Ultra-Fine 200 Mesh' }
    ],
    ctaText: 'Shop All Products',
    ctaLink: '/products'
  },
  {
    id: 'pre-workout',
    title: 'Ignition Pre-Workout',
    category: 'Focus, Blood Flow & Stamina',
    badge: 'READINESS CATALYST',
    icon: Flame,
    tagline: 'Clinically calibrated active ingredients to optimize mental alertness and muscular stamina.',
    whatItIs: 'A transparent synergy of vasodilators, intracellular buffers, and central nervous system stimulants with 100% disclosed milligram dosages.',
    howItWorks: 'L-Citrulline Malate boosts nitric oxide for cellular blood flow; Beta-Alanine buffers muscle acidity (carnosine synthesis); Natural Caffeine sharpens alertness.',
    keyBenefits: [
      'Promotes muscle fullness and efficient nutrient delivery through nitric oxide elevation',
      'Delays muscular fatigue by buffering hydrogen ion accumulation during high-rep sets',
      'Sharpens mental focus and reaction time without proprietary stimulant jitters or crash',
      'Zero added sugars, artificial dyes, or hidden proprietary blends'
    ],
    timing: 'Mix 1 scoop in 200–250ml cold water and consume 20–30 minutes before your physical activity. Assess tolerance first.',
    metrics: [
      { label: 'L-CITRULLINE', value: '6,000mg' },
      { label: 'BETA-ALANINE', value: '3,200mg' },
      { label: 'CAFFEINE', value: '250mg Natural' },
      { label: 'SECRET BLENDS', value: '0mg' }
    ],
    ctaText: 'Explore Pre-Workout',
    ctaLink: '/categories/pre-workout'
  }
];

export default function SupplementEducationSection() {
  const [activeTab, setActiveTab] = useState('protein');
  const currentTopic = SUPPLEMENT_TOPICS.find((t) => t.id === activeTab) || SUPPLEMENT_TOPICS[0];

  return (
    <section 
      id="supplement-education"
      aria-label="Supplement Science & Product Education"
      className="py-14 sm:py-32 bg-[#121212] border-b border-[#222222] relative overflow-hidden"
    >
      {/* Background Lighting & Grid */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#C8202B]/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#F5F4F2_1px,transparent_1px),linear-gradient(to_bottom,#F5F4F2_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-3">
              <span className="w-8 h-[2px] bg-[#C8202B]" />
              EVIDENCE-BASED SPORTS NUTRITION
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95]">
              UNDERSTAND YOUR <span className="text-[#C8202B]">SUPPLEMENTS.</span>
            </h2>
            <p className="mt-4 text-base text-[#8C8C8C] leading-relaxed font-body">
              Supplements are targeted nutritional tools designed to complement a balanced diet—not replace real food. Learn how our core formulations support your recovery and physical goals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5A5A5A]">
              TRANSPARENT EDUCATION • 4 CORE FORMULATIONS
            </span>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {SUPPLEMENT_TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isActive = topic.id === activeTab;

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setActiveTab(topic.id)}
                className={`p-4 sm:p-5 text-left border transition-all duration-200 relative group cursor-pointer ${
                  isActive
                    ? 'bg-[#181818] border-[#C8202B] shadow-lg shadow-[#C8202B]/10'
                    : 'bg-[#161616] border-[#262626] hover:border-[#383838] hover:bg-[#1A1A1A]'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#C8202B]" />
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 transition-colors ${isActive ? 'bg-[#C8202B] text-[#F5F4F2]' : 'bg-[#1F1F1F] text-[#8C8C8C] group-hover:text-[#F5F4F2]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest ${isActive ? 'text-[#C8202B]' : 'text-[#555555]'}`}>
                    0{SUPPLEMENT_TOPICS.indexOf(topic) + 1}
                  </span>
                </div>
                <h3 className={`font-heading text-lg sm:text-xl uppercase font-bold tracking-tight block ${isActive ? 'text-[#F5F4F2]' : 'text-[#AAAAAA]'}`}>
                  {topic.title}
                </h3>
                <span className="text-[11px] font-mono text-[#8C8C8C] block mt-0.5 truncate">
                  {topic.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Topic Detailed Deep-Dive Card */}
        <div className="bg-[#161616] border border-[#2B2B2B] p-5 sm:p-12 shadow-2xl relative overflow-hidden mb-12 sm:mb-16">
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#C8202B] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column: Educational Explanation (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1F1F] border border-[#2E2E2E] text-[11px] font-mono uppercase tracking-widest text-[#C8202B] font-semibold">
                  <Layers className="w-3.5 h-3.5 text-[#C8202B]" />
                  <span>{currentTopic.badge}</span>
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F4F2] uppercase font-black tracking-tight">
                  {currentTopic.title}
                </h3>
                <p className="font-heading text-base sm:text-lg text-[#C8202B] uppercase tracking-wider font-semibold">
                  {currentTopic.tagline}
                </p>
              </div>

              {/* What It Is & How It Works */}
              <div className="space-y-4 pt-4 border-t border-[#242424] text-sm sm:text-base text-[#D0D0D0] font-body leading-relaxed">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C] block mb-1">
                    WHAT IT IS
                  </span>
                  <p>{currentTopic.whatItIs}</p>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C] block mb-1">
                    HOW IT WORKS IN THE BODY
                  </span>
                  <p>{currentTopic.howItWorks}</p>
                </div>
              </div>

              {/* Verified Nutritional Benefits List */}
              <div className="space-y-2.5 pt-4 border-t border-[#242424]">
                <span className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C] block mb-2">
                  KEY PHYSIOLOGICAL BENEFITS
                </span>
                {currentTopic.keyBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F5F4F2]">
                    <CheckCircle2 className="w-4 h-4 text-[#C8202B] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Usage & Timing */}
              <div className="p-4 bg-[#1A1A1A] border-l-2 border-[#C8202B] flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C8202B] shrink-0 mt-0.5" />
                <div className="text-xs text-[#8C8C8C]">
                  <span className="font-bold uppercase text-[#F5F4F2] block mb-0.5 font-heading text-sm">
                    Optimal Timing Guideline
                  </span>
                  {currentTopic.timing}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 flex items-center gap-4">
                <Link
                  to={currentTopic.ctaLink}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8202B] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase tracking-wider text-sm font-bold transition-colors shadow-lg cursor-pointer"
                >
                  <span>{currentTopic.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products"
                  className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
                >
                  View Full Catalogue →
                </Link>
              </div>

            </div>

            {/* Right Column: Key Metric Matrix (5 cols) */}
            <div className="lg:col-span-5 bg-[#121212] border border-[#262626] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#242424] pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C8202B]">
                  LAB FORMULA METRICS
                </span>
                <span className="text-xs font-mono text-[#555555]">
                  PER SERVING
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentTopic.metrics.map((metric) => (
                  <div key={metric.label} className="p-4 bg-[#161616] border border-[#282828] text-center">
                    <span className="font-heading font-black text-2xl sm:text-3xl text-[#F5F4F2] block tracking-tight">
                      {metric.value}
                    </span>
                    <span className="text-[10px] font-mono text-[#8C8C8C] uppercase tracking-wider mt-1 block">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-[#242424] text-xs font-mono text-[#8C8C8C]">
                <div className="flex items-center justify-between">
                  <span>LABEL CLAIM TESTING</span>
                  <span className="text-[#F5F4F2]">100% VERIFIED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>AMINO ACID SPIKING</span>
                  <span className="text-[#C8202B] font-bold">ZERO DETECTED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>PROPRIETARY BLENDS</span>
                  <span className="text-[#F5F4F2]">NONE (FULL DOSING)</span>
                </div>
              </div>

              <div className="p-4 bg-[#181818] border border-[#2E2E2E] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-heading uppercase text-[#C8202B] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>The RK Guarantee</span>
                </div>
                <p className="text-[11px] text-[#7C7C7C] leading-relaxed font-body">
                  If any batch does not strictly match our stated nutritional profile, we recall the production run immediately.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Responsible Supplementation Principles Box */}
        <div className="p-6 sm:p-8 bg-[#141414] border border-[#282828] rounded-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#242424]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#C8202B]/10 border border-[#C8202B]/30 text-[#C8202B]">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-xl uppercase font-bold text-[#F5F4F2] tracking-wide">
                  Responsible Supplementation Principles
                </h4>
                <p className="text-xs text-[#8C8C8C] font-body">
                  We believe in truthful education over marketing hype. Here is our ethical code:
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#555555] uppercase shrink-0">
              ETHICS IN NUTRITION
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-xs text-[#8C8C8C] font-body">
            <div className="space-y-1.5">
              <span className="font-heading font-bold uppercase text-[#F5F4F2] text-sm block">
                1. Whole Food Foundation
              </span>
              <p>
                Supplements are designed to fill nutritional gaps and accelerate recovery. They should always complement a wholesome, balanced diet.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-heading font-bold uppercase text-[#F5F4F2] text-sm block">
                2. No Magic Promises
              </span>
              <p>
                We never promise unrealistic physical transformations or instant muscle gain. Real progress requires consistent nutrition and disciplined effort.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-heading font-bold uppercase text-[#F5F4F2] text-sm block">
                3. Hydration Matters
              </span>
              <p>
                Active compounds like Creatine and high-yield protein require adequate water intake (3–4 liters daily) for optimal biological transport.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-heading font-bold uppercase text-[#F5F4F2] text-sm block">
                4. Label Integrity
              </span>
              <p>
                We never hide ingredients behind "proprietary matrix" labels. What is listed on the container is precisely what you consume.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
