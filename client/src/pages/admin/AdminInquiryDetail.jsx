import React from 'react';
import { User, MessageSquare, Send } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import FieldLabel from '../../components/ui/FieldLabel';

const AdminInquiryDetail = ({
  selectedInquiry,
  replyText,
  onReplyChange,
  onSendReply,
  isReplying,
}) => {
  if (!selectedInquiry) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className="border border-dashed rounded-xl p-8 text-center text-xs"
      >
        <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-text-dim)' }} />
        <p style={{ color: 'var(--color-text)' }} className="font-semibold">Select an inquiry</p>
        <p style={{ color: 'var(--color-text-muted)' }} className="mt-1">
          Click on any ticket in the table to review the message and submit a response.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="border rounded-xl p-6 shadow-xs space-y-5"
    >
      <div style={{ borderColor: 'var(--color-border)' }} className="flex items-start justify-between gap-2 border-b pb-4">
        <div>
          <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-bold">
            {selectedInquiry.subject}
          </h3>
          <div style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-2 mt-1 text-xs">
            <User className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            <span>{selectedInquiry.sender?.name}</span>
            <span>•</span>
            <span className="font-mono text-[11px]">{selectedInquiry.sender?.email}</span>
          </div>
        </div>
        <StatusBadge status={selectedInquiry.status || 'pending'} />
      </div>

      {/* Inquiry Body */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-alt)',
          borderColor: 'var(--color-border)',
        }}
        className="rounded-lg p-4 border"
      >
        <span style={{ color: 'var(--color-text-dim)' }} className="block text-[10px] font-semibold uppercase tracking-wider mb-1">
          Inquiry Message
        </span>
        <p style={{ color: 'var(--color-text)' }} className="text-xs leading-relaxed whitespace-pre-wrap">
          {selectedInquiry.message}
        </p>
      </div>

      {/* Previous Reply if any */}
      {selectedInquiry.adminReply && (
        <div
          style={{
            backgroundColor: 'var(--color-accent-muted)',
            borderColor: 'var(--color-accent)',
          }}
          className="rounded-lg p-4 border"
        >
          <span style={{ color: 'var(--color-accent)' }} className="block text-[10px] font-semibold uppercase tracking-wider mb-1">
            Previous Organizer Response
          </span>
          <p style={{ color: 'var(--color-text)' }} className="text-xs leading-relaxed whitespace-pre-wrap">
            {selectedInquiry.adminReply}
          </p>
        </div>
      )}

      {/* Reply Form */}
      <form onSubmit={onSendReply} className="space-y-3">
        <FieldLabel htmlFor="replyInput" required>
          {selectedInquiry.adminReply ? 'Update Response' : 'Write Organizer Response'}
        </FieldLabel>
        <textarea
          id="replyInput"
          rows={4}
          value={replyText}
          onChange={(e) => onReplyChange(e.target.value)}
          placeholder="Draft your clear, helpful response to the sender..."
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          className="w-full px-3 py-2 text-xs rounded-lg border transition-colors resize-none placeholder:text-[var(--color-text-dim)]"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isReplying || !replyText.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
          >
            {isReplying && <LoadingSpinner size="sm" />}
            <Send className="w-3.5 h-3.5" />
            <span>{isReplying ? 'Sending...' : 'Dispatch Reply'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminInquiryDetail;
