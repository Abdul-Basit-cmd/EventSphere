import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getMyProfile,
  createProfile,
  updateProfile,
  submitProfile,
} from '../../api/exhibitorPortalApi';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProfileReadOnlyView from './ProfileReadOnlyView';
import ProfileFormFields from './ProfileFormFields';

const profileFormSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required'),
  industry: z.string().trim().min(1, 'Industry is required'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  website: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  contactPerson: z.string().trim().min(1, 'Contact person is required'),
  contactPhone: z.string().trim().min(5, 'Contact phone is required (at least 5 digits)'),
  productsServices: z.string().trim().min(1, 'Products and services are required'),
  logo: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  documents: z.string().trim().min(1, 'At least one document reference is required for review'),
});

const ExhibitorProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { setUser, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      description: '',
      website: '',
      contactPerson: '',
      contactPhone: '',
      productsServices: '',
      logo: '',
      documents: '',
    },
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMyProfile();
      const prof = response.data?.profile || null;
      setProfile(prof);
      if (prof) {
        reset({
          companyName: prof.companyName || '',
          industry: prof.industry || '',
          description: prof.description || '',
          website: prof.website || '',
          contactPerson: prof.contactPerson || '',
          contactPhone: prof.contactPhone || '',
          productsServices: prof.productsServices || '',
          logo: prof.logo || '',
          documents: Array.isArray(prof.documents) ? prof.documents.join('\n') : '',
        });
      }
    } catch (error) {
      toast.error('Failed to load exhibitor profile');
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const parseDocuments = (docString) => {
    if (!docString) return [];
    return docString.split('\n').map((d) => d.trim()).filter(Boolean);
  };

  const handleSaveDraft = async (formData) => {
    setIsSaving(true);
    try {
      const payload = { ...formData, documents: parseDocuments(formData.documents) };
      let response = !profile ? await createProfile(payload) : await updateProfile(payload);
      toast.success(profile ? 'Profile changes saved' : 'Profile created as draft');
      const updated = response.data?.profile;
      setProfile(updated);
      if (user) setUser({ ...user, onboardingComplete: updated?.onboardingComplete, approvalStatus: updated?.approvalStatus });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = async (formData) => {
    const values = formData && typeof formData.preventDefault !== 'function' ? formData : getValues();
    setIsSubmittingReview(true);
    try {
      const payload = { ...values, documents: parseDocuments(values.documents) };
      if (!profile) {
        try { await createProfile(payload); } catch (e) { /* ignore concurrent creation */ }
      }
      const response = await submitProfile(payload);
      toast.success('Profile submitted for organizer review!');
      const updated = response.data?.profile;
      setProfile(updated);
      if (user) setUser({ ...user, onboardingComplete: true, approvalStatus: 'pending' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed. Ensure all fields meet requirements.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <LoadingSpinner size="lg" />
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading profile...</p>
      </div>
    );
  }

  const isReadOnly =
    profile && profile.onboardingComplete && (profile.approvalStatus === 'pending' || profile.approvalStatus === 'approved');

  if (isReadOnly) {
    return <ProfileReadOnlyView profile={profile} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div style={{ borderColor: 'var(--color-border)' }} className="flex items-center justify-between border-b pb-4 page-header-accent">
        <div>
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">
            {profile ? 'Edit Exhibitor Profile' : 'Create Exhibitor Profile'}
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
            Fill in your business details to apply for participation in expos
          </p>
        </div>
        {profile && <StatusBadge status={profile.approvalStatus} />}
      </div>

      {profile?.approvalStatus === 'rejected' && profile.approvalNote && (
        <div style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-danger)' }} className="p-4 rounded-[10px] border">
          <h4 style={{ color: 'var(--color-danger)' }} className="text-xs font-bold uppercase tracking-wider mb-1">
            Organizer Rejection Feedback
          </h4>
          <p style={{ color: 'var(--color-text)' }} className="text-xs">{profile.approvalNote}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleSaveDraft)} className="space-y-5">
        <ProfileFormFields register={register} errors={errors} />

        <div style={{ borderColor: 'var(--color-border)' }} className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t">
          <button
            type="submit"
            disabled={isSaving}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg border hover:bg-[var(--color-border)] transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving Draft...' : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={handleSubmit(handleSubmitForReview)}
            disabled={isSubmittingReview}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg btn-primary shadow-xs disabled:opacity-50"
          >
            {isSubmittingReview && <LoadingSpinner size="sm" />}
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmittingReview ? 'Submitting...' : 'Submit for Review'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExhibitorProfilePage;
