import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  message = 'There is currently no data to display.',
  action = null,
}) => {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed"
    >
      <div
        style={{
          border: '2px dashed var(--color-border-light)',
          borderRadius: '50%',
          padding: '20px',
          color: 'var(--color-text-dim)',
          background: 'var(--color-surface-alt)',
        }}
        className="flex items-center justify-center mb-4"
      >
        <Icon className="w-6 h-6" />
      </div>
      <h4
        style={{ color: 'var(--color-text)' }}
        className="text-sm font-semibold mb-1"
      >
        {title}
      </h4>
      <p
        style={{ color: 'var(--color-text-muted)' }}
        className="text-xs max-w-sm mb-4 leading-relaxed"
      >
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
