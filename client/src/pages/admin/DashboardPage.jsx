import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Layers,
  Users,
  Eye,
  Clock,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAnalytics } from '../../api/analyticsApi';
import { fetchExpos } from '../../api/expoApi';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardCharts from './DashboardCharts';
import DashboardTables from './DashboardTables';
import Select from '../../components/ui/Select';

const DashboardPage = () => {
  const [selectedExpoId, setSelectedExpoId] = useState('');
  const [expos, setExpos] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch list of expos for filter dropdown
  useEffect(() => {
    const loadExpos = async () => {
      try {
        const response = await fetchExpos({ limit: 100 });
        setExpos(response.data?.expos || []);
      } catch (error) {
        console.error('Failed to load expos for filter:', error);
      }
    };
    loadExpos();
  }, []);

  // Fetch analytics data when filter changes
  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchAnalytics(selectedExpoId);
      setAnalytics(response.data || {});
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to load dashboard analytics';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedExpoId]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleFilterChange = (event) => {
    setSelectedExpoId(event.target.value);
  };

  const boothBreakdown = [
    { label: 'Assigned', value: analytics?.assignedBooths ?? 0 },
    { label: 'Reserved', value: analytics?.reservedBooths ?? 0 },
    { label: 'Occupancy', value: `${analytics?.boothOccupancyRate ?? 0}%` },
  ];

  const exhibitorBreakdown = [
    { label: 'Pending', value: analytics?.pendingExhibitors ?? 0 },
    { label: 'Approved', value: analytics?.approvedExhibitors ?? 0 },
    { label: 'Rejected', value: analytics?.rejectedExhibitors ?? 0 },
  ];

  const attendeeBreakdown = [
    { label: 'Unique Attendees', value: analytics?.totalAttendees ?? 0 },
    { label: 'Total Registrations', value: analytics?.totalRegistrations ?? 0 },
  ];

  const registrationTrends = analytics?.registrationTrends || [];
  const popularSessions = analytics?.popularSessions || [];
  const boothTraffic = analytics?.boothTraffic || [];

  return (
    <div className="space-y-8">
      {/* Top Filter Bar */}
      <div
        style={{ borderColor: 'var(--color-border)' }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
      >
        <div className="page-header-accent">
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold tracking-tight">
            Overview & Key Performance
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
            Monitor real-time participation, booth occupancy, and session engagement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="expoFilter"
            style={{ color: 'var(--color-text-muted)' }}
            className="text-xs font-medium whitespace-nowrap"
          >
            Filter by Expo:
          </label>
          <div style={{ minWidth: 200 }}>
            <Select
              id="expoFilter"
              value={selectedExpoId}
              onChange={handleFilterChange}
              disabled={isLoading && expos.length === 0}
              options={[
                { value: '', label: 'All Expositions (Aggregate)' },
                ...expos.map((expo) => ({ value: expo._id, label: expo.title })),
              ]}
            />
          </div>
        </div>
      </div>

      {isLoading && !analytics ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs font-medium">
            Loading dashboard metrics...
          </p>
        </div>
      ) : (
        <>
          {/* KPI Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard
              title="Total Expos"
              value={analytics?.totalExpos ?? 0}
              subtitle="Hosted & scheduled exhibitions"
              icon={Calendar}
              accentColor="#3B82F6"
              trend="+100%"
              trendPositive={true}
            />

            <StatCard
              title="Booths & Occupancy"
              value={analytics?.totalBooths ?? 0}
              subtitle={`${analytics?.boothOccupancyRate ?? 0}% overall occupancy`}
              icon={Layers}
              accentColor="#10B981"
              trend={`${analytics?.boothOccupancyRate ?? 0}%`}
              trendPositive={(analytics?.boothOccupancyRate ?? 0) > 50}
              breakdown={boothBreakdown}
            />

            <StatCard
              title="Exhibitors"
              value={analytics?.totalExhibitors ?? 0}
              subtitle="Registered vendor profiles"
              icon={Building}
              accentColor="#8B5CF6"
              trend="+8.2%"
              trendPositive={true}
              breakdown={exhibitorBreakdown}
            />

            <StatCard
              title="Attendees & Signups"
              value={analytics?.totalRegistrations ?? 0}
              subtitle="Confirmed registration tickets"
              icon={Users}
              accentColor="#06B6D4"
              trend="+15.4%"
              trendPositive={true}
              breakdown={attendeeBreakdown}
            />

            <StatCard
              title="Scheduled Sessions"
              value={analytics?.totalSessions ?? 0}
              subtitle={`${analytics?.totalBookmarks ?? 0} session bookmarks logged`}
              icon={Clock}
              accentColor="#F59E0B"
              trend="+12%"
              trendPositive={true}
            />

            <StatCard
              title="Booth Traffic"
              value={analytics?.totalBoothVisits ?? 0}
              subtitle="Total verified attendee visits logged"
              icon={Eye}
              accentColor="#EC4899"
              trend="+24%"
              trendPositive={true}
            />
          </div>

          {/* Registration Trends Chart */}
          <DashboardCharts registrationTrends={registrationTrends} />

          {/* Popular Sessions & Booth Traffic */}
          <DashboardTables popularSessions={popularSessions} boothTraffic={boothTraffic} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
