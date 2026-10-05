import React from 'react';
import type { StudySession, CreateStudySessionInput, CompleteStudySessionInput } from '../types/database';
import type { SummaryStats } from '../utils/statistics';
import { DailySummary } from '../components/DailySummary';
import { StudyCard } from '../components/StudyCard';
import { EmptyState } from '../components/EmptyState';
import { TaskCardSkeleton, SummarySkeleton } from '../components/Skeleton';
import { AddStudyModal } from '../components/AddStudyModal';
import { CompleteStudyModal } from '../components/CompleteStudyModal';
import { Plus } from 'lucide-react';

interface DashboardProps {
  todayStudies: StudySession[];
  todaySummary: SummaryStats;
  loading: boolean;
  onToggleComplete: (id: string, currentCompleted: boolean) => Promise<unknown>;
  onCompleteStudy: (id: string, input: CompleteStudySessionInput) => Promise<{ success: boolean; error?: string }>;
  onAddStudy: (input: CreateStudySessionInput) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<unknown>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  todayStudies,
  todaySummary,
  loading,
  onToggleComplete,
  onCompleteStudy,
  onAddStudy,
  onDelete,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [completingSession, setCompletingSession] = React.useState<StudySession | null>(null);

  const handleOpenCompleteModal = (session: StudySession) => {
    setCompletingSession(session);
  };

  const handleCloseCompleteModal = () => {
    setCompletingSession(null);
  };

  const handleCompleteSubmit = async (id: string, input: CompleteStudySessionInput) => {
    return await onCompleteStudy(id, input);
  };

  return (
    <div className="space-y-6">
      {/* Summary KPI section */}
      {loading ? (
        <SummarySkeleton />
      ) : (
        <DailySummary summary={todaySummary} title="Bugünün Özeti" />
      )}

      {/* Header with primary action */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Bugünün Çalışma Planı
          </h2>
          <p className="text-xs text-slate-500">
            Tamamlanan ve hedeflenen ders oturumları
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Hedef Ekle</span>
        </button>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ) : todayStudies.length === 0 ? (
        <EmptyState onAddTask={() => setIsAddModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {todayStudies.map((session) => (
            <StudyCard
              key={session.id}
              session={session}
              onOpenCompleteModal={handleOpenCompleteModal}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Add Study Modal */}
      <AddStudyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStudy={onAddStudy}
      />

      {/* Complete Task Modal */}
      <CompleteStudyModal
        isOpen={Boolean(completingSession)}
        session={completingSession}
        onClose={handleCloseCompleteModal}
        onComplete={handleCompleteSubmit}
      />
    </div>
  );
};
