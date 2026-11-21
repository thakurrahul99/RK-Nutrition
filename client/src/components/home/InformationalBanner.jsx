import { Link } from 'react-router-dom';
import { ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export default function InformationalBanner() {
  return (
    <section 
      aria-label="Launch Promotion Banner"
      className="relative py-16 bg-[#0E0E0E] border-b border-[#222222] overflow-hidden"
    >
      {/* Background Molecular Texture */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#F5F4F2_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-[#141414] border border-[#262626] p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-2xl overflow-hidden">
          {/* Signature RK red corner notch */}
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#C8202B] z-10 pointer-events-none" />

          {/* Subtle background RK Monogram */}
          <span 
            className="absolute -bottom-10 -right-6 font-heading font-black text-9xl text-white/[0.02] select-none pointer-events-none tracking-tighter"
            aria-hidden="true"
          >
            RK
          </span>
          
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8202B]">
              <Tag className="w-4 h-4 text-[#C8202B]" />
              <span>SPECIAL LAUNCH OFFER // SAVE 10%</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#F5F4F2] uppercase font-bold tracking-tight">
              USE COUPON <span className="text-[#C8202B]">RKLAUNCH10</span> AT CHECKOUT
            </h3>
            <p className="text-xs sm:text-sm text-[#8C8C8C] leading-relaxed font-body">
              Take 10% off your initial sports supplement order of ₹1,999 or more. Valid on Whey Protein Isolate, Advanced Mass Fuel, and Ignition Pre-Workout. Free delivery across India.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#555555]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8202B]" />
              <span>100% SECURE PREPAID (UPI / CARDS) & CASH ON DELIVERY ELIGIBLE</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0 z-10">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#C8202B] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase tracking-wider text-sm transition-colors shadow-lg cursor-pointer"
            >
              <span>Shop Supplements</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] hover:border-[#C8202B] text-[#F5F4F2] font-heading uppercase tracking-wider text-sm transition-colors cursor-pointer"
            >
              <span>View Categories</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
