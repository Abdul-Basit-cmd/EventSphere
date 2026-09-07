import React from 'react';
import { Clock, Bookmark, MapPin, User } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const ExpoScheduleTab = ({
  sessions = [],
  bookmarkedSessionIds = new Set(),
  onToggleBookmark,
  isBookmarkingId = null,
}) => {
  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No sessions published"
        message="The schedule for this exhibition has not been published yet."
      />
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isBookmarked = bookmarkedSessionIds.has(session._id);
        const isProcessing = isBookmarkingId === session._id;

        return (
          <div
            key={session._id}
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
            className="p-4 rounded-[10px] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-lift"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <h4 style={{ color: 'var(--color-text)' }} className="text-sm font-bold">{session.topic}</h4>
              {session.description && (
                <p style={{ color: 'var(--color-text-muted)' }} className="text-xs line-clamp-2 leading-relaxed">
                  {session.description}
                </p>
              )}

              <div style={{ color: 'var(--color-text-muted)' }} className="flex flex-wrap items-center gap-3 text-xs pt-1">
                {session.speaker && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    <strong style={{ color: 'var(--color-text)' }}>{session.speaker}</strong>
                  </span>
                )}
                {session.startTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    <span>
                      {session.startTime} {session.endTime ? `– ${session.endTime}` : ''}
                    </span>
                  </span>
                )}
                {session.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    <span>{session.location}</span>
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onToggleBookmark(session._id)}
              style={{
                backgroundColor: isBookmarked ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                borderColor: isBookmarked ? 'var(--color-primary)' : 'var(--color-border)',
                color: isBookmarked ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all hover:text-white shrink-0"
            >
              {isProcessing ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              )}
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ExpoScheduleTab;
