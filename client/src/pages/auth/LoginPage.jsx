import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: location.state?.email || '',
      password: '',
    },
  });

  const handleLoginSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await loginUser(formData);
      const user = response.data?.user;
      const accessToken = response.data?.accessToken;

      if (!user || !accessToken) {
        throw new Error('Incomplete authentication response received');
      }

      setAuth(user, accessToken);
      toast.success(response.message || 'Logged in successfully');

      // Role-based redirect
      if (user.role === 'admin') {
        const redirectPath = location.state?.from?.pathname || '/admin/dashboard';
        navigate(redirectPath, { replace: true });
      } else if (user.role === 'exhibitor') {
        navigate('/exhibitor/dashboard', { replace: true });
      } else if (user.role === 'attendee') {
        navigate('/attendee/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to log in';

      if (errorMessage.includes('Please verify your email first.')) {
        toast.error('Please verify your email before logging in.');
        navigate('/auth/verify-email', {
          state: { email: formData.email },
        });
        return;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
          Work or personal email
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="email"
            type="email"
            autoComplete="email"
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

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-xs font-semibold text-slate-300">
            Account password
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold btn-primary shadow-xs disabled:opacity-60 transition-all"
      >
        {isLoading && <LoadingSpinner size="sm" />}
        <span>{isLoading ? 'Authenticating...' : 'Sign in to EventSphere'}</span>
        {!isLoading && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Register Footer */}
      <div className="text-center pt-3 border-t border-slate-800/80">
        <span className="text-xs text-slate-400">
          Don't have an account yet?{' '}
        </span>
        <Link
          to="/auth/register"
          className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          Create account
        </Link>
      </div>
    </form>
  );
};

export default LoginPage;
