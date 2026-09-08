import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Pencil,
  Trash2,
  Calendar,
  Search,
  List,
} from 'lucide-react';

const formatTimeRange = (startTime, endTime) => {
  if (!startTime) return '—';
  const start = new Date(startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const end = endTime
    ? new Date(endTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
  return end ? `${start} – ${end}` : start;
};

const getDurationString = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  const diffMs = new Date(endTime) - new Date(startTime);
  if (diffMs <= 0) return null;
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`;
};

const stageColors = [
  '#3B82F6', // Blue
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
];

const SessionsTable = ({ sessions = [], onEdit, onDelete }) => {
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'table'
  const [searchQuery, setSearchQuery] = useState('');

  // Sort sessions chronologically
  const sortedSessions = [...sessions].sort((a, b) => {
    const timeA = new Date(a.startTime).getTime() || 0;
    const timeB = new Date(b.startTime).getTime() || 0;
    return timeA - timeB;
  });

  const filteredSessions = sortedSessions.filter((session) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      session.topic?.toLowerCase().includes(q) ||
      session.speaker?.toLowerCase().includes(q) ||
      session.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Search & Layout View Switcher */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.7) 0%, rgba(17, 21, 32, 0.95) 100%)',
          borderColor: 'rgba(148, 163, 184, 0.12)',
        }}
        className="p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
            {filteredSessions.length}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Program Sessions
            </h4>
            <p className="text-[11px] text-slate-400">
              {sessions.length} total scheduled timeline entries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topic or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Timeline View"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          No scheduled sessions match your search.
        </div>
      ) : viewMode === 'timeline' ? (
        /* Modern Timeline Layout */
        <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {filteredSessions.map((session, index) => {
            const accentColor = stageColors[index % stageColors.length];
            const duration = getDurationString(session.startTime, session.endTime);

            return (
              <div key={session._id} className="relative group">
                {/* Timeline node circle */}
                <div
                  style={{ backgroundColor: accentColor }}
                  className="absolute -left-6 sm:-left-8 top-5 w-3 h-3 rounded-full border-2 border-[#090C12] transition-transform group-hover:scale-110"
                />

                <div
                  style={{
                    background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(17, 21, 32, 0.95) 100%)',
                    borderColor: 'rgba(148, 163, 184, 0.12)',
                  }}
                  className="border rounded-2xl p-4 sm:p-5 shadow-xs card-lift flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Header with Timing & Duration Badge */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeRange(session.startTime, session.endTime)}</span>
                      </div>

                      {duration && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium border border-slate-700/50">
                          {duration}
                        </span>
                      )}

                      <div className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span className="font-medium text-slate-300">
                          {session.location || 'Main Stage'}
                        </span>
                      </div>
                    </div>

                    {/* Topic Title */}
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                      {session.topic}
                    </h3>

                    {/* Speaker Avatar Chip */}
                    <div className="flex items-center gap-2 pt-1">
                      <div
                        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold uppercase"
                      >
                        {session.speaker ? session.speaker.charAt(0) : 'S'}
                      </div>
                      <span className="text-xs font-medium text-slate-300">
                        {session.speaker || 'Unannounced Keynote Speaker'}
                      </span>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => onEdit(session)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all hover:text-white"
                      title="Edit Session"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(session)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
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
                  <th className="py-3.5 px-5">Topic / Title</th>
                  <th className="py-3.5 px-4">Speaker</th>
                  <th className="py-3.5 px-4">Stage / Room</th>
                  <th className="py-3.5 px-4">Time Window</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSessions.map((session) => (
                  <tr key={session._id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-white">
                      {session.topic}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                          {session.speaker ? session.speaker.charAt(0) : 'S'}
                        </div>
                        <span>{session.speaker || 'TBD'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{session.location || 'Main Stage'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>{formatTimeRange(session.startTime, session.endTime)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(session)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Session"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(session)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Session"
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

export default SessionsTable;
