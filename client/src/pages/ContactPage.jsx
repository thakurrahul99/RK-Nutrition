import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, Send, HelpCircle, ArrowRight, CheckCircle2, Phone, MapPin, Copy, ExternalLink } from 'lucide-react';
import { apiRequest } from '../services/api';


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText('A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your full name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide your message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      const res = await apiRequest('/store/inquiries', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.success) {
        setSubmittedSuccess(true);
        setFormData({ name: '', email: '', subject: 'general', message: '' });
      } else {
        setErrors({ form: res.error || 'Failed to submit inquiry.' });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2] page-enter">
      
      {/* Contact Hero */}
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
            <span className="text-[#E11D2E]">CONTACT</span>
          </nav>

          <div className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.25em] text-[#E11D2E] font-bold mb-4">
            <span className="w-6 h-[2px] bg-[#E11D2E]" />
            OFFICIAL INQUIRY DESK
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#F5F4F2] uppercase font-black tracking-tight leading-[0.95] mb-6">
            LET'S <span className="text-[#E11D2E]">CONNECT.</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-[#8C8C8C] leading-relaxed font-body">
            Have a question or need information? Reach out to RK Nutrition.
          </p>
        </div>
      </section>

      {/* Main 2-Column Contact Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E11D2E] font-semibold block mb-2">
                VERIFIED CHANNELS
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-[#F5F4F2] uppercase font-bold tracking-tight mb-3">
                HOW TO REACH US
              </h2>
              <p className="text-sm text-[#8C8C8C] leading-relaxed font-body">
                Official business channels for orders, formulation queries, and customer assistance. Our team is directly reachable via Phone, WhatsApp, and Email.
              </p>
            </div>

            {/* 1. Official Business Address Card */}
            <div className="p-6 bg-[#161616] border border-[#282828] space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5 text-xs text-[#E11D2E] font-mono">
                <MapPin className="w-4 h-4" />
                <span className="uppercase">Marketed By / Business Address</span>
              </div>
              <div>
                <span className="font-heading text-lg text-[#F5F4F2] block uppercase font-bold">
                  RK Nutrition
                </span>
                <p className="text-sm text-[#CCCCCC] font-body leading-relaxed select-all mt-1">
                  A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3 py-1.5 bg-[#1E1E1E] hover:bg-[#252525] border border-[#333333] text-[11px] font-mono uppercase text-[#F5F4F2] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#E11D2E]" />
                  <span>{copiedAddress ? 'Copied!' : 'Copy Address'}</span>
                </button>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Patparganj+Industrial+Area+Delhi+110092"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#1E1E1E] hover:bg-[#252525] border border-[#333333] text-[11px] font-mono uppercase text-[#F5F4F2] flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#8C8C8C]" />
                  <span>Directions</span>
                </a>
              </div>
            </div>

            {/* 2. Direct Calling Desk */}
            <div className="p-6 bg-[#161616] border border-[#282828] space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5 text-xs text-[#E11D2E] font-mono">
                <Phone className="w-4 h-4" />
                <span className="uppercase">Direct Phone Lines</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <a
                  href="tel:+918630663134"
                  className="p-3 bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#E11D2E] block group transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C] block">
                    Customer Care / Orders
                  </span>
                  <span className="font-heading text-lg text-[#F5F4F2] group-hover:text-[#E11D2E] tracking-wide font-bold">
                    +91 86306 63134
                  </span>
                </a>
                <a
                  href="tel:+918266821388"
                  className="p-3 bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#E11D2E] block group transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C] block">
                    Support Desk
                  </span>
                  <span className="font-heading text-lg text-[#F5F4F2] group-hover:text-[#E11D2E] tracking-wide font-bold">
                    +91 82668 21388
                  </span>
                </a>
                <a
                  href="tel:+917452013333"
                  className="p-3 bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#E11D2E] block group transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C] block">
                    Direct Support
                  </span>
                  <span className="font-heading text-lg text-[#F5F4F2] group-hover:text-[#E11D2E] tracking-wide font-bold">
                    +91 74520 13333
                  </span>
                </a>
              </div>
              <span className="text-xs text-[#8C8C8C] font-body block">
                Tap on any number to initiate an immediate phone call.
              </span>
            </div>

            {/* 3. WhatsApp Instant Support Desk */}
            <div className="p-6 bg-[#161616] border border-[#282828] space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-[#25D366] font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span className="uppercase">WhatsApp Direct Desk</span>
                </div>
                <span className="text-[10px] font-mono text-[#8C8C8C] uppercase">Fastest Response</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <span className="font-heading text-xl text-[#F5F4F2] block font-bold">
                    +91 86306 63134
                  </span>
                  <span className="text-xs text-[#8C8C8C]">Direct chat with supplement specialist</span>
                </div>
                <a
                  href="https://wa.me/918630663134?text=Hi%20RK%20Nutrition%2C%20I%20have%20an%20inquiry%20about%20your%20supplements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-heading uppercase text-xs tracking-wider font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-[#25D366]/20 cursor-pointer"
                >
                  <span>Chat On WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 4. Electronic Mail Card */}
            <div className="p-6 bg-[#161616] border border-[#282828] space-y-2 shadow-lg">
              <div className="flex items-center gap-2.5 text-xs text-[#E11D2E] font-mono">
                <Mail className="w-4 h-4" />
                <span className="uppercase">Official Email Desk</span>
              </div>
              <a
                href="mailto:Kuldeeprajput5262@gmail.com"
                className="font-heading text-xl text-[#F5F4F2] hover:text-[#E11D2E] tracking-wide transition-colors block break-all"
              >
                Kuldeeprajput5262@gmail.com
              </a>
              <span className="text-xs text-[#8C8C8C] font-body block">
                Primary channel for order issues, business collaborations, and bulk inquiries.
              </span>
            </div>

            {/* 5. Operating Schedule & Response Standard */}
            <div className="p-6 bg-[#161616] border border-[#282828] space-y-2">
              <div className="flex items-center gap-2.5 text-xs text-[#E11D2E] font-mono">
                <Clock className="w-4 h-4" />
                <span className="uppercase">Operating Schedule</span>
              </div>
              <span className="font-heading text-base text-[#F5F4F2] uppercase block font-semibold">
                Monday – Saturday: 09:00 AM – 07:00 PM IST
              </span>
              <span className="text-xs text-[#8C8C8C] font-body block">
                Average reply time: 2 to 4 business hours. Sunday inquiries are processed first thing on Monday morning.
              </span>
            </div>

            {/* Direct FAQ Callout */}
            <div className="p-6 bg-[#1A1A1A] border-l-2 border-[#E11D2E] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E11D2E]">
                <HelpCircle className="w-4 h-4" />
                <span>Quick Answers</span>
              </div>
              <h3 className="font-heading text-lg text-[#F5F4F2] uppercase font-bold">
                Check our Knowledge Base
              </h3>
              <p className="text-xs text-[#8C8C8C] leading-relaxed font-body">
                Have questions about our products or ingredients? Check our FAQ first.
              </p>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#E11D2E] hover:text-[#F5F4F2] transition-colors pt-1"
              >
                <span>Visit FAQ Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#161616] border border-[#282828] p-8 sm:p-10 shadow-2xl">
            <div className="pb-6 border-b border-[#262626] mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E11D2E] block mb-1">
                MESSAGE FORM
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl text-[#F5F4F2] uppercase font-bold tracking-tight">
                SEND AN INQUIRY
              </h3>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] block">
                  Full Name <span className="text-[#E11D2E]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className={`w-full bg-[#111111] border px-4 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body focus:outline-none transition-colors ${
                    errors.name ? 'border-[#E11D2E]' : 'border-[#2E2E2E] focus:border-[#E11D2E]'
                  }`}
                />
                {errors.name && (
                  <span className="text-xs text-[#E11D2E] font-mono block">{errors.name}</span>
                )}
              </div>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] block">
                  Email Address <span className="text-[#E11D2E]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. athlete@example.com"
                  className={`w-full bg-[#111111] border px-4 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body focus:outline-none transition-colors ${
                    errors.email ? 'border-[#E11D2E]' : 'border-[#2E2E2E] focus:border-[#E11D2E]'
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-[#E11D2E] font-mono block">{errors.email}</span>
                )}
              </div>

              {/* Subject Field */}
              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] block">
                  Subject
                </label>
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-4 py-3 text-sm text-[#F5F4F2] font-body focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="general">General Brand Inquiry</option>
                  <option value="products">Product Formulations & Ingredients</option>
                  <option value="partnerships">Athlete & Brand Partnerships</option>
                  <option value="retail">Authorized Retail / Distribution</option>
                </select>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] block">
                  Message <span className="text-[#E11D2E]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your question or inquiry here..."
                  className={`w-full bg-[#111111] border px-4 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body focus:outline-none transition-colors ${
                    errors.message ? 'border-[#E11D2E]' : 'border-[#2E2E2E] focus:border-[#E11D2E]'
                  }`}
                />
                {errors.message && (
                  <span className="text-xs text-[#E11D2E] font-mono block">{errors.message}</span>
                )}
              </div>

              {/* Submission Result */}
              {submittedSuccess && (
                <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/40 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-2 text-[#10B981] font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Inquiry Dispatched Successfully</span>
                  </div>
                  <p className="text-[#F5F4F2]/90 leading-relaxed font-body">
                    Your correspondence has been delivered to the official RK Nutrition inquiry desk. Our representatives will review and reply to your email within 24 hours.
                  </p>
                </div>
              )}

              {errors.form && (
                <div className="p-3 bg-[#E11D2E]/10 border border-[#E11D2E]/40 text-xs font-mono text-[#F5F4F2]">
                  {errors.form}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#E11D2E] hover:bg-[#AC1721] disabled:bg-[#551A1E] text-[#F5F4F2] font-heading uppercase text-base tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Processing...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
