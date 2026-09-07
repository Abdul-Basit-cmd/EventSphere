import React from 'react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import FieldLabel from '../../components/ui/FieldLabel';

const RejectExhibitorModal = ({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
  approvalNote,
  onNoteChange,
  rejectNoteError,
}) => {
  const rejectModalFooter = (
    <>
      <button
        type="button"
        disabled={isProcessing}
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
        form="reject-form"
        disabled={isProcessing}
        style={{
          backgroundColor: 'var(--color-danger)',
          color: 'var(--color-text)',
        }}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 hover:brightness-110"
      >
        {isProcessing && <LoadingSpinner size="sm" className="mr-2" />}
        {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Exhibitor Application"
      maxWidth="max-w-md"
      footer={rejectModalFooter}
    >
      <form id="reject-form" onSubmit={onSubmit} className="space-y-4">
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
          Please detail the reason for rejecting this application. This note will be emailed to the vendor and displayed on their dashboard so they can update their application.
        </p>

        <div>
          <FieldLabel htmlFor="approvalNote" required>Organizer Note / Reason</FieldLabel>
          <textarea
            id="approvalNote"
            rows={4}
            value={approvalNote}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="e.g. Please upload your registered business certificate and clarify product catalogue details..."
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border transition-colors resize-none placeholder:text-[var(--color-text-dim)]"
          />
          {rejectNoteError && (
            <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{rejectNoteError}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default RejectExhibitorModal;
