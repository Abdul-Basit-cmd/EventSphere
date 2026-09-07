import React from 'react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Select from '../../components/ui/Select';
import DateInput from '../../components/ui/DateInput';
import FieldLabel from '../../components/ui/FieldLabel';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'cancelled', label: 'Cancelled' },
];

const ExpoFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  editingExpo,
  register,
  handleSubmit,
  errors,
  watch,
  setValue,
}) => {
  const statusValue = watch ? watch('status') : 'draft';
  const dateValue = watch ? watch('date') : '';
  const statusRegister = register('status');

  // Today's date string (YYYY-MM-DD) — used as min when creating
  const todayStr = (() => {
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  })();

  const modalFooter = (
    <>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={onClose}
        style={{
          backgroundColor: 'var(--color-surface-alt)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
        className="px-4 py-2 text-xs font-medium rounded-lg border hover:text-white transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="expo-form"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
      >
        {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
        {isSubmitting ? 'Saving...' : editingExpo ? 'Save Changes' : 'Create Expo'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingExpo ? 'Edit Expo' : 'Create New Expo'}
      maxWidth="max-w-lg"
      footer={modalFooter}
    >
      <form id="expo-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <FieldLabel htmlFor="title" required>Expo Title</FieldLabel>
          <input
            id="title"
            type="text"
            placeholder="e.g. Global Tech Summit 2026"
            {...register('title')}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
          />
          {errors.title && <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="date" required>Date</FieldLabel>
            <DateInput
              id="date"
              name="date"
              value={dateValue}
              onChange={(e) =>
                setValue('date', e.target.value, { shouldValidate: true })
              }
              min={editingExpo ? undefined : todayStr}
            />
            {errors.date && <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.date.message}</p>}
          </div>

          <div>
            <FieldLabel htmlFor="status" required>Status</FieldLabel>
            <Select
              id="status"
              name={statusRegister.name}
              value={statusValue}
              options={STATUS_OPTIONS}
              onChange={(e) => statusRegister.onChange(e)}
            />
            {errors.status && <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.status.message}</p>}
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="location" required>Location / Venue</FieldLabel>
          <input
            id="location"
            type="text"
            placeholder="e.g. Metro Convention Center, Hall A"
            {...register('location')}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
          />
          {errors.location && <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.location.message}</p>}
        </div>

        <div>
          <FieldLabel htmlFor="theme">Theme / Focus Area</FieldLabel>
          <input
            id="theme"
            type="text"
            placeholder="e.g. Artificial Intelligence & Cloud Computing"
            {...register('theme')}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
          />
        </div>

        <div>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <textarea
            id="description"
            rows={3}
            placeholder="Brief details about the exhibition..."
            {...register('description')}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border transition-colors resize-none placeholder:text-[var(--color-text-dim)]"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ExpoFormModal;
