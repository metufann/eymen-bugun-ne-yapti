import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask }) => {
  return (
    <div className="glass-panel rounded-3xl p-10 sm:p-12 text-center border border-white/10 flex flex-col items-center justify-center max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 text-primary shadow-glow-primary">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight mb-2">
        Bugün henüz bir çalışma planı oluşturulmadı
      </h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm">
        Günün ilk hedefini ekleyerek başla. Her soru seni LGS hedefine bir adım daha yaklaştırır.
      </p>
      <button
        onClick={onAddTask}
        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all duration-200 shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Günün İlk Görevini Ekle</span>
      </button>
    </div>
  );
};
