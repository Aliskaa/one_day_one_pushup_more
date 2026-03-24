/**
 * Script pour synchroniser les données existantes vers le leaderboard
 * Usage: 
 * - Pour l'utilisateur connecté: Appeler depuis l'app
 * - Pour tous les utilisateurs: npx tsx -r dotenv/config tests/sync_existing_data.ts
 */

import { syncPublicStats } from '@/services/leaderboardSync';
import { loadProgressFromFirebase } from '@/services/firebaseStorage';
import log from '@/services/logger';
import { TrainingName } from '@/contexts/TrainingContext';

/**
 * Synchronise les données d'un utilisateur vers le leaderboard
 */
export const syncUserToLeaderboard = async (
  userId: string,
  username: string,
  trainingType: TrainingName,
  avatarUrl?: string
): Promise<void> => {
  try {
    log.info(`🔄 Synchronisation de ${username} (${trainingType})...`);

    // Charger les données existantes
    const progressMap = await loadProgressFromFirebase(userId, trainingType);

    if (Object.keys(progressMap).length === 0) {
      log.info(`⚠️ Aucune donnée pour ${username} (${trainingType})`);
      return;
    }

    // Synchroniser vers le leaderboard
    await syncPublicStats(userId, username, trainingType, progressMap, avatarUrl);

    log.info(`✅ ${username} synchronisé avec succès!`);
  } catch (error) {
    log.error(`❌ Erreur synchronisation ${username}:`, error);
    throw error;
  }
};

/**
 * Synchronise les deux types d'entraînement d'un utilisateur
 */
export const syncUserAllTrainings = async (
  userId: string,
  username: string,
  avatarUrl?: string
): Promise<void> => {
  const trainings: TrainingName[] = ['pushup', 'crunch'];

  for (const trainingType of trainings) {
    try {
      await syncUserToLeaderboard(userId, username, trainingType, avatarUrl);
    } catch (error) {
      // Continuer avec le suivant en cas d'erreur
      log.warn(`⚠️ Impossible de sync ${trainingType} pour ${username}`);
    }
  }
};
