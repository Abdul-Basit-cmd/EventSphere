import React from 'react';
import { Building2, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const DirectoryTable = ({
  exhibitors = [],
  pagination,
  onPageChange,
  onOpenInquiry,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="rounded-[10px] border overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="table-header border-b" style={{ borderColor: 'var(--color-border)' }}>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Industry</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Website</th>
              <th className="py-3 px-4 text-right">Connect</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            {exhibitors.map((exhibitor) => {
              const hasUserId = Boolean(exhibitor.userId);
              return (
                <tr key={exhibitor._id} className="table-row-hover">
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      <span>{exhibitor.companyName}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">{exhibitor.industry}</td>
                  <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">{exhibitor.contactPerson || '—'}</td>
                  <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">
                    {exhibitor.website ? (
                      <a
                        href={exhibitor.website}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--color-primary)' }}
                        className="hover:underline truncate max-w-[150px] inline-block"
                      >
                        {exhibitor.website}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {hasUserId ? (
                      <button
                        type="button"
                        onClick={() => onOpenInquiry(exhibitor)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg btn-primary"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Inquiry</span>
                      </button>
                    ) : (
                      <span style={{ color: 'var(--color-text-dim)' }} className="text-[11px]">
                        {exhibitor.contactPhone || 'Contact direct'}
                      </span>
                    )}
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
          className="p-3 border-t flex items-center justify-between text-xs"
        >
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              className="p-1 rounded border hover:bg-[var(--color-border)] disabled:opacity-30 transition-colors"
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
              className="p-1 rounded border hover:bg-[var(--color-border)] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryTable;
