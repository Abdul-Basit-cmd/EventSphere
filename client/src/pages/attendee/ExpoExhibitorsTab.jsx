import React, { useState, useEffect, useCallback } from 'react';
import { Search, Building2, User, Phone, Globe, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDirectory } from '../../api/directoryApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const ExpoExhibitorsTab = ({ onOpenInquiry }) => {
  const [exhibitors, setExhibitors] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadExhibitors = useCallback(async (query = '') => {
    setIsLoading(true);
    try {
      const response = await getDirectory({
        limit: 50,
        companyName: query.trim() || undefined,
      });
      setExhibitors(response.data?.exhibitors || []);
    } catch (error) {
      toast.error('Failed to load exhibitor directory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadExhibitors(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search, loadExhibitors]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search exhibitors by company name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border focus:outline-hidden"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">Loading exhibitors...</p>
        </div>
      ) : exhibitors.length === 0 ? (
        <EmptyState
          title="No exhibitors found"
          message="No exhibitors matched your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exhibitors.map((item) => (
            <div
              key={item._id}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              className="p-4 rounded-[10px] border flex flex-col justify-between space-y-3 card-lift"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 style={{ color: 'var(--color-text)' }} className="text-sm font-bold">{item.companyName}</h4>
                  <span
                    style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-muted)',
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-full border"
                  >
                    {item.industry || 'Exhibitor'}
                  </span>
                </div>
                {item.description && (
                  <p style={{ color: 'var(--color-text-muted)' }} className="text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                {item.contactPerson && (
                  <p style={{ color: 'var(--color-text-muted)' }} className="text-[11px]">Contact: {item.contactPerson}</p>
                )}
              </div>

              <div style={{ borderColor: 'var(--color-border)' }} className="pt-2 border-t">
                <button
                  type="button"
                  onClick={() => onOpenInquiry(item)}
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpoExhibitorsTab;
