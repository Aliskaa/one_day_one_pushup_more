/**
 * Types TypeScript pour les documents Firebase
 */

import { ProgressMapType } from '@/types/utils';
import { AchievementStats, UnlockedAchievement } from '@/types/achievement';

/**
 * Document de progression utilisateur dans Firestore
 * Collection: users/{userId}/training/{trainingType}/progress/year_{year}
 */
export interface UserProgressDoc {
  year: number;
  progressMap: ProgressMapType;
  lastUpdated: Date;
  totalDone: number;
}

/**
 * Document d'achievements utilisateur dans Firestore
 * Collection: users/{userId}/achievements/{trainingType}
 */
export interface UserAchievementsDoc {
  unlockedBadges: Record<string, UnlockedAchievement>;
  stats: AchievementStats;
  lastUpdated: Date;
}

/**
 * Options pour les opérations Firebase
 */
export interface FirebaseOperationOptions {
  /** Fusionner avec les données existantes */
  merge?: boolean;
  /** Timeout en millisecondes */
  timeout?: number;
}
