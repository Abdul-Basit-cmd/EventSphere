import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Bookmark, MapPin, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMySchedule } from '../../api/attendeeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

const AttendeeDashboardPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSchedule = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMySchedule();
      setRegistrations(response.data?.registrations || []);
    } catch (error) {
      toast.error('Failed to load your event schedule');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const registeredExposCount = registrations.length;
  const allBookmarks = registrations.flatMap((reg) =>
    (reg.bookmarkedSessions || []).map((session) => ({
      ...session,
      expoTitle: reg.expo?.title || 'Expo',
      expoId: reg.expo?._id,
    }))
  );
  const totalBookmarksCount = allBookmarks.length;
  const recentBookmarks = allBookmarks.slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div style={{ borderColor: 'var(--color-border)' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div className="page-header-accent">
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">Attendee Dashboard</h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
            Your registered exhibitions, bookmarked sessions, and event schedule
          </p>
        </div>
        <Link
          to="/attendee/expos"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg btn-primary self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Browse All Expos</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading attendee dashboard...</p>
        </div>
      ) : registeredExposCount === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Expo Registrations Yet"
          message="You have not registered for any upcoming exhibitions yet. Explore our scheduled expos to secure your access and bookmark key sessions."
          action={
            <Link to="/attendee/expos" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary">
              <span>Explore Expos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderTop: '2px solid var(--color-primary)',
              }}
              className="p-5 rounded-[10px] border space-y-2 card-lift"
            >
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text-muted)' }} className="text-xs uppercase font-semibold">Registered Expos</span>
                <div style={{ background: 'var(--color-primary-muted)', color: 'var(--color-primary)' }} className="p-1.5 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }} className="text-3xl font-bold">
                {registeredExposCount}
              </div>
              <Link to="/attendee/expos" style={{ color: 'var(--color-primary)' }} className="inline-flex items-center gap-1 text-xs hover:underline pt-1 font-semibold">
                <span>Browse more expos</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderTop: '2px solid var(--color-primary)',
              }}
              className="p-5 rounded-[10px] border space-y-2 card-lift"
            >
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text-muted)' }} className="text-xs uppercase font-semibold">Bookmarked Sessions</span>
                <div style={{ background: 'var(--color-primary-muted)', color: 'var(--color-primary)' }} className="p-1.5 rounded-lg">
                  <Bookmark className="w-4 h-4" />
                </div>
              </div>
              <div style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }} className="text-3xl font-bold">
                {totalBookmarksCount}
              </div>
              <Link to="/attendee/schedule" style={{ color: 'var(--color-primary)' }} className="inline-flex items-center gap-1 text-xs hover:underline pt-1 font-semibold">
                <span>View full schedule</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Upcoming Registered Expos */}
          <div className="space-y-3">
            <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              <span>Upcoming Registered Expos</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registrations.map((reg) => {
                const expo = reg.expo;
                if (!expo) return null;

                return (
                  <div
                    key={reg._id}
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    className="p-5 rounded-[10px] border flex flex-col justify-between space-y-4 card-lift"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 style={{ color: 'var(--color-text)' }} className="text-sm font-bold line-clamp-1">{expo.title}</h4>
                        <StatusBadge status={expo.status} />
                      </div>

                      <div style={{ color: 'var(--color-text-muted)' }} className="space-y-1 text-xs pt-1">
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

                    <Link
                      to={`/attendee/expos/${expo._id}`}
                      style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border hover:bg-[var(--color-border)] transition-colors"
                    >
                      <span>View Expo Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Bookmarked Sessions */}
          {recentBookmarks.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-bold flex items-center gap-2">
                  <Bookmark className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  <span>Recent Bookmarked Sessions</span>
                </h3>
                <Link to="/attendee/schedule" style={{ color: 'var(--color-primary)' }} className="text-xs hover:underline font-semibold">
                  View All ({totalBookmarksCount})
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentBookmarks.map((session) => (
                  <div
                    key={session._id}
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    className="p-4 rounded-[10px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-lift"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--color-text)' }} className="text-xs font-bold">{session.topic}</span>
                        <span style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }} className="text-[10px] px-2 py-0.5 rounded-full border">
                          {session.expoTitle}
                        </span>
                      </div>
                      <div style={{ color: 'var(--color-text-muted)' }} className="flex flex-wrap items-center gap-3 text-xs">
                        <span>Speaker: <strong style={{ color: 'var(--color-text)' }}>{session.speaker || 'TBD'}</strong></span>
                        {session.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
                            {session.startTime} {session.endTime ? `- ${session.endTime}` : ''}
                          </span>
                        )}
                        {session.location && <span>• {session.location}</span>}
                      </div>
                    </div>

                    <Link to={`/attendee/expos/${session.expoId}`} style={{ color: 'var(--color-primary)' }} className="text-xs hover:underline shrink-0 font-semibold">
                      Go to Expo
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendeeDashboardPage;
