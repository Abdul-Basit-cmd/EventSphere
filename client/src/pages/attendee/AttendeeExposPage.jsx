import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Check, ArrowRight, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchExpos } from '../../api/expoApi';
import { registerForExpo, getMySchedule } from '../../api/attendeeApi';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const AttendeeExposPage = () => {
  const [expos, setExpos] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [exposRes, scheduleRes] = await Promise.allSettled([
        fetchExpos({ limit: 100 }),
        isAuthenticated ? getMySchedule() : Promise.resolve({ data: { registrations: [] } }),
      ]);

      if (exposRes.status === 'fulfilled') {
        setExpos(exposRes.value.data?.expos || []);
      } else {
        toast.error('Failed to load exhibitions list');
      }

      if (scheduleRes.status === 'fulfilled' && scheduleRes.value?.data?.registrations) {
        const ids = new Set(
          scheduleRes.value.data.registrations
            .map((r) => r.expo?._id || r.expo)
            .filter(Boolean)
        );
        setRegisteredIds(ids);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRegister = async (expoId) => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    setRegisteringId(expoId);
    try {
      await registerForExpo(expoId);
      toast.success('Successfully registered for this expo!');
      setRegisteredIds((prev) => new Set([...prev, expoId]));
    } catch (error) {
      if (error.response?.status === 400) {
        toast('You are already registered for this expo.', { icon: 'ℹ️' });
        setRegisteredIds((prev) => new Set([...prev, expoId]));
      } else {
        const msg = error.response?.data?.message || 'Failed to register for expo';
        toast.error(msg);
      }
    } finally {
      setRegisteringId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading available exhibitions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="page-header-accent">
        <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">Browse & Register for Expos</h2>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
          Join scheduled industry exhibitions to explore booths and attend speaker sessions
        </p>
      </div>

      {expos.length === 0 ? (
        <EmptyState
          title="No exhibitions scheduled"
          message="There are currently no active or upcoming expos open for attendee registration."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {expos.map((expo) => {
            const isRegistered = registeredIds.has(expo._id);
            const isProcessing = registeringId === expo._id;

            return (
              <div
                key={expo._id}
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                className="p-5 rounded-[10px] border flex flex-col justify-between space-y-4 card-lift"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 style={{ color: 'var(--color-text)' }} className="text-base font-semibold line-clamp-1">{expo.title}</h3>
                    <StatusBadge status={expo.status} />
                  </div>

                  {expo.theme && (
                    <p style={{ color: 'var(--color-primary)' }} className="text-[11px] font-semibold uppercase tracking-wider">
                      {expo.theme}
                    </p>
                  )}

                  <p style={{ color: 'var(--color-text-muted)' }} className="text-xs line-clamp-2 leading-relaxed">
                    {expo.description || 'Participate in exciting keynote sessions and product exhibits.'}
                  </p>

                  <div style={{ color: 'var(--color-text-muted)' }} className="space-y-1.5 pt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                      <span>{expo.date ? new Date(expo.date).toLocaleDateString() : 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                      <span className="truncate">{expo.location || 'Exhibition Grounds'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderColor: 'var(--color-border)' }} className="pt-3 border-t space-y-2">
                  {isRegistered ? (
                    <button
                      type="button"
                      disabled
                      style={{
                        backgroundColor: 'var(--color-success-muted)',
                        borderColor: 'var(--color-success)',
                        color: 'var(--color-success)',
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border cursor-not-allowed"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleRegister(expo._id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
                    >
                      {isProcessing && <LoadingSpinner size="sm" />}
                      <span>{isProcessing ? 'Registering...' : 'Register for Expo'}</span>
                    </button>
                  )}

                  <Link
                    to={`/attendee/expos/${expo._id}`}
                    style={{ color: 'var(--color-text-muted)' }}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg hover:text-white hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>View Schedule & Floorplan</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendeeExposPage;
