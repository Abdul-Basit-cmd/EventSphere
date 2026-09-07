import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Layers, Clock, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const ExpoTable = ({ expos = [], onEdit, onDelete }) => {
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
              <th className="py-3 px-4">Title & Theme</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Management</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            {expos.map((expo) => (
              <tr key={expo._id} className="table-row-hover">
                <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                  <div>{expo.title}</div>
                  {expo.theme && (
                    <div style={{ color: 'var(--color-primary)' }} className="text-[11px] font-normal">
                      {expo.theme}
                    </div>
                  )}
                </td>
                <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    <span>{expo.date ? new Date(expo.date).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    <span>{expo.location || 'Not specified'}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={expo.status} />
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2 text-xs">
                    <Link
                      to={`/admin/expos/${expo._id}/booths`}
                      style={{
                        backgroundColor: 'var(--color-surface-alt)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-[var(--color-border)] transition-colors font-medium"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Booths</span>
                    </Link>
                    <Link
                      to={`/admin/expos/${expo._id}/schedule`}
                      style={{
                        backgroundColor: 'var(--color-surface-alt)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-[var(--color-border)] transition-colors font-medium"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Schedule</span>
                    </Link>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(expo)}
                      className="p-1.5 rounded-md text-[var(--color-text-dim)] hover:text-white hover:bg-[var(--color-surface-alt)] transition-colors"
                      title="Edit Expo"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(expo)}
                      className="p-1.5 rounded-md text-[var(--color-text-dim)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-muted)] transition-colors"
                      title="Delete Expo"
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

export default ExpoTable;
