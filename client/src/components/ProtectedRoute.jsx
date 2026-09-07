import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-muted)',
        }}
        className="min-h-screen flex flex-col items-center justify-center"
      >
        <LoadingSpinner size="lg" />
        <span className="mt-4 text-xs font-medium tracking-wide uppercase">
          Verifying session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
