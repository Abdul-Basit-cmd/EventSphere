import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Browse Expos', path: '/expos' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'exhibitor') return '/exhibitor/dashboard';
    return '/attendee/dashboard';
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
      className="min-h-screen flex flex-col font-sans selection:bg-[var(--color-primary)] selection:text-white"
    >
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          backgroundColor: 'rgba(22, 27, 38, 0.95)',
          backdropFilter: 'blur(8px)',
          borderColor: 'var(--color-border)',
        }}
        className="sticky top-0 z-40 border-b"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <span style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }} className="font-bold text-base tracking-tight">
              EventSphere
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium">
            {navLinks.map((item, index) => {
              const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <NavLink
                    to={item.path}
                    style={{
                      borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                      color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: '0.01em',
                    }}
                    className="py-1 transition-all hover:text-white"
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg btn-primary">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/auth/login" style={{ color: 'var(--color-text-muted)' }} className="px-3.5 py-1.5 text-xs font-semibold hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/auth/register" className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-lg btn-primary">
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} className="md:hidden border-b px-4 py-4 space-y-3">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((item) => {
                const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    style={{
                      borderLeft: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                      backgroundColor: isActive ? 'var(--color-surface-alt)' : 'transparent',
                      color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:text-white"
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div style={{ borderColor: 'var(--color-border)' }} className="pt-3 border-t flex flex-col gap-2">
              {isAuthenticated ? (
                <Link to={getDashboardPath()} onClick={closeMenu} className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link to="/auth/login" onClick={closeMenu} style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} className="w-full text-center px-4 py-2 text-xs font-semibold rounded-lg border">
                    Sign In
                  </Link>
                  <Link to="/auth/register" onClick={closeMenu} className="w-full text-center px-4 py-2 text-xs font-semibold rounded-lg btn-primary">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </motion.header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <Outlet />
      </main>

      <footer style={{ backgroundColor: 'var(--color-sidebar)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }} className="border-t py-6 px-4 md:px-8 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} EventSphere. Enterprise Exhibition Platform.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/expos" className="hover:text-white transition-colors">Exhibitions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
