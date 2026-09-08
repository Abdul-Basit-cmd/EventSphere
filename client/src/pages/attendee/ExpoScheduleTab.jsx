import React, { useState } from 'react';
import { Clock, Bookmark, MapPin, Search } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

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

const stageColors = ['#3B82F6', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B'];

const ExpoScheduleTab = ({
  sessions = [],
  bookmarkedSessionIds = new Set(),
  onToggleBookmark,
  isBookmarkingId = null,
}) => {
  const [search, setSearch] = useState('');

  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No sessions published"
        message="The schedule for this exhibition has not been published yet."
      />
    );
  }

  const filteredSessions = sessions.filter((session) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      session.topic?.toLowerCase().includes(q) ||
      session.speaker?.toLowerCase().includes(q) ||
      session.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredSessions.length} sessions ({bookmarkedSessionIds.size} bookmarked)
        </span>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search topic or speaker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="py-10 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          No scheduled sessions matched your search.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session, index) => {
            const isBookmarked = bookmarkedSessionIds.has(session._id);
            const isProcessing = isBookmarkingId === session._id;
            const accentColor = stageColors[index % stageColors.length];

            return (
              <div
                key={session._id}
                style={{
                  background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(17, 21, 32, 0.95) 100%)',
                  borderColor: isBookmarked
                    ? 'rgba(59, 130, 246, 0.35)'
                    : 'rgba(148, 163, 184, 0.12)',
                }}
                className="group relative border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-lift"
              >
                {/* Left Accent Bar */}
                <div
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                  style={{ backgroundColor: accentColor }}
                />

                <div className="space-y-2 flex-1 min-w-0 pl-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeRange(session.startTime, session.endTime)}</span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50 text-[11px]">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>{session.location || 'Main Auditorium'}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    {session.topic}
                  </h4>

                  {session.speaker && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <div
                        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold uppercase"
                      >
                        {session.speaker.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-300 font-medium">
                        {session.speaker}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => onToggleBookmark(session._id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all shrink-0 self-start sm:self-center ${
                    isBookmarked
                      ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {isProcessing ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Bookmark
                      className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`}
                    />
                  )}
                  <span>{isBookmarked ? 'Bookmarked' : 'Add to Schedule'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpoScheduleTab;
