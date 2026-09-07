import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchExhibitorById,
  approveExhibitor,
  rejectExhibitor,
  reopenExhibitor,
} from '../../api/exhibitorApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ExhibitorDetailHeader from './ExhibitorDetailHeader';
import ExhibitorDetailCards from './ExhibitorDetailCards';
import RejectExhibitorModal from './RejectExhibitorModal';

const ExhibitorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectNoteError, setRejectNoteError] = useState('');

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchExhibitorById(id);
      setProfile(response.data?.profile || null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch exhibitor profile');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const response = await approveExhibitor(id);
      toast.success('Exhibitor approved successfully');
      setProfile(response.data?.profile);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve exhibitor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!approvalNote.trim()) {
      setRejectNoteError('Please provide a reason or instruction note for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await rejectExhibitor(id, approvalNote.trim());
      toast.success('Exhibitor application rejected');
      setProfile(response.data?.profile);
      setIsRejectModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject exhibitor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReopen = async () => {
    setIsProcessing(true);
    try {
      const response = await reopenExhibitor(id);
      toast.success('Application reopened for review');
      setProfile(response.data?.profile);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reopen exhibitor');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs font-medium">
          Loading profile details...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16 space-y-4">
        <p style={{ color: 'var(--color-text-muted)' }} className="text-sm">Exhibitor profile not found.</p>
        <button
          type="button"
          onClick={() => navigate('/admin/exhibitors')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg btn-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exhibitors</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ExhibitorDetailHeader
        profile={profile}
        isProcessing={isProcessing}
        onApprove={handleApprove}
        onOpenReject={() => {
          setApprovalNote('');
          setRejectNoteError('');
          setIsRejectModalOpen(true);
        }}
        onReopen={handleReopen}
      />

      <ExhibitorDetailCards profile={profile} />

      <RejectExhibitorModal
        isOpen={isRejectModalOpen}
        onClose={() => !isProcessing && setIsRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
        isProcessing={isProcessing}
        approvalNote={approvalNote}
        onNoteChange={(val) => {
          setApprovalNote(val);
          setRejectNoteError('');
        }}
        rejectNoteError={rejectNoteError}
      />
    </div>
  );
};

export default ExhibitorDetailPage;
