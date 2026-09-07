import React from 'react';
import { User, MapPin, Clock, Pencil, Trash2 } from 'lucide-react';

const SessionsTable = ({ sessions = [], onEdit, onDelete }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="border rounded-[10px] overflow-hidden shadow-xs"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="table-header border-b" style={{ borderColor: 'var(--color-border)' }}>
              <th className="py-3 px-4">Topic / Title</th>
              <th className="py-3 px-4">Speaker / Host</th>
              <th className="py-3 px-4">Stage / Location</th>
              <th className="py-3 px-4">Time Window</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            {sessions.map((session) => (
              <tr key={session._id} className="table-row-hover">
                <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                  {session.topic}
                </td>
                <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    <span>{session.speaker || 'TBD'}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    <span>{session.location || 'Main Stage'}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    <span>
                      {session.startTime
                        ? new Date(session.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}{' '}
                      -{' '}
                      {session.endTime
                        ? new Date(session.endTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(session)}
                      className="p-1.5 rounded-md text-[var(--color-text-dim)] hover:text-white hover:bg-[var(--color-surface-alt)] transition-colors"
                      title="Edit Session"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(session)}
                      className="p-1.5 rounded-md text-[var(--color-text-dim)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-muted)] transition-colors"
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
  );
};

export default SessionsTable;
