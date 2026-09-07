import React from 'react';
import { User, Phone, Globe } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const ProfileReadOnlyView = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className="p-6 rounded-[10px] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-lift"
      >
        <div className="flex items-center gap-4">
          {profile.logo && (
            <img
              src={profile.logo}
              alt={profile.companyName}
              style={{ borderColor: 'var(--color-border)' }}
              className="w-12 h-12 rounded-lg object-cover border"
            />
          )}
          <div>
            <div className="flex items-center gap-3">
              <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">{profile.companyName}</h2>
              <StatusBadge status={profile.approvalStatus} />
            </div>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-1">{profile.industry}</p>
          </div>
        </div>
        <div
          style={{
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
          }}
          className="text-xs px-3 py-2 rounded-lg border"
        >
          Application locked while under review/approved
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
          className="p-5 rounded-[10px] border space-y-3 card-lift"
        >
          <h3 style={{ color: 'var(--color-text-muted)' }} className="text-xs font-semibold uppercase tracking-wider">
            Contact Details
          </h3>
          <div style={{ color: 'var(--color-text)' }} className="text-xs space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
              <span>{profile.contactPerson}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
              <span>{profile.contactPhone}</span>
            </div>
            {profile.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--color-primary)' }}
                  className="hover:underline truncate font-medium"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
          className="p-5 rounded-[10px] border space-y-3 card-lift"
        >
          <h3 style={{ color: 'var(--color-text-muted)' }} className="text-xs font-semibold uppercase tracking-wider">
            Company Overview
          </h3>
          <p style={{ color: 'var(--color-text)' }} className="text-xs leading-relaxed whitespace-pre-wrap">
            {profile.description}
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className="p-5 rounded-[10px] border space-y-3 card-lift"
      >
        <h3 style={{ color: 'var(--color-text-muted)' }} className="text-xs font-semibold uppercase tracking-wider">
          Products & Services
        </h3>
        <p style={{ color: 'var(--color-text)' }} className="text-xs leading-relaxed whitespace-pre-wrap">
          {profile.productsServices}
        </p>
      </div>
    </div>
  );
};

export default ProfileReadOnlyView;
