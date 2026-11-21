import { Link } from 'react-router-dom';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const { footer, name, tagline } = brandConfig;
  const { content } = useContent();
  const currentYear = new Date().getFullYear();

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
        { label: 'Contact', path: '/contact' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Shipping & Returns', path: '/shipping-policy' }
      ];

  const socialLinks = content?.navigation?.socialLinks || {
    instagram: 'https://instagram.com/rknutrition',
    youtube: 'https://youtube.com/@rknutrition',
    twitter: 'https://x.com/rknutrition',
    whatsapp: ''
  };

  return (
    <footer id="contact-footer" className="bg-[#0C0C0C] border-t border-[#222222] text-[#F5F4F2]">
      
      {/* Upper Footer: Brand & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#161616] border border-[#282828] group-hover:border-[#C8202B] transition-colors flex items-center justify-center relative overflow-hidden">
                <span className="font-heading font-black text-xl text-[#F5F4F2]">RK</span>
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#C8202B]" />
              </div>
              <span className="font-heading font-black text-2xl text-[#F5F4F2] tracking-wider uppercase">
                RK <span className="text-[#C8202B]">NUTRITION</span>
              </span>
            </Link>

            <p className="font-heading text-lg text-[#C8202B] uppercase tracking-wider font-semibold">
              {tagline}
            </p>

            <p className="text-sm text-[#8C8C8C] leading-relaxed max-w-md font-body">
              {footer.description}
            </p>

            {/* Configured Social Media Channels */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#181818] border border-[#2A2A2A] hover:border-[#C8202B] hover:text-[#C8202B] text-[#8C8C8C] flex items-center justify-center transition-colors"
                  aria-label="Follow RK Nutrition on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#181818] border border-[#2A2A2A] hover:border-[#C8202B] hover:text-[#C8202B] text-[#8C8C8C] flex items-center justify-center transition-colors"
                  aria-label="Subscribe to RK Nutrition on YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#181818] border border-[#2A2A2A] hover:border-[#C8202B] hover:text-[#C8202B] text-[#8C8C8C] flex items-center justify-center transition-colors"
                  aria-label="Follow RK Nutrition on X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {socialLinks.whatsapp && (
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#181818] border border-[#2A2A2A] hover:border-[#C8202B] hover:text-[#C8202B] text-[#8C8C8C] flex items-center justify-center transition-colors"
                  aria-label="Contact RK Nutrition on WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              )}
            </div>

            <div className="pt-2 text-xs font-mono text-[#5A5A5A] uppercase tracking-widest">
              OFFICIAL SPORTS NUTRITION // 100% PURE FORMULATIONS
            </div>
          </div>

          {/* Dedicated Navigation Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-lg uppercase tracking-wider text-[#F5F4F2] font-bold border-b border-[#222222] pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 font-heading text-base tracking-wider uppercase">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-[#8C8C8C] hover:text-[#C8202B] transition-colors inline-flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="w-1 h-1 bg-[#444444] group-hover:bg-[#C8202B] transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-heading text-lg uppercase tracking-wider text-[#F5F4F2] font-bold border-b border-[#222222] pb-2">
              Inquiries & Contact
            </h4>
            <p className="text-sm text-[#8C8C8C] leading-relaxed font-body">
              For direct partnership, athletic, or general brand inquiries, reach out through our official correspondence desk:
            </p>

            <div className="p-4 bg-[#141414] border border-[#242424] space-y-2">
              <div className="flex items-center gap-2.5 text-xs text-[#8C8C8C] font-mono">
                <Mail className="w-4 h-4 text-[#C8202B]" />
                <span>OFFICIAL INBOX:</span>
              </div>
              <a
                href="mailto:contact@rknutrition.com"
                className="font-heading text-base text-[#F5F4F2] hover:text-[#C8202B] tracking-wider transition-colors block"
              >
                contact@rknutrition.com
              </a>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono">
                <Link
                  to="/contact"
                  className="text-[#C8202B] hover:text-[#F5F4F2] uppercase block"
                >
                  Contact Page →
                </Link>
                <span className="text-[#333333]">|</span>
                <Link
                  to="/faq"
                  className="text-[#8C8C8C] hover:text-[#F5F4F2] uppercase block"
                >
                  FAQ →
                </Link>
              </div>
            </div>

            <div className="text-xs text-[#5A5A5A] pt-1 font-mono">
              Operating Schedule: Mon–Fri, 09:00–18:00 IST
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright, Legal & Back to Top */}
      <div className="border-t border-[#1C1C1C] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666] font-mono">
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© {currentYear} {name}. ALL RIGHTS RESERVED.</span>
            <Link
              to="/privacy-policy"
              className="hover:text-[#F5F4F2] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-[#F5F4F2] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/admin"
              className="hover:text-[#C8202B] underline underline-offset-4 transition-colors text-[#555555]"
              title="Restricted Operations Portal"
            >
              Admin Console
            </Link>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 hover:text-[#F5F4F2] transition-colors cursor-pointer group"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

        </div>
      </div>

    </footer>
  );
}
