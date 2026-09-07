import React, { useState, useEffect, useCallback } from 'react';
import { Building2, User, Phone, Globe, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { getNeighbors } from '../../api/exhibitorPortalApi';
import { sendInquiry } from '../../api/inquiryPortalApi';
import InquiryModal from './InquiryModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ExhibitorGuard from '../../components/ExhibitorGuard';

const NeighborsPage = () => {
  const [neighbors, setNeighbors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Message Modal
  const [selectedNeighbor, setSelectedNeighbor] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const loadNeighbors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getNeighbors();
      setNeighbors(response.data?.neighbors || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setNeighbors([]);
      } else {
        toast.error('Failed to load neighboring exhibitors');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNeighbors();
  }, [loadNeighbors]);

  const handleOpenMessageModal = (item) => {
    setSelectedNeighbor(item);
    setSubject(`Hello from neighbor at ${item.expoId?.title || 'Expo'}`);
    setMessage('');
  };

  const handleSendMessageSubmit = async (e) => {
    e.preventDefault();
    const recipientId = selectedNeighbor?.assignedTo?.userId?._id || selectedNeighbor?.assignedTo?.userId;
    const expoId = selectedNeighbor?.expoId?._id || selectedNeighbor?.expoId;

    if (!recipientId || !expoId || !subject.trim() || !message.trim()) {
      toast.error('Please enter all message details');
      return;
    }

    setIsSending(true);
    try {
      await sendInquiry({
        recipient: recipientId,
        expoId,
        subject: subject.trim(),
        message: message.trim(),
        type: 'exhibitor_network',
      });
      toast.success('Message dispatched to neighbor!');
      setSelectedNeighbor(null);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send message';
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ExhibitorGuard requiresSubmitted requiresApproval>
      <div className="space-y-6 max-w-6xl">
        <div className="page-header-accent">
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">Expo Neighbors</h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
            Exhibitors stationed alongside you in the same event halls
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[350px]">
            <LoadingSpinner size="lg" />
            <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Finding your expo neighbors...</p>
          </div>
        ) : neighbors.length === 0 ? (
          <EmptyState
            title="No neighbors to display"
            message="Neighboring exhibitors will appear here after your company has been assigned a booth in an expo alongside other exhibitors."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {neighbors.map((item) => {
              const vendor = item.assignedTo;
              return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                  className="p-5 rounded-[10px] border flex flex-col justify-between space-y-4 card-lift"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 style={{ color: 'var(--color-text)' }} className="text-base font-bold">
                          {vendor?.companyName || 'Neighbor Vendor'}
                        </h3>
                        <p style={{ color: 'var(--color-primary)' }} className="text-xs font-medium">
                          Booth #{item.boothNumber}
                        </p>
                      </div>
                      <span
                        style={{
                          backgroundColor: 'var(--color-surface-alt)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-muted)',
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-full border"
                      >
                        {item.expoId?.title || 'Expo'}
                      </span>
                    </div>

                    <div style={{ color: 'var(--color-text-muted)' }} className="space-y-1.5 text-xs pt-1">
                      {vendor?.contactPerson && (
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[var(--color-text-dim)]" />
                          <span>{vendor.contactPerson}</span>
                        </div>
                      )}
                      {vendor?.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[var(--color-text-dim)]" />
                          <span>{vendor.contactPhone}</span>
                        </div>
                      )}
                      {vendor?.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-[var(--color-text-dim)]" />
                          <a
                            href={vendor.website}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--color-primary)' }}
                            className="hover:underline truncate"
                          >
                            {vendor.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ borderColor: 'var(--color-border)' }} className="pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => handleOpenMessageModal(item)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg btn-primary"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Message Modal */}
        <InquiryModal
          isOpen={Boolean(selectedNeighbor)}
          onClose={() => setSelectedNeighbor(null)}
          title={`Message ${selectedNeighbor?.assignedTo?.companyName || 'Neighbor'}`}
          showExpoSelect={false}
          subject={subject}
          onSubjectChange={setSubject}
          message={message}
          onMessageChange={setMessage}
          onSubmit={handleSendMessageSubmit}
          isSending={isSending}
        />
      </div>
    </ExhibitorGuard>
  );
};

export default NeighborsPage;
