import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { ChevronDown, HelpCircle, ArrowRight, Mail, Phone } from 'lucide-react';

const DEFAULT_FAQ_ITEMS = [
  {
    question: "Are supplements a replacement for real food?",
    answer: "No. Supplements are designed to complement a nutrient-dense whole-food diet. They help bridge protein gaps, support post-training recovery convenience, and provide targeted macronutrients and micronutrients when whole food is impractical."
  },
  {
    question: "How do I choose between Pure Whey Isolate and Advanced Mass Fuel?",
    answer: "Pure Whey Isolate delivers ultra-lean protein (27g protein with less than 1g carbs/fat) for clean muscle recovery without caloric surplus. Advanced Mass Fuel provides high-density calories (380 kcal, 32g protein, and clean complex carbs) for athletes and hardgainers needing caloric surplus to gain mass."
  },
  {
    question: "What does 'Zero Amino Spiking' mean?",
    answer: "Amino spiking is an industry shortcut where manufacturers add cheap non-protein nitrogen compounds (such as free glycine or taurine) to artificially inflate laboratory protein test scores. At RK Nutrition, we test and guarantee that 100% of stated protein comes from pure, intact dairy protein."
  },
  {
    question: "How and when should I take Ignition Pre-Workout?",
    answer: "Mix 1 scoop with 200–250ml of cold water and consume 20–30 minutes before your physical activity. If you are sensitive to caffeine, we recommend starting with half a scoop to assess your individual tolerance."
  },
  {
    question: "Can I combine Whey Protein and Creatine together?",
    answer: "Yes. Creatine Monohydrate and Whey Protein can be safely mixed together in the same shaker with water or milk. Consuming creatine alongside carbohydrates or protein can enhance cellular nutrient uptake."
  },
  {
    question: "How long does shipping take and how can I track my order?",
    answer: "Orders are processed and dispatched within 24–48 business hours. Once shipped, you will receive real-time courier tracking details via email/SMS. Standard delivery takes 3–5 business days nationwide."
  }
];

export default function FAQPage() {
  const { content } = useContent();
  const configuredFaqs = content?.pages?.faq?.filter((f) => f.visible !== false) || DEFAULT_FAQ_ITEMS;
  const faqItems = configuredFaqs.length > 0 ? configuredFaqs : DEFAULT_FAQ_ITEMS;

  const [openIndices, setOpenIndices] = useState([0]); // First item open by default

  const toggleAccordion = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleAccordion(index);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2] page-enter">
      
      {/* FAQ Hero */}
      <section className="relative bg-[#141414] border-b border-[#222222] pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E11D2E]/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#F5F4F2_1px,transparent_1px),linear-gradient(to_bottom,#F5F4F2_1px,transparent_1px)] [background-size:48px_48px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#8C8C8C] mb-6 uppercase">
            <Link to="/" className="hover:text-[#F5F4F2] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-[#E11D2E]">FAQ</span>
          </nav>

          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#E11D2E] font-bold mb-4">
            <span className="w-6 h-[2px] bg-[#E11D2E]" />
            FREQUENTLY ASKED QUESTIONS
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95] mb-6">
            FREQUENTLY ASKED <br />
            <span className="text-[#E11D2E]">QUESTIONS</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-[#8C8C8C] leading-relaxed font-body">
            Find answers to common questions about RK Nutrition products, ingredients, and standards.
          </p>
        </div>
      </section>

      {/* Main FAQ Accordion Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-8">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E] font-semibold">
              <HelpCircle className="w-4 h-4 text-[#E11D2E]" />
              <span>KNOWLEDGE BASE • 6 QUESTIONS</span>
            </div>
            <span className="text-xs font-mono text-[#5A5A5A] uppercase">
              TRANSPARENT ANSWERS
            </span>
          </div>

          {/* Accessible Accordion Rows */}
          <div className="divide-y divide-[#262626] border-y border-[#262626]">
            {faqItems.map((item, index) => {
              const isOpen = openIndices.includes(index);
              const answerId = `faq-answer-${index}`;
              const questionId = `faq-question-${index}`;

              return (
                <div key={item.question} className="py-5">
                  <button
                    type="button"
                    id={questionId}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggleAccordion(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full flex items-center justify-between text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] cursor-pointer"
                  >
                    <span className="font-heading text-xl sm:text-2xl text-[#F5F4F2] uppercase tracking-wide group-hover:text-[#E11D2E] transition-colors pr-4">
                      {item.question}
                    </span>
                    <div className={`p-2 bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#E11D2E] transition-colors shrink-0 ${isOpen ? 'border-[#E11D2E]' : ''}`}>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8C8C8C] transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#E11D2E]' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      className="pt-4 pr-6 pb-2 text-sm sm:text-base text-[#8C8C8C] leading-relaxed font-body"
                    >
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Further Assistance Card */}
        <div className="mt-16 p-8 bg-[#161616] border border-[#282828] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-heading text-xl text-[#F5F4F2] uppercase tracking-wider font-bold">
              Still have questions about our formulations?
            </h3>
            <p className="text-xs sm:text-sm text-[#8C8C8C] font-body">
              Call our support desk at <a href="tel:+918630663134" className="text-[#F5F4F2] hover:text-[#E11D2E] font-bold font-mono">+91 86306 63134</a> / <a href="tel:+917452013333" className="text-[#F5F4F2] hover:text-[#E11D2E] font-bold font-mono">+91 74520 13333</a> or write to <a href="mailto:Kuldeeprajput5262@gmail.com" className="text-[#F5F4F2] hover:text-[#E11D2E] font-bold font-mono">Kuldeeprajput5262@gmail.com</a>.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://wa.me/918630663134?text=Hi%20RK%20Nutrition%2C%20I%20have%20a%20question%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-heading uppercase text-xs tracking-wider font-bold transition-all shadow-lg shadow-[#25D366]/20"
            >
              <span>WhatsApp Help</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#E11D2E] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase text-xs tracking-wider transition-colors shadow-lg"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
