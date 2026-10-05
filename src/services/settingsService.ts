import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Settings } from '../types/database';

export const settingsService = {
  async getSettings(): Promise<Settings | null> {
    if (!isSupabaseConfigured) {
      return null;
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }

    return data as Settings | null;
  },

  async updateLgsDate(lgsDate: string): Promise<Settings> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase bağlantısı henüz yapılandırılmamış');
    }

    // Check if record exists
    const existing = await this.getSettings();

    if (existing) {
      const { data, error } = await supabase
        .from('settings')
        .update({ lgs_date: lgsDate })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating LGS date:', error);
        throw error;
      }
      return data as Settings;
    } else {
      const { data, error } = await supabase
        .from('settings')
        .insert([{ lgs_date: lgsDate }])
        .select()
        .single();

      if (error) {
        console.error('Error inserting settings:', error);
        throw error;
      }
      return data as Settings;
    }
  },
};
