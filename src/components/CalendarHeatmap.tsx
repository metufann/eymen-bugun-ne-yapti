import React from 'react';
import type { StudySession } from '../types/database';
import { formatDateTurkish } from '../utils/date';

interface CalendarHeatmapProps {
  sessions: StudySession[];
  onSelectDate?: (dateStr: string) => void;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  sessions,
  onSelectDate,
}) => {
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

  const getIntensityClass = (q: number) => {
    if (q === 0) return 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-400';
    if (q < 30) return 'bg-orange-100 border-orange-200 text-orange-800';
    if (q < 60) return 'bg-orange-300 border-orange-400 text-orange-950 font-semibold';
    if (q < 100) return 'bg-primary text-white border-orange-500 font-semibold';
    return 'bg-orange-700 text-white border-orange-800 font-bold';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Son 35 Günün Çalışma Yoğunluğu
          </h3>
          <p className="text-xs text-slate-500">
            Kutuların renk koyuluğu çözülen soru sayısını gösterir
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
          <span>Az</span>
          <div className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200"></div>
          <div className="w-2.5 h-2.5 rounded bg-orange-100 border border-orange-200"></div>
          <div className="w-2.5 h-2.5 rounded bg-orange-300 border border-orange-400"></div>
          <div className="w-2.5 h-2.5 rounded bg-primary border border-orange-500"></div>
          <span>Çok</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {days.map((item) => (
          <div
            key={item.dateStr}
            onClick={() => onSelectDate?.(item.dateStr)}
            title={`${formatDateTurkish(item.dateStr)}: ${item.questions} soru (${item.count} ders)`}
            className={`aspect-square rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 p-1 ${getIntensityClass(
              item.questions
            )}`}
          >
            <span className="text-[10px] font-mono leading-none">
              {item.dateStr.split('-')[2]}
            </span>
            {item.questions > 0 && (
              <span className="text-[9px] font-mono leading-none mt-1 truncate max-w-full">
                {item.questions}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
