import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans bg-[#0B0E14] text-slate-100">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4" />
            </div>
            <span
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-xl font-bold tracking-tight text-white"
            >
              EventSphere
            </span>
          </Link>

          {title && (
            <h1
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-lg font-bold text-white tracking-tight"
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Clean, Crisp Card without any glowing borders or shadows */}
        <div className="rounded-2xl border border-slate-800 bg-[#141A26] p-6 sm:p-8 shadow-sm">
          {children}
        </div>

        {/* Security Trust Footnote */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-slate-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Enterprise 256-bit encrypted authentication</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
