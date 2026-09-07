import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDirectory } from '../../api/directoryApi';
import { fetchExpos } from '../../api/expoApi';
import { sendInquiry } from '../../api/inquiryPortalApi';
import InquiryModal from './InquiryModal';
import DirectoryTable from './DirectoryTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ExhibitorGuard from '../../components/ExhibitorGuard';

const ExhibitorDirectoryPage = () => {
  const [exhibitors, setExhibitors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [companySearch, setCompanySearch] = useState('');
  const [industrySearch, setIndustrySearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Inquiry Modal State
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);
  const [expos, setExpos] = useState([]);
  const [selectedExpoId, setSelectedExpoId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const loadDirectory = useCallback(async (page = 1, company = '', ind = '') => {
    setIsLoading(true);
    try {
      const response = await getDirectory({
        page,
        limit: 10,
        companyName: company.trim() || undefined,
        industry: ind.trim() || undefined,
      });
      setExhibitors(response.data?.exhibitors || []);
      setPagination(response.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (error) {
      toast.error('Failed to load exhibitor directory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadDirectory(1, companySearch, industrySearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [companySearch, industrySearch, loadDirectory]);

  const handleOpenInquiryModal = async (exhibitor) => {
    setSelectedExhibitor(exhibitor);
    setSubject('');
    setMessage('');
    try {
      const response = await fetchExpos({ limit: 100 });
      const expList = response.data?.expos || [];
      setExpos(expList);
      if (expList.length > 0) setSelectedExpoId(expList[0]._id);
    } catch (error) {
      toast.error('Failed to load expos list');
    }
  };

  const handleSendInquirySubmit = async (e) => {
    e.preventDefault();
    if (!selectedExpoId || !subject.trim() || !message.trim()) {
      toast.error('Please fill in all inquiry fields');
      return;
    }
    const recipientId = selectedExhibitor?.userId?._id || selectedExhibitor?.userId;
    if (!recipientId) {
      toast.error('Cannot message this exhibitor: user contact is not direct');
      return;
    }

    setIsSending(true);
    try {
      await sendInquiry({
        recipient: recipientId,
        expoId: selectedExpoId,
        subject: subject.trim(),
        message: message.trim(),
        type: 'exhibitor_network',
      });
      toast.success('Inquiry sent to exhibitor!');
      setSelectedExhibitor(null);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send inquiry';
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ExhibitorGuard requiresSubmitted>
      <div className="space-y-6 max-w-6xl">
        <div className="page-header-accent">
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">Exhibitor Directory</h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
            Connect and collaborate with verified vendors and event partners
          </p>
        </div>

        {/* Search Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--color-text-dim)] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by company name..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
            />
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--color-text-dim)] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by industry..."
              value={industrySearch}
              onChange={(e) => setIndustrySearch(e.target.value)}
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <LoadingSpinner size="lg" />
            <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading directory...</p>
          </div>
        ) : exhibitors.length === 0 ? (
          <EmptyState title="No exhibitors found" message="Try searching for a different company or industry." />
        ) : (
          <DirectoryTable
            exhibitors={exhibitors}
            pagination={pagination}
            onPageChange={(page) => loadDirectory(page, companySearch, industrySearch)}
            onOpenInquiry={handleOpenInquiryModal}
          />
        )}

        {/* Inquiry Modal */}
        <InquiryModal
          isOpen={Boolean(selectedExhibitor)}
          onClose={() => setSelectedExhibitor(null)}
          title={`Message ${selectedExhibitor?.companyName || 'Exhibitor'}`}
          expos={expos}
          showExpoSelect={true}
          selectedExpoId={selectedExpoId}
          onExpoChange={setSelectedExpoId}
          subject={subject}
          onSubjectChange={setSubject}
          message={message}
          onMessageChange={setMessage}
          onSubmit={handleSendInquirySubmit}
          isSending={isSending}
        />
      </div>
    </ExhibitorGuard>
  );
};

export default ExhibitorDirectoryPage;
