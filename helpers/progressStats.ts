import { START_YEAR, DAYS_IN_YEAR } from '@/constants/constants';
import { DayDataType } from '@/types/day';
import { formatDateString, getTodayIndex } from '@/helpers/dateUtils';

/**
 * Même logique que l’accueil : cumul des reps enregistrées vs somme des objectifs (1,2,…,n)
 * du 1er janvier jusqu’à aujourd’inclus. Utilisable avec une progressMap seule (sync leaderboard).
 */
export function computePhysicalEcartFromProgressMap(
  progressMap: Record<string, number>
): number {
  const todayIndex = getTodayIndex(START_YEAR, DAYS_IN_YEAR);
  if (todayIndex < 0) return 0;
  let expected = 0;
  let real = 0;
  for (let i = 0; i <= todayIndex; i++) {
    const d = new Date(START_YEAR, 0, 1 + i);
    const dateStr = formatDateString(d);
    expected += i + 1;
    real += progressMap[dateStr] ?? 0;
  }
  return real - expected;
}

/** Écart réel cumulé (répétitions enregistrées − objectifs) jusqu'à aujourd'hui inclus. */
export function computeRawEcart(days: DayDataType[], todayIndex: number): number {
  if (todayIndex < 0) return 0;
  const expectedCumul = days.slice(0, todayIndex + 1).reduce((s, d) => s + d.target, 0);
  const realCumul = days.slice(0, todayIndex + 1).reduce((s, d) => s + (d.done || 0), 0);
  return realCumul - expectedCumul;
}

export function effectiveDayDone(done: number | null | undefined, bankUsed?: number): number {
  return (done ?? 0) + (bankUsed ?? 0);
}
