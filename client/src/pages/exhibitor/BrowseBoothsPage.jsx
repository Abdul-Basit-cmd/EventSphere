import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { getExpoBooths, reserveBooth } from '../../api/boothBrowseApi';
import { fetchExpoById } from '../../api/expoApi';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ExhibitorGuard from '../../components/ExhibitorGuard';

const BrowseBoothsPage = () => {
  const { expoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [expo, setExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reservingId, setReservingId] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [expoRes, boothsRes] = await Promise.all([
        fetchExpoById(expoId),
        getExpoBooths(expoId),
      ]);
      setExpo(expoRes.data?.expo || null);
      setBooths(boothsRes.data?.booths || []);
    } catch (error) {
      toast.error('Failed to load expo booths');
    } finally {
      setIsLoading(false);
    }
  }, [expoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReserve = async (boothId) => {
    if (!user?.onboardingComplete || user?.approvalStatus === 'rejected') {
      toast.error('Complete and submit your profile before reserving a booth');
      navigate('/exhibitor/profile');
      return;
    }

    setReservingId(boothId);
    try {
      await reserveBooth(expoId, boothId);
      toast.success('Booth reserved successfully! Our team will follow up.');
      loadData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to reserve booth';
      toast.error(msg);
    } finally {
      setReservingId(null);
    }
  };

  return (
    <ExhibitorGuard requiresSubmitted requiresApproval>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading booth availability...</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-6xl">
          <div style={{ borderColor: 'var(--color-border)' }} className="flex items-center gap-3 border-b pb-4">
            <button
              type="button"
              onClick={() => navigate('/exhibitor/expos')}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-alt)] transition-colors"
              title="Back to Expos"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="page-header-accent">
              <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">
                {expo?.title || 'Expo'} — Floorplan Booths
              </h2>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
                Select an available space to secure your booth reservation
              </p>
            </div>
          </div>

          {booths.length === 0 ? (
            <EmptyState
              title="No booths listed for this expo"
              message="Organizers have not published floorplan booth allocations yet."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {booths.map((booth) => {
                const isAvailable = booth.status === 'available';
                const isPendingReserve = reservingId === booth._id;

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
                      <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
                        Size: <span style={{ color: 'var(--color-text)' }} className="capitalize font-medium">{booth.size || 'Standard'}</span>
                      </p>
                    </div>

                    <div>
                      {isAvailable ? (
                        <button
                          type="button"
                          disabled={isPendingReserve}
                          onClick={() => handleReserve(booth._id)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
                        >
                          {isPendingReserve && <LoadingSpinner size="sm" />}
                          <span>{isPendingReserve ? 'Reserving...' : 'Reserve Booth'}</span>
                        </button>
                      ) : (
                        <div
                          style={{
                            backgroundColor: 'var(--color-surface-alt)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-dim)',
                          }}
                          className="w-full text-center py-1.5 text-xs font-semibold rounded-lg border cursor-not-allowed"
                        >
                          Taken
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </ExhibitorGuard>
  );
};

export default BrowseBoothsPage;
