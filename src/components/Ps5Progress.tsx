import React from 'react';
import { Trophy, Zap } from 'lucide-react';

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
  const isAllDone = totalTasks > 0 && completedTasks === totalTasks;

  // Discrete ticks for gaming progress aesthetic
  const segments = 12;
  const activeSegments = Math.round((progress / 100) * segments);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 select-none animate-slide-up pointer-events-auto">
      <div className="ps5-card rounded-2xl p-4 sm:p-5 border border-white/10 w-[290px] sm:w-[320px] backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 group">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAllDone ? 'bg-emerald-400 shadow-[0_0_10px_#34D399]' : 'bg-primary shadow-glow-primary'} animate-pulse`} />
            <span className="text-[11px] font-black tracking-widest uppercase text-slate-300">
              {isAllDone ? "GÜN TAMAMLANDI" : "BUGÜNKÜ İLERLEME"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            {isAllDone ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <Trophy className="w-3.5 h-3.5" /> %100
              </span>
            ) : (
              <span className="text-white font-bold">{completedTasks} / {totalTasks}</span>
            )}
          </div>
        </div>

        {/* Segmented PS5-inspired progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 h-3.5 px-1 py-0.5 rounded-lg bg-black/40 border border-white/5">
            {Array.from({ length: segments }).map((_, idx) => {
              const isFilled = idx < activeSegments;
              return (
                <div
                  key={idx}
                  className={`flex-1 h-full rounded-sm transition-all duration-300 ${
                    isFilled
                      ? isAllDone
                        ? 'bg-gradient-to-t from-emerald-500 to-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                        : 'bg-gradient-to-t from-primary to-accent-teal shadow-glow-primary'
                      : 'bg-white/5'
                  }`}
                />
              );
            })}
          </div>

          {/* Sub progress label */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary-light" />
              Görev Tamamlama
            </span>
            <span className="font-extrabold text-white text-xs tracking-tight">
              %{progress}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
