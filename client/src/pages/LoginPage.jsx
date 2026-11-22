import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DocumentMeta from '../components/common/DocumentMeta';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated as customer, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, redirectPath]);

  // Load remembered email if present
  useEffect(() => {
    const savedEmail = localStorage.getItem('rk_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(cleanEmail, password);
      if (res.success) {
        if (rememberMe) {
          localStorage.setItem('rk_remember_email', cleanEmail);
        } else {
          localStorage.removeItem('rk_remember_email');
        }
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMessage(res.error || 'Invalid email or password. Please verify your credentials.');
      }
    } catch {
      setErrorMessage('Unable to connect to the authentication server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0E0E0E] relative overflow-hidden page-enter">
      {/* Background ambient red flare */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(225, 29, 46, 0.4) 0%, transparent 70%)'
        }}
        aria-hidden="true"
      />

      <DocumentMeta 
        title="Customer Sign In | RK Nutrition" 
        description="Sign in to your RK Nutrition customer account to track orders, manage delivery addresses, and view your supplement stack." 
      />

      <div className="w-full max-w-md space-y-6 sm:space-y-8 bg-[#141414] border border-[#262626] p-5 sm:p-10 shadow-2xl relative z-10 card-hover-lift">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E11D2E] via-[#FF3B4E] to-[#B01422]" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Link to="/" aria-label="RK Nutrition Home">
              <img 
                src="/images/RK%20Nutrition%20Logo.png" 
                alt="RK Nutrition" 
                className="h-10 sm:h-12 w-auto object-contain hover:scale-105 transition-transform" 
              />
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#E11D2E] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ATHLETE PORTAL</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider text-[#F5F4F2] font-black">
            CUSTOMER SIGN IN
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#8C8C8C] max-w-sm mx-auto">
            Access your order history, delivery addresses, and personal supplement stack.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div 
            role="alert"
            className="p-3.5 bg-[#2B1416] border border-[#852229] text-[#FFA8AE] text-xs sm:text-sm flex items-start gap-2.5 font-body"
          >
            <AlertCircle className="w-4 h-4 text-[#E11D2E] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@example.com"
                required
                autoComplete="email"
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] pl-10 pr-4 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#8C8C8C] hover:text-[#E11D2E] transition-colors font-body"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] pl-10 pr-11 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body outline-none transition-colors"
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

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#8C8C8C] select-none font-body">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 bg-[#111111] border border-[#2E2E2E] rounded accent-[#E11D2E] cursor-pointer"
              />
              <span>Remember email on this device</span>
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#E11D2E] hover:bg-[#C81A27] disabled:bg-[#44181B] disabled:cursor-not-allowed text-[#F5F4F2] font-heading text-base uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E11D2E]/25 btn-shimmer relative overflow-hidden group/btn active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span>SIGN IN TO ACCOUNT</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="pt-4 border-t border-[#262626] text-center">
          <p className="text-xs text-[#8C8C8C] font-body">
            New to RK Nutrition?{' '}
            <Link
              to={redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : '/register'}
              className="text-[#F5F4F2] hover:text-[#E11D2E] font-semibold underline underline-offset-4 ml-1 transition-colors"
            >
              Create an Athlete Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
