import React, { useState } from 'react';
import type { StudySession, CompleteStudySessionInput } from '../types/database';
import { X, Loader2 } from 'lucide-react';

interface CompleteStudyModalProps {
  session: StudySession | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (id: string, input: CompleteStudySessionInput) => Promise<{ success: boolean; error?: string }>;
}

export const CompleteStudyModal: React.FC<CompleteStudyModalProps> = ({
  session,
  isOpen,
  onClose,
  onComplete,
}) => {
  if (!isOpen || !session) return null;

  const [correct, setCorrect] = useState<string>(
    session.correct > 0 ? String(session.correct) : ''
  );
  const [wrong, setWrong] = useState<string>(
    session.wrong > 0 ? String(session.wrong) : ''
  );
  const [minutes, setMinutes] = useState<string>(
    session.minutes > 0 ? String(session.minutes) : ''
  );
  const [wrongReviewed, setWrongReviewed] = useState<boolean>(
    session.wrong_reviewed ?? false
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cNum = parseInt(correct, 10);
    const wNum = parseInt(wrong, 10);
    const mNum = minutes ? parseInt(minutes, 10) : session.minutes;

    if (isNaN(cNum) || cNum < 0) {
      setError('Doğru sayısı 0 veya daha büyük olmalıdır.');
      return;
    }
    if (isNaN(wNum) || wNum < 0) {
      setError('Yanlış sayısı 0 veya daha büyük olmalıdır.');
      return;
    }
    if (cNum + wNum > session.questions) {
      setError(
        `Doğru (${cNum}) ve yanlış (${wNum}) toplamı, soru sayısını (${session.questions}) geçemez.`
      );
      return;
    }

    if (wNum > 0 && !wrongReviewed) {
      setError('Lütfen yanlış soruların çözümünü gözden geçirip kutuyu işaretleyin.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onComplete(session.id, {
        correct: cNum,
        wrong: wNum,
        minutes: mNum,
        wrong_reviewed: wrongReviewed,
      });

      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Görev tamamlanırken bir hata oluştu.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedCorrect = parseInt(correct, 10) || 0;
  const parsedWrong = parseInt(wrong, 10) || 0;
  const netScore = Math.max(0, parsedCorrect - parsedWrong / 3).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-modal relative animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Görevi Tamamla
            </h3>
            <p className="text-xs text-slate-500">
              {session.subject} • Hedef: {session.questions} soru
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Doğru Sayısı
              </label>
              <input
                type="number"
                min="0"
                max={session.questions}
                value={correct}
                onChange={(e) => setCorrect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="0"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Yanlış Sayısı
              </label>
              <input
                type="number"
                min="0"
                max={session.questions}
                value={wrong}
                onChange={(e) => setWrong(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Harcanan Süre (Dakika)
            </label>
            <input
              type="number"
              min="0"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder={`${session.minutes || 0}`}
            />
          </div>

          {(parsedCorrect > 0 || parsedWrong > 0) && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Hesaplanan Net:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {netScore} Net
              </span>
            </div>
          )}

          {/* Review Checkbox */}
          <div className="pt-1">
            <label
              className={`flex items-start gap-2.5 p-3 rounded-lg border transition-colors cursor-pointer select-none ${
                wrongReviewed
                  ? 'bg-orange-50/50 border-primary/40 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={wrongReviewed}
                onChange={(e) => setWrongReviewed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
              />
              <div className="flex-1 text-xs">
                <span className="font-medium text-slate-900 block">
                  Yanlışlar gözden geçirildi mi?
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Eksikleri kapatmak için yanlış yapılan soruların çözümü incelenmelidir.
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <span>Tamamla ve Kaydet</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
