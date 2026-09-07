import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
  Sparkles,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { logoutUser } from '../api/authApi';
import { getMyNotifications } from '../api/notificationApi';
import LoadingSpinner from '../components/LoadingSpinner';

const AttendeeLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const { unreadCount, setNotifications } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await getMyNotifications(1, 20, false);
        setNotifications(
          response.data?.notifications || [],
          response.data?.unreadCount || 0
        );
      } catch (err) {
        // Silently catch initial notification counter error
      }
    };
    fetchUnreadCount();
  }, [setNotifications]);

  const navItems = [
    { label: 'Dashboard', path: '/attendee/dashboard', icon: LayoutDashboard },
    { label: 'Browse Expos', path: '/attendee/expos', icon: Calendar },
    { label: 'My Schedule', path: '/attendee/schedule', icon: Clock },
    { label: 'Exhibitor Directory', path: '/attendee/directory', icon: Users },
    { label: 'My Inquiries', path: '/attendee/inquiries', icon: MessageSquare },
    { label: 'Notifications', path: '/attendee/notifications', icon: Bell, badge: unreadCount },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/auth/login', { replace: true });
    } catch (error) {
      clearAuth();
      toast.success('Session ended');
      navigate('/auth/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
      className="min-h-screen flex flex-col md:flex-row font-sans"
    >
      {/* Mobile Top Header */}
      <header
        style={{
          backgroundColor: 'var(--color-sidebar)',
          borderColor: 'var(--color-border)',
        }}
        className="md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40"
      >
        <Link to="/attendee/dashboard" className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text)',
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <span
            style={{
              color: 'var(--color-text)',
              fontFamily: 'var(--font-heading)',
            }}
            className="font-semibold text-sm tracking-tight"
          >
            EventSphere
          </span>
          <span
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
            className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm border"
          >
            Attendee
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        style={{
          backgroundColor: 'var(--color-sidebar)',
          borderColor: 'var(--color-border)',
        }}
        className={`fixed md:sticky top-0 left-0 h-screen z-50 w-64 border-r flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div
            style={{ borderColor: 'var(--color-border)' }}
            className="p-5 border-b flex items-center justify-between"
          >
            <Link to="/attendee/dashboard" onClick={closeMobileMenu} className="flex items-center gap-2.5">
              <div
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text)',
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h1
                  style={{
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-heading)',
                  }}
                  className="font-bold text-sm tracking-tight"
                >
                  EventSphere
                </h1>
                <p
                  style={{ color: 'var(--color-text-dim)' }}
                  className="text-[10px] tracking-widest uppercase font-semibold"
                >
                  Attendee Portal
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="md:hidden text-[var(--color-text-muted)] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  style={{
                    borderLeft: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                    backgroundColor: isActive ? 'var(--color-primary-muted)' : 'transparent',
                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                    transition: 'all 0.15s ease',
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-r-lg text-xs font-semibold hover:bg-[var(--color-surface-alt)] hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" style={{ color: isActive ? 'var(--color-primary)' : 'inherit' }} />
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge) && item.badge > 0 && (
                    <span
                      style={{
                        background: 'var(--color-accent)',
                        color: '#0B0E14',
                      }}
                      className="text-[10px] font-bold px-1.5 py-0.2 rounded-full"
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
          className="p-3 border-t"
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
            }}
            className="flex items-center justify-between p-2 rounded-lg border"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0"
              >
                <User className="w-4 h-4 text-[var(--color-text-muted)]" />
              </div>
              <div className="min-w-0 leading-tight">
                <p style={{ color: 'var(--color-text)' }} className="text-xs font-semibold truncate">
                  {user?.name || user?.email || 'Attendee User'}
                </p>
                <p style={{ color: 'var(--color-text-muted)' }} className="text-[10px] capitalize truncate">
                  Attendee
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                color: 'var(--color-danger)',
                background: 'var(--color-danger-muted)',
              }}
              className="p-1.5 rounded-md hover:brightness-110 transition-all"
              title="Log Out"
            >
              {isLoggingOut ? <LoadingSpinner size="sm" /> : <LogOut className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Page Area */}
      <main
        style={{ backgroundColor: 'var(--color-bg)' }}
        className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AttendeeLayout;
