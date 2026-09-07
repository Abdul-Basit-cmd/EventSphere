import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { refreshTokenApi, fetchCurrentUser } from './api/authApi';

import ProtectedRoute from './components/ProtectedRoute';
import ExhibitorGuard from './components/ExhibitorGuard';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ExposPage from './pages/admin/ExposPage';
import ExhibitorsPage from './pages/admin/ExhibitorsPage';
import ExhibitorDetailPage from './pages/admin/ExhibitorDetailPage';
import BoothsPage from './pages/admin/BoothsPage';
import SchedulePage from './pages/admin/SchedulePage';
import InquiriesPage from './pages/admin/InquiriesPage';

// Exhibitor Pages & Layout
import ExhibitorLayout from './layouts/ExhibitorLayout';
import ExhibitorDashboardPage from './pages/exhibitor/ExhibitorDashboardPage';
import ExhibitorProfilePage from './pages/exhibitor/ExhibitorProfilePage';
import BrowseExposPage from './pages/exhibitor/BrowseExposPage';
import BrowseBoothsPage from './pages/exhibitor/BrowseBoothsPage';
import MyBoothsPage from './pages/exhibitor/MyBoothsPage';
import ExhibitorDirectoryPage from './pages/exhibitor/ExhibitorDirectoryPage';
import NeighborsPage from './pages/exhibitor/NeighborsPage';
import MyInquiriesPage from './pages/exhibitor/MyInquiriesPage';
import NotificationsPage from './pages/exhibitor/NotificationsPage';

// Attendee & Public Pages & Layouts
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import PublicExposPage from './pages/public/PublicExposPage';
import PublicExpoDetailPage from './pages/public/PublicExpoDetailPage';
import AttendeeLayout from './layouts/AttendeeLayout';
import AttendeeDashboardPage from './pages/attendee/AttendeeDashboardPage';
import AttendeeExposPage from './pages/attendee/AttendeeExposPage';
import AttendeeExpoDetailPage from './pages/attendee/AttendeeExpoDetailPage';
import MySchedulePage from './pages/attendee/MySchedulePage';
import AttendeeDirectoryPage from './pages/attendee/AttendeeDirectoryPage';
import AttendeeInquiriesPage from './pages/attendee/AttendeeInquiriesPage';
import AttendeeNotificationsPage from './pages/attendee/AttendeeNotificationsPage';

