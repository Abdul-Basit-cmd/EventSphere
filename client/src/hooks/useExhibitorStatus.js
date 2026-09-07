import { useState, useEffect, useCallback } from 'react';
import { getDashboard } from '../api/exhibitorPortalApi';

// In-flight promise and short cache to prevent duplicate requests
let cachedPromise = null;
let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL = 2000; // 2 seconds

const fetchDashboardStatus = async (force = false) => {
  const now = Date.now();
  if (!force && cachedData && now - lastFetchTime < CACHE_TTL) {
    return cachedData;
  }
  if (!force && cachedPromise) {
    return cachedPromise;
  }

  cachedPromise = (async () => {
    try {
      const response = await getDashboard();
      const profileStatus = response?.data?.profileStatus || {
        onboardingComplete: false,
        approvalStatus: 'draft',
      };
      cachedData = {
        onboardingComplete: Boolean(profileStatus.onboardingComplete),
        approvalStatus: profileStatus.approvalStatus || 'draft',
      };
      lastFetchTime = Date.now();
      return cachedData;
    } catch (err) {
      cachedData = {
        onboardingComplete: false,
        approvalStatus: 'draft',
      };
      lastFetchTime = Date.now();
      return cachedData;
    } finally {
      cachedPromise = null;
    }
  })();

  return cachedPromise;
};

export const useExhibitorStatus = () => {
  const [status, setStatus] = useState(
    cachedData || {
      onboardingComplete: false,
      approvalStatus: 'draft',
    }
  );
  const [isLoading, setIsLoading] = useState(!cachedData);

  const loadStatus = useCallback(async (force = false) => {
    if (!cachedData || force) {
      setIsLoading(true);
    }
    try {
      const data = await fetchDashboardStatus(force);
      setStatus(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const onboardingComplete = Boolean(status.onboardingComplete);
  const approvalStatus = status.approvalStatus || 'draft';
  const isSubmitted = onboardingComplete || approvalStatus === 'pending' || approvalStatus === 'approved';
  const isApproved = approvalStatus === 'approved';
  const isPending = approvalStatus === 'pending';
  const isRejected = approvalStatus === 'rejected';

  return {
    onboardingComplete,
    approvalStatus,
    isSubmitted,
    isApproved,
    isPending,
    isRejected,
    isLoading,
    refetch: () => loadStatus(true),
  };
};

export default useExhibitorStatus;
