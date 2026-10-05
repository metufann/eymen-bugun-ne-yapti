import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask }) => {
  return (
    <div className="bg-white rounded-xl p-8 sm:p-10 text-center border border-slate-200 flex flex-col items-center justify-center max-w-md mx-auto my-6">
      <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center mb-3 text-primary font-bold text-sm">
        +
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">
        Bugün henüz bir çalışma planı yok
      </h3>
      <p className="text-slate-500 text-xs mb-4 leading-relaxed max-w-xs">
        Ders ve hedef soru sayısını belirleyerek günün ilk oturumunu oluşturun.
      </p>
      <button
        onClick={onAddTask}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-xs transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Günün İlk Hedefini Ekle</span>
      </button>
    </div>
  );
};
