import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Heart, LogOut, Package, MapPin } from 'lucide-react';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

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
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];
  const configuredNav = content?.navigation?.headerLinks;
  const visibleConfigured = Array.isArray(configuredNav)
    ? configuredNav.filter((item) => item.visible !== false && item.path !== '/learn' && item.label?.toLowerCase() !== 'learn')
    : [];
  const rawNavItems = visibleConfigured.length >= 2 ? visibleConfigured : defaultNavItems;
  const navItems = rawNavItems.filter((item) => item.path !== '/learn' && item.label?.toLowerCase() !== 'learn');

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#111111]/95 backdrop-blur-md border-b border-[#262626] shadow-xl shadow-black/40 py-2 sm:py-3.5'
          : 'bg-[#111111] border-b border-[#1E1E1E] py-2.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 min-[360px]:px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Brand Logo (Always navigates to Home) */}
          <Link
            to="/"
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] text-left shrink-0 py-0.5"
            aria-label={`${name} Home`}
          >
            <img 
              src="/images/RK%20Nutrition%20Logo.png" 
              alt={name} 
              className="h-8 min-[360px]:h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105" 
            />
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
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#E11D2E] transition-all duration-300 ${
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
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#F5F4F2]/80 hover:text-[#F5F4F2] hover:bg-[#1C1C1C] transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Saved Formulations / Wishlist Trigger */}
            <button
              type="button"
              onClick={openWishlist}
              aria-label={`View saved items (${wishlistCount})`}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#F5F4F2]/80 hover:text-[#F5F4F2] hover:bg-[#1C1C1C] transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-[#E11D2E] fill-[#E11D2E]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#E11D2E] text-[#F5F4F2] text-[10px] font-mono font-bold px-1 rounded-full flex items-center justify-center border border-[#111111] animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Icon & Portal Dropdown */}
            <div className="relative group hidden sm:block">
              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={() => navigate('/account')}
                  aria-label="Athlete Account"
                  className="flex items-center gap-2 p-1.5 hover:bg-[#1C1C1C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-none bg-[#1A1A1A] border border-[#E11D2E] flex items-center justify-center font-heading font-black text-xs text-[#F5F4F2] shadow-sm">
                    {user.avatarInitials || 'RK'}
                  </div>
                </button>
              ) : (
                <Link
                  to="/login"
                  aria-label="Customer Sign In"
                  className="p-2.5 text-[#F5F4F2]/80 hover:text-[#F5F4F2] hover:bg-[#1C1C1C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] cursor-pointer inline-flex items-center justify-center"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block z-50 bg-[#161616] border border-[#2E2E2E] p-3 text-xs text-[#8C8C8C] whitespace-nowrap shadow-2xl font-mono space-y-2 min-w-[200px]">
                {isAuthenticated && user ? (
                  <>
                    <div className="border-b border-[#262626] pb-2">
                      <span className="text-[#F5F4F2] font-bold block uppercase font-heading text-sm truncate max-w-[180px]">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-[#E11D2E] uppercase tracking-wider block font-semibold">
                        {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'CLIENT_ADMIN' ? 'Store Manager' : 'Athlete Account'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <Link to="/account" className="hover:text-[#F5F4F2] hover:bg-[#1F1F1F] px-2 py-1.5 transition-colors flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#E11D2E]" />
                        <span>My Account</span>
                      </Link>
                      <Link to="/account?tab=orders" className="hover:text-[#F5F4F2] hover:bg-[#1F1F1F] px-2 py-1.5 transition-colors flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-[#E11D2E]" />
                        <span>My Orders</span>
                      </Link>
                      <Link to="/account?tab=addresses" className="hover:text-[#F5F4F2] hover:bg-[#1F1F1F] px-2 py-1.5 transition-colors flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#E11D2E]" />
                        <span>Saved Addresses</span>
                      </Link>

                      <div className="pt-1 border-t border-[#262626] mt-1">
                        <button
                          type="button"
                          onClick={logout}
                          className="w-full text-left text-red-400 hover:text-red-300 px-2 py-1.5 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-[#F5F4F2] font-bold block uppercase font-heading text-sm border-b border-[#262626] pb-1.5">
                      Customer Access
                    </span>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <Link
                        to="/login"
                        className="w-full py-1.5 px-3 bg-[#E11D2E] hover:bg-[#C81A27] text-white font-bold text-center uppercase tracking-wider transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="w-full py-1.5 px-3 bg-[#1F1F1F] hover:bg-[#252525] border border-[#2E2E2E] text-[#F5F4F2] text-center uppercase tracking-wider transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cart Icon & Counter Badge */}
            <button
              type="button"
              onClick={openCart || onCartClick}
              aria-label={`View shopping bag with ${itemCount} items`}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#F5F4F2]/80 hover:text-[#F5F4F2] hover:bg-[#1C1C1C] transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 ? (
                <span className="absolute top-1 right-1 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D2E] opacity-35 pointer-events-none" />
                  <span className="relative min-w-[18px] h-[18px] bg-gradient-to-br from-[#E11D2E] to-[#B91422] text-[#F5F4F2] text-[10px] font-mono font-bold px-1 rounded-full flex items-center justify-center border border-[#111111] shadow-sm shadow-[#E11D2E]/40 animate-scale-in">
                    {itemCount}
                  </span>
                </span>
              ) : (
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#444444] rounded-full" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[#F5F4F2] hover:bg-[#1C1C1C] border border-[#282828] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
