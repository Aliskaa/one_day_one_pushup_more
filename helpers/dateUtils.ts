/**
 * Utilitaires de gestion des dates
 * Centralise toute la logique de manipulation de dates pour éviter la duplication
 * 
 * @module helpers/dateUtils
 * @example
 * import { formatDateString, getCurrentWeekDays } from '@/helpers/dateUtils';
 */

import { START_YEAR } from '@/constants/constants';
import { DayDataType } from '@/types/day';

/**
 * Formate une date au format YYYY-MM-DD
 * 
 * @param date - Date à formater
 * @returns String au format YYYY-MM-DD
 * 
 * @example
 * formatDateString(new Date(2026, 0, 22)) // "2026-01-22"
 */
export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Récupère la date d'aujourd'hui au format YYYY-MM-DD
 * @returns String au format YYYY-MM-DD
 */
export const getTodayString = (): string => {
  return formatDateString(new Date());
};

/**
 * Calcule l'index du jour actuel dans l'année
 * @param year Année de référence (par défaut START_YEAR)
 * @param totalDays Nombre total de jours dans l'année
 * @returns Index du jour (0-based) ou -1 si hors période
 */
export const getTodayIndex = (year: number = START_YEAR, totalDays: number = 365): number => {
  const today = new Date();
  const startOfYear = new Date(year, 0, 1);
  const diffTime = today.getTime() - startOfYear.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays < totalDays ? diffDays : -1;
};

/**
 * Calcule les données de la semaine en cours
 * @param days Tableau des jours de l'année
 * @returns Tableau avec les données de la semaine (lundi à dimanche)
 */
export interface WeekDayData {
  day: string;
  dateStr: string;
  date: Date;
  isToday: boolean;
  isFuture: boolean;
  dayData?: DayDataType;
}

export const getCurrentWeekDays = (days: DayDataType[]): WeekDayData[] => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Dimanche
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const result: WeekDayData[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + mondayOffset + i);

    const dateStr = formatDateString(date);
    const dayData = days.find(d => d.dateStr === dateStr);

    const isToday = i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const isFuture = date > today && !isToday;

    result.push({
      day: weekDays[i],
      dateStr,
      date,
      isToday,
      isFuture,
      dayData,
    });
  }

  return result;
};

/**
 * Calcule si un jour est considéré comme réussi
 * @param done Nombre de répétitions effectuées
 * @param target Nombre de répétitions ciblées
 * @returns true si l'objectif est atteint
 */
export const isDayCompleted = (done: number | null | undefined, target: number): boolean => {
  return done !== null && done !== undefined && done >= target;
};

/**
 * Calcule si un jour est considéré comme raté
 * @param done Nombre de répétitions effectuées
 * @param target Nombre de répétitions ciblées
 * @returns true si l'objectif n'est pas atteint
 */
export const isDayMissed = (done: number | null | undefined, target: number): boolean => {
  return done !== null && done !== undefined && done < target;
};

/**
 * Calcule le pourcentage de progression d'un jour
 * @param done Nombre de répétitions effectuées
 * @param target Nombre de répétitions ciblées
 * @returns Pourcentage entre 0 et 100
 */
export const getDayProgressPercent = (done: number | null | undefined, target: number): number => {
  if (target <= 0) return 0;
  const actual = done || 0;
  return Math.min(100, Math.round((actual / target) * 100));
};
