import React from 'react';

const SectionHeader = ({ icon: Icon, title, badge, action }) => (
  <div className="flex items-center justify-between gap-2 mb-3">
    <div className="flex items-center gap-2 min-w-0">
      {Icon && <Icon size={14} className="text-brand-orange shrink-0" />}
      <h2 className="text-[11px] font-bold text-brand-charcoal uppercase tracking-wider truncate">
        {title}
      </h2>
      {badge != null && (
        <span className="text-[9px] font-black bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded shrink-0">
          {badge}
        </span>
      )}
    </div>
    {action}
  </div>
);

export default SectionHeader;
