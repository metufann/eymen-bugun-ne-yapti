import React from 'react';

interface LgsCountdownProps {
  daysRemaining: number;
  lgsDate: string;
}

export const LgsCountdown: React.FC<LgsCountdownProps> = ({ daysRemaining }) => {
  let label = '';
  let highlight = false;

  if (daysRemaining > 0) {
    label = `LGS'ye ${daysRemaining} gün`;
  } else if (daysRemaining === 0) {
    label = 'LGS Bugün!';
    highlight = true;
  } else {
    label = 'LGS Tamamlandı';
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      <span className="text-slate-600 font-medium">Hedef:</span>
      <span className={`font-semibold font-mono ${highlight ? 'text-primary' : 'text-slate-900'}`}>
        {label}
      </span>
    </div>
  );
};
