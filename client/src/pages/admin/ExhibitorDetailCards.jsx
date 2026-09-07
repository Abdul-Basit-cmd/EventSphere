import React from 'react';
import { Building2, Globe, User, Package, FileText } from 'lucide-react';

const ExhibitorDetailCards = ({ profile }) => {
  const productItems = (() => {
    if (!profile?.productsServices) return [];
    if (Array.isArray(profile.productsServices)) {
      return profile.productsServices;
    }
    if (typeof profile.productsServices === 'string') {
      return profile.productsServices
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  })();

  return (
    <div className="space-y-6">
      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company & Industry Info */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
          className="border rounded-[10px] p-6 space-y-4 shadow-xs card-lift"
        >
          <div
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="flex items-center gap-2 font-semibold text-sm border-b pb-3"
          >
            <Building2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <span>Organization Details</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span style={{ color: 'var(--color-text-dim)' }} className="block uppercase tracking-wider text-[10px] font-semibold mb-0.5">
                Industry & Sector
              </span>
              <span style={{ color: 'var(--color-text)' }} className="font-medium">
                {profile?.industry || 'General Exhibition'}
              </span>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-dim)' }} className="block uppercase tracking-wider text-[10px] font-semibold mb-0.5">
                Website
              </span>
              {profile?.website ? (
                <a
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-primary)' }}
                  className="hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <Globe className="w-3 h-3 text-[var(--color-text-dim)]" />
                  <span>{profile.website}</span>
                </a>
              ) : (
                <span style={{ color: 'var(--color-text-dim)' }}>Not provided</span>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--color-text-dim)' }} className="block uppercase tracking-wider text-[10px] font-semibold mb-0.5">
                Description
              </span>
              <p style={{ color: 'var(--color-text-muted)' }} className="leading-relaxed whitespace-pre-wrap">
                {profile?.description || 'No detailed description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
          className="border rounded-[10px] p-6 space-y-4 shadow-xs card-lift"
        >
          <div
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="flex items-center gap-2 font-semibold text-sm border-b pb-3"
          >
            <User className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <span>Point of Contact</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span style={{ color: 'var(--color-text-dim)' }} className="block uppercase tracking-wider text-[10px] font-semibold mb-0.5">
                Contact Person
              </span>
              <span style={{ color: 'var(--color-text)' }} className="font-medium">
                {profile?.contactPerson || profile?.userId?.name || '—'}
              </span>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-dim)' }} className="block uppercase tracking-wider text-[10px] font-semibold mb-0.5">
                Account Email
              </span>
              <span style={{ color: 'var(--color-text)' }} className="font-mono text-[11px]">
                {profile?.userId?.email || '—'}
              </span>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-dim)' }} className="block uppercase tracking-wider text-[10px] font-semibold mb-0.5">
                Contact Phone
              </span>
              <span style={{ color: 'var(--color-text)' }}>
                {profile?.contactPhone || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products and Services */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className="border rounded-[10px] p-6 shadow-xs card-lift"
      >
        <div
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          className="flex items-center gap-2 font-semibold text-sm border-b pb-3 mb-4"
        >
          <Package className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          <span>Products & Services Showcase</span>
        </div>

        {productItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {productItems.map((product, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                className="px-3 py-1 rounded-md text-xs font-medium border"
              >
                {product}
              </span>
            ))}
          </div>
        ) : typeof profile?.productsServices === 'string' && profile.productsServices.trim() ? (
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-relaxed">
            {profile.productsServices}
          </p>
        ) : (
          <p style={{ color: 'var(--color-text-dim)' }} className="text-xs">
            No specific product or service items cataloged yet.
          </p>
        )}
      </div>

      {/* Supporting Documents if present */}
      {Array.isArray(profile?.documents) && profile.documents.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
          className="border rounded-[10px] p-6 shadow-xs card-lift"
        >
          <div
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            className="flex items-center gap-2 font-semibold text-sm border-b pb-3 mb-4"
          >
            <FileText className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <span>Uploaded Verification Documents</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.documents.map((doc, idx) => (
              <a
                key={idx}
                href={typeof doc === 'string' && doc.startsWith('http') ? doc : '#'}
                target={typeof doc === 'string' && doc.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-[var(--color-border)] transition-colors"
              >
                <FileText className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                <span>
                  {typeof doc === 'string'
                    ? doc.split('/').pop() || `Document ${idx + 1}`
                    : `Document ${idx + 1}`}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitorDetailCards;
