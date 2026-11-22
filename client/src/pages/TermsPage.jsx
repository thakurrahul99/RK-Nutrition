import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const { content } = useContent();
  const terms = content?.pages?.termsOfService || {};

  const title = terms.title || 'Terms of Service';
  const lastUpdated = terms.lastUpdated || 'November 2026';
  const bodyText = terms.text || 'Welcome to the official digital platform of RK Nutrition. By exploring or ordering from this website, you agree to these terms. All formulations, visual branding, typography, and trade copy are the proprietary intellectual property of RK Nutrition.';

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2] page-enter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#8C8C8C] mb-8 uppercase">
          <Link to="/" className="hover:text-[#F5F4F2] transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HOME</span>
          </Link>
          <span>/</span>
          <span className="text-[#E11D2E]">LEGAL</span>
          <span>/</span>
          <span className="text-[#F5F4F2]">TERMS OF SERVICE</span>
        </nav>

        {/* Header */}
        <div className="pb-8 border-b border-[#222222] mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#E11D2E] font-bold mb-3">
            <FileText className="w-4 h-4" />
            TERMS & CONDITIONS // STATUTORY
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95] mb-4">
            {title}
          </h1>
          <p className="text-xs font-mono text-[#8C8C8C] uppercase tracking-wider">
            LAST REVISED: {lastUpdated} // LEGAL CONDITIONS OF USE
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 font-body text-sm sm:text-base text-[#CCCCCC] leading-relaxed">
          <div className="p-6 bg-[#161616] border-l-2 border-[#E11D2E] text-[#F5F4F2]">
            <p className="font-medium leading-relaxed">
              {bodyText}
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-heading text-xl uppercase font-bold text-[#F5F4F2] tracking-wide">
              1. Brand Intellectual Property
            </h2>
            <p className="text-[#8C8C8C]">
              All product formulations, brand names, visual styling, logotypes, athletic monograms, audio-visual materials, and written product descriptions are the exclusive intellectual property of RK Nutrition. Any reproduction, distribution, scraping, or trademark infringement is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl uppercase font-bold text-[#F5F4F2] tracking-wide">
              2. Product Descriptions & Informational Use
            </h2>
            <p className="text-[#8C8C8C]">
              Specifications, ingredients, and nutritional fact panels published on this platform are provided for athlete guidance and nutritional transparency. Supplement products are intended for healthy adults engaging in physical conditioning. Consult a healthcare practitioner if you are pregnant, nursing, or have a pre-existing medical condition.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl uppercase font-bold text-[#F5F4F2] tracking-wide">
              3. Pricing & Ordering Operations
            </h2>
            <p className="text-[#8C8C8C]">
              All prices listed on the platform are in Indian Rupees (₹) inclusive of applicable GST taxes unless explicitly noted. RK Nutrition reserves the right to adjust product availability, discontinue items, or reject fraudulent transactions in compliance with store operational policies.
            </p>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t border-[#222222] flex items-center justify-between text-xs font-mono text-[#8C8C8C]">
          <Link to="/" className="text-[#E11D2E] hover:text-[#F5F4F2] transition-colors uppercase">
            ← Return to Homepage
          </Link>
          <Link to="/privacy-policy" className="text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors uppercase">
            View Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
