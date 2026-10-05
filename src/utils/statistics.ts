import type { StudySession } from '../types/database';

export interface SummaryStats {
  totalQuestions: number;
  totalMinutes: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number; // percentage 0 - 100
  totalCompleted: number;
  totalTasks: number;
}

export function calculateSummary(sessions: StudySession[]): SummaryStats {
  const totalQuestions = sessions.reduce((sum, s) => sum + (s.questions || 0), 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
  const totalCorrect = sessions.reduce((sum, s) => sum + (s.correct || 0), 0);
  const totalWrong = sessions.reduce((sum, s) => sum + (s.wrong || 0), 0);
  const totalCompleted = sessions.filter((s) => s.completed).length;
  const totalTasks = sessions.length;

  const totalAnswered = totalCorrect + totalWrong;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 1000) / 10 : 0;

  return {
    totalQuestions,
    totalMinutes,
    totalCorrect,
    totalWrong,
    accuracy,
    totalCompleted,
    totalTasks,
  };
}

export interface SubjectStats {
  subject: string;
  totalQuestions: number;
  totalMinutes: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
}

export function calculateSubjectBreakdown(sessions: StudySession[]): SubjectStats[] {
  const map = new Map<string, { questions: number; minutes: number; correct: number; wrong: number }>();

  sessions.forEach((s) => {
    const existing = map.get(s.subject) || { questions: 0, minutes: 0, correct: 0, wrong: 0 };
    map.set(s.subject, {
      questions: existing.questions + (s.questions || 0),
      minutes: existing.minutes + (s.minutes || 0),
      correct: existing.correct + (s.correct || 0),
      wrong: existing.wrong + (s.wrong || 0),
    });
  });

  const result: SubjectStats[] = [];
  map.forEach((val, subject) => {
    const answered = val.correct + val.wrong;
    const accuracy = answered > 0 ? Math.round((val.correct / answered) * 1000) / 10 : 0;
    result.push({
      subject,
      totalQuestions: val.questions,
      totalMinutes: val.minutes,
      totalCorrect: val.correct,
      totalWrong: val.wrong,
      accuracy,
    });
  });

  return result.sort((a, b) => b.totalQuestions - a.totalQuestions);
}

export interface DayGroup {
  date: string;
  sessions: StudySession[];
  stats: SummaryStats;
}

export function groupSessionsByDate(sessions: StudySession[]): DayGroup[] {
  const map = new Map<string, StudySession[]>();

  sessions.forEach((s) => {
    const group = map.get(s.date) || [];
    group.push(s);
    map.set(s.date, group);
  });

  const sortedDates = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));

  return sortedDates.map((date) => {
    const daySessions = map.get(date) || [];
    return {
      date,
      sessions: daySessions,
      stats: calculateSummary(daySessions),
    };
  });
}
