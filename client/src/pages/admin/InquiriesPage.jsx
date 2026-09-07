import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchAdminInquiries, replyToInquiry } from '../../api/inquiryApi';
import AdminInquiriesTable from './AdminInquiriesTable';
import AdminInquiryDetail from './AdminInquiryDetail';

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  const loadInquiriesList = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetchAdminInquiries(page, 10);
      setInquiries(response.data?.inquiries || []);
      setPagination(
        response.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }
      );
      if (selectedInquiry) {
        const found = response.data?.inquiries?.find(
          (item) => item._id === selectedInquiry._id
        );
        if (found) setSelectedInquiry(found);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch inquiries');
    } finally {
      setIsLoading(false);
    }
  }, [selectedInquiry]);

  useEffect(() => {
    loadInquiriesList(pagination.page);
  }, [pagination.page]);

  const handleSelectInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyText(inquiry.adminReply || '');
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) {
      toast.error('Please enter a response message');
      return;
    }

    setIsReplying(true);
    try {
      const response = await replyToInquiry(selectedInquiry._id, replyText.trim());
      toast.success('Reply submitted and dispatched to user');
      setSelectedInquiry(response.data?.inquiry || null);
      loadInquiriesList(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header-accent">
        <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold tracking-tight">
          Support Inquiries
        </h2>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
          Review queries submitted by event attendees and exhibitors, provide direct organizer responses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inquiries Table (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <AdminInquiriesTable
            inquiries={inquiries}
            isLoading={isLoading}
            selectedInquiry={selectedInquiry}
            onSelectInquiry={handleSelectInquiry}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Inquiry Detail & Reply Form (Right 5 Cols) */}
        <div className="lg:col-span-5">
          <AdminInquiryDetail
            selectedInquiry={selectedInquiry}
            replyText={replyText}
            onReplyChange={setReplyText}
            onSendReply={handleSendReply}
            isReplying={isReplying}
          />
        </div>
      </div>
    </div>
  );
};

export default InquiriesPage;
