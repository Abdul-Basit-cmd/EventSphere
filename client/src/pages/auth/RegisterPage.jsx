import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Building2, Users, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser } from '../../api/authApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['attendee', 'exhibitor'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
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

  const selectedRole = watch('role');

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
      {/* Interactive Role Card Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-300">
          Select account type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('role', 'attendee', { shouldValidate: true })}
            className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-1.5 transition-all ${
              selectedRole === 'attendee'
                ? 'bg-blue-600/20 border-blue-500 shadow-xs'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-1.5 rounded-lg ${
                selectedRole === 'attendee' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className={`w-2 h-2 rounded-full ${
                selectedRole === 'attendee' ? 'bg-blue-500' : 'bg-transparent'
              }`} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Attendee</p>
              <p className="text-[10px] text-slate-400">Browse & register for events</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setValue('role', 'exhibitor', { shouldValidate: true })}
            className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-1.5 transition-all ${
              selectedRole === 'exhibitor'
                ? 'bg-cyan-600/20 border-cyan-500 shadow-xs'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-1.5 rounded-lg ${
                selectedRole === 'exhibitor' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className={`w-2 h-2 rounded-full ${
                selectedRole === 'exhibitor' ? 'bg-cyan-500' : 'bg-transparent'
              }`} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Exhibitor</p>
              <p className="text-[10px] text-slate-400">Book booths & showcase products</p>
            </div>
          </button>
        </div>
        {errors.role && (
          <p className="text-xs text-rose-400 font-medium pt-0.5">
            {errors.role.message}
          </p>
        )}
      </div>

      {/* Name Input */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-xs font-semibold text-slate-300">
          Full name
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            {...register('name')}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        {errors.name && (
          <p className="text-xs text-rose-400 font-medium pt-0.5">
            {errors.name.message}
          </p>
        )}
      </div>

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
            placeholder="jane@company.com"
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
        <label htmlFor="password" className="block text-xs font-semibold text-slate-300">
          Create password (min. 8 characters)
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
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
        <span>{isLoading ? 'Creating account...' : 'Complete Registration'}</span>
        {!isLoading && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Sign In Footer */}
      <div className="text-center pt-3 border-t border-slate-800/80">
        <span className="text-xs text-slate-400">
          Already registered?{' '}
        </span>
        <Link
          to="/auth/login"
          className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterPage;
