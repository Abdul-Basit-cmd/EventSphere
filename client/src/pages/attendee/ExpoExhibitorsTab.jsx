import React, { useState, useEffect, useCallback } from 'react';
import { Search, MessageSquare } from 'lucide-react';
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
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter exhibitors by company name, technology, or sector..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px]">
          <LoadingSpinner size="lg" />
          <p className="mt-3 text-xs text-slate-400">Loading exhibitor directory...</p>
        </div>
      ) : exhibitors.length === 0 ? (
        <EmptyState
          title="No exhibitors found"
          message="No registered exhibitors matched your search query."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exhibitors.map((item) => {
            const initial = item.companyName ? item.companyName.charAt(0) : 'E';

            return (
              <div
                key={item._id}
                style={{
                  background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(17, 21, 32, 0.95) 100%)',
                  borderColor: 'rgba(148, 163, 184, 0.12)',
                }}
                className="group relative border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 card-lift"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm uppercase">
                        {initial}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                          {item.companyName}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-400">
                          {item.contactPerson || 'Exhibitor Booth Staff'}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700/60 shrink-0">
                      {item.industry || 'Exhibitor'}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => onOpenInquiry(item)}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700/60 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Commercial Inquiry</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpoExhibitorsTab;
