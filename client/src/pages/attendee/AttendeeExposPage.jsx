import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Check,
  ArrowRight,
  Layers,
  Search,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchExpos } from '../../api/expoApi';
import { registerForExpo, getMySchedule } from '../../api/attendeeApi';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const AttendeeExposPage = () => {
  const [expos, setExpos] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [exposRes, scheduleRes] = await Promise.allSettled([
        fetchExpos({ limit: 100 }),
        isAuthenticated ? getMySchedule() : Promise.resolve({ data: { registrations: [] } }),
      ]);

      if (exposRes.status === 'fulfilled') {
        setExpos(exposRes.value.data?.expos || []);
      } else {
        toast.error('Failed to load exhibitions list');
      }

      if (scheduleRes.status === 'fulfilled' && scheduleRes.value?.data?.registrations) {
        const ids = new Set(
          scheduleRes.value.data.registrations
            .map((r) => r.expo?._id || r.expo)
            .filter(Boolean)
        );
        setRegisteredIds(ids);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRegister = async (expoId) => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    setRegisteringId(expoId);
    try {
      await registerForExpo(expoId);
      toast.success('Successfully registered for this expo!');
      setRegisteredIds((prev) => new Set([...prev, expoId]));
    } catch (error) {
      if (error.response?.status === 400) {
        toast('You are already registered for this expo.', { icon: 'ℹ️' });
        setRegisteredIds((prev) => new Set([...prev, expoId]));
      } else {
        const msg = error.response?.data?.message || 'Failed to register for expo';
        toast.error(msg);
      }
    } finally {
      setRegisteringId(null);
    }
  };

  // Collect unique themes for category filter pills
  const availableThemes = useMemo(() => {
    const set = new Set();
    expos.forEach((e) => {
      if (e.theme && e.theme.trim()) set.add(e.theme.trim());
    });
    return Array.from(set);
  }, [expos]);

  const filteredExpos = expos.filter((expo) => {
    const matchesSearch =
      searchQuery === '' ||
      expo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expo.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTheme =
      selectedTheme === 'all' ||
      expo.theme?.toLowerCase() === selectedTheme.toLowerCase();

    return matchesSearch && matchesTheme;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="page-header-accent">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Event Discovery & Exhibitions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover premier trade shows, register for attendee badges, and bookmark keynote schedules
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search exhibitions by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Theme Pills */}
      {availableThemes.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedTheme('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTheme === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            All Categories ({expos.length})
          </button>
          {availableThemes.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => setSelectedTheme(theme)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTheme === theme
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          <LoadingSpinner size="lg" />
          <p className="mt-3 text-xs text-slate-400">Discovering scheduled exhibitions...</p>
        </div>
      ) : expos.length === 0 ? (
        <EmptyState
          title="No exhibitions scheduled"
          message="There are currently no active or upcoming expos open for attendee registration."
        />
      ) : filteredExpos.length === 0 ? (
        <div className="py-14 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          No exhibitions matched your search or category filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExpos.map((expo) => {
            const isRegistered = registeredIds.has(expo._id);
            const isProcessing = registeringId === expo._id;
            const expoDate = expo.date ? new Date(expo.date) : null;

            return (
              <div
                key={expo._id}
                style={{
                  background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(17, 21, 32, 0.95) 100%)',
                  borderColor: isRegistered
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'rgba(148, 163, 184, 0.12)',
                }}
                className="group relative border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 card-lift overflow-hidden"
              >
                {/* Subtle top indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isRegistered ? 'bg-emerald-500' : 'bg-blue-500/80'
                  }`}
                />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                      {expo.theme || 'Industry Exhibition'}
                    </span>
                    <StatusBadge status={expo.status} />
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-blue-400 transition-colors line-clamp-1">
                    {expo.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {expo.description || 'Participate in cutting-edge keynote sessions, product launches, and expo booths.'}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>
                        {expoDate
                          ? expoDate.toLocaleDateString(undefined, {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Date TBD'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{expo.location || 'Convention Center'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  {isRegistered ? (
                    <div className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <Check className="w-3.5 h-3.5" />
                      <span>Registration Confirmed</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleRegister(expo._id)}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl btn-primary disabled:opacity-50 shadow-xs"
                    >
                      {isProcessing && <LoadingSpinner size="sm" />}
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Registering...' : 'Register for Expo'}</span>
                    </button>
                  )}

                  <Link
                    to={`/attendee/expos/${expo._id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>View Schedule & Floor Map</span>
                    <ArrowRight className="w-3 h-3 ml-1 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendeeExposPage;
