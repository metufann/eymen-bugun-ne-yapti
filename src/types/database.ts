export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  questions: number;
  minutes: number;
  correct: number;
  wrong: number;
  completed: boolean;
  wrong_reviewed?: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateStudySessionInput = Omit<StudySession, 'id' | 'created_at' | 'updated_at'>;

export interface CompleteStudySessionInput {
  correct: number;
  wrong: number;
  minutes?: number;
  wrong_reviewed: boolean;
}

export interface Settings {
  id: string;
  lgs_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export const LGS_SUBJECTS = [
  'Türkçe',
  'Matematik',
  'Fen Bilimleri',
  'T.C. İnkılap Tarihi',
  'Din Kültürü',
  'İngilizce',
  'Diğer',
] as const;

export type SubjectName = typeof LGS_SUBJECTS[number];
