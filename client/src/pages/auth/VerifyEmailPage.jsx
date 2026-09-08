import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, KeyRound, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { verifyEmailApi, resendVerificationApi } from '../../api/authApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const verifyEmailSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  otp: z
    .string()
    .trim()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only digits'),
});

const VerifyEmailPage = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: initialEmail,
      otp: '',
    },
  });

  const currentEmail = watch('email');

  useEffect(() => {
    let timer = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  const handleVerifySubmit = async (formData) => {
    setIsVerifying(true);
    try {
      const response = await verifyEmailApi(formData);
      toast.success(response.message || 'Email verified successfully');
      navigate('/auth/login', {
        replace: true,
        state: { email: formData.email },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Verification failed';
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!currentEmail || resendCooldown > 0 || isResending) {
      if (!currentEmail) toast.error('Please enter your email address first');
      return;
    }

    setIsResending(true);
    try {
      const response = await resendVerificationApi({ email: currentEmail });
      toast.success(response.message || 'Verification code sent to your email');
      setResendCooldown(60);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to resend code';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleVerifySubmit)} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
          Registered email address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            {...register('email')}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-rose-400 font-medium pt-0.5">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* 6-Digit Code Input */}
      <div className="space-y-1.5">
        <label htmlFor="otp" className="block text-xs font-semibold text-slate-300">
          6-digit confirmation code
        </label>
        <div className="relative">
          <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            {...register('otp')}
            className="w-full pl-10 pr-4 py-2.5 text-center text-sm font-mono tracking-[0.3em] font-bold rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        {errors.otp && (
          <p className="text-xs text-rose-400 font-medium pt-0.5">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* Resend helper */}
      <div className="flex items-center justify-between text-xs pt-0.5 text-slate-400">
        <span>Didn't receive the code?</span>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendCooldown > 0 || isResending}
          className="font-semibold text-blue-400 hover:text-blue-300 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed transition-colors"
        >
          {isResending ? (
            <span className="inline-flex items-center gap-1">
              <LoadingSpinner size="sm" /> Sending...
            </span>
          ) : resendCooldown > 0 ? (
            `Resend in ${resendCooldown}s`
          ) : (
            'Resend code'
          )}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isVerifying}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold btn-primary shadow-xs disabled:opacity-60 transition-all"
      >
        {isVerifying && <LoadingSpinner size="sm" />}
        <span>{isVerifying ? 'Verifying code...' : 'Confirm & Activate Account'}</span>
        {!isVerifying && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Back Link */}
      <div className="text-center pt-3 border-t border-slate-800/80">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </form>
  );
};

export default VerifyEmailPage;
