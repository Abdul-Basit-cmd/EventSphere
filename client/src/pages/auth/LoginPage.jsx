import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import FieldLabel from '../../components/ui/FieldLabel';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      <div>
        <FieldLabel htmlFor="email" required>Email address</FieldLabel>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          {...register('email')}
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
        />
        {errors.email && (
          <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <FieldLabel htmlFor="password" required>Password</FieldLabel>
          <Link
            to="/auth/forgot-password"
            style={{ color: 'var(--color-primary)' }}
            className="text-xs hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
        />
        {errors.password && (
          <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold btn-primary disabled:opacity-60"
      >
        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="text-center pt-2">
        <span style={{ color: 'var(--color-text-muted)' }} className="text-xs">
          Don't have an account?{' '}
        </span>
        <Link
          to="/auth/register"
          style={{ color: 'var(--color-primary)' }}
          className="text-xs font-semibold hover:underline"
        >
          Create account
        </Link>
      </div>
    </form>
  );
};

export default LoginPage;
