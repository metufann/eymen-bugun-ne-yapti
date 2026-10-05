import React from 'react';
import { formatDateTurkish } from '../utils/date';
import type { StudySession } from '../types/database';

interface CalendarHeatmapProps {
  sessions: StudySession[];
  onSelectDate?: (dateStr: string) => void;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  sessions,
  onSelectDate,
}) => {
  // Generate the last 35 days (5 weeks) for high visual density and clean look
  const days: { dateStr: string; questions: number; count: number }[] = [];
  const map = new Map<string, { questions: number; count: number }>();

  sessions.forEach((s) => {
    const cur = map.get(s.date) || { questions: 0, count: 0 };
    map.set(s.date, {
      questions: cur.questions + (s.questions || 0),
      count: cur.count + 1,
    });
  });

  const now = new Date();
  for (let i = 34; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const data = map.get(dateStr) || { questions: 0, count: 0 };
    days.push({
      dateStr,
      questions: data.questions,
      count: data.count,
    });
  }

  // Intensity color function
  const getIntensityClass = (q: number) => {
    if (q === 0) return 'bg-white/5 border-white/5 hover:border-white/20';
    if (q < 30) return 'bg-primary/30 border-primary/40 hover:border-primary';
    if (q < 60) return 'bg-primary/60 border-primary/70 hover:border-primary';
    if (q < 100) return 'bg-primary border-primary-light hover:border-white shadow-glow-primary';
    return 'bg-accent-teal border-teal-300 hover:border-white shadow-glow-teal';
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Son 35 Günün Çalışma Yoğunluğu
          </h3>
          <p className="text-xs text-slate-400">
            Daha koyu ve parlak kutular daha yüksek soru sayısını temsil eder.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <span>Az</span>
          <div className="w-2.5 h-2.5 rounded bg-white/5 border border-white/10"></div>
          <div className="w-2.5 h-2.5 rounded bg-primary/40 border border-primary/50"></div>
          <div className="w-2.5 h-2.5 rounded bg-primary border border-primary-light"></div>
          <div className="w-2.5 h-2.5 rounded bg-accent-teal border border-teal-300"></div>
          <span>Çok</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 pt-1">
        {days.map((item) => (
          <div
            key={item.dateStr}
            onClick={() => onSelectDate?.(item.dateStr)}
            title={`${formatDateTurkish(item.dateStr)}: ${item.questions} soru (${item.count} ders)`}
            className={`aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 p-1.5 ${getIntensityClass(
              item.questions
            )}`}
          >
            <span className="text-[10px] font-mono text-slate-300 font-medium">
              {item.dateStr.split('-')[2]}
            </span>
            {item.questions > 0 && (
              <span className="text-[9px] font-mono font-bold text-white truncate max-w-full">
                {item.questions}s
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
