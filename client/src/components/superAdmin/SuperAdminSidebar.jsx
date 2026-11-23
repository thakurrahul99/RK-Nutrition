import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Terminal, 
  LayoutTemplate, 
  FileCode2, 
  Palette, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  LogOut, 
  X,
  ShoppingBag
} from 'lucide-react';

const DEV_NAV_ITEMS = [
  { label: 'Developer Console', path: '/super-admin', icon: Terminal, end: true },
  { label: 'Homepage Engine', path: '/super-admin/homepage', icon: LayoutTemplate },
  { label: 'Pages & Content', path: '/super-admin/pages', icon: FileCode2 },
  { label: 'Branding & Theme', path: '/super-admin/branding', icon: Palette },
  { label: 'Site Navigation', path: '/super-admin/navigation', icon: Compass },
  { label: 'Advanced Config', path: '/super-admin/config', icon: Cpu },
  { label: 'Developer Profile', path: '/super-admin/profile', icon: ShieldCheck },
];

export default function SuperAdminSidebar({ isOpen, onClose }) {
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/super-admin/login', { replace: true });
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A0E17] border-r border-[#1E293B] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Header: Developer Identity */}
          <div className="h-16 px-6 border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0F172A] border border-[#38BDF8]/40 flex items-center justify-center relative shadow-sm">
                <Terminal className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-sm tracking-wider uppercase text-[#F1F5F9]">
                  SUPER <span className="text-[#38BDF8]">ADMIN</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase -mt-0.5">
                  Developer Engine
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Switch to Store Admin */}
          <div className="p-3 mx-3 my-2 bg-[#1E293B]/60 border border-[#334155] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#E11D2E]" />
              <span className="text-[11px] font-mono text-[#E2E8F0] uppercase font-semibold">Client Store</span>
            </div>
            <Link 
              to="/admin"
              className="text-[10px] font-mono uppercase bg-[#E11D2E]/20 hover:bg-[#E11D2E]/30 text-[#F87171] px-2 py-1 flex items-center gap-1 transition-colors"
            >
              <span>Store Admin →</span>
            </Link>
          </div>

          {/* Developer Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
              System Modules
            </div>
            {DEV_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono font-medium tracking-wide transition-all relative
                    ${isActive 
                      ? 'bg-[#0F172A] text-[#38BDF8] border-l-2 border-[#38BDF8] shadow-inner font-semibold' 
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0F172A]/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#38BDF8]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel: Developer Profile & Logout */}
        <div className="p-4 border-t border-[#1E293B] space-y-3 bg-[#07090E]">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 bg-[#0F172A] border border-[#38BDF8]/30 text-[#38BDF8] font-mono font-bold text-xs flex items-center justify-center">
              DEV
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-mono font-bold text-[#F1F5F9] truncate uppercase">
                {adminUser?.name || 'Developer'}
              </span>
              <span className="text-[10px] font-mono text-[#38BDF8] truncate">
                SUPER_ADMIN (Root)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#38BDF8]/60 text-xs font-mono uppercase tracking-wider text-[#F1F5F9] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Terminate Session</span>
          </button>

          <div className="text-center text-[10px] font-mono text-[#475569]">
            RK Super Admin Core • v2.0
          </div>
        </div>
      </aside>
    </>
  );
}
