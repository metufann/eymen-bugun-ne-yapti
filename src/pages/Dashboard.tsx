import React, { useState } from 'react';
import type { StudySession, CreateStudySessionInput } from '../types/database';
import type { SummaryStats } from '../utils/statistics';
import { DailySummary } from '../components/DailySummary';
import { StudyCard } from '../components/StudyCard';
import { EmptyState } from '../components/EmptyState';
import { TaskCardSkeleton, SummarySkeleton } from '../components/Skeleton';
import { AddStudyModal } from '../components/AddStudyModal';
import { Plus, CheckSquare2 } from 'lucide-react';

interface DashboardProps {
  todayStudies: StudySession[];
  todaySummary: SummaryStats;
  loading: boolean;
  onToggleComplete: (id: string, currentCompleted: boolean) => Promise<unknown>;
  onAddStudy: (input: CreateStudySessionInput) => Promise<{ success: boolean; error?: string }>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  todayStudies,
  todaySummary,
  loading,
  onToggleComplete,
  onAddStudy,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Summary */}
      {loading ? (
        <SummarySkeleton />
      ) : (
        <DailySummary summary={todaySummary} title="BUGÜNÜN ÖZETİ" />
      )}

      {/* Main Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
            <CheckSquare2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Bugün Ne Yapmalı?
            </h2>
            <p className="text-xs text-slate-400">
              Bugün için planlanan LGS soru ve çalışma seansları
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Görev Ekle</span>
        </button>
      </div>

      {/* Task List or States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ) : todayStudies.length === 0 ? (
        <EmptyState onAddTask={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayStudies.map((session) => (
            <StudyCard
              key={session.id}
              session={session}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      )}

      {/* Add Study Modal */}
      <AddStudyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStudy={onAddStudy}
      />
    </div>
  );
};
