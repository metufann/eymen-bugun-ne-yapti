import React from 'react';
import { Calendar, Flame } from 'lucide-react';

interface LgsCountdownProps {
  daysRemaining: number;
  lgsDate: string;
}

export const LgsCountdown: React.FC<LgsCountdownProps> = ({ daysRemaining }) => {
  let badgeText = '';
  let badgeSub = 'LGS YOLCULUĞU';
  let isTargetDay = false;
  let isPassed = false;

  if (daysRemaining > 0) {
    badgeText = `LGS'YE ${daysRemaining} GÜN KALDI`;
  } else if (daysRemaining === 0) {
    badgeText = 'LGS BUGÜN!';
    badgeSub = 'BAŞARILAR!';
    isTargetDay = true;
  } else {
    badgeText = 'LGS TAMAMLANDI';
    badgeSub = 'GEÇMİŞ OLSUN';
    isPassed = true;
  }

  return (
    <div className="relative group">
      <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-100/80 border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-lg">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
          isTargetDay 
            ? 'bg-accent-amber/20 text-accent-amber' 
            : isPassed 
            ? 'bg-slate-700/50 text-slate-400' 
            : 'bg-primary/20 text-primary-light shadow-glow-primary'
        }`}>
          {isTargetDay ? <Flame className="w-5 h-5 animate-bounce" /> : <Calendar className="w-5 h-5" />}
        </div>
        
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
            {badgeSub}
          </span>
          <span className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
            {badgeText}
          </span>
        </div>
      </div>
    </div>
  );
};
