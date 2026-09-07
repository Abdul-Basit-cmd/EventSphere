import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const ExhibitorDetailHeader = ({
  profile,
  isProcessing,
  onApprove,
  onOpenReject,
  onReopen,
}) => {
  const navigate = useNavigate();
  const isPending = profile.approvalStatus === 'pending';
  const isApprovedOrRejected =
    profile.approvalStatus === 'approved' || profile.approvalStatus === 'rejected';

  return (
    <div className="space-y-4">
      <div style={{ borderColor: 'var(--color-border)' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/exhibitors')}
            className="p-1.5 rounded-lg text-[var(--color-text-dim)] hover:text-white hover:bg-[var(--color-surface-alt)] transition-colors"
            title="Back to exhibitors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {profile.logo && (
            <img
              src={profile.logo}
              alt={profile.companyName || 'Logo'}
              style={{ borderColor: 'var(--color-border)' }}
              className="w-11 h-11 rounded-lg object-cover border shadow-xs"
            />
          )}
          <div className="page-header-accent">
            <div className="flex items-center gap-2.5">
              <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold tracking-tight">
                {profile.companyName || 'Company Profile'}
              </h2>
              <StatusBadge status={profile.approvalStatus || 'pending'} />
            </div>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
              Account: {profile.userId?.email || '—'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isPending && (
            <>
              <button
                type="button"
                disabled={isProcessing}
                onClick={onApprove}
                style={{
                  backgroundColor: 'var(--color-success)',
                  color: 'var(--color-text)',
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 hover:brightness-110"
              >
                {isProcessing ? <LoadingSpinner size="sm" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Approve</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={onOpenReject}
                style={{
                  backgroundColor: 'var(--color-danger-muted)',
                  borderColor: 'var(--color-danger)',
                  color: 'var(--color-danger)',
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-50 hover:bg-[var(--color-danger)] hover:text-white"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </>
          )}

          {isApprovedOrRejected && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onReopen}
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border hover:bg-[var(--color-border)] transition-colors disabled:opacity-50"
            >
              {isProcessing ? <LoadingSpinner size="sm" /> : <RotateCcw className="w-4 h-4" />}
              <span>Reopen Application</span>
            </button>
          )}
        </div>
      </div>

      {/* Review Note Notice if Rejected */}
      {profile.approvalStatus === 'rejected' && profile.approvalNote && (
        <div
          style={{
            backgroundColor: 'var(--color-danger-muted)',
            borderColor: 'var(--color-danger)',
          }}
          className="p-4 rounded-xl border"
        >
          <h4 style={{ color: 'var(--color-danger)' }} className="text-xs font-semibold uppercase tracking-wide mb-1">
            Rejection Reason / Organizer Note
          </h4>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
            {profile.approvalNote}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExhibitorDetailHeader;
