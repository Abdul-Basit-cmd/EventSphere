import React, { useState } from 'react';
import { CheckCircle2, Building2, Search, MapPin, Sparkles } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const sizeDimensions = {
  small: '10 × 10 ft',
  medium: '20 × 20 ft',
  large: '30 × 30 ft',
};

const ExpoBoothsTab = ({
  booths = [],
  visitedBoothIds = new Set(),
  onCheckIn,
  isCheckingInId = null,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'visited' | 'unvisited'

  if (booths.length === 0) {
    return (
      <EmptyState
        title="No booths allocated"
        message="Floor plan booths have not been published for this exhibition yet."
      />
    );
  }

  const visitedCount = visitedBoothIds.size;
  const total = booths.length;

  const filteredBooths = booths.filter((booth) => {
    const isVisited = visitedBoothIds.has(booth._id);
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'visited' && isVisited) ||
      (filterType === 'unvisited' && !isVisited);

    const matchesSearch =
      search === '' ||
      booth.boothNumber?.toLowerCase().includes(search.toLowerCase()) ||
      booth.assignedTo?.companyName?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Floor Plan Explorer Header */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.7) 0%, rgba(17, 21, 32, 0.95) 100%)',
          borderColor: 'rgba(148, 163, 184, 0.12)',
        }}
        className="p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Interactive Floor Map & Passport
            </h4>
            <p className="text-[11px] text-slate-400">
              Check in at booths as you walk the exhibition floor to log visits
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Visited Progress Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {visitedCount} / {total} Visited
            </span>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search booth or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {filteredBooths.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          No booths match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooths.map((booth) => {
            const isVisited = visitedBoothIds.has(booth._id);
            const isProcessing = isCheckingInId === booth._id;
            const vendor = booth.assignedTo;

            return (
              <div
                key={booth._id}
                style={{
                  background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(17, 21, 32, 0.95) 100%)',
                  borderColor: isVisited
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'rgba(148, 163, 184, 0.12)',
                }}
                className="group relative border rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-4 card-lift overflow-hidden"
              >
                {/* Top visited highlight bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isVisited ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                        #{booth.boothNumber}
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Exhibition Space
                        </span>
                        <span className="text-xs font-bold text-white capitalize">
                          {booth.size || 'Standard'} ({sizeDimensions[booth.size] || '10×10'})
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={booth.status} />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <p className="text-xs font-bold text-white truncate">
                        {vendor?.companyName || 'Available Space'}
                      </p>
                    </div>
                    {vendor?.industry && (
                      <p className="text-[11px] text-slate-400 pl-5">
                        {vendor.industry}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  {isVisited ? (
                    <div className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Check-In Verified</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => onCheckIn(booth._id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl btn-primary disabled:opacity-50"
                    >
                      {isProcessing && <LoadingSpinner size="sm" />}
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Verifying Visit...' : 'Check In at Booth'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpoBoothsTab;
