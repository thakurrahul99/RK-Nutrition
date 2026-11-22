import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

const ROUTE_TITLES = {
  '/admin': 'Store Operations Dashboard',
  '/admin/products': 'Product Management',
  '/admin/products/new': 'Add New Product',
  '/admin/inventory': 'Inventory & Stock Matrix',
  '/admin/orders': 'Orders & Fulfillment',
  '/admin/payments': 'Payment Methods & Rules',
  '/admin/discounts': 'Coupons & Promotional Offers',
  '/admin/inquiries': 'Customer Inquiries & Messages',
  '/admin/reports': 'Sales & Performance Reports',
  '/admin/store-settings': 'Store Logistics & Settings',
  '/admin/profile': 'Administrator Profile & Security'
};

export default function AdminHeader({ onToggleMobileSidebar }) {
  const { adminUser, isSuperAdmin } = useAuth();
  const location = useLocation();
  
  let currentTitle = ROUTE_TITLES[location.pathname];
  if (!currentTitle && location.pathname.includes('/admin/products/') && location.pathname.includes('/edit')) {
    currentTitle = 'Edit Product';
  }
  if (!currentTitle) currentTitle = 'Store Operations';

  return (
    <header className="sticky top-0 z-30 bg-[#141414]/95 backdrop-blur-md border-b border-[#242424] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#1E1E1E] transition-colors focus:outline-none"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#8C8C8C]">
          <span className="text-[#E11D2E] font-bold uppercase tracking-wider">Store Admin</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#4A4A4A]" />
          <span className="text-[#F5F4F2] font-heading font-medium tracking-wide uppercase truncate max-w-[160px] sm:max-w-none">
            {currentTitle}
          </span>
        </div>
      </div>

      {/* Right: Server Status, Live Site Link, and Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Super Admin developer badge if applicable */}
        {isSuperAdmin && (
          <Link
            to="/super-admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0F172A] border border-[#1E293B] text-[11px] font-mono text-[#38BDF8] hover:bg-[#1E293B] transition-colors"
            title="Switch to Super Admin Developer Console"
          >
            <Cpu className="w-3 h-3 text-[#38BDF8]" />
            <span>Dev Console</span>
          </Link>
        )}

        {/* Server Sync Indicator */}
        <div 
          className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#2B2B2B] text-xs font-mono text-[#8C8C8C]"
          title="Connected to RK Nutrition Express backend on port 5000"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#4CAF50]" />
          <span>API: <span className="text-[#4CAF50] font-semibold">Online</span></span>
        </div>

        {/* View Public Website */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] hover:border-[#E11D2E]/60 text-xs font-heading font-semibold uppercase tracking-wider text-[#F5F4F2] transition-colors"
          title="Open public website in a new tab"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8C8C8C]" />
        </Link>

        {/* Admin User Pill */}
        <Link
          to="/admin/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2B2B2B] transition-colors group"
        >
          <div className="w-6 h-6 rounded-none bg-[#E11D2E] text-[#F5F4F2] font-heading font-bold text-xs flex items-center justify-center">
            {adminUser?.avatarInitials || 'SO'}
          </div>
          <span className="hidden sm:inline text-xs font-heading font-semibold text-[#F5F4F2] uppercase tracking-wider group-hover:text-[#E11D2E] transition-colors">
            {adminUser?.name?.split(' ')[0] || 'Owner'}
          </span>
        </Link>
      </div>
    </header>
  );
}
