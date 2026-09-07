import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Building2,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDashboard } from '../../api/exhibitorPortalApi';
import { useExhibitorStatus } from '../../hooks/useExhibitorStatus';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardBoothsTable from './DashboardBoothsTable';

const ExhibitorDashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isSubmitted,
    isApproved,
    isPending,
    isRejected,
    approvalStatus,
  } = useExhibitorStatus();

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDashboard();
      setData(response.data || {});
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to load dashboard metrics';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading exhibitor dashboard...</p>
      </div>
    );
  }

  const booths = data?.booths || [];
  const unreadInquiries = data?.unreadInquiries ?? 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="page-header-accent">
        <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">Exhibitor Dashboard</h2>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
          Overview of application status, assigned booths, and commercial inquiries
        </p>
      </div>

      {/* 1. Incomplete profile banner */}
      {!isSubmitted && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-primary)',
            borderLeft: '3px solid var(--color-primary)',
          }}
          className="p-4 rounded-[10px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }} className="p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">
                Profile Incomplete
              </h4>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
                Complete and submit your company profile to unlock floorplan booth reservations.
              </p>
            </div>
          </div>
          <Link
            to="/exhibitor/profile"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg btn-primary self-start sm:self-auto"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2. Pending review banner */}
      {isPending && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-warning)',
            borderLeft: '3px solid var(--color-warning)',
          }}
          className="p-4 rounded-[10px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: 'var(--color-warning-muted)', color: 'var(--color-warning)' }} className="p-2 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 style={{ color: 'var(--color-warning)' }} className="text-sm font-semibold">
                Application Under Review
              </h4>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
                Your profile has been submitted and is currently being reviewed by organizers. Booth reservations will unlock upon approval.
              </p>
            </div>
          </div>
          <Link
            to="/exhibitor/profile"
            style={{
              borderColor: 'var(--color-warning)',
              color: 'var(--color-warning)',
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border hover:bg-[var(--color-warning-muted)] transition-colors self-start sm:self-auto"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 3. Rejected banner */}
      {isRejected && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-danger)',
            borderLeft: '3px solid var(--color-danger)',
          }}
          className="p-4 rounded-[10px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: 'var(--color-danger-muted)', color: 'var(--color-danger)' }} className="p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 style={{ color: 'var(--color-danger)' }} className="text-sm font-semibold">
                Application Requires Revisions
              </h4>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
                Your exhibitor application was rejected. Please review organizer feedback and update your profile.
              </p>
            </div>
          </div>
          <Link
            to="/exhibitor/profile"
            style={{
              borderColor: 'var(--color-danger)',
              color: 'var(--color-danger)',
            }}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border hover:bg-[var(--color-danger-muted)] transition-colors self-start sm:self-auto"
          >
            <span>Review & Edit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Profile Approval Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            borderTop: '2px solid var(--color-primary)',
          }}
          className="p-5 rounded-[10px] border space-y-3 card-lift"
        >
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--color-text-muted)' }} className="text-xs uppercase font-semibold">
              Application Status
            </span>
            <Building2 className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={approvalStatus || 'draft'} />
          </div>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
            {isApproved
              ? 'Application approved'
              : isPending
              ? 'Profile submitted for organizer review'
              : isRejected
              ? 'Revisions required'
              : 'Profile is in draft mode'}
          </p>
        </div>

        {/* Booths Count Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            borderTop: '2px solid var(--color-primary)',
          }}
          className="p-5 rounded-[10px] border space-y-2 card-lift"
        >
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--color-text-muted)' }} className="text-xs uppercase font-semibold">
              Assigned Booths
            </span>
            <Layers className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          <div style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }} className="text-3xl font-bold">
            {booths.length}
          </div>
          <Link
            to="/exhibitor/booths"
            style={{ color: 'var(--color-primary)' }}
            className="inline-flex items-center gap-1 text-xs hover:underline pt-1 font-semibold"
          >
            <span>View booth assignments</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Unread Inquiries Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            borderTop: '2px solid var(--color-primary)',
          }}
          className="p-5 rounded-[10px] border space-y-2 card-lift"
        >
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--color-text-muted)' }} className="text-xs uppercase font-semibold">
              Inquiries Inbox
            </span>
            <MessageSquare className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          <div style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }} className="text-3xl font-bold">
            {unreadInquiries}
          </div>
          <Link
            to="/exhibitor/inquiries"
            style={{ color: 'var(--color-primary)' }}
            className="inline-flex items-center gap-1 text-xs hover:underline pt-1 font-semibold"
          >
            <span>{unreadInquiries > 0 ? 'Review unread inquiries' : 'Go to inquiries'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Assigned Booths Table */}
      <DashboardBoothsTable booths={booths} />
    </div>
  );
};

export default ExhibitorDashboardPage;
