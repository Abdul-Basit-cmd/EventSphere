import React from 'react';
import { Bookmark, Eye, Trophy, Layers } from 'lucide-react';

const DashboardTables = ({ popularSessions = [], boothTraffic = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top 5 Popular Sessions */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.7) 0%, rgba(17, 21, 32, 0.95) 100%)',
          borderColor: 'rgba(148, 163, 184, 0.12)',
        }}
        className="border rounded-2xl p-6 shadow-xs card-lift flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Bookmark className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Top Popular Sessions
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">By attendee bookmarks</span>
          </div>

          {popularSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 pr-3">Rank & Topic</th>
                    <th className="py-2.5 px-3">Speaker</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 pl-3 text-right">Saves</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {popularSessions.map((session, index) => (
                    <tr key={session.sessionId || index} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pr-3 font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            index === 0
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : index === 1
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-400/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="truncate max-w-[180px] group-hover:text-white transition-colors">
                            {session.topic}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800/70 border border-slate-700/50 text-[11px]">
                          {session.speaker || 'TBD'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {session.location || 'Main Stage'}
                      </td>
                      <td className="py-3 pl-3 text-right font-bold text-cyan-400">
                        {session.bookmarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-10 text-center">
              No session bookmark data recorded yet.
            </p>
          )}
        </div>
      </div>

      {/* Top 10 Booth Traffic */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.7) 0%, rgba(17, 21, 32, 0.95) 100%)',
          borderColor: 'rgba(148, 163, 184, 0.12)',
        }}
        className="border rounded-2xl p-6 shadow-xs card-lift flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                High-Traffic Floor Booths
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Physical check-ins</span>
          </div>

          {boothTraffic.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 pr-3">Booth #</th>
                    <th className="py-2.5 px-3">Exhibitor Company</th>
                    <th className="py-2.5 px-3 text-right">Total Visits</th>
                    <th className="py-2.5 pl-3 text-right">Unique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {boothTraffic.map((traffic, index) => (
                    <tr key={traffic.boothId || index} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pr-3 font-semibold text-white">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-400" />
                          <span>#{traffic.boothNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-medium">
                        {traffic.exhibitorName || 'Unassigned'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
                        {traffic.visits}
                      </td>
                      <td className="py-3 pl-3 text-right text-slate-400 font-mono text-[11px]">
                        {traffic.uniqueVisitors}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-10 text-center">
              No booth check-in traffic recorded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTables;
