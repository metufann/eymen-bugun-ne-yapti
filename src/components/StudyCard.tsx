import React, { useState } from 'react';
import type { StudySession } from '../types/database';
import { Check, Trash2 } from 'lucide-react';

interface StudyCardProps {
  session: StudySession;
  onOpenCompleteModal: (session: StudySession) => void;
  onToggleComplete: (id: string, currentCompleted: boolean) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}

export const StudyCard: React.FC<StudyCardProps> = ({
  session,
  onOpenCompleteModal,
  onToggleComplete,
  onDelete,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAction = async () => {
    if (isUpdating) return;

    if (!session.completed) {
      onOpenCompleteModal(session);
    } else {
      setIsUpdating(true);
      try {
        await onToggleComplete(session.id, true);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleEditResults = () => {
    onOpenCompleteModal(session);
  };

  const netScore = Math.max(0, session.correct - session.wrong / 3).toFixed(1);

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        session.completed
          ? 'bg-slate-50/80 border-slate-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header: Subject & Completion CTA */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {session.subject}
          </span>
          {session.completed && (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Tamamlandı
            </span>
          )}
          {session.completed && session.wrong_reviewed && (
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Yanlışlar incelendi
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {session.completed && (
            <button
              onClick={handleEditResults}
              className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
            >
              Düzenle
            </button>
          )}

          <button
            onClick={handleAction}
            disabled={isUpdating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              session.completed
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {session.completed && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{session.completed ? 'Geri Al' : 'Tamamla'}</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Bu görevi silmek istediğine emin misin?')) {
                onDelete(session.id);
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Görevi sil"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-4 text-xs font-mono text-slate-600 py-2 border-t border-slate-100">
        <div>
          <span className="text-slate-400 font-sans mr-1">Hedef:</span>
          <span className="font-semibold text-slate-800">{session.questions} soru</span>
        </div>
        {session.minutes > 0 && (
          <div>
            <span className="text-slate-400 font-sans mr-1">Süre:</span>
            <span className="font-semibold text-slate-800">{session.minutes} dk</span>
          </div>
        )}
        {session.completed && (
          <>
            <div>
              <span className="text-slate-400 font-sans mr-1">Sonuç:</span>
              <span className="font-semibold text-emerald-600">{session.correct}D</span>
              <span className="text-slate-300 mx-1">/</span>
              <span className="font-semibold text-amber-600">{session.wrong}Y</span>
            </div>
            <div className="ml-auto text-slate-700 font-sans">
              <span className="font-medium">Net:</span>{' '}
              <strong className="font-mono text-slate-900">{netScore}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
