import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

const InquiryList = ({ inquiries = [], currentUserId }) => {
  const [activeTab, setActiveTab] = useState('received');
  const [expandedId, setExpandedId] = useState(null);

  const sentInquiries = inquiries.filter((inq) => {
    const senderId = inq.sender?._id || inq.sender;
    return String(senderId) === String(currentUserId);
  });

  const receivedInquiries = inquiries.filter((inq) => {
    const recipientId = inq.recipient?._id || inq.recipient;
    return String(recipientId) === String(currentUserId);
  });

  const displayedList = activeTab === 'sent' ? sentInquiries : receivedInquiries;

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div
        style={{ borderColor: 'var(--color-border)' }}
        className="flex items-center gap-2 border-b pb-1"
      >
        <button
          type="button"
          onClick={() => setActiveTab('received')}
          style={{
            background: activeTab === 'received' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'received' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
          className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors hover:text-white"
        >
          Received Messages ({receivedInquiries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sent')}
          style={{
            background: activeTab === 'sent' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'sent' ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
          className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors hover:text-white"
        >
          Sent Queries ({sentInquiries.length})
        </button>
      </div>

      {/* List */}
      {displayedList.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} messages`}
          message={`You currently have no ${activeTab} inquiries on record.`}
        />
      ) : (
        <div className="space-y-3">
          {displayedList.map((item) => {
            const isExpanded = expandedId === item._id;
            const otherParty =
              activeTab === 'sent'
                ? item.recipient?.name || item.recipient?.companyName || 'Event Organizer / Vendor'
                : item.sender?.name || item.sender?.companyName || 'Attendee / Vendor';

            return (
              <div
                key={item._id}
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
                className="rounded-[10px] border overflow-hidden transition-all card-lift"
              >
                <div
                  onClick={() => toggleExpand(item._id)}
                  style={{ transition: 'background 0.15s ease' }}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[var(--color-surface-alt)]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ color: 'var(--color-text)' }}
                        className="text-sm font-bold"
                      >
                        {item.subject}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div
                      style={{ color: 'var(--color-text-muted)' }}
                      className="flex items-center gap-3 text-xs"
                    >
                      <span>
                        {activeTab === 'sent' ? 'To:' : 'From:'}{' '}
                        <strong style={{ color: 'var(--color-text)' }}>{otherParty}</strong>
                      </span>
                      <span>•</span>
                      <span>{item.expoId?.title || 'Exhibition'}</span>
                      <span>•</span>
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{ color: 'var(--color-text-muted)' }}
                    className="self-end sm:self-auto p-1"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      borderColor: 'var(--color-border)',
                      background: 'var(--color-sidebar)',
                    }}
                    className="px-4 pb-4 pt-2 border-t space-y-3 text-xs"
                  >
                    <div>
                      <span
                        style={{ color: 'var(--color-text-dim)' }}
                        className="block text-[10px] uppercase font-semibold mb-1"
                      >
                        Inquiry Message
                      </span>
                      <p
                        style={{ color: 'var(--color-text)' }}
                        className="leading-relaxed whitespace-pre-wrap"
                      >
                        {item.message}
                      </p>
                    </div>

                    {item.adminReply && (
                      <div
                        style={{
                          background: 'var(--color-success-muted)',
                          borderColor: 'var(--color-success)',
                        }}
                        className="p-3 rounded-lg border"
                      >
                        <span
                          style={{ color: 'var(--color-success)' }}
                          className="block text-[10px] uppercase font-bold mb-1"
                        >
                          Organizer Reply
                        </span>
                        <p
                          style={{ color: 'var(--color-text)' }}
                          className="leading-relaxed whitespace-pre-wrap"
                        >
                          {item.adminReply}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InquiryList;
