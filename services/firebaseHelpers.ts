/**
 * Utilitaires communs pour Firebase
 */

import { TrainingName } from '@/contexts/TrainingContext';
import { doc, DocumentReference } from 'firebase/firestore';
import { db, USERS_COLLECTION, TRAINING_COLLECTION, PROGRESS_COLLECTION, ACHIEVEMENTS_COLLECTION } from './firebase';
import { START_YEAR } from '@/constants/constants';
import log from './logger';

/**
 * Génère une référence de document pour la progression d'un utilisateur
 */
export const getProgressDocRef = (userId: string, trainingType: TrainingName): DocumentReference => {
  return doc(db, USERS_COLLECTION, userId, TRAINING_COLLECTION, trainingType, `year_${START_YEAR}`, PROGRESS_COLLECTION);
};

/**
 * Génère une référence de document pour les achievements d'un utilisateur
 */
export const getAchievementsDocRef = (userId: string, trainingType: TrainingName): DocumentReference => {
  return doc(db, USERS_COLLECTION, userId, TRAINING_COLLECTION, trainingType, `year_${START_YEAR}`, ACHIEVEMENTS_COLLECTION);
};

/**
 * Génère une date au format string YYYY-MM-DD
 */
export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Récupère la date d'aujourd'hui au format string
 */
export const getTodayString = (): string => {
  return formatDateString(new Date());
};

/**
 * Gestion centralisée des erreurs Firebase
 */
export const handleFirebaseError = (operation: string, error: unknown): void => {
  log.error(`❌ Erreur lors de ${operation}:`, error);
};

/**
 * Crée une map des targets par date pour optimiser les lookups
 */
export const createTargetsByDateMap = (days: { dateStr: string; target: number }[]): Record<string, number> => {
  return days.reduce((map, day) => {
    map[day.dateStr] = day.target;
    return map;
  }, {} as Record<string, number>);
};
