import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Building2, User, Calendar, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchExhibitors } from '../../api/exhibitorApi';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const ExhibitorsPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [exhibitors, setExhibitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadExhibitorsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchExhibitors(statusFilter);
      setExhibitors(response.data?.profiles || []);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch exhibitors';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadExhibitorsList();
  }, [loadExhibitorsList]);

  const tabs = [
    { id: 'all', label: 'All Exhibitors' },
    { id: 'pending', label: 'Pending Review' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const handleRowClick = (exhibitorId) => {
    navigate(`/admin/exhibitors/${exhibitorId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header-accent">
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold tracking-tight">
            Exhibitor Profiles
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
            Review vendor applications, verify credentials, and manage approvals
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ borderColor: 'var(--color-border)' }} className="flex items-center gap-2 border-b pb-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap hover:text-white"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Exhibitors List Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs font-medium">
            Loading exhibitors...
          </p>
        </div>
      ) : exhibitors.length === 0 ? (
        <EmptyState
          title={`No ${statusFilter === 'all' ? '' : statusFilter} exhibitors found`}
          message="No vendor profiles match the selected status category."
        />
      ) : (
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
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Account Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                {exhibitors.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => handleRowClick(item._id)}
                    className="table-row-hover cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span>{item.companyName || 'Unnamed Company'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">
                      {item.contactPerson || item.userId?.name || '—'}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4 font-mono text-[11px]">
                      {item.userId?.email || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.approvalStatus || 'pending'} />
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleDateString()
                        : item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleRowClick(item._id)}
                        style={{
                          backgroundColor: 'var(--color-surface-alt)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border hover:bg-[var(--color-border)] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitorsPage;
