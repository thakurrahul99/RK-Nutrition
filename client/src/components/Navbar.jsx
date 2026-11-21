import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({
  onOpenSearch,
  onOpenMobileMenu,
  isMobileMenuOpen,
  onCartClick
}) {
  const [scrolled, setScrolled] = useState(false);
  const { name } = brandConfig;
  const { content } = useContent();
  const { openCart, itemCount } = useCart();
  const { openWishlist, wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const configuredNav = content?.navigation?.headerLinks;
  const navItems = Array.isArray(configuredNav) && configuredNav.length > 0
    ? configuredNav.filter((item) => item.visible !== false)
    : [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: 'Categories', path: '/categories' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' }
      ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#111111]/95 backdrop-blur-md border-b border-[#262626] shadow-xl shadow-black/40 py-3.5'
          : 'bg-[#111111] border-b border-[#1E1E1E] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 min-[360px]:px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Brand Wordmark (Always navigates to Home) */}
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8202B] text-left"
            aria-label={`${name} Home`}
          >
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#1A1A1A] border border-[#2E2E2E] group-hover:border-[#C8202B] transition-colors relative overflow-hidden">
              <span className="font-heading font-black text-xl text-[#F5F4F2] tracking-tighter">
                RK
              </span>
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#C8202B]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading font-bold text-[15px] min-[360px]:text-base sm:text-2xl text-[#F5F4F2] tracking-[0.04em] sm:tracking-wider uppercase leading-none whitespace-nowrap transition-colors">
                RK <span className="text-[#C8202B]">NUTRITION</span>
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.12em] sm:tracking-widest text-[#8C8C8C] uppercase font-semibold mt-0.5">
                SPORTS NUTRITION
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `relative font-heading text-sm lg:text-base tracking-widest uppercase transition-colors py-1 group ${
                    isActive ? 'text-[#F5F4F2] font-bold' : 'text-[#F5F4F2]/75 hover:text-[#F5F4F2]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#C8202B] transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Utility Icons & CTAs */}
          <div className="flex items-center gap-0.5 min-[360px]:gap-1 sm:gap-3">
            
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Open search interface"
              className="p-1.5 sm:p-2.5 text-[#F5F4F2]/80 hover:text-[#F5F4F2] hover:bg-[#1C1C1C] transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8202B] cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Saved Formulations / Wishlist Trigger */}
            <button
              type="button"
              onClick={openWishlist}
              aria-label={`View saved items (${wishlistCount})`}
              className="p-2.5 text-[#F5F4F2]/80 hover:text-[#F5F4F2] hover:bg-[#1C1C1C] transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8202B] cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-[#C8202B] fill-[#C8202B]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#C8202B] text-[#F5F4F2] text-[10px] font-mono font-bold px-1 rounded-full flex items-center justify-center border border-[#111111]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account icon is desktop-only; its hover portal dropdown is not mobile-friendly */}
            <div className="relative group hidden sm:block">
              <button
                type="button"
                aria-label="Account portals and customer desk"
                className="p-2.5 text-[#F5F4F2]/80 hover:text-[#F5F4F2] hover:bg-[#1C1C1C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8202B] cursor-pointer"
              >
                <User className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 bg-[#161616] border border-[#2E2E2E] p-3 text-xs text-[#8C8C8C] whitespace-nowrap shadow-2xl font-mono space-y-2">
                <span className="text-[#F5F4F2] font-bold block uppercase font-heading text-sm border-b border-[#262626] pb-1.5">
                  RK Account Access
                </span>
                <div className="flex flex-col gap-1.5 text-xs">
                  <Link to="/admin" className="hover:text-[#C8202B] transition-colors py-1">
                    Store Manager Console →
                  </Link>
                  <Link to="/super-admin" className="hover:text-[#C8202B] transition-colors py-1">
                    Developer CMS Console →
                  </Link>
                  <Link to="/contact" className="hover:text-[#C8202B] transition-colors py-1 text-[#666666]">
                    Customer Help Desk
                  </Link>
                </div>
              </div>
            </div>

            {/* Cart Icon & Counter Badge */}
            <button
              type="button"
              onClick={openCart || onCartClick}
              aria-label={`View shopping bag with ${itemCount} items`}
              className="p-2.5 text-[#F5F4F2]/80 hover:text-[#F5F4F2] hover:bg-[#1C1C1C] transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8202B] cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#C8202B] text-[#F5F4F2] text-[10px] font-mono font-bold px-1 rounded-full flex items-center justify-center border border-[#111111]">
                  {itemCount}
                </span>
              ) : (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#444444] rounded-full" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden p-2.5 text-[#F5F4F2] hover:bg-[#1C1C1C] border border-[#282828] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8202B]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
