import { Link } from 'react-router-dom';
import { Truck, RotateCcw, Clock, AlertCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function ShippingPolicyPage() {
  const { content } = useContent();
  const shippingPolicy = content?.pages?.shippingPolicy || {};

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2] page-enter">
      {/* Hero Section */}
      <section className="relative bg-[#141414] border-b border-[#222222] pt-14 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#8C8C8C] mb-6 uppercase">
            <Link to="/" className="hover:text-[#F5F4F2] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-[#C8202B]">SHIPPING & RETURNS</span>
          </nav>

          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#C8202B] font-bold mb-4">
            <span className="w-6 h-[2px] bg-[#C8202B]" />
            LOGISTICS STANDARDS
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95] mb-4">
            SHIPPING & <span className="text-[#C8202B]">RETURNS.</span>
          </h1>

          <p className="max-w-2xl text-base text-[#8C8C8C] leading-relaxed font-body">
            Fast, secure dispatch from our temperature-controlled central facility to your doorstep across India.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        {/* 3 Core Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#161616] border border-[#242424] space-y-3">
            <div className="w-10 h-10 bg-[#1C1C1C] border border-[#2D2D2D] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#C8202B]" />
            </div>
            <h3 className="font-heading text-base font-bold uppercase text-[#F5F4F2]">
              24-48h Fast Dispatch
            </h3>
            <p className="text-xs text-[#8C8C8C] leading-relaxed font-body">
              {shippingPolicy.dispatchTimeline || 'Orders are processed, batch-verified, and dispatched from our primary hub within 24 to 48 hours.'}
            </p>
          </div>

          <div className="p-6 bg-[#161616] border border-[#242424] space-y-3">
            <div className="w-10 h-10 bg-[#1C1C1C] border border-[#2D2D2D] flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#C8202B]" />
            </div>
            <h3 className="font-heading text-base font-bold uppercase text-[#F5F4F2]">
              Free Shipping Over ₹1,999
            </h3>
            <p className="text-xs text-[#8C8C8C] leading-relaxed font-body">
              {shippingPolicy.shippingCharges || 'Orders valued at ₹1,999 or above receive free premium courier delivery. Flat ₹99 on smaller orders.'}
            </p>
          </div>

          <div className="p-6 bg-[#161616] border border-[#242424] space-y-3">
            <div className="w-10 h-10 bg-[#1C1C1C] border border-[#2D2D2D] flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-[#C8202B]" />
            </div>
            <h3 className="font-heading text-base font-bold uppercase text-[#F5F4F2]">
              7-Day Return Guarantee
            </h3>
            <p className="text-xs text-[#8C8C8C] leading-relaxed font-body">
              {shippingPolicy.returnWindow || 'Inspect your formulation seal. Returns accepted within 7 days for unopened, sealed containers.'}
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="bg-[#141414] border border-[#242424] p-8 space-y-8 font-body">
          <div className="space-y-3">
            <h2 className="font-heading text-xl uppercase font-bold text-[#F5F4F2] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8202B]" />
              1. Delivery Coverage & Transit Times
            </h2>
            <p className="text-sm text-[#8C8C8C] leading-relaxed">
              We partner with Tier-1 logistics carriers (including Delhivery, BlueDart, and DTDC) to ensure reliable nationwide delivery. Metros typically receive shipments within 2-3 business days, while non-metro and regional locations arrive within 4-5 business days. Once your parcel departs our facility, live tracking details are provided via email and SMS.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl uppercase font-bold text-[#F5F4F2] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8202B]" />
              2. Packaging & Tamper-Evident Security
            </h2>
            <p className="text-sm text-[#8C8C8C] leading-relaxed">
              All RK Nutrition proteins, gainers, and pre-workouts are sealed under strict pharmaceutical standards. Outer cartons feature reinforced tamper-evident tape. If an outer package arrives visibly breached or crushed, please refuse delivery and immediately document photo evidence with the carrier.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl uppercase font-bold text-[#F5F4F2] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8202B]" />
              3. Returns & Replacement Eligibility
            </h2>
            <p className="text-sm text-[#8C8C8C] leading-relaxed">
              Due to strict health and consumable safety regulations, opened, unsealed, or partially consumed dietary supplements cannot be restocked or returned. Replacements are immediately dispatched at our expense if an incorrect formulation was received or if a container was compromised during transit.
            </p>
            <div className="p-4 bg-[#111111] border border-[#222222] text-xs font-mono text-[#8C8C8C] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#C8202B] shrink-0 mt-0.5" />
              <span>To initiate a return or replacement, email our desk at <strong className="text-[#F5F4F2]">support@rknutrition.com</strong> with your Order ID, batch number, and high-resolution photo proof within 7 days of delivery.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
