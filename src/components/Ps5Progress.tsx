import React from 'react';

interface Ps5ProgressProps {
  progress: number; // 0 to 100
  completedTasks: number;
  totalTasks: number;
}

export const Ps5Progress: React.FC<Ps5ProgressProps> = ({
  progress,
  completedTasks,
  totalTasks,
}) => {
  if (totalTasks === 0) return null;

  const isAllDone = totalTasks > 0 && completedTasks === totalTasks;
  const segments = 12;
  const activeSegments = Math.round((progress / 100) * segments);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 select-none animate-slide-up pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-slate-200 shadow-lift w-[260px] sm:w-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-700">
            {isAllDone ? 'Bugün Tamamlandı' : 'Günlük İlerleme'}
          </span>
          <span className="text-xs font-mono font-bold text-slate-900">
            {completedTasks} / {totalTasks}
          </span>
        </div>

        {/* Segmented discrete bar */}
        <div className="flex items-center gap-1 h-2 rounded bg-slate-100 p-0.5">
          {Array.from({ length: segments }).map((_, idx) => {
            const isFilled = idx < activeSegments;
            return (
              <div
                key={idx}
                className={`flex-1 h-full rounded-xs transition-all duration-200 ${
                  isFilled
                    ? isAllDone
                      ? 'bg-emerald-600'
                      : 'bg-primary'
                    : 'bg-slate-200/70'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1.5">
          <span>Başarı Oranı</span>
          <span className="font-semibold text-slate-800">%{progress}</span>
        </div>
      </div>
    </div>
  );
};
