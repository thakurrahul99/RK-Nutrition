import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { Mail, ArrowUp, ShieldCheck, CheckCircle2, FlaskConical, Truck, Send, Phone, MapPin } from 'lucide-react';

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
    whatsapp: 'https://wa.me/917452013333'
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
              {isValidUrl(socialLinks.whatsapp || 'https://wa.me/917452013333') && (
                <a
                  href={socialLinks.whatsapp || 'https://wa.me/917452013333'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#141414] border border-[#242424] hover:border-[#25D366] hover:text-[#25D366] text-[#8C8C8C] flex items-center justify-center transition-colors"
                  aria-label="WhatsApp Support"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.75 6.67C8.58 6.67 8.31 6.74 8.08 6.99C7.85 7.24 7.2 7.85 7.2 9.07C7.2 10.29 8.09 11.46 8.21 11.63C8.33 11.8 9.94 14.42 12.48 15.42C14.07 16.05 14.75 15.93 15.35 15.82C16.05 15.69 17.1 14.83 17.33 14.18C17.56 13.53 17.56 12.98 17.49 12.86C17.42 12.74 17.25 12.67 16.99 12.54C16.74 12.42 15.49 11.8 15.26 11.72C15.03 11.64 14.87 11.6 14.7 11.85C14.53 12.1 14.06 12.67 13.91 12.84C13.77 13.01 13.62 13.03 13.37 12.91C13.12 12.78 12.31 12.52 11.36 11.67C10.62 11.01 10.12 10.19 9.98 9.94C9.83 9.69 9.96 9.55 10.09 9.42C10.2 9.31 10.34 9.13 10.46 8.99C10.59 8.84 10.63 8.74 10.71 8.57C10.79 8.41 10.75 8.26 10.69 8.14C10.63 8.01 10.16 6.87 9.97 6.4C9.78 5.95 9.58 6.01 9.43 6C9.29 6 9.12 6 8.95 6C8.78 6 8.75 6.67 8.75 6.67Z"/>
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

            <div className="p-3.5 bg-[#121212] border border-[#1F1F1F] space-y-2.5 text-xs font-mono">
              <div className="flex items-start gap-2 text-[#8C8C8C]">
                <MapPin className="w-3.5 h-3.5 text-[#E11D2E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#F5F4F2] font-semibold block text-[11px] uppercase">Marketed By / Head Office</span>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Patparganj+Industrial+Area+Delhi+110092" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-[#E11D2E] text-[11px] leading-relaxed transition-colors block text-[#8C8C8C]"
                  >
                    A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#8C8C8C] pt-0.5">
                <Phone className="w-3.5 h-3.5 text-[#E11D2E] shrink-0" />
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <a href="tel:+918630663134" className="hover:text-[#E11D2E] transition-colors font-bold text-[#F5F4F2]">
                    +91 86306 63134
                  </a>
                  <span className="text-[#444444]">•</span>
                  <a href="tel:+917452013333" className="hover:text-[#E11D2E] transition-colors font-bold text-[#F5F4F2]">
                    +91 74520 13333
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#8C8C8C]">
                <Mail className="w-3.5 h-3.5 text-[#E11D2E] shrink-0" />
                <a href="mailto:Kuldeeprajput5262@gmail.com" className="hover:text-[#E11D2E] transition-colors text-[11px] break-all">
                  Kuldeeprajput5262@gmail.com
                </a>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#1C1C1C] text-[10px] text-[#666666]">
                <span>Mon–Sat: 09:00–19:00 IST</span>
                <a 
                  href="https://wa.me/917452013333" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#25D366] hover:underline font-bold"
                >
                  WhatsApp: 7452013333
                </a>
              </div>
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
