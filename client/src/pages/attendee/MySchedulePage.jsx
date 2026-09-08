import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Trash2, ArrowRight, User, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMySchedule, toggleBookmark } from '../../api/attendeeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const MySchedulePage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const loadSchedule = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMySchedule();
      setRegistrations(response.data?.registrations || []);
    } catch (error) {
      toast.error('Failed to load your schedule');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleRemoveBookmark = async (expoId, sessionId) => {
    setRemovingId(sessionId);
    try {
      await toggleBookmark(expoId, sessionId);
      toast.success('Session removed from your schedule');
      setRegistrations((prev) =>
        prev.map((reg) => {
          const currentExpoId = reg.expo?._id || reg.expo;
          if (currentExpoId !== expoId) return reg;
          return {
            ...reg,
            bookmarkedSessions: (reg.bookmarkedSessions || []).filter((s) => (s._id || s) !== sessionId),
          };
        })
      );
    } catch (error) {
      toast.error('Failed to remove bookmark');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div style={{ borderColor: 'var(--color-border)' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div className="page-header-accent">
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">My Event Schedule</h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">Bookmarked keynotes and speaker sessions grouped by exhibition</p>
        </div>
        <Link to="/attendee/expos" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg btn-primary self-start sm:self-auto">
          <span>Browse Expos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading your personalized schedule...</p>
        </div>
      ) : registrations.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No registered expos"
          message="You haven't registered for any expos yet. Register for an exhibition to start bookmarking speaker sessions and planning your agenda."
          action={
            <Link to="/attendee/expos" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary">
              <span>Browse Expos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
        {registrations.map((reg) => {
          const expo = reg.expo;
          if (!expo) return null;
          const sessions = reg.bookmarkedSessions || [];

          return (
            <div key={reg._id} style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} className="rounded-[10px] border overflow-hidden">
              <div style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }} className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-bold">{expo.title}</h3>
                    <span style={{ backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }} className="text-[10px] px-2 py-0.5 rounded-full border font-semibold">
                      {sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'} Bookmarked
                    </span>
                  </div>
                  <div style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-3 text-xs">
                    <span>{expo.date ? new Date(expo.date).toLocaleDateString() : 'TBD'}</span>
                    <span>•</span>
                    <span>{expo.location || 'Exhibition Grounds'}</span>
                  </div>
                </div>
                <Link to={`/attendee/expos/${expo._id}`} style={{ color: 'var(--color-primary)' }} className="inline-flex items-center gap-1 text-xs hover:underline font-semibold self-start sm:self-auto">
                  <span>View All Sessions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4">
                {sessions.length === 0 ? (
                  <div className="py-6 text-center space-y-2">
                    <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">No sessions bookmarked for this expo yet.</p>
                    <Link to={`/attendee/expos/${expo._id}`} style={{ color: 'var(--color-primary)' }} className="inline-flex items-center gap-1 text-xs hover:underline font-medium">
                      <span>Explore Schedule</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session._id} style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }} className="p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-lift">
                        <div className="space-y-1 flex-1">
                          <h4 style={{ color: 'var(--color-text)' }} className="text-xs font-bold">{session.topic}</h4>
                          <div style={{ color: 'var(--color-text-muted)' }} className="flex flex-wrap items-center gap-3 text-xs">
                            {session.speaker && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
                                <span>{session.speaker}</span>
                              </span>
                            )}
                            {session.startTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
                                <span>{session.startTime} {session.endTime ? `– ${session.endTime}` : ''}</span>
                              </span>
                            )}
                            {session.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
                                <span>{session.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={removingId === session._id}
                          onClick={() => handleRemoveBookmark(expo._id, session._id)}
                          style={{ borderColor: 'var(--color-border)', color: 'var(--color-danger)' }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border hover:bg-[var(--color-danger-muted)] transition-colors self-end sm:self-auto shrink-0"
                          title="Remove from schedule"
                        >
                          {removingId === session._id ? <LoadingSpinner size="sm" /> : <Trash2 className="w-3.5 h-3.5" />}
                          <span>Remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default MySchedulePage;
