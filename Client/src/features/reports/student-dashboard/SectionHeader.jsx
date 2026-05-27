import React from 'react';

const SectionHeader = ({ icon: Icon, title, badge, action, inverted = false }) => (
  <div className="flex items-center justify-between gap-2 mb-3">
    <div className="flex items-center gap-2 min-w-0">
      {Icon && <Icon size={14} className="shrink-0 text-brand-orange" />}
      <h2
        className={`text-[11px] font-bold uppercase tracking-wider truncate ${
          inverted ? 'text-white' : 'text-brand-charcoal'
        }`}
      >
        {title}
      </h2>
      {badge != null && (
        <span
          className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ${
            inverted ? 'bg-white/15 text-white' : 'bg-brand-orange/10 text-brand-orange'
          }`}
        >
          {badge}
        </span>
      )}
    </div>
    {action}
  </div>
);

export default SectionHeader;
