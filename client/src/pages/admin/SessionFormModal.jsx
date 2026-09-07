import React from 'react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import FieldLabel from '../../components/ui/FieldLabel';
import DateTimeInput from '../../components/ui/DateTimeInput';

const SessionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  editingSession,
  register,
  handleSubmit,
  errors,
  watch,
  setValue,
}) => {
  const startTimeValue = watch ? watch('startTime') : '';
  const endTimeValue = watch ? watch('endTime') : '';
  const todayDateStr = new Date().toISOString().slice(0, 10);

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
        form="session-form"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
      >
        {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
        {isSubmitting ? 'Saving...' : editingSession ? 'Save Changes' : 'Create Session'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSession ? 'Edit Session' : 'Create Session'}
      maxWidth="max-w-lg"
      footer={modalFooter}
    >
      <form id="session-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <FieldLabel htmlFor="topic" required>Session Topic / Title</FieldLabel>
          <input
            id="topic"
            type="text"
            placeholder="e.g. Next-Gen Cloud Architecture"
            {...register('topic')}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
          />
          {errors.topic && (
            <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.topic.message}</p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="speaker">Speaker Name &amp; Title</FieldLabel>
          <input
            id="speaker"
            type="text"
            placeholder="e.g. Dr. Alex Morgan (Chief Architect)"
            {...register('speaker')}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
          />
          {errors.speaker && (
            <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.speaker.message}</p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="location">Location / Stage Room</FieldLabel>
          <input
            id="location"
            type="text"
            placeholder="e.g. Auditorium Hall B"
            {...register('location')}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
          />
          {errors.location && (
            <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.location.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="startTime" required>Start Time</FieldLabel>
            <DateTimeInput
              id="startTime"
              name="startTime"
              value={startTimeValue}
              onChange={(e) =>
                setValue('startTime', e.target.value, { shouldValidate: true })
              }
              min={editingSession ? undefined : todayDateStr}
              placeholder="Select start time"
            />
            {errors.startTime && (
              <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.startTime.message}</p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="endTime" required>End Time</FieldLabel>
            <DateTimeInput
              id="endTime"
              name="endTime"
              value={endTimeValue}
              onChange={(e) =>
                setValue('endTime', e.target.value, { shouldValidate: true })
              }
              min={startTimeValue || (editingSession ? undefined : todayDateStr)}
              placeholder="Select end time"
            />
            {errors.endTime && (
              <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.endTime.message}</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SessionFormModal;
