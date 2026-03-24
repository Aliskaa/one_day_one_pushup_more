/**
 * Helper pour synchroniser les stats publiques avec le leaderboard
 * À appeler après chaque mise à jour de progression
 */

import { TrainingName } from '@/contexts/TrainingContext';
import { computePhysicalEcartFromProgressMap } from '@/helpers/progressStats';
import { ProgressMapType } from '@/types/utils';
import { updatePublicProfile, updatePublicStats } from './leaderboard';
import log from './logger';

/**
 * Calcule les statistiques à partir d'une progressMap
 */
export const calculateStatsFromProgress = (progressMap: ProgressMapType): {
  totalDone: number;
  currentStreak: number;
  bestStreak: number;
  bestSingleDay: number;
  physicalEcart: number;
  daysCompleted: number;
  weekTotal: number;
  monthTotal: number;
} => {
  const dates = Object.keys(progressMap).sort();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const values = Object.values(progressMap);
  // Total
  const totalDone = values.reduce((sum, val) => sum + (val || 0), 0);

  let bestSingleDay = 0;
  for (const val of values) {
    const n = typeof val === 'number' && !Number.isNaN(val) ? val : 0;
    if (n > bestSingleDay) bestSingleDay = n;
  }

  // Jours complétés
  const daysCompleted = Object.values(progressMap).filter((val) => val && val > 0).length;

  // Calcul des streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Vérifier streak actuel (depuis aujourd'hui vers le passé)
  let checkDate = new Date(today);
  let foundToday = false;

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const value = progressMap[dateStr];

    if (value && value > 0) {
      if (!foundToday) {
        foundToday = true;
      }
      currentStreak++;
    } else {
      if (foundToday) {
        break; // Fin du streak actuel
      }
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Calculer le meilleur streak
  for (const dateStr of dates) {
    const value = progressMap[dateStr];
    if (value && value > 0) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Total de la semaine (7 derniers jours)
  let weekTotal = 0;
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    weekTotal += progressMap[dateStr] || 0;
  }

  // Total du mois
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = today;
  let monthTotal = 0;
  
  for (
    let d = new Date(monthStart);
    d <= monthEnd;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().split('T')[0];
    monthTotal += progressMap[dateStr] || 0;
  }

  const physicalEcart = computePhysicalEcartFromProgressMap(progressMap);

  return {
    totalDone,
    currentStreak,
    bestStreak,
    bestSingleDay,
    physicalEcart,
    daysCompleted,
    weekTotal,
    monthTotal,
  };
};

/**
 * Synchronise le profil et les stats publiques d'un utilisateur
 * Appelé après chaque mise à jour de progression
 */
export const syncPublicStats = async (
  userId: string,
  username: string,
  trainingType: TrainingName,
  progressMap: ProgressMapType,
  avatarUrl?: string
): Promise<void> => {
  try {
    // Mettre à jour le profil public
    await updatePublicProfile(userId, username, avatarUrl);

    // Calculer les stats
    const stats = calculateStatsFromProgress(progressMap);

    // Mettre à jour les stats publiques
    await updatePublicStats(userId, trainingType, stats);

    log.info('✅ Stats publiques synchronisées:', stats);
  } catch (error) {
    log.error('❌ Erreur synchronisation stats publiques:', error);
    // Ne pas bloquer l'utilisateur si la sync échoue
  }
};
