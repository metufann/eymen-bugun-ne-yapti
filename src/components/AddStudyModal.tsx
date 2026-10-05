import React, { useState } from 'react';
import { LGS_SUBJECTS, type CreateStudySessionInput } from '../types/database';
import { getTodayDateString } from '../utils/date';
import { X, Plus, AlertCircle, Loader2 } from 'lucide-react';

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
  const [minutes, setMinutes] = useState<string>('45');
  const [correct, setCorrect] = useState<string>('26');
  const [wrong, setWrong] = useState<string>('4');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qNum = parseInt(questions, 10);
    const mNum = parseInt(minutes, 10);
    const cNum = parseInt(correct, 10);
    const wNum = parseInt(wrong, 10);

    // Validation rules
    if (!subject) {
      setError('Lütfen bir ders seçin.');
      return;
    }
    if (isNaN(qNum) || qNum < 0) {
      setError('Soru sayısı 0 veya daha büyük olmalıdır.');
      return;
    }
    if (isNaN(mNum) || mNum < 0) {
      setError('Süre negatif olamaz.');
      return;
    }
    if (isNaN(cNum) || cNum < 0) {
      setError('Doğru sayısı negatif olamaz.');
      return;
    }
    if (isNaN(wNum) || wNum < 0) {
      setError('Yanlış sayısı negatif olamaz.');
      return;
    }
    if (cNum + wNum > qNum) {
      setError(`Doğru (${cNum}) ve yanlış (${wNum}) toplamı, soru sayısını (${qNum}) geçemez.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onAddStudy({
        subject,
        questions: qNum,
        minutes: mNum,
        correct: cNum,
        wrong: wNum,
        completed: false,
        date: date || getTodayDateString(),
      });

      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Kayıt eklenirken bir sorun oluştu.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl relative animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary-light">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Yeni Çalışma Görevi Ekle
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Ders Seçin
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
            >
              {LGS_SUBJECTS.map((s) => (
                <option key={s} value={s} className="bg-surface-200 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Soru Sayısı
              </label>
              <input
                type="number"
                min="0"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Örn: 40"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Süre (Dakika)
              </label>
              <input
                type="number"
                min="0"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Örn: 50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                Doğru Sayısı
              </label>
              <input
                type="number"
                min="0"
                value={correct}
                onChange={(e) => setCorrect(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-emerald-300 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Örn: 35"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-400 mb-1.5">
                Yanlış Sayısı
              </label>
              <input
                type="number"
                min="0"
                value={wrong}
                onChange={(e) => setWrong(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-rose-300 font-mono focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                placeholder="Örn: 5"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Çalışma Tarihi
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Görevi Ekle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
