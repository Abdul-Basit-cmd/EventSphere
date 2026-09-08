import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPasswordApi } from '../../api/authApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgotSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await forgotPasswordApi(formData);
      setIsSubmitted(true);
      toast.success('If that email is registered, a reset link has been sent.');
    } catch (error) {
      // Backend guarantees not leaking existence, so still show generic message
      setIsSubmitted(true);
      toast.success('If that email is registered, a reset link has been sent.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToReset = () => {
    navigate('/auth/reset-password', {
      state: { email: getValues('email') },
    });
  };

  return (
    <div className="space-y-4">
      {isSubmitted ? (
        <div className="space-y-5 animate-modal-in">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                Dispatch Sent
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an account matches that email, a 6-digit password reset verification code has been dispatched. Please check your inbox and spam filters.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProceedToReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold btn-primary shadow-xs"
          >
            <KeyRound className="w-4 h-4" />
            <span>Enter 6-Digit Reset Code</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleForgotSubmit)} className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your registered email address below and we'll dispatch a 6-digit confirmation code to securely update your credentials.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
              Account email address
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold btn-primary shadow-xs disabled:opacity-60 transition-all"
          >
            {isLoading && <LoadingSpinner size="sm" />}
            <span>{isLoading ? 'Sending code...' : 'Send Reset Code'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>

          <div className="text-center pt-3 border-t border-slate-800/80">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Remember your password? Sign in</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
