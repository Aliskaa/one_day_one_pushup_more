/**
 * Hook pour synchroniser manuellement vers le leaderboard
 * Utile pour les utilisateurs existants
 */

import { useAuth, useUser } from '@clerk/clerk-expo';
import { useTraining } from '@/contexts/TrainingContext';
import { useState } from 'react';
import { syncUserAllTrainings, syncUserToLeaderboard } from '@/services/syncExistingData';
import log from '@/services/logger';

export const useSyncToLeaderboard = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const { trainingType } = useTraining();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtenir un nom d'affichage depuis Clerk
  const getDisplayName = (): string | null => {
    if (!user) return null;
    
    // Priorité : username > fullName > firstName + lastName > firstName > email
    return user.username 
      || user.fullName 
      || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null)
      || user.firstName
      || user.primaryEmailAddress?.emailAddress?.split('@')[0]
      || null;
  };

  /**
   * Synchronise l'entraînement actuel
   */
  const syncCurrentTraining = async () => {
    const displayName = getDisplayName();
    
    if (!userId || !displayName || !trainingType) {
      const missing = !userId ? 'userId' : !displayName ? 'username/nom' : 'trainingType';
      setError(`Informations manquantes: ${missing}`);
      log.warn('⚠️ Impossible de synchroniser: informations manquantes', { 
        userId, 
        displayName, 
        trainingType,
        userFullName: user?.fullName,
        userFirstName: user?.firstName,
        userEmail: user?.primaryEmailAddress?.emailAddress
      });
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      
      log.info('🔄 Synchronisation de l\'entraînement actuel...', { userId, username: displayName, trainingType });
      
      await syncUserToLeaderboard(
        userId,
        displayName,
        trainingType,
        user?.imageUrl
      );

      log.info('✅ Synchronisation réussie!');
    } catch (err: any) {
      log.error('❌ Erreur de synchronisation:', err);
      setError(err.message || 'Erreur de synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  /**
   * Synchronise tous les types d'entraînement
   */
  const syncAllTrainings = async () => {
    const displayName = getDisplayName();
    
    if (!userId || !displayName) {
      const missing = !userId ? 'userId' : 'username/nom';
      setError(`Informations manquantes: ${missing}`);
      log.warn('⚠️ Impossible de synchroniser: informations manquantes', { 
        userId, 
        displayName,
        userFullName: user?.fullName,
        userFirstName: user?.firstName,
        userEmail: user?.primaryEmailAddress?.emailAddress
      });
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      
      log.info('🔄 Synchronisation de tous les entraînements...', { userId, username: displayName });
      
      await syncUserAllTrainings(
        userId,
        displayName,
        user?.imageUrl
      );

      log.info('✅ Tous les entraînements synchronisés!');
    } catch (err: any) {
      log.error('❌ Erreur de synchronisation:', err);
      setError(err.message || 'Erreur de synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  return {
    syncCurrentTraining,
    syncAllTrainings,
    syncing,
    error,
  };
};