function App() {
  const { setAuth, clearAuth, setInitialized, isInitialized, user, isAuthenticated } =
    useAuthStore();

  // Guard against React 18 StrictMode double-executing this effect.
  // The backend rotates refresh tokens on each /auth/refresh call and revokes
  // the session if it detects the old token being reused. A second call from
  // StrictMode's teardown/re-mount cycle would send the now-stale cookie,
  // causing the session to be revoked and the user to be logged out.
  const hasStartedRehydration = useRef(false);

  useEffect(() => {
    if (hasStartedRehydration.current) return;
    hasStartedRehydration.current = true;

    // If the user is already authenticated (e.g. just logged in and navigated
    // within the SPA), skip the rehydration to avoid consuming the refresh token.
    if (useAuthStore.getState().isAuthenticated) {
      setInitialized(true);
      return;
    }

    // Attempt session rehydration on initial mount via HTTP-only refresh cookie
    const rehydrateSession = async () => {
      try {
        const refreshRes = await refreshTokenApi();
        const newAccessToken = refreshRes.data?.accessToken;

        if (newAccessToken) {
          // Set access token first so subsequent requests have Authorization header
          useAuthStore.getState().setAccessToken(newAccessToken);
          const userRes = await fetchCurrentUser();
          const currentUser = userRes.data?.user;

          if (currentUser) {
            setAuth(currentUser, newAccessToken);
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        // No active or valid refresh session; clear in-memory state cleanly
        clearAuth();
      } finally {
        setInitialized(true);
      }
    };

    rehydrateSession();
  }, [setAuth, clearAuth, setInitialized]);

  if (!isInitialized) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)',
        }}
        className="min-h-screen flex flex-col items-center justify-center"
      >
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-dim)' }} className="mt-4 text-xs font-semibold tracking-wider uppercase">
          Initializing EventSphere...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Toast notifications container with calm editorial styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '13px',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'var(--color-surface)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: 'var(--color-surface)',
            },
          },
        }}
      />

      <ErrorBoundary>
        <Routes>


        {/* Auth Routes */}
        <Route
          path="/auth/login"
          element={
            <AuthLayout
              title="Sign in to your account"
              subtitle="Access the management portal and event operations"
            >
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/register"
          element={
            <AuthLayout
              title="Create an account"
              subtitle="Join EventSphere as an attendee or registered exhibitor"
            >
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/verify-email"
          element={
            <AuthLayout
              title="Verify your email"
              subtitle="Enter the 6-digit confirmation code sent to your inbox"
            >
              <VerifyEmailPage />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <AuthLayout
              title="Forgot your password?"
              subtitle="We'll send a 6-digit verification code to reset it"
            >
              <ForgotPasswordPage />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <AuthLayout
              title="Reset password"
              subtitle="Enter your verification code and choose a new password"
            >
              <ResetPasswordPage />
            </AuthLayout>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="expos" element={<ExposPage />} />
          <Route path="expos/:expoId/booths" element={<BoothsPage />} />
          <Route path="expos/:expoId/schedule" element={<SchedulePage />} />
          <Route path="exhibitors" element={<ExhibitorsPage />} />
          <Route path="exhibitors/:id" element={<ExhibitorDetailPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
        </Route>

        {/* Protected Exhibitor Routes */}
        <Route
          path="/exhibitor"
          element={
            <ProtectedRoute requiredRole="exhibitor">
              <ExhibitorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/exhibitor/dashboard" replace />} />
          <Route path="dashboard" element={<ExhibitorDashboardPage />} />
          <Route path="profile" element={<ExhibitorProfilePage />} />
          <Route
            path="expos"
            element={
              <ExhibitorGuard requiresSubmitted>
                <BrowseExposPage />
              </ExhibitorGuard>
            }
          />
          <Route
            path="expos/:expoId/booths"
            element={
              <ExhibitorGuard requiresSubmitted requiresApproval>
                <BrowseBoothsPage />
              </ExhibitorGuard>
            }
          />
          <Route
            path="booths"
            element={
              <ExhibitorGuard requiresSubmitted requiresApproval>
                <MyBoothsPage />
              </ExhibitorGuard>
            }
          />
          <Route
            path="directory"
            element={
              <ExhibitorGuard requiresSubmitted>
                <ExhibitorDirectoryPage />
              </ExhibitorGuard>
            }
          />
          <Route
            path="neighbors"
            element={
              <ExhibitorGuard requiresSubmitted requiresApproval>
                <NeighborsPage />
              </ExhibitorGuard>
            }
          />
          <Route path="inquiries" element={<MyInquiriesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/expos" element={<PublicExposPage />} />
          <Route path="/expos/:expoId" element={<PublicExpoDetailPage />} />
        </Route>

        {/* Protected Attendee Routes */}
        <Route
          path="/attendee"
          element={
            <ProtectedRoute requiredRole="attendee">
              <AttendeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/attendee/dashboard" replace />} />
          <Route path="dashboard" element={<AttendeeDashboardPage />} />
          <Route path="expos" element={<AttendeeExposPage />} />
          <Route path="expos/:expoId" element={<AttendeeExpoDetailPage />} />
          <Route path="schedule" element={<MySchedulePage />} />
          <Route path="directory" element={<AttendeeDirectoryPage />} />
          <Route path="inquiries" element={<AttendeeInquiriesPage />} />
          <Route path="notifications" element={<AttendeeNotificationsPage />} />
        </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
