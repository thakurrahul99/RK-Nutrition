import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, Search, ShoppingBag, Heart, ArrowRight, User, Package, LogOut } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function MobileMenu({
  isOpen,
  onClose,
  onOpenSearch,
  onCartClick
}) {
  const { content } = useContent();
  const { openCart, itemCount } = useCart();
  const { openWishlist, wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
    { label: 'Learn', path: '/learn' },
    { label: 'Contact', path: '/contact' }
  ];

  const configuredNav = content?.navigation?.headerLinks;
  const visibleConfigured = Array.isArray(configuredNav)
    ? configuredNav.filter((item) => item && item.visible !== false && (item.path || item.href))
    : [];

  // Fallback to defaultNavItems if configured navigation has fewer than 3 items
  const rawNavItems = visibleConfigured.length >= 3 ? visibleConfigured : defaultNavItems;

  // Normalize paths and labels
  const navItems = rawNavItems.map((item) => ({
    label: item.label,
    path: item.path || item.href || '/'
  }));

  // Ensure Learn is present in the list
  if (!navItems.some((i) => i.path === '/learn' || i.label?.toLowerCase() === 'learn')) {
    const contactIdx = navItems.findIndex((i) => i.path === '/contact' || i.label?.toLowerCase() === 'contact');
    const learnItem = { label: 'Learn', path: '/learn' };
    if (contactIdx >= 0) {
      navItems.splice(contactIdx, 0, learnItem);
    } else {
      navItems.push(learnItem);
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-y-0 right-0 w-[88vw] max-w-[340px] bg-[#111111] border-l border-[#262626] flex flex-col h-full shadow-2xl">
        
        {/* Header - Fixed top bar */}
        <div className="shrink-0 p-4 min-[360px]:p-5 pb-4 border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center font-heading font-black text-sm text-[#F5F4F2]">
              RK
            </div>
            <span className="font-heading font-bold text-base min-[360px]:text-lg tracking-wider text-[#F5F4F2]">
              RK <span className="text-[#E11D2E]">NUTRITION</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] bg-[#1A1A1A] border border-[#2E2E2E] focus:outline-none transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Middle Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 min-[360px]:px-5 py-4 space-y-4">
          
          {/* Quick Search Action */}
          <div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#161616] border border-[#262626] hover:border-[#E11D2E]/60 text-left text-xs text-[#8C8C8C] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#E11D2E]" />
                <span>Search formulations...</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#222222] px-2 py-0.5 text-[#F5F4F2]">
                Find
              </span>
            </button>
          </div>

          {/* Navigation Links - Moderate compact font size & touch targets */}
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between py-2.5 px-3 font-heading text-sm min-[360px]:text-[15px] font-semibold tracking-wider uppercase border-b border-[#1E1E1E] transition-all ${
                    isActive
                      ? 'text-[#E11D2E] bg-[#161616] pl-3.5 font-bold border-l-2 border-[#E11D2E]'
                      : 'text-[#F5F4F2]/90 hover:text-[#E11D2E] hover:bg-[#161616]'
                  }`
                }
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#8C8C8C] group-hover:text-[#E11D2E]" />
              </NavLink>
            ))}
          </nav>

          {/* Customer Account Section in Mobile Menu */}
          <div className="pt-3 border-t border-[#262626]">
            {isAuthenticated && user ? (
              <div className="bg-[#161616] border border-[#2E2E2E] p-3 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#222222] border border-[#E11D2E] flex items-center justify-center font-heading font-black text-xs text-[#F5F4F2]">
                    {user.avatarInitials || 'RK'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-heading text-xs text-[#F5F4F2] font-bold uppercase truncate">
                      {user.name}
                    </p>
                    <p className="text-[9px] font-mono text-[#8C8C8C] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#222222]">
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="py-1.5 px-2 bg-[#202020] hover:bg-[#282828] text-center text-[11px] font-mono uppercase text-[#F5F4F2] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <User className="w-3 h-3 text-[#E11D2E]" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/account?tab=orders"
                    onClick={onClose}
                    className="py-1.5 px-2 bg-[#202020] hover:bg-[#282828] text-center text-[11px] font-mono uppercase text-[#F5F4F2] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Package className="w-3 h-3 text-[#E11D2E]" />
                    <span>Orders</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full py-1 text-center text-[11px] font-mono uppercase text-red-400 hover:text-red-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="py-2 bg-[#E11D2E] hover:bg-[#D51F32] text-white font-heading font-bold text-center text-xs uppercase tracking-wider transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] text-[#F5F4F2] font-heading font-bold text-center text-xs uppercase tracking-wider transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Footer Quick Actions: Wishlist & Cart - Fixed bottom bar */}
        <div className="shrink-0 p-4 min-[360px]:p-5 pt-3 border-t border-[#262626] bg-[#111111] space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              openWishlist();
            }}
            className="w-full py-2 bg-[#161616] hover:bg-[#1E1E1E] border border-[#262626] flex items-center justify-between px-3 text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'text-[#E11D2E] fill-[#E11D2E]' : 'text-[#8C8C8C]'}`} />
              <span>Saved Formulations</span>
            </div>
            {wishlistCount > 0 ? (
              <span className="bg-[#E11D2E] text-white text-[10px] px-2 py-0.2 rounded-full font-bold">
                {wishlistCount}
              </span>
            ) : (
              <span className="text-[#666666]">0</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (openCart) openCart();
              else if (onCartClick) onCartClick();
            }}
            className="w-full py-2 bg-[#161616] hover:bg-[#1E1E1E] border border-[#262626] flex items-center justify-between px-3 text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 text-[#E11D2E]" />
              <span>Shopping Cart</span>
            </div>
            {itemCount > 0 ? (
              <span className="bg-[#E11D2E] text-white text-[10px] px-2 py-0.2 rounded-full font-bold">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            ) : (
              <span className="text-[#666666]">Empty</span>
            )}
          </button>

          <div className="text-[9px] font-mono text-[#555555] text-center uppercase tracking-widest pt-0.5">
            RK NUTRITION • ALL RIGHTS RESERVED
          </div>
        </div>

      </div>
    </div>
  );
}
