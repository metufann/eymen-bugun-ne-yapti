import React, { useMemo, useState } from 'react';
import type { StudySession, CompleteStudySessionInput } from '../types/database';
import { groupSessionsByDate } from '../utils/statistics';
import { formatDateTurkish } from '../utils/date';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { StudyCard } from '../components/StudyCard';
import { CompleteStudyModal } from '../components/CompleteStudyModal';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryProps {
  studies: StudySession[];
  loading: boolean;
  onToggleComplete: (id: string, currentCompleted: boolean) => Promise<unknown>;
  onCompleteStudy: (id: string, input: CompleteStudySessionInput) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<unknown>;
}

export const History: React.FC<HistoryProps> = ({
  studies,
  loading,
  onToggleComplete,
  onCompleteStudy,
  onDelete,
}) => {
  const dayGroups = useMemo(() => groupSessionsByDate(studies), [studies]);
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [completingSession, setCompletingSession] = useState<StudySession | null>(null);

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
                        {group.sessions.some((s) => !s.completed) && (
                          <span className="ml-1.5 text-amber-700 font-medium">
                            · {group.sessions.filter((s) => !s.completed).length} bekliyor
                          </span>
                        )}
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
                  <div className="px-4 pb-4 pt-3 border-t border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.sessions.map((session) => (
                      <StudyCard
                        key={session.id}
                        session={session}
                        onOpenCompleteModal={setCompletingSession}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <CompleteStudyModal
        key={completingSession?.id ?? 'closed'}
        isOpen={Boolean(completingSession)}
        session={completingSession}
        onClose={() => setCompletingSession(null)}
        onComplete={onCompleteStudy}
      />
    </div>
  );
};
