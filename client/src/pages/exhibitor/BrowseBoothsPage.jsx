import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getExpoBooths, reserveBooth } from '../../api/boothBrowseApi';
import { fetchExpoById } from '../../api/expoApi';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ExhibitorGuard from '../../components/ExhibitorGuard';

const sizeDimensions = {
  small: { label: 'Small', dim: '10 × 10 ft', area: '100 sq ft' },
  medium: { label: 'Medium', dim: '20 × 20 ft', area: '400 sq ft' },
  large: { label: 'Large', dim: '30 × 30 ft', area: '900 sq ft' },
};

const BrowseBoothsPage = () => {
  const { expoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [expo, setExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reservingId, setReservingId] = useState(null);

  // Filter state
  const [sizeFilter, setSizeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'available' | 'reserved'
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [expoRes, boothsRes] = await Promise.all([
        fetchExpoById(expoId),
        getExpoBooths(expoId),
      ]);
      setExpo(expoRes.data?.expo || null);
      setBooths(boothsRes.data?.booths || []);
    } catch (error) {
      toast.error('Failed to load expo booths');
    } finally {
      setIsLoading(false);
    }
  }, [expoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReserve = async (boothId) => {
    if (!user?.onboardingComplete || user?.approvalStatus === 'rejected') {
      toast.error('Complete and submit your profile before reserving a booth');
      navigate('/exhibitor/profile');
      return;
    }

    setReservingId(boothId);
    try {
      await reserveBooth(expoId, boothId);
      toast.success('Booth reserved successfully! Our team will follow up.');
      loadData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to reserve booth';
      toast.error(msg);
    } finally {
      setReservingId(null);
    }
  };

  const totalBooths = booths.length;
  const availableBooths = booths.filter((b) => b.status === 'available').length;
  const reservedBooths = booths.filter((b) => b.status === 'reserved').length;
  const assignedBooths = booths.filter((b) => b.status === 'assigned').length;

  const filteredBooths = booths.filter((booth) => {
    const matchesSize = sizeFilter === 'all' || booth.size === sizeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && booth.status === 'available') ||
      (statusFilter === 'taken' && booth.status !== 'available');
    const matchesSearch =
      searchQuery === '' ||
      booth.boothNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSize && matchesStatus && matchesSearch;
  });

  return (
    <ExhibitorGuard requiresSubmitted requiresApproval>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          <LoadingSpinner size="lg" />
          <p className="mt-3 text-xs text-slate-400">Loading booth availability...</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <button
              type="button"
              onClick={() => navigate('/exhibitor/expos')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-colors"
              title="Back to Expos"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="page-header-accent">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {expo?.title || 'Expo'} — Floor Plan Booths
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Browse open exhibition lots and reserve prime floor presence for your brand
              </p>
            </div>
          </div>

          {/* Interactive Filter & Floor Summary Bar */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.7) 0%, rgba(17, 21, 32, 0.95) 100%)',
              borderColor: 'rgba(148, 163, 184, 0.12)',
            }}
            className="p-5 rounded-2xl border shadow-xs space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Size Pill Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                  Size:
                </span>
                {['all', 'small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSizeFilter(size)}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition-all capitalize ${
                      sizeFilter === size
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {size === 'all' ? 'All Sizes' : `${size} (${sizeDimensions[size]?.dim || size})`}
                  </button>
                ))}
              </div>

              {/* Status & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      statusFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({totalBooths})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('available')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      statusFilter === 'available'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Available ({availableBooths})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('taken')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      statusFilter === 'taken'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Taken ({reservedBooths + assignedBooths})
                  </button>
                </div>

                <div className="relative min-w-[180px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search booth #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Quick Floor Stats Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Available: <strong className="text-white">{availableBooths}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Reserved: <strong className="text-white">{reservedBooths}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Assigned: <strong className="text-white">{assignedBooths}</strong></span>
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Click an available booth to initiate immediate reservation
              </span>
            </div>
          </div>

          {booths.length === 0 ? (
            <EmptyState
              title="No booths listed for this expo"
              message="Organizers have not published floor plan booth allocations yet."
            />
          ) : filteredBooths.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/60">
              No booths match your active size or status filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBooths.map((booth) => {
                const isAvailable = booth.status === 'available';
                const isPendingReserve = reservingId === booth._id;
                const sizeSpec = sizeDimensions[booth.size] || sizeDimensions.small;

                return (
                  <div
                    key={booth._id}
                    style={{
                      background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(17, 21, 32, 0.95) 100%)',
                      borderColor: isAvailable
                        ? 'rgba(6, 182, 212, 0.25)'
                        : 'rgba(148, 163, 184, 0.12)',
                    }}
                    className={`group relative border rounded-2xl p-4 shadow-xs card-lift flex flex-col justify-between space-y-4 overflow-hidden ${
                      isAvailable ? 'hover:border-cyan-500/50' : 'opacity-85'
                    }`}
                  >
                    {/* Top status indicator line */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 ${
                        isAvailable ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    />

                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs ${
                            isAvailable
                              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            #{booth.boothNumber}
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                              Booth Space
                            </span>
                            <span className="text-xs font-bold text-white capitalize">
                              {sizeSpec.label}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={booth.status} />
                      </div>

                      {/* Dimension Specs Box */}
                      <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Footprint:</span>
                          <span className="font-semibold text-slate-200">{sizeSpec.dim}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Total Area:</span>
                          <span className="font-semibold text-slate-200">{sizeSpec.area}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div>
                      {isAvailable ? (
                        <button
                          type="button"
                          disabled={isPendingReserve}
                          onClick={() => handleReserve(booth._id)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl btn-primary disabled:opacity-50"
                        >
                          {isPendingReserve ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>{isPendingReserve ? 'Reserving...' : 'Reserve Booth'}</span>
                        </button>
                      ) : (
                        <div className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 cursor-not-allowed">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unavailable</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </ExhibitorGuard>
  );
};

export default BrowseBoothsPage;
