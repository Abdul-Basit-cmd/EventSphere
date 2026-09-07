import React from 'react';
import FieldLabel from '../../components/ui/FieldLabel';

const ProfileFormFields = ({ register, errors }) => {
  const inputStyle = {
    backgroundColor: 'var(--color-surface-alt)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text)',
  };

  const labelStyle = {
    color: 'var(--color-text-muted)',
  };

  const errorStyle = {
    color: 'var(--color-danger)',
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel required>Company Name</FieldLabel>
          <input
            type="text"
            placeholder="Acme Innovations"
            {...register('companyName')}
            style={inputStyle}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden"
          />
          {errors.companyName && <p style={errorStyle} className="mt-1 text-xs">{errors.companyName.message}</p>}
        </div>

        <div>
          <FieldLabel required>Industry / Sector</FieldLabel>
          <input
            type="text"
            placeholder="Software, Clean Energy, etc."
            {...register('industry')}
            style={inputStyle}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden"
          />
          {errors.industry && <p style={errorStyle} className="mt-1 text-xs">{errors.industry.message}</p>}
        </div>

        <div>
          <FieldLabel required>Contact Person Name</FieldLabel>
          <input
            type="text"
            placeholder="Jane Smith"
            {...register('contactPerson')}
            style={inputStyle}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden"
          />
          {errors.contactPerson && <p style={errorStyle} className="mt-1 text-xs">{errors.contactPerson.message}</p>}
        </div>

        <div>
          <FieldLabel required>Contact Phone</FieldLabel>
          <input
            type="text"
            placeholder="+1-555-0199"
            {...register('contactPhone')}
            style={inputStyle}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden"
          />
          {errors.contactPhone && <p style={errorStyle} className="mt-1 text-xs">{errors.contactPhone.message}</p>}
        </div>

        <div>
          <FieldLabel>Website URL</FieldLabel>
          <input
            type="text"
            placeholder="https://example.com"
            {...register('website')}
            style={inputStyle}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden"
          />
          {errors.website && <p style={errorStyle} className="mt-1 text-xs">{errors.website.message}</p>}
        </div>

        <div>
          <FieldLabel>Logo URL</FieldLabel>
          <input
            type="text"
            placeholder="https://example.com/logo.png"
            {...register('logo')}
            style={inputStyle}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden"
          />
          {errors.logo && <p style={errorStyle} className="mt-1 text-xs">{errors.logo.message}</p>}
        </div>
      </div>

      <div>
        <FieldLabel required>Company Description</FieldLabel>
        <textarea
          rows={3}
          placeholder="Tell organizers and attendees about your business..."
          {...register('description')}
          style={inputStyle}
          className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden resize-none"
        />
        {errors.description && <p style={errorStyle} className="mt-1 text-xs">{errors.description.message}</p>}
      </div>

      <div>
        <FieldLabel required>Products & Services</FieldLabel>
        <textarea
          rows={3}
          placeholder="List your key products and services (e.g. Cloud Hosting, Cyber Security Audits)"
          {...register('productsServices')}
          style={inputStyle}
          className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden resize-none"
        />
        {errors.productsServices && <p style={errorStyle} className="mt-1 text-xs">{errors.productsServices.message}</p>}
      </div>

      <div>
        <FieldLabel required>Documents / Certificates (One per line)</FieldLabel>
        <textarea
          rows={2}
          placeholder="https://example.com/business-license.pdf"
          {...register('documents')}
          style={inputStyle}
          className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-hidden resize-none"
        />
        {errors.documents && <p style={errorStyle} className="mt-1 text-xs">{errors.documents.message}</p>}
      </div>
    </div>
  );
};

export default ProfileFormFields;
