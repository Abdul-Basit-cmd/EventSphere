import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Clock, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import { useExhibitorStatus } from '../hooks/useExhibitorStatus';
import LoadingSpinner from './LoadingSpinner';

const ExhibitorGuard = ({
  children,
  requiresSubmitted = false,
  requiresApproval = false,
}) => {
  const {
    isSubmitted,
    isApproved,
    isPending,
    isRejected,
    isLoading,
  } = useExhibitorStatus();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">
          Checking exhibitor permissions...
        </p>
      </div>
    );
  }

  // Check: Requires approval
  if (requiresApproval && !isApproved) {
    let title = 'Application Approval Required';
    let message = 'This section requires an approved exhibitor profile to access.';
    let actionText = 'Go to Profile';
    let actionLink = '/exhibitor/profile';
    let Icon = Lock;
    let iconStyle = {
      color: 'var(--color-primary)',
      background: 'var(--color-primary-muted)',
      borderColor: 'var(--color-primary)',
    };

    if (!isSubmitted) {
      title = 'Profile Submission Required';
      message =
        'You must complete and submit your company profile before reserving booths or viewing neighboring exhibitors.';
      actionText = 'Complete Profile';
      actionLink = '/exhibitor/profile';
      Icon = FileText;
    } else if (isPending) {
      title = 'Application Under Review';
      message =
        'Your exhibitor application has been submitted and is currently awaiting organizer review. This section will unlock automatically once approved.';
      actionText = 'View Submitted Profile';
      actionLink = '/exhibitor/profile';
      Icon = Clock;
      iconStyle = {
        color: 'var(--color-warning)',
        background: 'var(--color-warning-muted)',
        borderColor: 'var(--color-warning)',
      };
    } else if (isRejected) {
      title = 'Application Requires Revisions';
      message =
        'Your exhibitor application was rejected by event organizers. Please review the feedback notes, update your profile, and resubmit for approval.';
      actionText = 'Review & Edit Profile';
      actionLink = '/exhibitor/profile';
      Icon = AlertTriangle;
      iconStyle = {
        color: 'var(--color-danger)',
        background: 'var(--color-danger-muted)',
        borderColor: 'var(--color-danger)',
      };
    }

    return (
      <div
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderTop: '2px solid var(--color-primary)',
        }}
        className="max-w-xl mx-auto my-12 p-8 rounded-xl border text-center space-y-4"
      >
        <div
          style={iconStyle}
          className="w-12 h-12 mx-auto rounded-full border flex items-center justify-center"
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 style={{ color: 'var(--color-text)' }} className="text-base font-bold">
            {title}
          </h3>
          <p
            style={{ color: 'var(--color-text-muted)' }}
            className="text-xs max-w-md mx-auto leading-relaxed"
          >
            {message}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={actionLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Check: Requires submitted only
  if (requiresSubmitted && !isSubmitted) {
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderTop: '2px solid var(--color-primary)',
        }}
        className="max-w-xl mx-auto my-12 p-8 rounded-xl border text-center space-y-4"
      >
        <div
          style={{
            background: 'var(--color-primary-muted)',
            borderColor: 'var(--color-primary)',
            color: 'var(--color-primary)',
          }}
          className="w-12 h-12 mx-auto rounded-full border flex items-center justify-center"
        >
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 style={{ color: 'var(--color-text)' }} className="text-base font-bold">
            Profile Submission Required
          </h3>
          <p
            style={{ color: 'var(--color-text-muted)' }}
            className="text-xs max-w-md mx-auto leading-relaxed"
          >
            Complete and submit your company profile to unlock access to scheduled expos and the exhibitor directory.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/exhibitor/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ExhibitorGuard;
