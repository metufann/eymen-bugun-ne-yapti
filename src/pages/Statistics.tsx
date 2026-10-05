import React, { useMemo } from 'react';
import type { StudySession } from '../types/database';
import { calculateSummary, calculateSubjectBreakdown } from '../utils/statistics';
import { DailySummary } from '../components/DailySummary';

export interface StatisticsProps {
  studies: StudySession[];
  loading: boolean;
}

export const Statistics: React.FC<{ studies: StudySession[] }> = ({ studies }) => {
  const overallSummary = useMemo(() => calculateSummary(studies), [studies]);
  const subjectStats = useMemo(() => calculateSubjectBreakdown(studies), [studies]);

  const last7DaysStats = useMemo(() => {
    const now = new Date();
    const past7Date = new Date();
    past7Date.setDate(now.getDate() - 7);
    const past7Str = past7Date.toISOString().split('T')[0];

    const filtered = studies.filter((s) => s.date >= past7Str);
    return calculateSummary(filtered);
  }, [studies]);

  const topSubject = subjectStats.length > 0 ? subjectStats[0] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Performans Analizi
        </h2>
        <p className="text-xs text-slate-500">
          Tüm zamanlar ve ders bazlı soru dağılımı
        </p>
      </div>

      {/* Genel Özet */}
      <DailySummary summary={overallSummary} title="Tüm Zamanların Özeti" />

      {/* 2-column breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Son 7 Gün */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              Son 7 Günlük Tempo
            </span>
            <span className="text-xs font-mono text-primary font-medium">
              Haftalık
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="text-[11px] text-slate-500">Soru</div>
              <div className="text-xl font-mono font-bold text-slate-900 mt-0.5">
                {last7DaysStats.totalQuestions}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="text-[11px] text-slate-500">Süre</div>
              <div className="text-xl font-mono font-bold text-slate-900 mt-0.5">
                {last7DaysStats.totalMinutes} <span className="text-xs font-normal text-slate-500">dk</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="text-[11px] text-slate-500">Başarı</div>
              <div className="text-xl font-mono font-bold text-primary mt-0.5">
                %{last7DaysStats.accuracy}
              </div>
            </div>
          </div>
        </div>

        {/* En Çok Çalışılan Ders */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              En Çok Çalışılan Ders
            </span>
            <span className="text-xs font-mono text-slate-500">Lider</span>
          </div>

          {topSubject ? (
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-lg font-bold text-slate-900">
                  {topSubject.subject}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {topSubject.totalQuestions} Soru • {topSubject.totalMinutes} Dk
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-primary">
                  %{topSubject.accuracy}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Doğruluk
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-3">Veri bulunmuyor.</div>
          )}
        </div>
      </div>

      {/* Ders Dağılımı */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Ders Bazında Soru Dağılımı
        </h3>

        {subjectStats.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-6">
            Henüz analiz edilecek ders verisi bulunmuyor.
          </div>
        ) : (
          <div className="space-y-3">
            {subjectStats.map((sub) => {
              const maxQuestions = topSubject ? topSubject.totalQuestions : 1;
              const barWidth = Math.max(4, Math.round((sub.totalQuestions / maxQuestions) * 100));

              return (
                <div key={sub.subject} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-900">
                      {sub.subject}
                    </span>
                    <span className="font-mono text-slate-600">
                      {sub.totalQuestions} soru ({sub.totalCorrect}D / {sub.totalWrong}Y) • <strong className="text-slate-900">%{sub.accuracy}</strong>
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden flex items-center">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
