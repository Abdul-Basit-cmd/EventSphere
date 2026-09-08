import React, { useState } from 'react';
import { Building2, Package, ShieldCheck, Globe, Phone, User, Link as LinkIcon } from 'lucide-react';
import FieldLabel from '../../components/ui/FieldLabel';

const tabs = [
  { id: 'overview', label: '1. Company Overview', icon: Building2 },
  { id: 'products', label: '2. Products & Services', icon: Package },
  { id: 'contact', label: '3. Contact & Documents', icon: ShieldCheck },
];

const ProfileFormFields = ({ register, errors }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Modern Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Company Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-modal-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Company Name</FieldLabel>
              <input
                type="text"
                placeholder="Acme Innovations Inc."
                {...register('companyName')}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {errors.companyName && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <FieldLabel required>Industry / Vertical</FieldLabel>
              <input
                type="text"
                placeholder="Artificial Intelligence, Robotics, CleanTech"
                {...register('industry')}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {errors.industry && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.industry.message}</p>
              )}
            </div>
          </div>

          <div>
            <FieldLabel required>Company Bio / Description</FieldLabel>
            <textarea
              rows={4}
              placeholder="Tell organizers and attendees about your mission, flagship products, and exhibition objectives..."
              {...register('description')}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none leading-relaxed"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <FieldLabel>Official Website URL</FieldLabel>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="https://example.com"
                  {...register('website')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
              {errors.website && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.website.message}</p>
              )}
            </div>

            <div>
              <FieldLabel>Brand Logo URL</FieldLabel>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="https://example.com/logo.png"
                  {...register('logo')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
              {errors.logo && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.logo.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products & Catalog */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-modal-in">
          <div>
            <FieldLabel required>Products & Services Showcase</FieldLabel>
            <p className="text-xs text-slate-400 mb-2">
              List the products, technologies, hardware, or consulting services you plan to display at your booth.
            </p>
            <textarea
              rows={5}
              placeholder="e.g. Enterprise Cloud ERP, IoT Sensor Arrays, Automated Warehouse Fleet"
              {...register('productsServices')}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors resize-none leading-relaxed"
            />
            {errors.productsServices && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.productsServices.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Contact & Documents */}
      {activeTab === 'contact' && (
        <div className="space-y-4 animate-modal-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Primary Contact Person</FieldLabel>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Jane Smith (Chief Exhibitor Officer)"
                  {...register('contactPerson')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
              {errors.contactPerson && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.contactPerson.message}</p>
              )}
            </div>

            <div>
              <FieldLabel required>Contact Direct Phone</FieldLabel>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="+1 (555) 234-5678"
                  {...register('contactPhone')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
              {errors.contactPhone && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.contactPhone.message}</p>
              )}
            </div>
          </div>

          <div>
            <FieldLabel required>Compliance Documents & Licenses (One per line)</FieldLabel>
            <p className="text-xs text-slate-400 mb-2">
              Provide verifiable URLs to your trade licenses, company certificate, or product compliance PDFs for administrative review.
            </p>
            <textarea
              rows={3}
              placeholder="https://example.com/docs/business-license-2026.pdf&#10;https://example.com/docs/tax-certificate.pdf"
              {...register('documents')}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors resize-none font-mono"
            />
            {errors.documents && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.documents.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFormFields;
