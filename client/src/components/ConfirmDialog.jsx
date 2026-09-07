import React from 'react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmLabel = 'Delete',
  isDestructive = true,
  isLoading = false,
}) => {
  const footer = (
    <>
      <button
        type="button"
        disabled={isLoading}
        onClick={onClose}
        style={{
          backgroundColor: 'var(--color-surface-alt)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
        className="px-4 py-2 text-xs font-medium rounded-lg border hover:text-white transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        disabled={isLoading}
        onClick={onConfirm}
        style={{
          backgroundColor: isDestructive ? 'var(--color-danger)' : 'var(--color-primary)',
          color: 'var(--color-text)',
        }}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 hover:brightness-110"
      >
        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
        {isLoading ? 'Processing...' : confirmLabel}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      title={title}
      maxWidth="max-w-md"
      footer={footer}
    >
      <div className="flex items-start gap-4">
        {isDestructive && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-muted)',
              borderColor: 'var(--color-danger)',
              color: 'var(--color-danger)',
            }}
            className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center"
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed pt-1">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
