import React from 'react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Select from '../../components/ui/Select';
import FieldLabel from '../../components/ui/FieldLabel';

const InquiryModal = ({
  isOpen,
  onClose,
  title,
  expos = [],
  showExpoSelect = true,
  selectedExpoId,
  onExpoChange,
  subject,
  onSubjectChange,
  message,
  onMessageChange,
  onSubmit,
  isSending,
}) => {
  const expoOptions = expos.map((expo) => ({ value: expo._id, label: expo.title }));

  const modalFooter = (
    <>
      <button
        type="button"
        disabled={isSending}
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
        form="inquiry-shared-modal-form"
        disabled={isSending}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
      >
        {isSending && <LoadingSpinner size="sm" />}
        <span>{isSending ? 'Sending...' : 'Send Inquiry'}</span>
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={modalFooter}
    >
      <form id="inquiry-shared-modal-form" onSubmit={onSubmit} className="space-y-4 text-xs">
        {showExpoSelect && (
          <div>
            <FieldLabel required>Related Exposition</FieldLabel>
            <Select
              value={selectedExpoId}
              options={expoOptions}
              onChange={(e) => onExpoChange(e.target.value)}
              placeholder="-- Select an Expo --"
            />
          </div>
        )}

        <div>
          <FieldLabel required>Subject</FieldLabel>
          <input
            type="text"
            placeholder="e.g. Collaboration on booth display"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
          />
        </div>

        <div>
          <FieldLabel required>Message</FieldLabel>
          <textarea
            rows={4}
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="w-full px-3 py-2 rounded-lg border transition-colors resize-none placeholder:text-[var(--color-text-dim)]"
          />
        </div>
      </form>
    </Modal>
  );
};

export default InquiryModal;
