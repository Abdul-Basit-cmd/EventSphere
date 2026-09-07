import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Layers, Users, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchExpoById } from '../../api/expoApi';
import { fetchSessions } from '../../api/scheduleApi';
import { getExpoBooths } from '../../api/boothBrowseApi';
import {
  registerForExpo,
  toggleBookmark,
  getMySchedule,
  recordBoothVisit,
} from '../../api/attendeeApi';
import { sendInquiry } from '../../api/inquiryPortalApi';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import InquiryModal from '../exhibitor/InquiryModal';
import ExpoScheduleTab from './ExpoScheduleTab';
import ExpoBoothsTab from './ExpoBoothsTab';
import ExpoExhibitorsTab from './ExpoExhibitorsTab';

const AttendeeExpoDetailPage = () => {
  const { expoId } = useParams();
  const navigate = useNavigate();

  const [expo, setExpo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [booths, setBooths] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [visitedIds, setVisitedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState('schedule');

  // Action states
  const [isRegistering, setIsRegistering] = useState(false);
  const [bookmarkingId, setBookmarkingId] = useState(null);
  const [checkingInId, setCheckingInId] = useState(null);

  // Inquiry Modal
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [expoRes, sessionsRes, boothsRes, scheduleRes] = await Promise.allSettled([
        fetchExpoById(expoId),
        fetchSessions(expoId),
        getExpoBooths(expoId),
        getMySchedule(),
      ]);

      if (expoRes.status === 'fulfilled') setExpo(expoRes.value.data?.expo || null);
      if (sessionsRes.status === 'fulfilled') setSessions(sessionsRes.value.data?.sessions || []);
      if (boothsRes.status === 'fulfilled') setBooths(boothsRes.value.data?.booths || []);

      if (scheduleRes.status === 'fulfilled' && scheduleRes.value.data?.registrations) {
        const regs = scheduleRes.value.data.registrations;
        const currentReg = regs.find((r) => (r.expo?._id || r.expo) === expoId);
        setIsRegistered(Boolean(currentReg));
        if (currentReg && currentReg.bookmarkedSessions) {
          const bIds = new Set(
            currentReg.bookmarkedSessions.map((s) => s._id || s)
          );
          setBookmarkedIds(bIds);
        }
      }
    } catch (error) {
      toast.error('Failed to load exhibition details');
    } finally {
      setIsLoading(false);
    }
  }, [expoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await registerForExpo(expoId);
      toast.success('Successfully registered for this expo!');
      setIsRegistered(true);
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      if (error.response?.status === 400) setIsRegistered(true);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleToggleBookmark = async (sessionId) => {
    if (!isRegistered) {
      toast.error('Please register for this expo before bookmarking sessions');
      return;
    }
    setBookmarkingId(sessionId);
    try {
      await toggleBookmark(expoId, sessionId);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (next.has(sessionId)) {
          next.delete(sessionId);
          toast.success('Bookmark removed');
        } else {
          next.add(sessionId);
          toast.success('Session bookmarked!');
        }
        return next;
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to toggle bookmark';
      toast.error(msg);
    } finally {
      setBookmarkingId(null);
    }
  };

  const handleCheckIn = async (boothId) => {
    if (!isRegistered) {
      toast.error('Please register for this expo before checking in at booths');
      return;
    }
    setCheckingInId(boothId);
    try {
      const res = await recordBoothVisit(expoId, boothId);
      setVisitedIds((prev) => new Set([...prev, boothId]));
      if (res.data?.alreadyRecorded) {
        toast('Already checked in at this booth.', { icon: 'ℹ️' });
      } else {
        toast.success('Check-in recorded! Visited booth badge earned.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to check in';
      toast.error(msg);
    } finally {
      setCheckingInId(null);
    }
  };

  const handleOpenInquiry = (exhibitor) => {
    setSelectedExhibitor(exhibitor);
    setInquirySubject(`Inquiry regarding ${expo?.title || 'Expo'}`);
    setInquiryMessage('');
  };

  const handleSendInquirySubmit = async (e) => {
    e.preventDefault();
    const recipientId = selectedExhibitor?.userId?._id || selectedExhibitor?.userId;
    if (!recipientId || !inquirySubject.trim() || !inquiryMessage.trim()) {
      toast.error('Please provide a subject and message');
      return;
    }
    setIsSendingInquiry(true);
    try {
      await sendInquiry({
        recipient: recipientId,
        expoId,
        subject: inquirySubject.trim(),
        message: inquiryMessage.trim(),
        type: 'exhibitor_network',
      });
      toast.success('Inquiry dispatched to exhibitor!');
      setSelectedExhibitor(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setIsSendingInquiry(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading expo schedule and booths...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div style={{ borderColor: 'var(--color-border)' }} className="flex items-center gap-3 border-b pb-4">
        <button
          type="button"
          onClick={() => navigate('/attendee/expos')}
          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-alt)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="page-header-accent">
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">{expo?.title || 'Expo'}</h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">Explore sessions, visit vendor booths, and connect with exhibitors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Expo Details */}
        <div className="space-y-4">
          <div style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} className="p-5 rounded-[10px] border space-y-4 card-lift">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-primary)' }} className="text-[11px] font-semibold uppercase tracking-wider">{expo?.theme || 'Exhibition'}</span>
                <StatusBadge status={expo?.status} />
              </div>
              <h3 style={{ color: 'var(--color-text)' }} className="text-base font-bold">{expo?.title}</h3>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">{expo?.description}</p>
            </div>

            <div style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }} className="space-y-2 pt-2 border-t text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <span>{expo?.date ? new Date(expo.date).toLocaleDateString() : 'TBD'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <span>{expo?.location || 'Exhibition Hall'}</span>
              </div>
            </div>

            <div className="pt-2">
              {isRegistered ? (
                <div
                  style={{
                    backgroundColor: 'var(--color-success-muted)',
                    borderColor: 'var(--color-success)',
                    color: 'var(--color-success)',
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border"
                >
                  <Check className="w-4 h-4" />
                  <span>Registered for this Expo</span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isRegistering}
                  onClick={handleRegister}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
                >
                  {isRegistering && <LoadingSpinner size="sm" />}
                  <span>{isRegistering ? 'Registering...' : 'Register for Expo'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Tabs */}
        <div className="lg:col-span-2 space-y-4">
          <div style={{ borderColor: 'var(--color-border)' }} className="flex items-center gap-2 border-b pb-1">
            {[
              { id: 'schedule', label: `Schedule (${sessions.length})`, icon: Clock },
              { id: 'booths', label: `Booths (${booths.length})`, icon: Layers },
              { id: 'exhibitors', label: 'Exhibitors', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors hover:text-white"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'schedule' && (
            <ExpoScheduleTab
              sessions={sessions}
              bookmarkedSessionIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              isBookmarkingId={bookmarkingId}
            />
          )}

          {activeTab === 'booths' && (
            <ExpoBoothsTab
              booths={booths}
              visitedBoothIds={visitedIds}
              onCheckIn={handleCheckIn}
              isCheckingInId={checkingInId}
            />
          )}

          {activeTab === 'exhibitors' && <ExpoExhibitorsTab onOpenInquiry={handleOpenInquiry} />}
        </div>
      </div>

      <InquiryModal
        isOpen={Boolean(selectedExhibitor)}
        onClose={() => setSelectedExhibitor(null)}
        title={`Message ${selectedExhibitor?.companyName || 'Exhibitor'}`}
        showExpoSelect={false}
        subject={inquirySubject}
        onSubjectChange={setInquirySubject}
        message={inquiryMessage}
        onMessageChange={setInquiryMessage}
        onSubmit={handleSendInquirySubmit}
        isSending={isSendingInquiry}
      />
    </div>
  );
};

export default AttendeeExpoDetailPage;
