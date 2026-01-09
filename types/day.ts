export interface DayDataType {
  dateStr: string;  // "2026-01-01"
  dayNum: number;   // 1, 2, 3... 365
  target: number;   // Objectif du jour
  done: number | null; // Ce que tu as fait (null = pas encore renseigné)
}
