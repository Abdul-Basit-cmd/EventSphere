import React, { useState, useEffect, useCallback } from 'react';
import { Building2, User, Phone, Globe, MessageSquare, Sparkles, Layers } from 'lucide-react';
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
          <h2 className="text-xl font-bold text-white tracking-tight">Expo Hall Neighbors</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Network and coordinate with exhibitors stationed in adjacent booths across your active halls
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[350px]">
            <LoadingSpinner size="lg" />
            <p className="mt-3 text-xs text-slate-400">Finding your hall neighbors...</p>
          </div>
        ) : neighbors.length === 0 ? (
          <EmptyState
            title="No neighbors to display"
            message="Neighboring exhibitors will appear here once your company has been assigned a booth in an expo hall alongside fellow vendors."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {neighbors.map((item) => {
              const vendor = item.assignedTo;
              const companyInitial = vendor?.companyName ? vendor.companyName.charAt(0) : 'N';

              return (
                <div
                  key={item._id}
                  style={{
                    background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(17, 21, 32, 0.95) 100%)',
                    borderColor: 'rgba(148, 163, 184, 0.12)',
                  }}
                  className="p-5 rounded-2xl border shadow-xs flex flex-col justify-between space-y-4 card-lift"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm uppercase">
                          {companyInitial}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight">
                            {vendor?.companyName || 'Neighbor Vendor'}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Layers className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs font-semibold text-cyan-400">
                              Booth #{item.boothNumber}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold border border-slate-700/60 truncate max-w-[110px]">
                        {item.expoId?.title || 'Expo'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs pt-2 border-t border-slate-800/80 text-slate-300">
                      {vendor?.contactPerson && (
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>{vendor.contactPerson}</span>
                        </div>
                      )}
                      {vendor?.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-mono">{vendor.contactPhone}</span>
                        </div>
                      )}
                      {vendor?.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-slate-500" />
                          <a
                            href={vendor.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:underline truncate"
                          >
                            {vendor.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => handleOpenMessageModal(item)}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl btn-primary shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message Neighbor</span>
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
