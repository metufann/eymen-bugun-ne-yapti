import React, { useMemo } from 'react';
import type { StudySession } from '../types/database';
import { calculateSummary, calculateSubjectBreakdown } from '../utils/statistics';
import { DailySummary } from '../components/DailySummary';
import { BarChart3, Award, BookMarked, TrendingUp } from 'lucide-react';

export interface StatisticsProps {
  studies: StudySession[];
  loading: boolean;
}

export const Statistics: React.FC<{ studies: StudySession[] }> = ({ studies }) => {
  const overallSummary = useMemo(() => calculateSummary(studies), [studies]);
  const subjectStats = useMemo(() => calculateSubjectBreakdown(studies), [studies]);

  // Last 7 days calculations
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
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-light" />
          Performans & İstatistik Paneli
        </h2>
        <p className="text-xs text-slate-400">
          Tüm zamanlar ve ders bazlı detaylı soru çözüm analizi
        </p>
      </div>

      {/* Genel Özet */}
      <DailySummary summary={overallSummary} title="TÜM ZAMANLARIN GENEL ÖZETİ" />

      {/* Highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Son 7 Gün */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-teal" /> Son 7 Günün Tempoyu
            </span>
            <span className="text-xs font-mono font-bold text-accent-teal">
              Haftalık İlerleme
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Soru</div>
              <div className="text-xl font-mono font-bold text-white">
                {last7DaysStats.totalQuestions}
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Süre</div>
              <div className="text-xl font-mono font-bold text-accent-teal">
                {last7DaysStats.totalMinutes} <span className="text-xs font-normal">dk</span>
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Başarı</div>
              <div className="text-xl font-mono font-bold text-accent-amber">
                %{last7DaysStats.accuracy}
              </div>
            </div>
          </div>
        </div>

        {/* En Çok Çalışılan Ders */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-accent-amber" /> En Çok Çalışılan Ders
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">1. Sırada</span>
          </div>

          {topSubject ? (
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {topSubject.subject}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  {topSubject.totalQuestions} Soru • {topSubject.totalMinutes} Dk Çalışma
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-mono font-extrabold text-accent-amber">
                  %{topSubject.accuracy}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">
                  Net Doğruluk Oranı
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 py-3">Veri bulunmuyor.</div>
          )}
        </div>
      </div>

      {/* Ders Bazında Dağılım */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-primary-light" />
          Ders Bazında Başarı & Soru Dağılımı
        </h3>

        {subjectStats.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-6">
            Henüz analiz edilecek ders verisi bulunmuyor.
          </div>
        ) : (
          <div className="space-y-4">
            {subjectStats.map((sub) => {
              const maxQuestions = topSubject ? topSubject.totalQuestions : 1;
              const barWidth = Math.max(5, Math.round((sub.totalQuestions / maxQuestions) * 100));

              return (
                <div key={sub.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white tracking-wide">
                      {sub.subject}
                    </span>
                    <span className="font-mono text-slate-300">
                      {sub.totalQuestions} soru ({sub.totalCorrect}D / {sub.totalWrong}Y) • <strong className="text-accent-amber">%{sub.accuracy}</strong>
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/5 overflow-hidden flex items-center">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent-teal transition-all duration-500"
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
