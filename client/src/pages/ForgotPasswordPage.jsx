import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { apiRequest } from '../services/api';
import DocumentMeta from '../components/common/DocumentMeta';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail })
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(res.error || 'Unable to process your request. Please try again.');
      }
    } catch {
      setErrorMessage('Network error occurred. Please verify your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#111111]">
      <DocumentMeta 
        title="Forgot Password | RK Nutrition" 
        description="Reset your RK Nutrition athlete account password securely via email recovery link." 
      />

      <div className="w-full max-w-md space-y-6 sm:space-y-8 bg-[#161616] border border-[#262626] p-5 sm:p-10 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E11D2E] via-[#E52535] to-[#8A141D]" />

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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1F1F] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#E11D2E] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ACCOUNT RECOVERY</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider text-[#F5F4F2] font-black">
            RESET PASSWORD
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#8C8C8C] max-w-sm mx-auto">
            Enter your registered email address and we'll dispatch a secure password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="p-4 bg-[#172517] border border-[#2E6030] text-[#86EFAC] text-xs sm:text-sm flex items-start gap-3 font-body">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">Reset Link Dispatched</p>
                <p className="text-green-300/90 leading-relaxed">
                  If an account exists for <span className="text-white font-mono">{email}</span>, a secure recovery email has been sent. Please check your inbox and spam folder.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full py-3 px-4 bg-[#1F1F1F] hover:bg-[#252525] border border-[#2E2E2E] text-[#F5F4F2] font-heading text-sm uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>RETURN TO SIGN IN</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div 
                role="alert"
                className="p-3.5 bg-[#2B1416] border border-[#852229] text-[#FFA8AE] text-xs sm:text-sm flex items-start gap-2.5 font-body"
              >
                <AlertCircle className="w-4 h-4 text-[#E11D2E] shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@example.com"
                  required
                  autoFocus
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] pl-10 pr-4 py-3 text-sm text-[#F5F4F2] placeholder-[#555555] font-body outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#E11D2E] hover:bg-[#D51F32] disabled:bg-[#44181B] disabled:cursor-not-allowed text-[#F5F4F2] font-heading text-base uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E11D2E]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>DISPATCHING LINK...</span>
                </>
              ) : (
                <>
                  <span>SEND RECOVERY LINK</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors font-body"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
