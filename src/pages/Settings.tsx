import React, { useState } from 'react';
import type { Settings as SettingsType } from '../types/database';
import { formatDateTurkish } from '../utils/date';
import { Loader2 } from 'lucide-react';

interface SettingsProps {
  settings: SettingsType | null;
  onUpdateLgsDate: (newDate: string) => Promise<{ success: boolean; error?: string }>;
  isConfigured: boolean;
}

export const SettingsPage: React.FC<SettingsProps> = ({
  settings,
  onUpdateLgsDate,
  isConfigured,
}) => {
  const [lgsDateInput, setLgsDateInput] = useState<string>(
    settings?.lgs_date || '2027-06-06'
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lgsDateInput) return;

    setSaving(true);
    setMessage(null);
    try {
      const res = await onUpdateLgsDate(lgsDateInput);
      if (res.success) {
        setMessage({ type: 'success', text: 'Hedef sınav tarihi güncellendi.' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Güncelleme başarısız oldu.' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Ayarlar
        </h2>
        <p className="text-xs text-slate-500">
          Sınav hedef tarihi ve sistem durumu
        </p>
      </div>

      {/* Target Date Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            LGS Sınav Tarihi
          </h3>
          <p className="text-xs text-slate-500">
            Sayaç bu tarihe göre gün sayısını hesaplar.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-xs ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tarih Seçin
            </label>
            <input
              type="date"
              value={lgsDateInput}
              onChange={(e) => setLgsDateInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              required
            />
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Şu anki hedef: <strong className="text-slate-800">{formatDateTurkish(lgsDateInput)}</strong>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <span>Tarihi Kaydet</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Database Status Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-2">
        <h3 className="text-sm font-semibold text-slate-900">
          Veritabanı Durumu
        </h3>
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-600">Supabase Bağlantısı:</span>
          <span
            className={`font-mono px-2 py-0.5 rounded text-[11px] font-medium ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isConfigured ? 'Bağlı' : 'Yapılandırılmadı'}
          </span>
        </div>
      </div>
    </div>
  );
};
