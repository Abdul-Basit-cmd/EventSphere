import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { verifyEmailApi, resendVerificationApi } from '../../api/authApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import FieldLabel from '../../components/ui/FieldLabel';

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
        <FieldLabel htmlFor="otp" required>6-digit verification code</FieldLabel>
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
          className="w-full px-3 py-2 text-center text-lg font-mono tracking-widest rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
        />
        {errors.otp && (
          <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">
            {errors.otp.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <span style={{ color: 'var(--color-text-muted)' }}>
          Didn't receive the code?
        </span>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendCooldown > 0 || isResending}
          style={{ color: 'var(--color-primary)' }}
          className="font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
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

      <button
        type="submit"
        disabled={isVerifying}
        className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold btn-primary disabled:opacity-60"
      >
        {isVerifying && <LoadingSpinner size="sm" className="mr-2" />}
        {isVerifying ? 'Verifying...' : 'Verify email'}
      </button>

      <div className="text-center pt-2">
        <Link
          to="/auth/login"
          style={{ color: 'var(--color-text-muted)' }}
          className="text-xs hover:text-white transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
};

export default VerifyEmailPage;
