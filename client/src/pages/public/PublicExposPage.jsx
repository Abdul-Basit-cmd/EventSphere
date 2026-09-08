import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  ArrowRight,
  UserPlus,
  Layers,
  Search,
  Sparkles,
  Filter,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchExpos } from '../../api/expoApi';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getExpoCoverImage } from '../../utils/expoImages';

const PublicExposPage = () => {
  const [expos, setExpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('ALL');
  const { isAuthenticated } = useAuthStore();

  const loadExpos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchExpos({ limit: 100 });
      setExpos(response.data?.expos || []);
    } catch (error) {
      toast.error('Failed to load upcoming exhibitions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpos();
  }, [loadExpos]);

  // Extract unique themes for filter pills
  const availableThemes = useMemo(() => {
    const themes = new Set();
    expos.forEach((e) => {
      if (e.theme && e.theme.trim()) {
        themes.add(e.theme.trim());
      }
    });
    return ['ALL', ...Array.from(themes).slice(0, 5)];
  }, [expos]);

  const filteredExpos = useMemo(() => {
    return expos.filter((expo) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        expo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expo.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expo.theme?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTheme =
        selectedTheme === 'ALL' ||
        (expo.theme && expo.theme.toLowerCase() === selectedTheme.toLowerCase());

      return matchesSearch && matchesTheme;
    });
  }, [expos, searchQuery, selectedTheme]);

  return (
    <div className="space-y-8">
      {/* 1. Page Header with subtle background depth */}
      <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-[11px] font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover & Register</span>
          </div>

          <h1
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            Upcoming Industry Exhibitions
          </h1>

          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm leading-relaxed">
            Explore world-class exhibitions, reserve floorplan booth units, and join verified keynote speaker sessions.
          </p>
        </div>

        {/* Search & Theme Filter Controls */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search expos by title, topic, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/50"
            />
          </div>

          {/* Theme Quick-Filter Pills */}
          {availableThemes.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden sm:inline" />
              {availableThemes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                    selectedTheme === theme
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Loading State or Exhibitions Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] rounded-2xl border border-slate-800/60 bg-slate-900/30">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">
            Discovering industry exhibitions...
          </p>
        </div>
      ) : filteredExpos.length === 0 ? (
        <EmptyState
          title="No scheduled expos found"
          message={
            searchQuery || selectedTheme !== 'ALL'
              ? 'No exhibitions match your current search or theme filter. Try clearing filters.'
              : 'There are currently no active public exhibitions listed. Please check back soon.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpos.map((expo, idx) => {
            const coverImage = getExpoCoverImage(expo, idx);
            return (
              <motion.div
                key={expo._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.06 * idx, ease: 'easeOut' }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md overflow-hidden hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20"
              >
                {/* Image Cover Banner with Gradient Overlay */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={coverImage}
                    alt={expo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-[#0E131F]/35 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    {expo.theme ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-blue-400 border border-blue-500/30">
                        {expo.theme}
                      </span>
                    ) : (
                      <span />
                    )}
                    <StatusBadge status={expo.status} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3
                      style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
                      className="text-base font-bold line-clamp-1 group-hover:text-blue-300 transition-colors"
                    >
                      {expo.title}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)' }} className="text-xs line-clamp-2 leading-relaxed">
                      {expo.description || 'Join leading organizations and industry delegates at this exhibition.'}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/70 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{expo.date ? new Date(expo.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{expo.location || 'Exhibition Grounds'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/70 space-y-2">
                    {isAuthenticated ? (
                      <Link
                        to="/attendee/expos"
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg btn-primary"
                      >
                        <span>Register in Portal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        to="/auth/login"
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg btn-primary"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Login to Register</span>
                      </Link>
                    )}

                    <Link
                      to={`/expos/${expo._id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>View Public Schedule</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicExposPage;
