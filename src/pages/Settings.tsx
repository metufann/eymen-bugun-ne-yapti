import React, { useState } from 'react';
import type { Settings as SettingsType } from '../types/database';
import { formatDateTurkish } from '../utils/date';
import { Settings as SettingsIcon, Calendar, Check, AlertCircle, Loader2, Database, ShieldCheck } from 'lucide-react';

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
        setMessage({ type: 'success', text: 'LGS Hedef tarihi başarıyla güncellendi!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Güncelleme başarısız oldu.' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary-light" />
          Uygulama Ayarları
        </h2>
        <p className="text-xs text-slate-400">
          LGS hedef sınav tarihi ve merkezi veritabanı ayarlarını yapılandırın
        </p>
      </div>

      {/* LGS Target Date Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              LGS Sınav Hedef Tarihi
            </h3>
            <p className="text-xs text-slate-400">
              Geri sayım sayacı tüm cihazlarda bu tarihe göre gerçek zamanlı hesaplanır.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Hedef Tarih Seçin
            </label>
            <input
              type="date"
              value={lgsDateInput}
              onChange={(e) => setLgsDateInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
              required
            />
          </div>

          <div className="p-3 bg-black/20 rounded-xl border border-white/5 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Şu anki hedef:</span>
            <span className="font-bold text-white">
              {formatDateTurkish(lgsDateInput)}
            </span>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ayarları Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Supabase Status info */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Merkezi Veritabanı Durumu (Supabase)
            </h3>
            <p className="text-xs text-slate-400">
              PostgreSQL tabanlı gerçek zamanlı veri eşitleme
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Bağlantı Yapılandırması:</span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                isConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {isConfigured ? 'AKTİF & BAĞLI' : 'YAPILANDIRMA BEKLİYOR (.env)'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400">Güvenlik Mimarisi:</span>
            <span className="text-slate-200 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-teal" /> Public RLS Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
