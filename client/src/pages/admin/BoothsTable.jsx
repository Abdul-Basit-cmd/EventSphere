import React from 'react';
import { Layers, Building2, UserCheck, UserX, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const BoothsTable = ({ booths = [], onUnassign, onOpenAssign, onDelete }) => {
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
              <th className="py-3 px-4">Booth Number</th>
              <th className="py-3 px-4">Dimensions</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Exhibitor</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            {booths.map((booth) => (
              <tr key={booth._id} className="table-row-hover">
                <td className="py-3.5 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    <span>#{booth.boothNumber}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4 capitalize">
                  {booth.size || 'Standard'}
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={booth.status || 'available'} />
                </td>
                <td className="py-3.5 px-4">
                  {booth.assignedTo ? (
                    <div className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--color-text)' }}>
                      <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />
                      <span>{booth.assignedTo.companyName || 'Assigned Exhibitor'}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--color-text-dim)' }} className="italic">Unassigned</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {booth.assignedTo ? (
                      <button
                        type="button"
                        onClick={() => onUnassign(booth._id)}
                        style={{
                          backgroundColor: 'var(--color-warning-muted)',
                          borderColor: 'var(--color-warning)',
                          color: 'var(--color-warning)',
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border transition-colors hover:brightness-110"
                        title="Unassign Exhibitor"
                      >
                        <UserX className="w-3 h-3" />
                        <span>Unassign</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenAssign(booth)}
                        style={{
                          backgroundColor: 'var(--color-surface-alt)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border hover:bg-[var(--color-border)] transition-colors"
                        title="Assign to Exhibitor"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Assign</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(booth)}
                      className="p-1.5 rounded-md text-[var(--color-text-dim)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-muted)] transition-colors"
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
  );
};

export default BoothsTable;
