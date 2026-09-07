import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const DashboardBoothsTable = ({ booths = [] }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        borderTop: '1px solid var(--color-primary)',
      }}
      className="p-6 rounded-[10px] border space-y-4"
    >
      <div style={{ borderColor: 'var(--color-border)' }} className="flex items-center justify-between border-b pb-3">
        <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">
          Your Reserved & Assigned Floorplan Spaces
        </h3>
        <Link
          to="/exhibitor/expos"
          style={{ color: 'var(--color-primary)' }}
          className="text-xs font-semibold hover:underline"
        >
          Browse more expos →
        </Link>
      </div>

      {booths.length === 0 ? (
        <EmptyState
          title="No booth spaces reserved"
          message="Explore scheduled exhibitions to reserve booth spaces for your brand."
          action={
            <Link
              to="/exhibitor/expos"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg btn-primary"
            >
              <span>Browse Expos</span>
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="table-header">
                <th className="py-2.5 px-3">Booth</th>
                <th className="py-2.5 px-3">Expo Title</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: 'var(--color-border)' }} className="divide-y text-[var(--color-text)]">
              {booths.map((booth) => (
                <tr key={booth._id} className="table-row-hover">
                  <td className="py-3 px-3 font-bold">#{booth.boothNumber}</td>
                  <td className="py-3 px-3">{booth.expoId?.title || 'Expo'}</td>
                  <td style={{ color: 'var(--color-text-muted)' }} className="py-3 px-3">
                    {booth.expoId?.location || 'Main Hall'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <StatusBadge status={booth.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardBoothsTable;
