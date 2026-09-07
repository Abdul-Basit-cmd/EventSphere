import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchExpos } from '../../api/expoApi';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ExhibitorGuard from '../../components/ExhibitorGuard';

const BrowseExposPage = () => {
  const [expos, setExpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadExpos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchExpos({ limit: 100 });
      setExpos(response.data?.expos || []);
    } catch (error) {
      toast.error('Failed to load available expos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpos();
  }, [loadExpos]);

  return (
    <ExhibitorGuard requiresSubmitted>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading exhibitions...</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-6xl">
          <div className="page-header-accent">
            <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">Browse Scheduled Expos</h2>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
              Explore upcoming industry exhibitions and select floorplans to book vendor booths
            </p>
          </div>

          {expos.length === 0 ? (
            <EmptyState
              title="No exhibitions scheduled"
              message="There are currently no active or upcoming expos listed."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {expos.map((expo) => (
                <div
                  key={expo._id}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                  className="p-5 rounded-[10px] border flex flex-col justify-between space-y-4 card-lift"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 style={{ color: 'var(--color-text)' }} className="text-base font-bold line-clamp-1">
                        {expo.title}
                      </h3>
                      <StatusBadge status={expo.status} />
                    </div>

                    {expo.theme && (
                      <p style={{ color: 'var(--color-primary)' }} className="text-[11px] font-semibold uppercase tracking-wider">
                        {expo.theme}
                      </p>
                    )}

                    <p style={{ color: 'var(--color-text-muted)' }} className="text-xs line-clamp-2 leading-relaxed">
                      {expo.description || 'Join key industry leaders and visitors at this expo.'}
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

                  <div style={{ borderColor: 'var(--color-border)' }} className="pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => navigate(`/exhibitor/expos/${expo._id}/booths`)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg btn-primary"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>View Floorplan Booths</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ExhibitorGuard>
  );
};

export default BrowseExposPage;
