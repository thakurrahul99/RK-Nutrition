import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, Terminal } from 'lucide-react';
import RKWatermark from '../../components/common/RKWatermark';

export default function AdminLoginPage() {
  const { login, isAuthenticated, isClientAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated with client permissions, redirect to /admin
  if (isAuthenticated && isClientAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password, 'CLIENT');
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Authentication failed. Please verify store credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#0D0D0D] text-[#F5F4F2] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden font-body">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#F5F4F2_1px,transparent_1px),linear-gradient(to_bottom,#F5F4F2_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E11D2E]/[0.06] rounded-full blur-[140px]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[420px] opacity-10">
          <RKWatermark className="w-full h-auto" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card Box */}
        <div className="bg-[#141414] border border-[#262626] p-5 sm:p-8 shadow-2xl relative">
          {/* Crimson Top Bar Indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#E11D2E]" />

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/images/RK%20Nutrition%20Logo.png" 
                alt="RK Nutrition" 
                className="h-12 sm:h-14 w-auto object-contain" 
              />
            </div>
            <h1 className="font-heading text-2xl uppercase tracking-wider text-[#F5F4F2] font-black">
              Store Owner <span className="text-[#E11D2E]">Admin</span>
            </h1>
            <p className="text-xs text-[#8C8C8C] mt-1 font-mono uppercase tracking-widest">
              Products, Inventory, Orders & Payments
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 bg-[#E11D2E]/10 border border-[#E11D2E]/40 text-[#F5F4F2] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#E11D2E] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Store Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="storeowner@rknutrition.com"
                  required
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] focus:outline-none pl-10 pr-3 py-2.5 text-sm text-[#F5F4F2] placeholder-[#555555] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Store Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] focus:outline-none pl-10 pr-10 py-2.5 text-sm text-[#F5F4F2] placeholder-[#555555] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#F5F4F2] p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#E11D2E] hover:bg-[#AC1721] disabled:opacity-50 text-[#F5F4F2] font-heading uppercase text-xs tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#E11D2E]/20"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In To Store Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Admin Portal Switch */}
          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#222222] space-y-3">
            <div className="p-3 bg-[#111111] border border-[#222222] text-[11px] font-mono text-[#8C8C8C] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Developer / Super Admin?</span>
              </div>
              <Link 
                to="/super-admin/login" 
                className="text-[#38BDF8] hover:underline font-bold"
              >
                Super Admin Login →
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center mt-4 sm:mt-6">
          <Link
            to="/"
            className="text-xs font-mono text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
