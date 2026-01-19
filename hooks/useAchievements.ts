/**
 * Hook personnalisé pour gérer les achievements/badges
 * Calcule automatiquement les achievements débloqués et synchronise avec Firebase
 */

import { ACHIEVEMENTS } from '@/constants/achievements';
import {
  AchievementStats,
  AchievementWithStatus,
  UnlockedAchievement
} from '@/types/achievement';
import { DayDataType } from '@/types/day';
import { ProgressMapType } from '@/types/utils';
import {
  buildAchievementsWithStatus,
  calculateStatsFromProgress,
  checkAchievementsToUnlock,
  loadAchievementsFromFirebase,
  saveAchievementsToFirebase,
  unlockAchievement
} from '@/services/achievementsStorage';
import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePushNotifications } from './usePushNotifications';
import { useTraining } from '@/contexts/TrainingContext';

export interface UseAchievementsReturn {
  achievements: AchievementWithStatus[];
  stats: AchievementStats;
  unlockedCount: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  newlyUnlocked: string[]; // IDs des achievements nouvellement débloqués
  clearNewlyUnlocked: () => void;
  refreshAchievements: () => Promise<void>;
}

const defaultStats: AchievementStats = {
  totalPushups: 0,
  currentStreak: 0,
  bestStreak: 0,
  daysCompleted: 0,
  perfectDays: 0,
  bestSingleDay: 0,
};

export const useAchievements = (
  days: DayDataType[],
  progressMap: ProgressMapType
): UseAchievementsReturn => {
  const { userId } = useAuth();
  const { trainingType } = useTraining();
  const { sendAchievementNotification } = usePushNotifications();
  
  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, UnlockedAchievement>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  // Calculer les stats à partir du progressMap
  const stats = useMemo(() => {
    if (days.length === 0) return defaultStats;
    return calculateStatsFromProgress(progressMap, days);
  }, [progressMap, days]);

  // Charger les achievements depuis Firebase au démarrage
  useEffect(() => {
    const loadAchievements = async () => {
      if (!userId || !trainingType) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await loadAchievementsFromFirebase(userId, trainingType);
        
        if (data) {
          setUnlockedBadges(data.unlockedBadges || {});
        }
        
        console.log('🏆 Achievements chargés');
      } catch (err) {
        console.error('❌ Erreur chargement achievements:', err);
        setError('Impossible de charger les achievements');
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, [userId, trainingType]);

  // Vérifier et débloquer les nouveaux achievements quand les stats changent
  useEffect(() => {
    const checkAndUnlock = async () => {
      if (!userId || !trainingType || isLoading || days.length === 0) return;

      try {
        const toUnlock = checkAchievementsToUnlock(stats, progressMap, days, unlockedBadges);
        
        if (toUnlock.length > 0) {
          console.log('🎉 Nouveaux achievements à débloquer:', toUnlock);
          
          // Débloquer chaque achievement
          const newUnlockedBadges = { ...unlockedBadges };
          
          for (const achievementId of toUnlock) {
            await unlockAchievement(userId, trainingType, achievementId, stats.totalPushups);
            
            newUnlockedBadges[achievementId] = {
              achievementId,
              unlockedAt: new Date(),
              progress: stats.totalPushups,
            };

            // Envoyer une notification pour cet achievement
            const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
            if (achievement) {
              try {
                await sendAchievementNotification(
                  achievement.title,
                  achievement.description,
                  achievementId
                );
                console.log(`🔔 Notification envoyée pour ${achievement.title}`);
              } catch (notifError) {
                console.error('Erreur envoi notification achievement:', notifError);
              }
            }
          }
          
          setUnlockedBadges(newUnlockedBadges);
          setNewlyUnlocked(prev => [...prev, ...toUnlock]);
          
          // Sauvegarder les stats mises à jour
          await saveAchievementsToFirebase(userId, trainingType, newUnlockedBadges, stats);
        }
      } catch (err) {
        console.error('❌ Erreur lors de la vérification des achievements:', err);
      }
    };

    checkAndUnlock();
  }, [stats, userId, isLoading, days.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Construire la liste complète des achievements avec leur statut
  const achievements = useMemo(() => {
    return buildAchievementsWithStatus(stats, progressMap, days, unlockedBadges);
  }, [stats, progressMap, days, unlockedBadges]);

  // Compter les achievements débloqués
  const unlockedCount = useMemo(() => {
    return Object.keys(unlockedBadges).length;
  }, [unlockedBadges]);

  // Effacer les nouveaux achievements (après affichage de notification)
  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  // Rafraîchir les achievements depuis Firebase
  const refreshAchievements = useCallback(async () => {
    if (!userId || !trainingType) return;

    try {
      setIsLoading(true);
      const data = await loadAchievementsFromFirebase(userId, trainingType);
      
      if (data) {
        setUnlockedBadges(data.unlockedBadges || {});
      }
    } catch (err) {
      console.error('❌ Erreur refresh achievements:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, trainingType]);

  return {
    achievements,
    stats,
    unlockedCount,
    totalCount: ACHIEVEMENTS.length,
    isLoading,
    error,
    newlyUnlocked,
    clearNewlyUnlocked,
    refreshAchievements,
  };
};
