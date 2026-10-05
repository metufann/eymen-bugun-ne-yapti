import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { StudySession, CreateStudySessionInput } from '../types/database';

export const studyService = {
  async getStudiesByDate(date: string): Promise<StudySession[]> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured, cannot fetch studies for date');
      return [];
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching study sessions by date:', error);
      throw error;
    }

    return (data as StudySession[]) || [];
  },

  async getAllStudies(): Promise<StudySession[]> {
    if (!isSupabaseConfigured) {
      return [];
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching all study sessions:', error);
      throw error;
    }

    return (data as StudySession[]) || [];
  },

  async createStudy(input: CreateStudySessionInput): Promise<StudySession> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase bağlantısı henüz yapılandırılmamış (.env dosyasını kontrol edin)');
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error('Error creating study session:', error);
      throw error;
    }

    return data as StudySession;
  },

  async toggleStudyCompletion(id: string, completed: boolean): Promise<StudySession> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase bağlantısı henüz yapılandırılmamış');
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .update({ completed })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating study completion:', error);
      throw error;
    }

    return data as StudySession;
  },

  async updateStudy(id: string, updates: Partial<CreateStudySessionInput>): Promise<StudySession> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase bağlantısı henüz yapılandırılmamış');
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating study session:', error);
      throw error;
    }

    return data as StudySession;
  },
};
