import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPasswordApi } from '../../api/authApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const resetPasswordSchema = z
  .object({
    email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
    otp: z
      .string()
      .trim()
      .length(6, 'Reset code must be 6 digits')
      .regex(/^\d+$/, 'Code must contain only digits'),
    password: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: location.state?.email || '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleResetSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await resetPasswordApi({
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
      });

      toast.success(response.message || 'Password reset successfully. Please sign in.');
      navigate('/auth/login', {
        replace: true,
        state: { email: formData.email },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Password reset failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleResetSubmit)} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
          Account email
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
          6-digit reset code
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

      {/* New Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-xs font-semibold text-slate-300">
          New password (min. 8 characters)
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            {...register('password')}
            className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-rose-400 font-medium pt-0.5">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300">
          Confirm new password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-rose-400 font-medium pt-0.5">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold btn-primary shadow-xs disabled:opacity-60 transition-all"
      >
        {isLoading && <LoadingSpinner size="sm" />}
        <span>{isLoading ? 'Updating password...' : 'Update Credentials'}</span>
        {!isLoading && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Back Link */}
      <div className="text-center pt-3 border-t border-slate-800/80">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel and back to sign in</span>
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordPage;
