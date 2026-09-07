import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyBooths } from '../../api/exhibitorPortalApi';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ExhibitorGuard from '../../components/ExhibitorGuard';

const MyBoothsPage = () => {
  const [booths, setBooths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoProfile, setHasNoProfile] = useState(false);

  const loadBooths = useCallback(async () => {
    setIsLoading(true);
    setHasNoProfile(false);
    try {
      const response = await getMyBooths();
      setBooths(response.data?.booths || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setBooths([]);
        setHasNoProfile(true);
      } else {
        toast.error('Failed to load your reserved booths');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooths();
  }, [loadBooths]);

  return (
    <ExhibitorGuard requiresSubmitted requiresApproval>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading your booth assignments...</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-6xl">
          <div style={{ borderColor: 'var(--color-border)' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div className="page-header-accent">
              <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">My Assigned & Reserved Booths</h2>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
                Overview of your company's confirmed spaces across events
              </p>
            </div>
            <Link
              to="/exhibitor/expos"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg btn-primary"
            >
              <span>Find & Reserve More Booths</span>
            </Link>
          </div>

          {hasNoProfile ? (
            <EmptyState
              title="Exhibitor Profile Required"
              message="You haven't created an exhibitor profile yet. Complete and submit your profile to view and manage your booth reservations."
              action={
                <Link
                  to="/exhibitor/profile"
                  className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg btn-primary"
                >
                  Create Profile
                </Link>
              }
            />
          ) : booths.length === 0 ? (
            <EmptyState
              title="No booths currently assigned"
              message="You haven't reserved any booths yet. Browse upcoming expos to secure your space."
              action={
                <Link
                  to="/exhibitor/expos"
                  className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg btn-primary"
                >
                  Browse Expos
                </Link>
              }
            />
          ) : (
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
                      <th className="py-3 px-4">Booth</th>
                      <th className="py-3 px-4">Expo</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Dimensions</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                    {booths.map((booth) => (
                      <tr key={booth._id} className="table-row-hover">
                        <td className="py-3.5 px-4 font-bold">
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                            <span>#{booth.boothNumber}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium">
                          {booth.expoId?.title || 'Exhibition'}
                        </td>
                        <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4">
                          {booth.expoId?.location || 'Main Floor'}
                        </td>
                        <td style={{ color: 'var(--color-text-muted)' }} className="py-3.5 px-4 capitalize">
                          {booth.size || 'Standard'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <StatusBadge status={booth.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </ExhibitorGuard>
  );
};

export default MyBoothsPage;
