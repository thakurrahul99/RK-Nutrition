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
    <div 
      className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-y-0 right-0 w-[88vw] max-w-[340px] bg-[#111111] border-l border-[#262626] flex flex-col justify-between p-4 min-[360px]:p-5 shadow-2xl">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center font-heading font-black text-sm text-[#F5F4F2]">
                RK
              </div>
              <span className="font-heading font-bold text-lg tracking-wider text-[#F5F4F2]">
                RK <span className="text-[#C8202B]">NUTRITION</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-[#8C8C8C] hover:text-[#F5F4F2] bg-[#1A1A1A] border border-[#2E2E2E] focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Action */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#C8202B] text-left text-sm text-[#8C8C8C] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#C8202B]" />
                Search formulations & specs...
              </span>
              <span className="text-xs font-mono uppercase bg-[#242424] px-2 py-0.5 text-[#F5F4F2]">
                Find
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between py-3 px-3 font-heading text-lg tracking-wider uppercase border-b border-[#1E1E1E] transition-all ${
                    isActive
                      ? 'text-[#C8202B] bg-[#161616] pl-4 font-bold border-l-2 border-[#C8202B]'
                      : 'text-[#F5F4F2] hover:text-[#C8202B] hover:bg-[#161616]'
                  }`
                }
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100" />
              </NavLink>
            ))}
          </nav>

          {/* Customer Account Section in Mobile Menu */}
          <div className="mt-6 pt-4 border-t border-[#262626]">
            {isAuthenticated && user ? (
              <div className="bg-[#161616] border border-[#2E2E2E] p-3 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#222222] border border-[#C8202B] flex items-center justify-center font-heading font-black text-sm text-[#F5F4F2]">
                    {user.avatarInitials || 'RK'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-heading text-sm text-[#F5F4F2] font-bold uppercase truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-mono text-[#8C8C8C] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#222222]">
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="py-1.5 px-2 bg-[#202020] hover:bg-[#282828] text-center text-xs font-mono uppercase text-[#F5F4F2] flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-[#C8202B]" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/account?tab=orders"
                    onClick={onClose}
                    className="py-1.5 px-2 bg-[#202020] hover:bg-[#282828] text-center text-xs font-mono uppercase text-[#F5F4F2] flex items-center justify-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5 text-[#C8202B]" />
                    <span>Orders</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full py-1 text-center text-xs font-mono uppercase text-red-400 hover:text-red-300 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="py-2.5 bg-[#C8202B] hover:bg-[#D51F32] text-white font-heading font-bold text-center text-xs uppercase tracking-wider transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="py-2.5 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] text-[#F5F4F2] font-heading font-bold text-center text-xs uppercase tracking-wider transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer Quick Actions: Wishlist & Cart */}
        <div className="pt-5 border-t border-[#262626] space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              openWishlist();
            }}
            className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] flex items-center justify-between px-4 text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-[#C8202B] fill-[#C8202B]' : 'text-[#8C8C8C]'}`} />
              <span>Saved Formulations</span>
            </div>
            {wishlistCount > 0 ? (
              <span className="bg-[#C8202B] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
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
              else onCartClick();
            }}
            className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] flex items-center justify-between px-4 text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C8202B]" />
              <span>Shopping Cart</span>
            </div>
            {itemCount > 0 ? (
              <span className="bg-[#C8202B] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            ) : (
              <span className="text-[#666666]">Empty</span>
            )}
          </button>

          <div className="text-[10px] font-mono text-[#555555] text-center uppercase tracking-widest pt-1">
            RK NUTRITION // ALL RIGHTS RESERVED
          </div>
        </div>

      </div>
    </div>
  );
}
