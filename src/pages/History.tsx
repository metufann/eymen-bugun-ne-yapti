import React, { useMemo, useState } from 'react';
import type { StudySession } from '../types/database';
import { groupSessionsByDate } from '../utils/statistics';
import { formatDateTurkish } from '../utils/date';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
    setExpandedDates((prev) => ({ ...prev, [dateStr]: true }));
    const el = document.getElementById(`date-group-${dateStr}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Heatmap */}
      <CalendarHeatmap sessions={studies} onSelectDate={handleSelectDate} />

      {/* History section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Geçmiş Çalışma Günlüğü
            </h2>
            <p className="text-xs text-slate-500">
              Gün bazında ders seansları ve soru sayıları
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {dayGroups.length} gün kayıtlı
          </span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse h-20" />
            ))}
          </div>
        ) : dayGroups.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
            Henüz kaydedilmiş bir geçmiş çalışma bulunmuyor.
          </div>
        ) : (
          dayGroups.map((group) => {
            const isExpanded = expandedDates[group.date] ?? true;
            return (
              <div
                key={group.date}
                id={`date-group-${group.date}`}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                {/* Header summary of the day */}
                <div
                  onClick={() => toggleExpand(group.date)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex flex-col items-center justify-center font-mono">
                      <span className="text-xs font-bold text-primary">
                        {group.date.split('-')[2]}
                      </span>
                      <span className="text-[9px] uppercase text-slate-500">
                        {group.date.split('-')[1]}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {formatDateTurkish(group.date)}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {group.sessions.length} ders oturumu
                      </p>
                    </div>
                  </div>

                  {/* Day Aggregate metrics */}
                  <div className="flex items-center gap-3 sm:gap-5 text-xs font-mono text-slate-600 flex-wrap">
                    <span className="font-semibold text-slate-900">
                      {group.stats.totalQuestions} Soru
                    </span>
                    {group.stats.totalMinutes > 0 && (
                      <span>{group.stats.totalMinutes} dk</span>
                    )}
                    <span className="text-emerald-700 font-medium">
                      {group.stats.totalCorrect}D
                    </span>
                    <span className="text-amber-700 font-medium">
                      {group.stats.totalWrong}Y
                    </span>
                    <span className="px-2 py-0.5 rounded bg-orange-50 text-primary font-bold">
                      %{group.stats.accuracy}
                    </span>

                    <button className="text-slate-400 hover:text-slate-700 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded individual sessions */}
                {isExpanded && (
                  <div className="px-4 pb-2 pt-1 border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/50">
                    {group.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="py-2.5 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="font-medium text-slate-900">
                            {session.subject}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-slate-600">
                          <span>{session.questions} soru</span>
                          {session.minutes > 0 && <span>{session.minutes} dk</span>}
                          {session.completed ? (
                            <>
                              <span className="text-emerald-700">{session.correct}D</span>
                              <span className="text-amber-700">{session.wrong}Y</span>
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Tamamlandı
                              </span>
                              {session.wrong_reviewed && (
                                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  İncelendi
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              Devam Ediyor
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
