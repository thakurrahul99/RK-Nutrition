import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DocumentMeta from '../components/common/DocumentMeta';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const { register, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, redirectPath]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMessage) setErrorMessage('');
  };

  // Password strength calculator
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500 text-red-400' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-yellow-500 text-yellow-400' };
    return { score: 3, label: 'Strong', color: 'bg-green-500 text-green-400' };
  };

  const strength = calculateStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.name.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters long.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (formData.phone && cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service and Privacy Policy to register.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        cleanPhone
      );

      if (res.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMessage(res.error || 'Failed to create your account. Please verify your details.');
      }
    } catch {
      setErrorMessage('Unable to connect to the registration service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#111111]">
      <DocumentMeta 
        title="Create Account | RK Nutrition" 
        description="Register for an RK Nutrition athlete account to access exclusive supplement formulations, faster checkout, and order tracking." 
      />

      <div className="w-full max-w-lg space-y-8 bg-[#161616] border border-[#262626] p-6 sm:p-10 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8202B] via-[#E52535] to-[#8A141D]" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1F1F] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#C8202B] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>JOIN THE TEAM</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider text-[#F5F4F2] font-black">
            CREATE ATHLETE ACCOUNT
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#8C8C8C] max-w-sm mx-auto">
            Build your supplement stack, track real-time dispatches, and expedite your checkout.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div 
            role="alert"
            className="p-3.5 bg-[#2B1416] border border-[#852229] text-[#FFA8AE] text-xs sm:text-sm flex items-start gap-2.5 font-body"
          >
            <AlertCircle className="w-4 h-4 text-[#C8202B] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Kumar"
                required
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#C8202B] pl-10 pr-4 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="athlete@example.com"
                required
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#C8202B] pl-10 pr-4 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
              Mobile Phone (for delivery notifications)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#C8202B] pl-10 pr-4 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
              Password * (Min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
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

            {/* Password strength indicator */}
            {formData.password && (
              <div className="pt-1.5 flex items-center gap-2">
                <div className="flex-1 grid grid-cols-3 gap-1 h-1.5 bg-[#222222]">
                  <div className={`h-full ${strength.score >= 1 ? (strength.score === 1 ? 'bg-red-500' : strength.score === 2 ? 'bg-yellow-500' : 'bg-green-500') : ''}`} />
                  <div className={`h-full ${strength.score >= 2 ? (strength.score === 2 ? 'bg-yellow-500' : 'bg-green-500') : ''}`} />
                  <div className={`h-full ${strength.score >= 3 ? 'bg-green-500' : ''}`} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C8C8C]">
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={`w-full bg-[#111111] border ${
                  passwordsMismatch 
                    ? 'border-red-600 focus:border-red-500' 
                    : passwordsMatch 
                    ? 'border-green-600 focus:border-green-500' 
                    : 'border-[#2E2E2E] focus:border-[#C8202B]'
                } pl-10 pr-11 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body outline-none transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#A3A3A3] transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordsMatch && (
              <p className="text-[11px] text-green-400 flex items-center gap-1 font-body">
                <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
              </p>
            )}
            {passwordsMismatch && (
              <p className="text-[11px] text-red-400 flex items-center gap-1 font-body">
                <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#8C8C8C] font-body leading-relaxed">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 bg-[#111111] border border-[#2E2E2E] rounded accent-[#C8202B] cursor-pointer"
              />
              <span>
                I agree to the RK Nutrition{' '}
                <Link to="/terms-of-service" target="_blank" className="text-[#F5F4F2] underline hover:text-[#C8202B]">
                  Terms of Service
                </Link>{' '}
                and acknowledge the{' '}
                <Link to="/privacy-policy" target="_blank" className="text-[#F5F4F2] underline hover:text-[#C8202B]">
                  Privacy Policy
                </Link>.
              </span>
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#C8202B] hover:bg-[#D51F32] disabled:bg-[#44181B] disabled:cursor-not-allowed text-[#F5F4F2] font-heading text-base uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C8202B]/20 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>CREATING ACCOUNT...</span>
              </>
            ) : (
              <>
                <span>COMPLETE REGISTRATION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-[#262626] text-center">
          <p className="text-xs text-[#8C8C8C] font-body">
            Already have an athlete account?{' '}
            <Link
              to={redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : '/login'}
              className="text-[#F5F4F2] hover:text-[#C8202B] font-semibold underline underline-offset-4 ml-1 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
