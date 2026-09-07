import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const AdminInquiriesTable = ({
  inquiries = [],
  isLoading,
  selectedInquiry,
  onSelectInquiry,
  pagination,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className="flex flex-col items-center justify-center min-h-[300px] border rounded-xl"
      >
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs font-medium">
          Loading support tickets...
        </p>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <EmptyState
        title="No support inquiries"
        message="There are currently no open support requests in the inbox."
      />
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="border rounded-xl overflow-hidden shadow-xs"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="table-header border-b" style={{ borderColor: 'var(--color-border)' }}>
              <th className="py-3 px-4">Sender</th>
              <th className="py-3 px-4">Subject & Event</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            {inquiries.map((inquiry) => {
              const isSelected = selectedInquiry?._id === inquiry._id;
              return (
                <tr
                  key={inquiry._id}
                  onClick={() => onSelectInquiry(inquiry)}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-surface-alt)' : undefined,
                  }}
                  className="table-row-hover cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                    <div>{inquiry.sender?.name || 'User'}</div>
                    <div style={{ color: 'var(--color-text-dim)' }} className="text-[11px] font-mono font-normal">
                      {inquiry.sender?.email || '—'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium line-clamp-1" style={{ color: 'var(--color-text)' }}>
                      {inquiry.subject}
                    </div>
                    <div style={{ color: 'var(--color-text-dim)' }} className="text-[11px]">
                      {inquiry.expoId?.title || 'General Event'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inquiry.status || 'pending'} />
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4 whitespace-nowrap">
                    {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
          className="px-4 py-3 border-t flex items-center justify-between text-xs"
        >
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              className="p-1 rounded border hover:bg-[var(--color-border)] disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              className="p-1 rounded border hover:bg-[var(--color-border)] disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiriesTable;
