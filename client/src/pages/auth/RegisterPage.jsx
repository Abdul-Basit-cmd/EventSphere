import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../../api/authApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import Select from '../../components/ui/Select';
import FieldLabel from '../../components/ui/FieldLabel';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['attendee', 'exhibitor'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
});

const ROLE_OPTIONS = [
  { value: 'attendee', label: 'Attendee (Explore events & visit booths)' },
  { value: 'exhibitor', label: 'Exhibitor (Book booths & showcase products)' },
];

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'attendee',
    },
  });

  const roleValue = watch('role');
  const roleRegister = register('role');

  const handleRegisterSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await registerUser(formData);
      toast.success(response.message || 'Account created. Please verify your email.');
      navigate('/auth/verify-email', {
        state: { email: formData.email },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegisterSubmit)} className="space-y-4">
      <div>
        <FieldLabel htmlFor="name" required>Full name</FieldLabel>
        <input
          id="name"
          type="text"
          placeholder="Jane Doe"
          {...register('name')}
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
        />
        {errors.name && (
          <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="email" required>Work or personal email</FieldLabel>
        <input
          id="email"
          type="email"
          placeholder="jane@example.com"
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
        <FieldLabel htmlFor="role" required>Account type</FieldLabel>
        <Select
          id="role"
          name={roleRegister.name}
          value={roleValue}
          options={ROLE_OPTIONS}
          onChange={(e) => roleRegister.onChange(e)}
        />
        {errors.role && (
          <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">
            {errors.role.message}
          </p>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="password" required>Password</FieldLabel>
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold btn-primary disabled:opacity-60"
      >
        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>

      <div className="text-center pt-2">
        <span style={{ color: 'var(--color-text-muted)' }} className="text-xs">
          Already registered?{' '}
        </span>
        <Link
          to="/auth/login"
          style={{ color: 'var(--color-primary)' }}
          className="text-xs font-semibold hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterPage;
