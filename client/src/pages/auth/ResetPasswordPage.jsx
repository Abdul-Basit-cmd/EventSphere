import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPasswordApi } from '../../api/authApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import FieldLabel from '../../components/ui/FieldLabel';

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
      <div>
        <FieldLabel htmlFor="email" required>Email address</FieldLabel>
        <input
          id="email"
          type="email"
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
        <FieldLabel htmlFor="otp" required>6-digit reset code</FieldLabel>
        <input
          id="otp"
          type="text"
          maxLength={6}
          placeholder="123456"
          {...register('otp')}
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          className="w-full px-3 py-2 text-center text-base font-mono tracking-widest rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
        />
        {errors.otp && (
          <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">
            {errors.otp.message}
          </p>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="password" required>New password</FieldLabel>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
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

      <div>
        <FieldLabel htmlFor="confirmPassword" required>Confirm new password</FieldLabel>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter new password"
          {...register('confirmPassword')}
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
        />
        {errors.confirmPassword && (
          <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold btn-primary disabled:opacity-60"
      >
        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
        {isLoading ? 'Updating password...' : 'Reset password'}
      </button>

      <div className="text-center pt-2">
        <Link
          to="/auth/login"
          style={{ color: 'var(--color-text-muted)' }}
          className="text-xs hover:text-white transition-colors"
        >
          Cancel and back to sign in
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordPage;
