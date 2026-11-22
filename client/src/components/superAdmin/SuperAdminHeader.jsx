import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  ExternalLink, 
  ChevronRight,
  Activity,
  ShoppingBag
} from 'lucide-react';

const DEV_TITLES = {
  '/super-admin': 'Developer System Overview',
  '/super-admin/homepage': 'Homepage Section Engine',
  '/super-admin/pages': 'Informational Pages & FAQ Editor',
  '/super-admin/branding': 'Brand System & CSS Design Tokens',
  '/super-admin/navigation': 'Navigation & Link Registry',
  '/super-admin/config': 'Technical Configuration & Secrets',
  '/super-admin/profile': 'Super Admin Authentication & Keys'
};

export default function SuperAdminHeader({ onToggleMobileSidebar }) {
  const { adminUser } = useAuth();
  const location = useLocation();

  let currentTitle = DEV_TITLES[location.pathname] || 'Developer Console';

  return (
    <header className="sticky top-0 z-30 bg-[#0A0E17]/95 backdrop-blur-md border-b border-[#1E293B] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B] transition-colors focus:outline-none"
          aria-label="Open developer sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#94A3B8]">
          <span className="text-[#38BDF8] font-bold uppercase tracking-wider">Super Admin</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#475569]" />
          <span className="text-[#F1F5F9] font-medium tracking-wide truncate max-w-[160px] sm:max-w-none">
            {currentTitle}
          </span>
        </div>
      </div>

      {/* Right: Server Status, Switch to Client Admin, Live Store */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Backend API Status Indicator */}
        <div 
          className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#0F172A] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8]"
          title="Direct link to local Express API daemon"
        >
          <Activity className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
          <span>API 5000: <strong className="text-[#10B981]">ONLINE</strong></span>
        </div>

        {/* Switch to Client Admin */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-xs font-mono uppercase tracking-wider text-[#F1F5F9] transition-colors"
          title="Switch to Store Operations Admin Panel"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#E11D2E]" />
          <span className="hidden sm:inline">Store Admin</span>
        </Link>

        {/* Public Storefront */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
          title="Open live customer store in new tab"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Super Admin Pill */}
        <Link
          to="/super-admin/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1 bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] transition-colors group"
        >
          <div className="w-6 h-6 rounded-none bg-[#38BDF8] text-[#0A0E17] font-mono font-bold text-xs flex items-center justify-center">
            {adminUser?.avatarInitials || 'DEV'}
          </div>
          <span className="hidden sm:inline text-xs font-mono text-[#F1F5F9] uppercase tracking-wider group-hover:text-[#38BDF8] transition-colors">
            {adminUser?.name || 'Developer'}
          </span>
        </Link>
      </div>
    </header>
  );
}
