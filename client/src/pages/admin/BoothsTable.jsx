import React, { useState } from 'react';
import {
  Layers,
  Building2,
  UserCheck,
  UserX,
  Trash2,
  LayoutGrid,
  List,
  Search,
  Sparkles,
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const sizeDimensions = {
  small: '10 × 10 ft',
  medium: '20 × 20 ft',
  large: '30 × 30 ft',
};

const BoothsTable = ({ booths = [], onUnassign, onOpenAssign, onDelete }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats calculation
  const total = booths.length;
  const availableCount = booths.filter((b) => b.status === 'available').length;
  const reservedCount = booths.filter((b) => b.status === 'reserved').length;
  const assignedCount = booths.filter((b) => b.status === 'assigned').length;
  const occupancyRate = total > 0 ? Math.round((assignedCount / total) * 100) : 0;

  // Filtered booths
  const filteredBooths = booths.filter((booth) => {
    const matchesStatus = statusFilter === 'all' || booth.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      booth.boothNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.assignedTo?.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Top Controls & Metrics Bar */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.7) 0%, rgba(17, 21, 32, 0.95) 100%)',
          borderColor: 'rgba(148, 163, 184, 0.12)',
        }}
        className="p-5 rounded-2xl border shadow-xs space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Quick Counters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              All Booths ({total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                statusFilter === 'available'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              Available ({availableCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('reserved')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                statusFilter === 'reserved'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              Reserved ({reservedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('assigned')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                statusFilter === 'assigned'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              Assigned ({assignedCount})
            </button>
          </div>

          {/* Search & View Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search booth or exhibitor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Floor Plan Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Floor Plan Space Utilization</span>
            <span className="font-bold text-white">{occupancyRate}% Occupied</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden flex">
            <div
              style={{ width: `${(assignedCount / (total || 1)) * 100}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Assigned: ${assignedCount}`}
            />
            <div
              style={{ width: `${(reservedCount / (total || 1)) * 100}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Reserved: ${reservedCount}`}
            />
            <div
              style={{ width: `${(availableCount / (total || 1)) * 100}%` }}
              className="bg-cyan-500 transition-all duration-500"
              title={`Available: ${availableCount}`}
            />
          </div>
        </div>
      </div>

      {filteredBooths.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          No booths match your active filter criteria.
        </div>
      ) : viewMode === 'grid' ? (
        /* Floor Plan Grid Visualizer */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooths.map((booth) => {
            const isAssigned = booth.status === 'assigned';
            const isReserved = booth.status === 'reserved';
            const isAvailable = booth.status === 'available';

            return (
              <div
                key={booth._id}
                style={{
                  background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(17, 21, 32, 0.95) 100%)',
                  borderColor: isAssigned
                    ? 'rgba(16, 185, 129, 0.3)'
                    : isReserved
                    ? 'rgba(245, 158, 11, 0.3)'
                    : 'rgba(6, 182, 212, 0.25)',
                }}
                className="group relative border rounded-2xl p-4 shadow-xs card-lift flex flex-col justify-between space-y-3 overflow-hidden"
              >
                {/* Top status indicator line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isAssigned
                      ? 'bg-emerald-500'
                      : isReserved
                      ? 'bg-amber-500'
                      : 'bg-cyan-500'
                  }`}
                />

                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-blue-400 font-bold text-xs">
                        #{booth.boothNumber}
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Floor Space
                        </span>
                        <span className="text-xs font-bold text-white capitalize">
                          {booth.size || 'Standard'} ({sizeDimensions[booth.size] || '10×10'})
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={booth.status || 'available'} />
                  </div>

                  {/* Exhibitor Details Box */}
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    {booth.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {booth.assignedTo.companyName || 'Assigned Exhibitor'}
                          </p>
                          <p className="text-[10px] text-emerald-400 font-medium">
                            Confirmed Space
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Available for reservation</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between gap-2">
                  {booth.assignedTo ? (
                    <button
                      type="button"
                      onClick={() => onUnassign(booth._id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                      title="Unassign Exhibitor"
                    >
                      <UserX className="w-3 h-3" />
                      <span>Unassign</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenAssign(booth)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all"
                      title="Assign to Exhibitor"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Assign</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDelete(booth)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Booth"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Polished Detailed Table View */
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.7) 0%, rgba(17, 21, 32, 0.95) 100%)',
            borderColor: 'rgba(148, 163, 184, 0.12)',
          }}
          className="border rounded-2xl overflow-hidden shadow-xs"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-5">Booth Number</th>
                  <th className="py-3.5 px-4">Dimensions</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Exhibitor</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBooths.map((booth) => (
                  <tr key={booth._id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm">#{booth.boothNumber}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 capitalize">
                      {booth.size || 'Standard'} ({sizeDimensions[booth.size] || '10×10'})
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={booth.status || 'available'} />
                    </td>
                    <td className="py-3.5 px-4">
                      {booth.assignedTo ? (
                        <div className="flex items-center gap-2 font-medium text-white">
                          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{booth.assignedTo.companyName || 'Assigned Exhibitor'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {booth.assignedTo ? (
                          <button
                            type="button"
                            onClick={() => onUnassign(booth._id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                            title="Unassign Exhibitor"
                          >
                            <UserX className="w-3 h-3" />
                            <span>Unassign</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenAssign(booth)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-blue-600 hover:text-white transition-all"
                            title="Assign to Exhibitor"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Assign</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDelete(booth)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Booth"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoothsTable;
