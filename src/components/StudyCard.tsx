import React, { useState } from 'react';
import type { StudySession } from '../types/database';
import { Check, Clock, CheckCircle2, XCircle, BookOpen, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyCardProps {
  session: StudySession;
  onToggleComplete: (id: string, currentCompleted: boolean) => Promise<unknown>;
}

export const StudyCard: React.FC<StudyCardProps> = ({ session, onToggleComplete }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    // Trigger celebratory confetti if completing
    if (!session.completed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366F1', '#14B8A6', '#F59E0B'],
      });
    }

    try {
      await onToggleComplete(session.id, session.completed);
    } finally {
      setIsUpdating(false);
    }
  };

  // Color badges based on subject
  const getSubjectColor = (subj: string) => {
    switch (subj) {
      case 'Matematik':
        return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300';
      case 'Fen Bilimleri':
        return 'border-teal-500/30 bg-teal-500/10 text-teal-300';
      case 'Türkçe':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'T.C. İnkılap Tarihi':
        return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
      case 'İngilizce':
        return 'border-sky-500/30 bg-sky-500/10 text-sky-300';
      case 'Din Kültürü':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
      default:
        return 'border-slate-500/30 bg-slate-500/10 text-slate-300';
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden ${
        session.completed
          ? 'bg-surface-300/40 border-white/5 opacity-85'
          : 'glass-panel glass-panel-hover border-white/10'
      }`}
    >
      {/* Top row: Subject badge & status */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold tracking-wide border ${getSubjectColor(
              session.subject
            )}`}
          >
            {session.subject.toUpperCase()}
          </span>

          {session.completed && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              TAMAMLANDI
            </span>
          )}
        </div>

        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            session.completed
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
              : 'bg-surface-50 hover:bg-primary text-white border border-white/10 hover:border-primary shadow-sm hover:shadow-glow-primary'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
              session.completed
                ? 'bg-emerald-500 border-emerald-400 text-black'
                : 'border-slate-400 text-transparent'
            }`}
          >
            <Check className="w-3 h-3" strokeWidth={3} />
          </div>
          <span>{session.completed ? 'Geri Al' : 'Tamamla'}</span>
        </button>
      </div>

      {/* Metric highlights */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-black/20 rounded-xl p-2.5 border border-white/5">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-0.5">
            Soru
          </div>
          <div className="text-base sm:text-lg font-mono font-bold text-white">
            {session.questions}
          </div>
        </div>

        <div className="bg-black/20 rounded-xl p-2.5 border border-white/5">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-0.5 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-accent-teal" /> Süre
          </div>
          <div className="text-base sm:text-lg font-mono font-bold text-accent-teal">
            {session.minutes} <span className="text-[10px] font-normal text-slate-400">dk</span>
          </div>
        </div>

        <div className="bg-black/20 rounded-xl p-2.5 border border-white/5">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Doğru
          </div>
          <div className="text-base sm:text-lg font-mono font-bold text-emerald-400">
            {session.correct}
          </div>
        </div>

        <div className="bg-black/20 rounded-xl p-2.5 border border-white/5">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-0.5 flex items-center gap-1">
            <XCircle className="w-2.5 h-2.5 text-rose-400" /> Yanlış
          </div>
          <div className="text-base sm:text-lg font-mono font-bold text-rose-400">
            {session.wrong}
          </div>
        </div>
      </div>

      {/* Net & Success bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1.5 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          Net: {(session.correct - session.wrong / 3).toFixed(1)} Net
        </span>
        <span className="font-mono font-bold text-slate-300">
          Başarı: {session.correct + session.wrong > 0 ? Math.round((session.correct / (session.correct + session.wrong)) * 100) : 0}%
        </span>
      </div>
    </div>
  );
};
