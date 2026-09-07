import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, UserPlus, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchExpos } from '../../api/expoApi';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const PublicExposPage = () => {
  const [expos, setExpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  const loadExpos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchExpos({ limit: 100 });
      setExpos(response.data?.expos || []);
    } catch (error) {
      toast.error('Failed to load upcoming exhibitions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpos();
  }, [loadExpos]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">
          Discovering industry exhibitions...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ borderColor: 'var(--color-border)' }} className="space-y-1 border-b pb-4">
        <h1
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          className="text-2xl font-bold tracking-tight"
        >
          Upcoming Industry Exhibitions
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
          Explore world-class exhibitions, discover cutting-edge vendor booths, and join keynote speaker sessions
        </p>
      </div>

      {expos.length === 0 ? (
        <EmptyState
          title="No scheduled expos"
          message="There are currently no active public exhibitions listed. Please check back soon."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {expos.map((expo, idx) => (
            <motion.div
              key={expo._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.08 * idx, ease: 'easeOut' }}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              className="p-5 rounded-[10px] border flex flex-col justify-between space-y-4 shadow-xs card-lift"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 style={{ color: 'var(--color-text)' }} className="text-base font-semibold line-clamp-1">
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
                  {expo.description || 'Join leading organizations and industry delegates at this exhibition.'}
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
                {isAuthenticated ? (
                  <Link
                    to="/attendee/expos"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg btn-primary"
                  >
                    <span>Register in Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    to="/auth/login"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg btn-primary"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Login to Register</span>
                  </Link>
                )}

                <Link
                  to={`/expos/${expo._id}`}
                  style={{ color: 'var(--color-text-muted)' }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg hover:text-white hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View Public Schedule</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicExposPage;
