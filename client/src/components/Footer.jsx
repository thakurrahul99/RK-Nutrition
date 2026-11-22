import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { Mail, ArrowUp, ShieldCheck, CheckCircle2, FlaskConical, Truck, Send } from 'lucide-react';

export default function Footer() {
  const { name } = brandConfig;
  const { content } = useContent();
  const currentYear = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const configuredFooterLinks = content?.navigation?.footerLinks;
  const navItems = Array.isArray(configuredFooterLinks) && configuredFooterLinks.length > 0
    ? configuredFooterLinks.filter((item) => item.visible !== false)
    : [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: 'Categories', path: '/categories' },
        { label: 'About', path: '/about' },
        { label: 'Learn', path: '/learn' },
        { label: 'Contact', path: '/contact' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Shipping & Returns', path: '/shipping-policy' }
      ];

  const policyItems = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
    { label: 'Shipping & Returns', path: '/shipping-policy' },
    { label: 'FAQ', path: '/faq' }
  ];

  const socialLinks = content?.navigation?.socialLinks || {
    instagram: 'https://instagram.com/rknutrition',
    youtube: 'https://youtube.com/@rknutrition',
    twitter: 'https://x.com/rknutrition',
    whatsapp: ''
  };

  const isValidUrl = (url) => typeof url === 'string' && url.trim().length > 0 && url.trim() !== '#' && !url.startsWith('javascript:');

  return (
    <footer id="contact-footer" className="bg-[#090909] border-t border-[#1C1C1C] text-[#F5F4F2]">
      
      {/* Trust & Verification Strip */}
      <div className="border-b border-[#1A1A1A] bg-[#0C0C0C]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-[#8C8C8C]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#E11D2E] shrink-0" />
              <span>100% Authentic Sourced</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#E11D2E] shrink-0" />
              <span>FSSAI Certified Labs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FlaskConical className="w-4 h-4 text-[#E11D2E] shrink-0" />
              <span>Zero Amino Spiking</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#E11D2E] shrink-0" />
              <span>Free Delivery Over ₹999</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand & Identity Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block group">
              <img 
                src="/images/RK%20Nutrition%20Logo.png" 
                alt="RK Nutrition" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105" 
              />
            </Link>

            <p className="font-heading text-sm text-[#E11D2E] uppercase tracking-wider font-semibold">
              Engineered for pure performance.
            </p>

            <p className="text-xs text-[#8C8C8C] leading-relaxed max-w-sm font-body">
              Pure, transparent sports nutrition built for dedicated athletes. Zero deceptive filler blends.
            </p>

            {/* Social Icons: Render only valid external URLs */}
            <div className="flex items-center gap-2.5 pt-1">
              {isValidUrl(socialLinks.instagram) && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#141414] border border-[#242424] hover:border-[#E11D2E] hover:text-[#E11D2E] text-[#8C8C8C] flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {isValidUrl(socialLinks.youtube) && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#141414] border border-[#242424] hover:border-[#E11D2E] hover:text-[#E11D2E] text-[#8C8C8C] flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {isValidUrl(socialLinks.twitter) && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#141414] border border-[#242424] hover:border-[#E11D2E] hover:text-[#E11D2E] text-[#8C8C8C] flex items-center justify-center transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links Column: 2-column mobile layout (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-heading uppercase tracking-wider text-[#F5F4F2] font-bold block mb-3">
                Quick Links
              </span>
              <ul className="space-y-2 text-xs font-heading uppercase tracking-wide">
                {navItems.slice(0, 5).map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="text-[#8C8C8C] hover:text-[#E11D2E] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[11px] font-heading uppercase tracking-wider text-[#F5F4F2] font-bold block mb-3">
                Policies & Help
              </span>
              <ul className="space-y-2 text-xs font-heading uppercase tracking-wide">
                {policyItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="text-[#8C8C8C] hover:text-[#E11D2E] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Inquiry & Newsletter Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <span className="text-[11px] font-heading uppercase tracking-wider text-[#F5F4F2] font-bold block mb-2">
                Athlete Dispatch
              </span>
              <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    placeholder="Enter athlete email"
                    className="bg-[#141414] border border-[#242424] focus:border-[#E11D2E] text-xs font-mono px-3 py-2 text-[#F5F4F2] placeholder-[#666666] flex-1 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to dispatch"
                    className="px-3 bg-[#E11D2E] hover:bg-[#C81A27] text-white flex items-center justify-center transition-all btn-shimmer active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {subscribed && (
                  <span className="text-[10px] font-mono text-emerald-400 block animate-fade-in">
                    ✓ Registered for RK Athlete drops.
                  </span>
                )}
              </form>
            </div>

            <div className="p-3 bg-[#121212] border border-[#1F1F1F] space-y-1 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-[#8C8C8C]">
                <Mail className="w-3.5 h-3.5 text-[#E11D2E]" />
                <span>contact@rknutrition.com</span>
              </div>
              <p className="text-[11px] text-[#666666]">
                Mon–Sat: 09:00–18:00 IST
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & FSSAI Disclaimer */}
      <div className="border-t border-[#191919] bg-[#070707] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="text-[10px] text-[#555555] font-body text-center sm:text-left">
            * Disclaimer: These products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#666666] font-mono">
            <span>© {currentYear} {name}. All rights reserved.</span>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-[#F5F4F2] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
}
