import React from 'react';
import { Sparkles } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text)',
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <span
            style={{
              color: 'var(--color-text)',
              fontFamily: 'var(--font-heading)',
            }}
            className="text-xl font-bold tracking-tight"
          >
            EventSphere
          </span>
        </div>

        {title && (
          <h2
            style={{
              color: 'var(--color-text)',
              fontFamily: 'var(--font-heading)',
            }}
            className="mt-4 text-center text-xl font-bold tracking-tight"
          >
            {title}
          </h2>
        )}

        {subtitle && (
          <p
            style={{ color: 'var(--color-text-muted)' }}
            className="mt-1 text-center text-xs font-normal"
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            borderTop: '2px solid var(--color-primary)',
          }}
          className="py-8 px-6 sm:px-10 shadow-xs border rounded-2xl"
        >
          {children}
        </div>

        <p
          style={{ color: 'var(--color-text-dim)' }}
          className="mt-6 text-center text-xs"
        >
          Internal Operations & Event Coordination Platform
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
