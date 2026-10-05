import React from 'react';
import type { SummaryStats } from '../utils/statistics';
import { HelpCircle, Clock, CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface DailySummaryProps {
  summary: SummaryStats;
  title?: string;
}

export const DailySummary: React.FC<DailySummaryProps> = ({
  summary,
  title = "BUGÜNÜN ÖZETİ"
}) => {
  const cards = [
    {
      label: 'TOPLAM SORU',
      value: summary.totalQuestions,
      unit: 'adet',
      icon: HelpCircle,
      color: 'text-primary-light',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    },
    {
      label: 'TOPLAM SÜRE',
      value: summary.totalMinutes,
      unit: 'dk',
      icon: Clock,
      color: 'text-accent-teal',
      bg: 'bg-accent-teal/10',
      border: 'border-accent-teal/20',
    },
    {
      label: 'DOĞRU',
      value: summary.totalCorrect,
      unit: 'net/d',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'YANLIŞ',
      value: summary.totalWrong,
      unit: 'adet',
      icon: XCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
    },
    {
      label: 'BAŞARI ORANI',
      value: `${summary.accuracy}%`,
      unit: 'isabet',
      icon: Trophy,
      color: 'text-accent-amber',
      bg: 'bg-accent-amber/10',
      border: 'border-accent-amber/20',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          {title}
        </h2>
        <span className="text-[11px] text-slate-400 font-medium">
          {summary.totalCompleted}/{summary.totalTasks} görev tamamlandı
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`glass-panel rounded-2xl p-4 border ${card.border} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-400">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                  {card.value}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {card.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
