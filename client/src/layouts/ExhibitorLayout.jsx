import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Calendar,
  Layers,
  Users,
  Building2,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { logoutUser } from '../api/authApi';
import { getMyNotifications } from '../api/notificationApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ExhibitorLayout = () => {
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
    { label: 'Dashboard', path: '/exhibitor/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/exhibitor/profile', icon: User },
    { label: 'Browse Expos', path: '/exhibitor/expos', icon: Calendar },
    { label: 'My Booths', path: '/exhibitor/booths', icon: Layers },
    { label: 'Exhibitor Directory', path: '/exhibitor/directory', icon: Users },
    { label: 'Neighbors', path: '/exhibitor/neighbors', icon: Building2 },
    { label: 'My Inquiries', path: '/exhibitor/inquiries', icon: MessageSquare },
    { label: 'Notifications', path: '/exhibitor/notifications', icon: Bell, badge: unreadCount },
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

  const currentNav = navItems.find((item) => location.pathname === item.path);
  const pageTitle = currentNav ? currentNav.label : 'Exhibitor Portal';

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
      className="min-h-screen flex flex-col md:flex-row font-sans"
    >
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        style={{
          backgroundColor: 'var(--color-sidebar)',
          borderColor: 'var(--color-border)',
        }}
        className={`fixed md:sticky top-0 left-0 h-screen z-50 w-64 border-r flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Header */}
          <div
            style={{ borderColor: 'var(--color-border)' }}
            className="h-16 px-6 flex items-center justify-between border-b shrink-0"
          >
            <div className="flex items-center gap-2.5">
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
                <span
                  style={{
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-heading)',
                  }}
                  className="text-sm font-bold tracking-tight block"
                >
                  EventSphere
                </span>
                <span
                  style={{ color: 'var(--color-text-dim)' }}
                  className="block text-[10px] uppercase font-semibold tracking-wider"
                >
                  Exhibitor Portal
                </span>
              </div>
            </div>
            <button
              type="button"
              className="md:hidden p-1 rounded-md text-[var(--color-text-muted)] hover:text-white"
              onClick={closeMobileMenu}
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
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" style={{ color: isActive ? 'var(--color-primary)' : 'inherit' }} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span
                      style={{
                        background: 'var(--color-accent)',
                        color: '#0B0E14',
                      }}
                      className="px-1.5 py-0.2 text-[10px] font-bold rounded-full"
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout (Matches Attendee & Admin) */}
        <div
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
          className="p-3 border-t shrink-0"
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
            }}
            className="flex items-center justify-between p-2 rounded-xl border"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0"
              >
                <Building2 className="w-4 h-4 text-[var(--color-text-muted)]" />
              </div>
              <div className="min-w-0 leading-tight">
                <p style={{ color: 'var(--color-text)' }} className="text-xs font-semibold truncate">
                  {user?.name || 'Exhibitor User'}
                </p>
                <p style={{ color: 'var(--color-text-muted)' }} className="text-[10px] capitalize truncate">
                  Exhibitor
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div
          style={{
            backgroundColor: 'var(--color-sidebar)',
            borderColor: 'var(--color-border)',
          }}
          className="md:hidden h-14 px-4 border-b flex items-center justify-between sticky top-0 z-30"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span
              style={{
                color: 'var(--color-text)',
                fontFamily: 'var(--font-heading)',
              }}
              className="text-sm font-semibold"
            >
              {pageTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/exhibitor/notifications"
              className="relative p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span
                  style={{ backgroundColor: 'var(--color-accent)' }}
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                />
              )}
            </Link>
          </div>
        </div>

        {/* Routed Page Outlet */}
        <main
          style={{ backgroundColor: 'var(--color-bg)' }}
          className="flex-1 p-4 md:p-8 overflow-y-auto"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ExhibitorLayout;
