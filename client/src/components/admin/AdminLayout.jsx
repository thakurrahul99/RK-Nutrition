import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, isClientAdmin, isLoading } = useAuth();
  const { toast } = useContent();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If session is verifying with backend
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center font-mono text-xs text-[#8C8C8C]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#C8202B] animate-ping rounded-full" />
          <span>Verifying Store Administration Credentials...</span>
        </div>
      </div>
    );
  }

  // Strict role guard: must be authenticated and have CLIENT_ADMIN or SUPER_ADMIN role
  if (!isAuthenticated || !isClientAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F4F2] flex font-body">
      {/* Sidebar Navigation */}
      <AdminSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Administrative Surface */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader 
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Real-time Administrative Toast Feedback */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#181818] border border-[#2E2E2E] shadow-2xl text-xs font-mono text-[#F5F4F2] animate-bounce-short"
        >
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#C8202B] shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#2196F3] shrink-0" />}
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#4CAF50] shrink-0" />}
          <span className="max-w-xs">{toast.message}</span>
        </aside>
      )}
    </div>
  );
}
