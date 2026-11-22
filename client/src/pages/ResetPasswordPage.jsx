import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { apiRequest } from '../services/api';
import DocumentMeta from '../components/common/DocumentMeta';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Missing password reset token. Please request a new recovery link.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setErrorMessage(res.error || 'Password reset link is invalid or has expired.');
      }
    } catch {
      setErrorMessage('Network error occurred. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#111111]">
      <DocumentMeta 
        title="Create New Password | RK Nutrition" 
        description="Set a new secure password for your RK Nutrition customer account." 
      />

      <div className="w-full max-w-md space-y-6 sm:space-y-8 bg-[#161616] border border-[#262626] p-5 sm:p-10 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8202B] via-[#E52535] to-[#8A141D]" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1F1F] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#C8202B] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECURITY RECOVERY</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider text-[#F5F4F2] font-black">
            SET NEW PASSWORD
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#8C8C8C] max-w-sm mx-auto">
            Create a strong, unique password to safeguard your supplement orders and personal information.
          </p>
        </div>

        {/* Missing Token Check */}
        {!token && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#2B1416] border border-[#852229] text-[#FFA8AE] text-xs sm:text-sm flex items-start gap-2.5 font-body">
              <AlertCircle className="w-4 h-4 text-[#C8202B] shrink-0 mt-0.5" />
              <span>Invalid password reset link. The security token is missing from the URL.</span>
            </div>
            <Link
              to="/forgot-password"
              className="w-full py-3 px-4 bg-[#C8202B] text-[#F5F4F2] font-heading text-sm uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>REQUEST NEW RESET LINK</span>
            </Link>
          </div>
        )}

        {token && success && (
          <div className="space-y-6">
            <div className="p-4 bg-[#172517] border border-[#2E6030] text-[#86EFAC] text-xs sm:text-sm flex items-start gap-3 font-body">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">Password Updated Successfully</p>
                <p className="text-green-300/90 leading-relaxed">
                  Your credentials have been securely updated. Redirecting you to sign in...
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full py-3.5 px-4 bg-[#C8202B] text-[#F5F4F2] font-heading text-sm uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C8202B]/20"
            >
              <span>SIGN IN NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {token && !success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div 
                role="alert"
                className="p-3.5 bg-[#2B1416] border border-[#852229] text-[#FFA8AE] text-xs sm:text-sm flex items-start gap-2.5 font-body"
              >
                <AlertCircle className="w-4 h-4 text-[#C8202B] shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                New Password * (Min 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#C8202B] pl-10 pr-11 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#A3A3A3] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#C8202B] pl-10 pr-11 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#A3A3A3] transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#C8202B] hover:bg-[#D51F32] disabled:bg-[#44181B] disabled:cursor-not-allowed text-[#F5F4F2] font-heading text-base uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C8202B]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>UPDATING CREDENTIALS...</span>
                </>
              ) : (
                <>
                  <span>SET NEW PASSWORD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
