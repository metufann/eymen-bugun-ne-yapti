import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StudySession, CreateStudySessionInput } from '../types/database';
import { studyService } from '../services/studyService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getTodayDateString } from '../utils/date';
import { calculateSummary, type SummaryStats } from '../utils/statistics';

export function useStudyData() {
  const [studies, setStudies] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudies = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await studyService.getAllStudies();
      setStudies(data);
    } catch (err: unknown) {
      console.error('Failed to load study sessions:', err);
      setError('Veriler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudies();

    if (!isSupabaseConfigured) return;

    // Real-time subscription for instant updates across devices
    const channel = supabase
      .channel('public:study_sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'study_sessions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new as StudySession;
            setStudies((prev) => {
              if (prev.some((s) => s.id === newRecord.id)) return prev;
              return [newRecord, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedRecord = payload.new as StudySession;
            setStudies((prev) =>
              prev.map((s) => (s.id === updatedRecord.id ? updatedRecord : s))
            );
          } else if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as { id: string }).id;
            setStudies((prev) => prev.filter((s) => s.id !== oldId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStudies]);

  const todayStr = getTodayDateString();

  // Filter today's tasks
  const todayStudies = useMemo(() => {
    return studies.filter((s) => s.date === todayStr);
  }, [studies, todayStr]);

  // Today summary stats
  const todaySummary: SummaryStats = useMemo(() => {
    return calculateSummary(todayStudies);
  }, [todayStudies]);

  // Total summary across all time
  const allTimeSummary: SummaryStats = useMemo(() => {
    return calculateSummary(studies);
  }, [studies]);

  // Progress: completedTasks / totalTasks * 100
  const todayProgress = useMemo(() => {
    if (todayStudies.length === 0) return 0;
    const completedCount = todayStudies.filter((s) => s.completed).length;
    return Math.round((completedCount / todayStudies.length) * 100);
  }, [todayStudies]);

  // Actions with Optimistic UI updates
  const addStudy = async (input: CreateStudySessionInput) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticSession: StudySession = {
      ...input,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic append
    setStudies((prev) => [optimisticSession, ...prev]);

    try {
      const created = await studyService.createStudy(input);
      // Replace temp with real record
      setStudies((prev) =>
        prev.map((s) => (s.id === tempId ? created : s))
      );
      return { success: true, data: created };
    } catch (err: unknown) {
      console.error('Failed to create study session:', err);
      // Revert optimistic update
      setStudies((prev) => prev.filter((s) => s.id !== tempId));
      const msg = err instanceof Error ? err.message : 'Görev kaydedilirken bir sorun oluştu.';
      return { success: false, error: msg };
    }
  };

  const toggleComplete = async (id: string, currentCompleted: boolean) => {
    const targetState = !currentCompleted;
    // Optimistic toggle
    setStudies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: targetState } : s))
    );

    try {
      await studyService.toggleStudyCompletion(id, targetState);
      return { success: true };
    } catch (err: unknown) {
      console.error('Failed to toggle completion:', err);
      // Revert
      setStudies((prev) =>
        prev.map((s) => (s.id === id ? { ...s, completed: currentCompleted } : s))
      );
      const msg = err instanceof Error ? err.message : 'Durum güncellenirken hata oluştu.';
      return { success: false, error: msg };
    }
  };

  return {
    studies,
    todayStudies,
    todaySummary,
    allTimeSummary,
    todayProgress,
    loading,
    error,
    addStudy,
    toggleComplete,
    refreshStudies: fetchStudies,
    isConfigured: isSupabaseConfigured,
  };
}
