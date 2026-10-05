import React from 'react';
import type { SummaryStats } from '../utils/statistics';

interface DailySummaryProps {
  summary: SummaryStats;
  title?: string;
}

export const DailySummary: React.FC<DailySummaryProps> = ({
  summary,
  title = "Bugünün Özeti"
}) => {
  const metrics = [
    {
      label: 'Toplam Soru',
      value: summary.totalQuestions,
      unit: 'adet',
    },
    {
      label: 'Çalışma Süresi',
      value: summary.totalMinutes,
      unit: 'dk',
    },
    {
      label: 'Doğru',
      value: summary.totalCorrect,
      unit: 'd',
      color: 'text-slate-900',
    },
    {
      label: 'Yanlış',
      value: summary.totalWrong,
      unit: 'y',
      color: summary.totalWrong > 0 ? 'text-amber-600' : 'text-slate-900',
    },
    {
      label: 'Başarı Oranı',
      value: `${summary.accuracy}%`,
      unit: 'isabet',
      color: 'text-primary font-bold',
    },
  ];

  return (
    <div className="pb-6 border-b border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          {summary.totalCompleted} / {summary.totalTasks} görev tamamlandı
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-3.5"
          >
            <div className="text-[11px] font-medium text-slate-500 mb-1">
              {m.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold font-mono tracking-tight ${m.color || 'text-slate-900'}`}>
                {m.value}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {m.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
