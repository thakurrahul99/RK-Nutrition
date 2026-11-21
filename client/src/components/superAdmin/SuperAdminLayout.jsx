import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminHeader from './SuperAdminHeader';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function SuperAdminLayout() {
  const { isAuthenticated, isSuperAdmin, isLoading } = useAuth();
  const { toast } = useContent();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If session is verifying with backend
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center font-mono text-xs text-[#38BDF8]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#38BDF8] animate-ping rounded-full" />
          <span>Validating Super Admin Developer Credentials...</span>
        </div>
      </div>
    );
  }

  // Strict role guard: MUST be authenticated AND have role === 'SUPER_ADMIN'
  if (!isAuthenticated || !isSuperAdmin) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-[#E2E8F0] flex font-body">
      {/* Super Admin Developer Sidebar */}
      <SuperAdminSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Developer Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <SuperAdminHeader 
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Real-time System Toast Feedback */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F172A] border border-[#1E293B] shadow-2xl text-xs font-mono text-[#F1F5F9] animate-bounce-short"
        >
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#38BDF8] shrink-0" />}
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />}
          <span className="max-w-xs">{toast.message}</span>
        </aside>
      )}
    </div>
  );
}
