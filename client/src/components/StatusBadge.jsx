import React from 'react';

const statusConfig = {
  // Success styles
  approved: {
    label: 'Approved',
    style: {
      background: 'var(--color-success-muted)',
      color: 'var(--color-success)',
      borderColor: 'var(--color-success)',
    },
  },
  active: {
    label: 'Active',
    style: {
      background: 'var(--color-success-muted)',
      color: 'var(--color-success)',
      borderColor: 'var(--color-success)',
    },
  },
  published: {
    label: 'Published',
    style: {
      background: 'var(--color-success-muted)',
      color: 'var(--color-success)',
      borderColor: 'var(--color-success)',
    },
  },

  // Warning styles
  pending: {
    label: 'Pending',
    style: {
      background: 'var(--color-warning-muted)',
      color: 'var(--color-warning)',
      borderColor: 'var(--color-warning)',
    },
  },
  reserved: {
    label: 'Reserved',
    style: {
      background: 'var(--color-warning-muted)',
      color: 'var(--color-warning)',
      borderColor: 'var(--color-warning)',
    },
  },
  draft: {
    label: 'Draft',
    style: {
      background: 'var(--color-warning-muted)',
      color: 'var(--color-warning)',
      borderColor: 'var(--color-warning)',
    },
  },

  // Danger styles
  rejected: {
    label: 'Rejected',
    style: {
      background: 'var(--color-danger-muted)',
      color: 'var(--color-danger)',
      borderColor: 'var(--color-danger)',
    },
  },
  cancelled: {
    label: 'Cancelled',
    style: {
      background: 'var(--color-danger-muted)',
      color: 'var(--color-danger)',
      borderColor: 'var(--color-danger)',
    },
  },

  // Accent / Cyan styles
  available: {
    label: 'Available',
    style: {
      background: 'var(--color-accent-muted)',
      color: 'var(--color-accent)',
      borderColor: 'var(--color-accent)',
    },
  },
  assigned: {
    label: 'Assigned',
    style: {
      background: 'var(--color-primary-muted)',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)',
    },
  },
  replied: {
    label: 'Replied',
    style: {
      background: 'var(--color-accent-muted)',
      color: 'var(--color-accent)',
      borderColor: 'var(--color-accent)',
    },
  },
};

const defaultMutedStyle = {
  background: 'var(--color-surface-alt)',
  color: 'var(--color-text-muted)',
  borderColor: 'var(--color-border)',
};

const StatusBadge = ({ status = 'pending', customLabel = null }) => {
  const normalized = String(status).toLowerCase();
  const config = statusConfig[normalized] || {
    label: status,
    style: defaultMutedStyle,
  };

  const displayText = customLabel || config.label;

  return (
    <span
      style={{
        ...config.style,
        borderWidth: '1px',
        borderStyle: 'solid',
        transition: 'opacity 0.2s ease',
      }}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {displayText}
    </span>
  );
};

export default StatusBadge;
