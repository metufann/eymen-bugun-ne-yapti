import React, { useState } from 'react';
import { LGS_SUBJECTS, type CreateStudySessionInput } from '../types/database';
import { getTodayDateString } from '../utils/date';
import { X, Loader2 } from 'lucide-react';

interface AddStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudy: (input: CreateStudySessionInput) => Promise<{ success: boolean; error?: string }>;
}

export const AddStudyModal: React.FC<AddStudyModalProps> = ({
  isOpen,
  onClose,
  onAddStudy,
}) => {
  const [subject, setSubject] = useState<string>(LGS_SUBJECTS[0]);
  const [questions, setQuestions] = useState<string>('30');
  const [minutes, setMinutes] = useState<string>('40');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qNum = parseInt(questions, 10);
    const mNum = parseInt(minutes, 10) || 0;

    if (!subject) {
      setError('Lütfen bir ders seçin.');
      return;
    }
    if (isNaN(qNum) || qNum <= 0) {
      setError('Çözülecek soru sayısı en az 1 olmalıdır.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateStudySessionInput = {
        subject,
        questions: qNum,
        minutes: mNum,
        correct: 0,
        wrong: 0,
        completed: false,
        date: date || getTodayDateString(),
      };

      const res = await onAddStudy(payload);

      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Görev eklenirken bir sorun oluştu.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-modal relative animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Yeni Çalışma Hedefi Ekle
            </h3>
            <p className="text-xs text-slate-500">
              Ders ve çözülecek soru sayısını belirleyin
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ders
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {LGS_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Çözülecek Soru
              </label>
              <input
                type="number"
                min="1"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tahmini Süre (Dk)
              </label>
              <input
                type="number"
                min="0"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tarih
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Ekleniyor...</span>
                </>
              ) : (
                <span>Hedefi Ekle</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
