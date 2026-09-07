import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const ExpoBoothsTab = ({
  booths = [],
  visitedBoothIds = new Set(),
  onCheckIn,
  isCheckingInId = null,
}) => {
  if (booths.length === 0) {
    return (
      <EmptyState
        title="No booths allocated"
        message="Floorplan booths have not been published for this exhibition yet."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {booths.map((booth) => {
        const isVisited = visitedBoothIds.has(booth._id);
        const isProcessing = isCheckingInId === booth._id;
        const vendor = booth.assignedTo;

        return (
          <div
            key={booth._id}
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
            className="p-4 rounded-[10px] border flex flex-col justify-between space-y-4 card-lift"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                  <Layers className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  <span>Booth #{booth.boothNumber}</span>
                </div>
                <StatusBadge status={booth.status} />
              </div>

              <div>
                <p style={{ color: 'var(--color-text)' }} className="text-xs font-semibold">
                  {vendor?.companyName || 'Unassigned Booth'}
                </p>
                <p style={{ color: 'var(--color-text-muted)' }} className="text-[11px] capitalize">
                  Size: {booth.size || 'Standard'}
                </p>
              </div>
            </div>

            <div style={{ borderColor: 'var(--color-border)' }} className="pt-2 border-t">
              {isVisited ? (
                <div
                  style={{
                    backgroundColor: 'var(--color-success-muted)',
                    borderColor: 'var(--color-success)',
                    color: 'var(--color-success)',
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Visited</span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => onCheckIn(booth._id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
                >
                  {isProcessing && <LoadingSpinner size="sm" />}
                  <span>{isProcessing ? 'Checking in...' : 'Check In at Booth'}</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpoBoothsTab;
