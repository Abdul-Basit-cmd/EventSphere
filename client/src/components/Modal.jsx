import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  footer = null,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderTop: '2px solid var(--color-primary)',
        }}
        className={`relative w-full ${maxWidth} rounded-xl shadow-xl border overflow-hidden z-10 animate-modal-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          style={{ borderColor: 'var(--color-border)' }}
          className="flex items-center justify-between px-6 py-4 border-b"
        >
          <h3
            id="modal-title"
            style={{ color: 'var(--color-text)' }}
            className="text-base font-semibold"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ color: 'var(--color-text-muted)' }}
            className="p-1.5 rounded-md hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 max-h-[calc(85vh-120px)] overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div
            style={{
              background: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
            }}
            className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
