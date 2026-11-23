import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConfirmation } from '../../context/ConfirmationContext';
import { 
  LayoutDashboard, 
  Package,
  Layers,
  Boxes,
  ClipboardList,
  CreditCard,
  Tag,
  MessageSquare,
  BarChart3,
  Sliders, 
  User, 
  LogOut, 
  X,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const STORE_NAV_ITEMS = [
  { label: 'Store Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Categories', path: '/admin/categories', icon: Layers },
  { label: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes },
  { label: 'Orders & Shipping', path: '/admin/orders', icon: ClipboardList },
  { label: 'Payment Rules', path: '/admin/payments', icon: CreditCard },
  { label: 'Offers & Coupons', path: '/admin/discounts', icon: Tag },
  { label: 'Customer Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  { label: 'Sales Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Store Settings', path: '/admin/store-settings', icon: Sliders },
  { label: 'Store Profile', path: '/admin/profile', icon: User },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const { logout, adminUser, isSuperAdmin } = useAuth();
  const { confirm } = useConfirmation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Sign Out of Store Admin?',
      message: 'Are you sure you want to sign out of the store operations dashboard?',
      confirmText: 'Sign Out',
      cancelText: 'Stay Signed In',
      variant: 'danger',
      icon: LogOut
    });
    if (confirmed) {
      logout();
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#111111] border-r border-[#242424] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: Brand Identity */}
        <div>
          <div className="h-16 px-6 border-b border-[#242424] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img 
                src="/images/RK%20Nutrition%20Logo.png" 
                alt="RK Nutrition" 
                className="h-8 w-auto object-contain" 
              />
              <span className="text-[10px] font-mono tracking-widest text-[#8C8C8C] uppercase bg-[#181818] border border-[#262626] px-1.5 py-0.5">
                Admin
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#1E1E1E]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Super Admin Switcher (Visible only if user has SUPER_ADMIN role) */}
          {isSuperAdmin && (
            <div className="p-3 mx-3 my-2 bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[11px] font-mono text-[#E2E8F0] uppercase font-semibold">Dev Super Admin</span>
              </div>
              <Link 
                to="/super-admin"
                className="text-[10px] font-mono uppercase bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] px-2 py-1 flex items-center gap-1 transition-colors"
              >
                <span>Console</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#5A5A5A]">
              Store Management
            </div>
            {STORE_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold uppercase tracking-wider transition-all relative
                    ${isActive 
                      ? 'bg-[#1C1C1C] text-[#F5F4F2] border-l-2 border-[#E11D2E] shadow-inner' 
                      : 'text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#161616]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#E11D2E]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel: Store Owner details & Logout */}
        <div className="p-4 border-t border-[#242424] space-y-3 bg-[#0F0F0F]">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 bg-[#202020] border border-[#2D2D2D] text-[#E11D2E] font-heading font-bold text-xs flex items-center justify-center">
              {adminUser?.avatarInitials || 'SO'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-heading font-bold text-[#F5F4F2] truncate uppercase">
                {adminUser?.name || 'Store Owner'}
              </span>
              <span className="text-[10px] font-mono text-[#8C8C8C] truncate">
                {adminUser?.role === 'SUPER_ADMIN' ? 'Developer / Store Admin' : 'Store Administrator'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#171717] hover:bg-[#202020] border border-[#262626] hover:border-[#E11D2E]/60 text-xs font-heading font-semibold uppercase tracking-wider text-[#F5F4F2] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E11D2E]" />
            <span>Sign Out</span>
          </button>

          <div className="text-center text-[10px] font-mono text-[#4A4A4A]">
            Client Store Admin • v2.0
          </div>
        </div>
      </aside>
    </>
  );
}
