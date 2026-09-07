import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPasswordApi } from '../../api/authApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import FieldLabel from '../../components/ui/FieldLabel';

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
        <div className="text-center space-y-4">
          <div
            style={{
              backgroundColor: 'var(--color-success-muted)',
              borderColor: 'var(--color-success)',
            }}
            className="p-4 rounded-xl border text-left"
          >
            <p style={{ color: 'var(--color-success)' }} className="text-xs leading-relaxed font-medium">
              If an account matches that email address, we have dispatched a password reset code. Please check your inbox and spam folder.
            </p>
          </div>

          <button
            type="button"
            onClick={handleProceedToReset}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold btn-primary"
          >
            Enter reset code
          </button>

          <div className="pt-1">
            <Link
              to="/auth/login"
              style={{ color: 'var(--color-text-muted)' }}
              className="text-xs hover:text-white transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleForgotSubmit)} className="space-y-4">
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
            Enter your registered email address and we'll send you a 6-digit code to reset your password.
          </p>

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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold btn-primary disabled:opacity-60"
          >
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {isLoading ? 'Sending code...' : 'Send reset code'}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/auth/login"
              style={{ color: 'var(--color-text-muted)' }}
              className="text-xs hover:text-white transition-colors"
            >
              Remembered your password? Sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
