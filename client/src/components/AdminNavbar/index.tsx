import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminPageHeader = ({ title, subtitle, actions }: AdminPageHeaderProps) => {
  return (
    <div
      className="flex align-items-center justify-content-between mb-4"
      style={{
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--surface-border)',
      }}
    >
      <div>
        <h1 className="m-0 text-2xl font-bold text-900">{title}</h1>
        {subtitle && <span className="text-500 text-sm mt-1 block">{subtitle}</span>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};
