import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchSessions,
  createSession,
  updateSession,
  deleteSession,
} from '../../api/scheduleApi';
import { fetchExpoById } from '../../api/expoApi';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import SessionFormModal from './SessionFormModal';
import SessionsTable from './SessionsTable';

const sessionSchema = z
  .object({
    topic: z.string().min(1, 'Topic is required'),
    speaker: z.string().optional(),
    location: z.string().optional(),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );

const SchedulePage = () => {
  const { expoId } = useParams();
  const navigate = useNavigate();

  const [expo, setExpo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingSession, setDeletingSession] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      topic: '',
      speaker: '',
      location: '',
      startTime: '',
      endTime: '',
    },
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [expoRes, sessionsRes] = await Promise.all([
        fetchExpoById(expoId),
        fetchSessions(expoId),
      ]);

      setExpo(expoRes.data?.expo || null);
      setSessions(sessionsRes.data?.sessions || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load session schedule');
    } finally {
      setIsLoading(false);
    }
  }, [expoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatDateTimeInput = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleOpenCreateModal = () => {
    setEditingSession(null);
    reset({
      topic: '',
      speaker: '',
      location: '',
      startTime: '',
      endTime: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (session) => {
    setEditingSession(session);
    reset({
      topic: session.topic || '',
      speaker: session.speaker || '',
      location: session.location || '',
      startTime: formatDateTimeInput(session.startTime),
      endTime: formatDateTimeInput(session.endTime),
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingSession) {
        await updateSession(expoId, editingSession._id, formData);
        toast.success('Session schedule updated');
      } else {
        await createSession(expoId, formData);
        toast.success('New session added to schedule');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSession) return;
    setIsDeleting(true);
    try {
      await deleteSession(expoId, deletingSession._id);
      toast.success('Session deleted successfully');
      setDeletingSession(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete session');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div style={{ borderColor: 'var(--color-border)' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/expos')}
            className="p-1.5 rounded-lg text-[var(--color-text-dim)] hover:text-white hover:bg-[var(--color-surface-alt)] transition-colors"
            title="Back to Expos"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="page-header-accent">
            <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold tracking-tight">
              Session Schedule — {expo?.title || 'Expo'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
              Program keynotes, workshops, presentations, and speaker locations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Add Session</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs font-medium">Loading session schedule...</p>
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          title="No sessions scheduled yet"
          message="Plan the first keynote or breakout session for attendees."
          action={
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg btn-primary"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add first session</span>
            </button>
          }
        />
      ) : (
        <SessionsTable
          sessions={sessions}
          onEdit={handleOpenEditModal}
          onDelete={setDeletingSession}
        />
      )}

      <SessionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        editingSession={editingSession}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingSession)}
        onClose={() => setDeletingSession(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Session"
        message={`Are you sure you want to delete session "${deletingSession?.topic}"? This will also clear attendee bookmarks.`}
        confirmLabel="Delete Session"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SchedulePage;
