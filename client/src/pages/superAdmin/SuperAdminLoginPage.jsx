import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, Terminal, ShoppingBag } from 'lucide-react';
import RKWatermark from '../../components/common/RKWatermark';

export default function SuperAdminLoginPage() {
  const { login, isAuthenticated, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated with super admin permissions, redirect to /super-admin
  if (isAuthenticated && isSuperAdmin) {
    return <Navigate to="/super-admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password, 'SUPER');
    if (result.success) {
      navigate('/super-admin');
    } else {
      setError(result.error || 'Access Denied: Invalid developer credentials or unauthorized role.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#07090E] text-[#E2E8F0] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden font-mono">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#38BDF8_1px,transparent_1px),linear-gradient(to_bottom,#38BDF8_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#38BDF8]/[0.05] rounded-full blur-[140px]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[420px] opacity-5">
          <RKWatermark className="w-full h-auto" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card Box */}
        <div className="bg-[#0A0E17] border border-[#1E293B] p-5 sm:p-8 shadow-2xl relative">
          {/* Cyan Top Bar Indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#38BDF8]" />

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0F172A] border border-[#38BDF8]/40 mb-4 shadow-lg">
              <Terminal className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <h1 className="font-heading text-2xl uppercase tracking-wider text-[#F1F5F9] font-black">
              SUPER <span className="text-[#38BDF8]">ADMIN</span>
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1 font-mono uppercase tracking-widest">
              Developer & System Console
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 bg-[#F43F5E]/10 border border-[#F43F5E]/40 text-[#F1F5F9] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2">
                Developer Identity (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@rknutrition.com"
                  required
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] focus:outline-none pl-10 pr-3 py-2.5 text-xs text-[#F1F5F9] placeholder-[#475569] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2">
                Root Developer Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] focus:outline-none pl-10 pr-10 py-2.5 text-xs text-[#F1F5F9] placeholder-[#475569] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F1F5F9] p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:opacity-50 text-[#0A0E17] font-mono uppercase text-xs tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#38BDF8]/20"
            >
              <span>{isSubmitting ? 'Authenticating System...' : 'Access Developer Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Admin Portal Switch */}
          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#1E293B] space-y-3">
            <div className="p-3 bg-[#0F172A] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-[#E11D2E]" />
                <span>Store Owner?</span>
              </div>
              <Link 
                to="/admin/login" 
                className="text-[#E11D2E] hover:underline font-bold"
              >
                Store Admin Login →
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center mt-4 sm:mt-6">
          <Link
            to="/"
            className="text-xs font-mono text-[#64748B] hover:text-[#E2E8F0] transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
