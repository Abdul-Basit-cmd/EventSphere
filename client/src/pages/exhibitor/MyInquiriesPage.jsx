import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getMyInquiries } from '../../api/inquiryPortalApi';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import InquiryList from '../../components/InquiryList';

const MyInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const loadInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMyInquiries();
      setInquiries(response.data?.inquiries || []);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const currentUserId = user?._id || user?.id;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="page-header-accent">
        <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">Inquiries & Messages</h2>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
          View inquiries you sent to organizers and fellow exhibitors, plus incoming network queries
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading messages...</p>
        </div>
      ) : (
        <InquiryList inquiries={inquiries} currentUserId={currentUserId} />
      )}
    </div>
  );
};

export default MyInquiriesPage;
