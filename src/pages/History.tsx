import React, { useMemo, useState } from 'react';
import type { StudySession } from '../types/database';
import { groupSessionsByDate } from '../utils/statistics';
import { formatDateTurkish } from '../utils/date';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { Calendar, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryProps {
  studies: StudySession[];
  loading: boolean;
}

export const History: React.FC<HistoryProps> = ({ studies, loading }) => {
  const dayGroups = useMemo(() => groupSessionsByDate(studies), [studies]);
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleSelectDate = (dateStr: string) => {
    // Auto scroll or expand date
    setExpandedDates((prev) => ({ ...prev, [dateStr]: true }));
    const el = document.getElementById(`date-group-${dateStr}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Calendar Heatmap */}
      <CalendarHeatmap sessions={studies} onSelectDate={handleSelectDate} />

      {/* Grouped Day List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-light" />
            <h2 className="text-lg font-black tracking-tight text-white">
              Geçmiş Çalışma Günlüğü
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {dayGroups.length} gün kayıtlı
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-2xl p-5 border border-white/5 animate-pulse h-28" />
            ))}
          </div>
        ) : dayGroups.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center border border-white/5 text-slate-400">
            Henüz kaydedilmiş bir geçmiş çalışma bulunmuyor.
          </div>
        ) : (
          dayGroups.map((group) => {
            const isExpanded = expandedDates[group.date] ?? true; // expanded by default
            return (
              <div
                key={group.date}
                id={`date-group-${group.date}`}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/20"
              >
                {/* Header summary of the day */}
                <div
                  onClick={() => toggleExpand(group.date)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer bg-surface-100/40 hover:bg-surface-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center font-mono">
                      <span className="text-xs font-bold text-primary-light">
                        {group.date.split('-')[2]}
                      </span>
                      <span className="text-[9px] uppercase text-slate-400">
                        {group.date.split('-')[1]}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {formatDateTurkish(group.date)}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {group.sessions.length} ders seansı
                      </p>
                    </div>
                  </div>

                  {/* Day Aggregate metrics */}
                  <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono flex-wrap">
                    <span className="text-white font-bold">
                      {group.stats.totalQuestions} Soru
                    </span>
                    <span className="text-accent-teal flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {group.stats.totalMinutes} Dk
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {group.stats.totalCorrect}D
                    </span>
                    <span className="text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {group.stats.totalWrong}Y
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-accent-amber/10 border border-accent-amber/20 text-accent-amber font-bold">
                      %{group.stats.accuracy}
                    </span>

                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded individual sessions */}
                {isExpanded && (
                  <div className="p-4 pt-2 divide-y divide-white/5 bg-black/20">
                    {group.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="py-3 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="font-bold text-white tracking-wide">
                            {session.subject}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 font-mono text-slate-300">
                          <span>{session.questions} soru</span>
                          <span className="text-slate-400">{session.minutes} dk</span>
                          <span className="text-emerald-400">{session.correct}D</span>
                          <span className="text-rose-400">{session.wrong}Y</span>
                          {session.completed && (
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Tamamlandı
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
