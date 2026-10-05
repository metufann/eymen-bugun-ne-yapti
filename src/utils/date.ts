/**
 * Turkey local timezone aware date helpers
 */

export function getTodayDateString(): string {
  // Returns YYYY-MM-DD based on local browser time (Europe/Istanbul or user's active timezone)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateTurkish(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
  });
}

export function getDaysRemaining(targetDateStr: string): number {
  if (!targetDateStr) return 0;
  
  const todayStr = getTodayDateString();
  const [tY, tM, tD] = todayStr.split('-').map(Number);
  const [gY, gM, gD] = targetDateStr.split('-').map(Number);
  
  const todayDate = new Date(tY, tM - 1, tD);
  const targetDate = new Date(gY, gM - 1, gD);
  
  const diffTime = targetDate.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
