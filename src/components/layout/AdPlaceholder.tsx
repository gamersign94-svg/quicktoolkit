import React from 'react';

interface AdPlaceholderProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = 'horizontal',
  className = '',
}) => {
  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 mx-auto w-full max-w-4xl px-4 ${className}`}
    >
      <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-100/70 p-4 text-center transition-colors">
        <div className="flex items-center justify-between pb-2 text-[11px] font-medium tracking-wider text-slate-500 uppercase">
          <span>Sponsored Advertisement</span>
          <span>Ad Space Ready</span>
        </div>
        <div
          className={`flex items-center justify-center rounded-lg bg-white/60 border border-slate-200/60 shadow-xs ${
            format === 'horizontal'
              ? 'h-[90px] min-h-[60px] md:h-[90px]'
              : format === 'rectangle'
              ? 'h-[250px]'
              : 'h-[120px]'
          }`}
        >
          <div className="space-y-1 text-slate-500">
            <p className="text-xs font-semibold text-slate-700">QuickToolKit Ad Slot ({format})</p>
            <p className="text-[11px] text-slate-500">
              Future monetization area — Reserved for Google AdSense or partner network
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
