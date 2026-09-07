import React from 'react';
import { Bookmark, Eye } from 'lucide-react';

const DashboardTables = ({ popularSessions = [], boothTraffic = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top 5 Popular Sessions */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className="border rounded-[10px] p-6 shadow-xs card-lift"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">
            Top 5 Popular Sessions
          </h3>
        </div>

        {popularSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="table-header border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="py-2.5 pr-3">Topic</th>
                  <th className="py-2.5 px-3">Speaker</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 pl-3 text-right">Bookmarks</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                {popularSessions.map((session, index) => (
                  <tr key={session.sessionId || index} className="table-row-hover">
                    <td className="py-2.5 pr-3 font-medium" style={{ color: 'var(--color-text)' }}>
                      {session.topic}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }} className="py-2.5 px-3">
                      {session.speaker || 'TBD'}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }} className="py-2.5 px-3">
                      {session.location || 'Hall'}
                    </td>
                    <td className="py-2.5 pl-3 text-right font-semibold" style={{ color: 'var(--color-accent)' }}>
                      {session.bookmarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-dim)' }} className="text-xs py-6 text-center">
            No session bookmark data available.
          </p>
        )}
      </div>

      {/* Top 10 Booth Traffic */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className="border rounded-[10px] p-6 shadow-xs card-lift"
      >
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">
            Top 10 Booth Traffic
          </h3>
        </div>

        {boothTraffic.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="table-header border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="py-2.5 pr-3">Booth</th>
                  <th className="py-2.5 px-3">Exhibitor</th>
                  <th className="py-2.5 px-3 text-right">Total Visits</th>
                  <th className="py-2.5 pl-3 text-right">Unique</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                {boothTraffic.map((traffic, index) => (
                  <tr key={traffic.boothId || index} className="table-row-hover">
                    <td className="py-2.5 pr-3 font-semibold" style={{ color: 'var(--color-text)' }}>
                      #{traffic.boothNumber}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }} className="py-2.5 px-3">
                      {traffic.exhibitorName || 'Unassigned'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium" style={{ color: 'var(--color-text)' }}>
                      {traffic.visits}
                    </td>
                    <td style={{ color: 'var(--color-text-dim)' }} className="py-2.5 pl-3 text-right">
                      {traffic.uniqueVisitors}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-dim)' }} className="text-xs py-6 text-center">
            No booth visits recorded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardTables;
