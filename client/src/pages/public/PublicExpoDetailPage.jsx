import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Layers, UserPlus, Sparkles, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchExpoById } from '../../api/expoApi';
import { fetchSessions } from '../../api/scheduleApi';
import { getExpoBooths } from '../../api/boothBrowseApi';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getExpoCoverImage } from '../../utils/expoImages';

const PublicExpoDetailPage = () => {
  const { expoId } = useParams();
  const [expo, setExpo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [booths, setBooths] = useState([]);
  const [activeTab, setActiveTab] = useState('schedule');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [expoRes, sessionsRes, boothsRes] = await Promise.allSettled([
        fetchExpoById(expoId),
        fetchSessions(expoId),
        getExpoBooths(expoId),
      ]);
      if (expoRes.status === 'fulfilled') setExpo(expoRes.value.data?.expo || null);
      if (sessionsRes.status === 'fulfilled') setSessions(sessionsRes.value.data?.sessions || []);
      if (boothsRes.status === 'fulfilled') setBooths(boothsRes.value.data?.booths || []);
    } catch (error) {
      toast.error('Failed to load exhibition details');
    } finally {
      setIsLoading(false);
    }
  }, [expoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading exhibition details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div style={{ borderColor: 'var(--color-border)' }} className="flex items-center gap-3 border-b pb-4">
        <Link to="/expos" className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-alt)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }} className="text-xl font-bold">
            {expo?.title || 'Exhibition'}
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">Public event preview and speaker agenda</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-primary)',
          borderLeft: '3px solid var(--color-primary)',
        }}
        className="p-4 rounded-[10px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div style={{ backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }} className="p-2 rounded-lg shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">Login to interact with this expo</h4>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
              Sign in as an attendee to register, bookmark sessions, check in at booths, and connect with exhibitors.
            </p>
          </div>
        </div>
        <Link to="/auth/login" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary shrink-0">
          <UserPlus className="w-3.5 h-3.5" />
          <span>Login / Register</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-xl"
      >
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
          <img
            src={getExpoCoverImage(expo)}
            alt={expo?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-[#0E131F]/50 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-blue-400 border border-blue-500/30">
              {expo?.theme || 'Exhibition'}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <StatusBadge status={expo?.status} />
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <div className="space-y-2">
            <h3 style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }} className="text-xl sm:text-2xl font-bold">
              {expo?.title}
            </h3>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs sm:text-sm leading-relaxed max-w-3xl">
              {expo?.description}
            </p>
          </div>

          <div style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }} className="flex flex-wrap items-center gap-6 pt-4 border-t text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{expo?.date ? new Date(expo.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{expo?.location || 'Exhibition Grounds'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ borderColor: 'var(--color-border)' }} className="flex items-center gap-2 border-b pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          style={{
            backgroundColor: activeTab === 'schedule' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'schedule' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors hover:text-white"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Schedule ({sessions.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('booths')}
          style={{
            backgroundColor: activeTab === 'booths' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'booths' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors hover:text-white"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Booths Floorplan ({booths.length})</span>
        </button>
      </div>

      {activeTab === 'schedule' ? (
        sessions.length === 0 ? (
          <EmptyState title="No schedule published" message="Organizers have not published speaker sessions for this exhibition yet." />
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session._id} style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} className="p-4 rounded-[10px] border space-y-2 card-lift">
                <h4 style={{ color: 'var(--color-text)' }} className="text-sm font-bold">{session.topic}</h4>
                {session.description && <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">{session.description}</p>}
                <div style={{ color: 'var(--color-text-muted)' }} className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  {session.speaker && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                      <strong style={{ color: 'var(--color-text)' }}>{session.speaker}</strong>
                    </span>
                  )}
                  {session.startTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                      <span>{session.startTime} {session.endTime ? `– ${session.endTime}` : ''}</span>
                    </span>
                  )}
                  {session.location && <span>• {session.location}</span>}
                </div>
              </div>
            ))}
          </div>
        )
      ) : booths.length === 0 ? (
        <EmptyState title="No booths allocated" message="Floorplan allocation is not yet available for this exhibition." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {booths.map((booth) => (
            <div key={booth._id} style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} className="p-4 rounded-[10px] border space-y-2 card-lift">
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text)' }} className="font-bold text-sm">Booth #{booth.boothNumber}</span>
                <StatusBadge status={booth.status} />
              </div>
              <p style={{ color: 'var(--color-text)' }} className="text-xs font-semibold">{booth.assignedTo?.companyName || 'Available / Unassigned'}</p>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-[11px] capitalize">Size: {booth.size || 'Standard'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicExpoDetailPage;
