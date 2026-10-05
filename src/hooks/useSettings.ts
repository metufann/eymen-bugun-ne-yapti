import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '../types/database';
import { settingsService } from '../services/settingsService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getDaysRemaining } from '../utils/date';

const DEFAULT_LGS_DATE = '2027-06-06';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setSettings({
        id: 'local-default',
        lgs_date: DEFAULT_LGS_DATE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      if (data) {
        setSettings(data);
      } else {
        // Fallback default
        setSettings({
          id: 'temp-id',
          lgs_date: DEFAULT_LGS_DATE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err: unknown) {
      console.error('Failed to load settings:', err);
      setError('Ayarlar yüklenirken bir sorun oluştu.');
      setSettings({
        id: 'fallback-id',
        lgs_date: DEFAULT_LGS_DATE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    if (!isSupabaseConfigured) return;

    // Realtime subscription for settings table
    const channel = supabase
      .channel('public:settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
          if (payload.new && (payload.new as Settings).lgs_date) {
            setSettings(payload.new as Settings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSettings]);

  const updateLgsDate = async (newDate: string) => {
    // Optimistic UI update
    const previous = settings;
    setSettings((prev) =>
      prev
        ? { ...prev, lgs_date: newDate, updated_at: new Date().toISOString() }
        : {
            id: 'temp',
            lgs_date: newDate,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
    );

    try {
      const updated = await settingsService.updateLgsDate(newDate);
      setSettings(updated);
      return { success: true };
    } catch (err: unknown) {
      console.error('Failed to update LGS date:', err);
      setSettings(previous); // Revert on failure
      const msg = err instanceof Error ? err.message : 'LGS tarihi güncellenirken bir sorun oluştu.';
      return { success: false, error: msg };
    }
  };

  const lgsDate = settings?.lgs_date || DEFAULT_LGS_DATE;
  const daysRemaining = getDaysRemaining(lgsDate);

  return {
    settings,
    lgsDate,
    daysRemaining,
    loading,
    error,
    updateLgsDate,
    refreshSettings: fetchSettings,
  };
}
