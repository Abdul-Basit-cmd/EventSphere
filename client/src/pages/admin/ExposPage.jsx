import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchExpos,
  createExpo,
  updateExpo,
  deleteExpo,
} from '../../api/expoApi';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ExpoFormModal from './ExpoFormModal';
import ExpoTable from './ExpoTable';

const expoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  theme: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled']),
});

const ExposPage = () => {
  const [expos, setExpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpo, setEditingExpo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingExpo, setDeletingExpo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expoSchema),
    defaultValues: {
      title: '',
      date: '',
      location: '',
      description: '',
      theme: '',
      status: 'draft',
    },
  });

  const loadExposList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchExpos({ limit: 100 });
      setExpos(response.data?.expos || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch expos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExposList();
  }, [loadExposList]);

  const handleOpenCreateModal = () => {
    setEditingExpo(null);
    reset({
      title: '',
      date: '',
      location: '',
      description: '',
      theme: '',
      status: 'draft',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expo) => {
    setEditingExpo(expo);
    const formattedDate = expo.date ? new Date(expo.date).toISOString().split('T')[0] : '';
    reset({
      title: expo.title || '',
      date: formattedDate,
      location: expo.location || '',
      description: expo.description || '',
      theme: expo.theme || '',
      status: expo.status || 'draft',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingExpo) {
        await updateExpo(editingExpo._id, formData);
        toast.success('Expo updated successfully');
      } else {
        await createExpo(formData);
        toast.success('Expo created successfully');
      }
      setIsModalOpen(false);
      loadExposList();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save expo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingExpo) return;
    setIsDeleting(true);
    try {
      await deleteExpo(deletingExpo._id);
      toast.success('Expo deleted successfully');
      setDeletingExpo(null);
      loadExposList();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete expo');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header-accent">
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold tracking-tight">
            Expositions
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
            Create and organize multi-day exhibitions, manage floorplans and schedules
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>New Expo</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs font-medium">Loading expos...</p>
        </div>
      ) : expos.length === 0 ? (
        <EmptyState
          title="No expos created yet"
          message="Begin by creating your first exhibition event to host booths and sessions."
          action={
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg btn-primary"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create first expo</span>
            </button>
          }
        />
      ) : (
        <ExpoTable expos={expos} onEdit={handleOpenEditModal} onDelete={setDeletingExpo} />
      )}

      <ExpoFormModal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        editingExpo={editingExpo}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingExpo)}
        onClose={() => setDeletingExpo(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Exposition"
        message={`Are you sure you want to delete "${deletingExpo?.title}"? All associated booths, sessions, and registrations will be permanently removed.`}
        confirmLabel="Delete Expo"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ExposPage;
