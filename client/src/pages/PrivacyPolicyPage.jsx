import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { content } = useContent();
  const privacy = content?.pages?.privacyPolicy || {};

  const title = privacy.title || 'Privacy Policy';
  const lastUpdated = privacy.lastUpdated || 'November 2026';
  const bodyText = privacy.text || 'At RK Nutrition, we value the privacy of our athletes and visitors. This informational and commerce platform does not sell, trade, or monetize personal tracking profiles. Commercial transaction data is secured via bank-grade encryption.';

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
          <span className="text-[#F5F4F2]">PRIVACY POLICY</span>
        </nav>

        {/* Header */}
        <div className="pb-8 border-b border-[#222222] mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#E11D2E] font-bold mb-3">
            <Shield className="w-4 h-4" />
            LEGAL ARCHITECTURE // COMPLIANCE
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95] mb-4">
            {title}
          </h1>
          <p className="text-xs font-mono text-[#8C8C8C] uppercase tracking-wider">
            LAST REVISED: {lastUpdated} // OFFICIAL RK NUTRITION DISCLOSURE
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
              1. Information Collection & Use
            </h2>
            <p className="text-[#8C8C8C]">
              Information submitted via our contact forms, product inquiries, or future order fulfillment processes is utilized exclusively to provide customer support, verify athletic orders, and maintain delivery logistics. We do not engage in unauthorized third-party marketing or sell customer profiles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl uppercase font-bold text-[#F5F4F2] tracking-wide">
              2. Commercial Transaction Security
            </h2>
            <p className="text-[#8C8C8C]">
              When electronic transactions are initiated on our platform, payment gateway communications (including UPI, Card, and Net Banking) are encrypted end-to-end via PCI-DSS compliant providers. RK Nutrition does not store full credit card numbers or banking passwords on internal servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl uppercase font-bold text-[#F5F4F2] tracking-wide">
              3. Data Retention & Contact
            </h2>
            <p className="text-[#8C8C8C]">
              Inquiry submissions and fulfillment records are retained only as long as necessary to satisfy operational and statutory requirements under Indian law. For privacy-related inquiries, reach our official compliance desk at <a href="mailto:Kuldeeprajput5262@gmail.com" className="text-[#E11D2E] underline">Kuldeeprajput5262@gmail.com</a> or write to RK Nutrition, A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India (Phone: <a href="tel:+918630663134" className="text-[#F5F4F2] hover:underline">+91 86306 63134</a> / <a href="tel:+917452013333" className="text-[#F5F4F2] hover:underline">+91 74520 13333</a>).
            </p>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t border-[#222222] flex items-center justify-between text-xs font-mono text-[#8C8C8C]">
          <Link to="/" className="text-[#E11D2E] hover:text-[#F5F4F2] transition-colors uppercase">
            ← Return to Homepage
          </Link>
          <Link to="/terms-of-service" className="text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors uppercase">
            View Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
