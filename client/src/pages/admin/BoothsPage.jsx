import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchBooths,
  createBooth,
  deleteBooth,
  assignBooth,
  unassignBooth,
} from '../../api/boothApi';
import { fetchExpoById } from '../../api/expoApi';
import { fetchExhibitors } from '../../api/exhibitorApi';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import BoothModals from './BoothModals';
import BoothsTable from './BoothsTable';

const boothSchema = z.object({
  boothNumber: z.string().min(1, 'Booth number is required'),
  size: z.enum(['small', 'medium', 'large']),
  status: z.enum(['available', 'reserved', 'assigned']),
});

const BoothsPage = () => {
  const { expoId } = useParams();
  const navigate = useNavigate();

  const [expo, setExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [approvedExhibitors, setApprovedExhibitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [assigningBooth, setAssigningBooth] = useState(null);
  const [selectedExhibitorId, setSelectedExhibitorId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const [deletingBooth, setDeletingBooth] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(boothSchema),
    defaultValues: {
      boothNumber: '',
      size: 'small',
      status: 'available',
    },
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [expoRes, boothsRes, exhibitorsRes] = await Promise.all([
        fetchExpoById(expoId),
        fetchBooths(expoId),
        fetchExhibitors('approved'),
      ]);

      setExpo(expoRes.data?.expo || null);
      setBooths(boothsRes.data?.booths || []);
      setApprovedExhibitors(exhibitorsRes.data?.profiles || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load booth information');
    } finally {
      setIsLoading(false);
    }
  }, [expoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateBoothSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await createBooth(expoId, formData);
      toast.success('Booth added successfully');
      setIsCreateModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booth');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignBoothSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExhibitorId || !assigningBooth) {
      toast.error('Please select an approved exhibitor');
      return;
    }

    setIsAssigning(true);
    try {
      await assignBooth(expoId, assigningBooth._id, selectedExhibitorId);
      toast.success('Booth assigned successfully');
      setAssigningBooth(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign booth');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = async (boothId) => {
    try {
      await unassignBooth(expoId, boothId);
      toast.success('Booth unassigned and returned to available status');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unassign booth');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBooth) return;
    setIsDeleting(true);
    try {
      await deleteBooth(expoId, deletingBooth._id);
      toast.success('Booth removed successfully');
      setDeletingBooth(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete booth');
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
              Floorplan Booths — {expo?.title || 'Expo'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
              Allocate booth spaces, match approved vendors, and configure floor sizing
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            reset({ boothNumber: '', size: 'small', status: 'available' });
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Add Booth</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs font-medium">Loading booth directory...</p>
        </div>
      ) : booths.length === 0 ? (
        <EmptyState
          title="No booths created yet"
          message="Define booth numbers and dimensions for this exhibition floorplan."
          action={
            <button
              type="button"
              onClick={() => {
                reset({ boothNumber: '', size: 'small', status: 'available' });
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg btn-primary"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create first booth</span>
            </button>
          }
        />
      ) : (
        <BoothsTable
          booths={booths}
          onUnassign={handleUnassign}
          onOpenAssign={(booth) => {
            setAssigningBooth(booth);
            setSelectedExhibitorId('');
          }}
          onDelete={setDeletingBooth}
        />
      )}

      <BoothModals
        isCreateOpen={isCreateModalOpen}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        onCreateSubmit={handleCreateBoothSubmit}
        isSubmitting={isSubmitting}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        watch={watch}
        assigningBooth={assigningBooth}
        onCloseAssign={() => setAssigningBooth(null)}
        onAssignSubmit={handleAssignBoothSubmit}
        isAssigning={isAssigning}
        selectedExhibitorId={selectedExhibitorId}
        onSelectExhibitor={setSelectedExhibitorId}
        approvedExhibitors={approvedExhibitors}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingBooth)}
        onClose={() => setDeletingBooth(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Booth"
        message={`Are you sure you want to remove Booth #${deletingBooth?.boothNumber}? This action is permanent.`}
        confirmLabel="Delete Booth"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BoothsPage;
