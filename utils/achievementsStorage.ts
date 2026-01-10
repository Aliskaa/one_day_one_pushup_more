/**
 * Service Firebase pour la gestion des achievements/badges
 */

import { ACHIEVEMENTS } from '@/constants/achievements';
import {
  AchievementStats,
  AchievementWithStatus,
  UnlockedAchievement,
  UserAchievementsDoc
} from '@/types/achievement';
import { ProgressMapType } from '@/types/utils';
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

// Collections Firestore
const USERS_COLLECTION = 'users';
const ACHIEVEMENTS_COLLECTION = 'achievements';

/**
 * Récupère le document de référence pour les achievements d'un utilisateur
 */
const getUserAchievementsRef = (userId: string) => {
  return doc(db, USERS_COLLECTION, userId, ACHIEVEMENTS_COLLECTION, 'data');
};

/**
 * Charge les achievements depuis Firestore
 */
export const loadAchievementsFromFirebase = async (userId: string): Promise<UserAchievementsDoc | null> => {
  try {
    const docRef = getUserAchievementsRef(userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserAchievementsDoc;
      console.log('🏆 Achievements chargés depuis Firebase:', {
        unlockedCount: Object.keys(data.unlockedBadges || {}).length,
      });
      return data;
    }
    
    console.log('📝 Aucun achievement existant');
    return null;
  } catch (error) {
    console.error('❌ Erreur lors du chargement des achievements:', error);
    throw error;
  }
};

/**
 * Sauvegarde les achievements dans Firestore
 */
export const saveAchievementsToFirebase = async (
  userId: string,
  unlockedBadges: Record<string, UnlockedAchievement>,
  stats: AchievementStats
): Promise<void> => {
  try {
    const docRef = getUserAchievementsRef(userId);
    
    const data: UserAchievementsDoc = {
      unlockedBadges,
      stats,
      lastUpdated: new Date(),
    };
    
    await setDoc(docRef, data, { merge: true });
    console.log('💾 Achievements sauvegardés dans Firebase');
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des achievements:', error);
    throw error;
  }
};

/**
 * Débloque un nouvel achievement
 */
export const unlockAchievement = async (
  userId: string,
  achievementId: string,
  progress: number
): Promise<void> => {
  try {
    const docRef = getUserAchievementsRef(userId);
    
    const newUnlock: UnlockedAchievement = {
      achievementId,
      unlockedAt: new Date(),
      progress,
    };
    
    await setDoc(docRef, {
      [`unlockedBadges.${achievementId}`]: newUnlock,
      lastUpdated: new Date(),
    }, { merge: true });
    
    console.log(`🎉 Achievement débloqué: ${achievementId}`);
  } catch (error) {
    console.error('❌ Erreur lors du débloquage:', error);
    throw error;
  }
};

/**
 * Écoute en temps réel les changements d'achievements
 */
export const subscribeToAchievements = (
  userId: string,
  onUpdate: (data: UserAchievementsDoc | null) => void
): Unsubscribe => {
  const docRef = getUserAchievementsRef(userId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as UserAchievementsDoc;
      onUpdate(data);
    } else {
      onUpdate(null);
    }
  }, (error) => {
    console.error('❌ Erreur de synchronisation achievements:', error);
  });
};

/**
 * Calcule les statistiques à partir du progressMap
 */
export const calculateStatsFromProgress = (
  progressMap: ProgressMapType,
  days: { dateStr: string; target: number }[]
): AchievementStats => {
  const sortedDates = Object.keys(progressMap).sort();
  
  let totalPushups = 0;
  let daysCompleted = 0;
  let perfectDays = 0;
  let bestSingleDay = 0;
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Créer une map des targets par date
  const targetsByDate: Record<string, number> = {};
  days.forEach(day => {
    targetsByDate[day.dateStr] = day.target;
  });
  
  // Calculer les stats
  for (const dateStr of sortedDates) {
    const done = progressMap[dateStr];
    
    if (done !== null && done !== undefined && done > 0) {
      totalPushups += done;
      daysCompleted++;
      
      if (done > bestSingleDay) {
        bestSingleDay = done;
      }
      
      const target = targetsByDate[dateStr] || 0;
      if (done >= target && target > 0) {
        perfectDays++;
      }
      
      tempStreak++;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }
  
  // Calculer le streak actuel (en partant de la fin)
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Trouver l'index de today ou le dernier jour avant today
  const reversedDates = [...sortedDates].reverse();
  for (const dateStr of reversedDates) {
    if (dateStr <= todayStr) {
      const done = progressMap[dateStr];
      if (done !== null && done !== undefined && done > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  return {
    totalPushups,
    currentStreak,
    bestStreak,
    daysCompleted,
    perfectDays,
    bestSingleDay,
  };
};

/**
 * Vérifie quels achievements doivent être débloqués
 */
export const checkAchievementsToUnlock = (
  stats: AchievementStats,
  progressMap: ProgressMapType,
  days: { dateStr: string; target: number }[],
  alreadyUnlocked: Record<string, UnlockedAchievement>
): string[] => {
  const newUnlocks: string[] = [];
  
  // Créer une map des targets par date
  const targetsByDate: Record<string, number> = {};
  days.forEach(day => {
    targetsByDate[day.dateStr] = day.target;
  });
  
  // Calculer le max debt payoff (différence entre done et target quand done > target)
  let maxDebtPayoff = 0;
  for (const dateStr of Object.keys(progressMap)) {
    const done = progressMap[dateStr];
    const target = targetsByDate[dateStr] || 0;
    if (done !== null && done !== undefined && done > target) {
      const payoff = done - target;
      if (payoff > maxDebtPayoff) {
        maxDebtPayoff = payoff;
      }
    }
  }
  
  // Vérifier si un jour a fait 1.5x l'objectif
  let hasOverachieved = false;
  for (const dateStr of Object.keys(progressMap)) {
    const done = progressMap[dateStr];
    const target = targetsByDate[dateStr] || 0;
    if (done !== null && done !== undefined && target > 0 && done >= target * 1.5) {
      hasOverachieved = true;
      break;
    }
  }
  
  for (const achievement of ACHIEVEMENTS) {
    // Skip si déjà débloqué
    if (alreadyUnlocked[achievement.id]) {
      continue;
    }
    
    let shouldUnlock = false;
    
    switch (achievement.requirementType) {
      case 'streak':
        shouldUnlock = stats.currentStreak >= achievement.requirement || 
                       stats.bestStreak >= achievement.requirement;
        break;
        
      case 'total_pushups':
        shouldUnlock = stats.totalPushups >= achievement.requirement;
        break;
        
      case 'single_day_pushups':
        shouldUnlock = stats.bestSingleDay >= achievement.requirement;
        break;
        
      case 'days_completed':
        shouldUnlock = stats.daysCompleted >= achievement.requirement;
        break;
        
      case 'perfect_days':
        shouldUnlock = stats.perfectDays >= achievement.requirement;
        break;
        
      case 'debt_payoff':
        shouldUnlock = maxDebtPayoff >= achievement.requirement;
        break;
        
      case 'overachiever_ratio':
        shouldUnlock = hasOverachieved;
        break;
    }
    
    if (shouldUnlock) {
      newUnlocks.push(achievement.id);
    }
  }
  
  return newUnlocks;
};

/**
 * Construit la liste complète des achievements avec leur statut
 */
export const buildAchievementsWithStatus = (
  stats: AchievementStats,
  progressMap: ProgressMapType,
  days: { dateStr: string; target: number }[],
  unlockedBadges: Record<string, UnlockedAchievement>
): AchievementWithStatus[] => {
  // Créer une map des targets par date
  const targetsByDate: Record<string, number> = {};
  days.forEach(day => {
    targetsByDate[day.dateStr] = day.target;
  });
  
  // Calculer le max debt payoff
  let maxDebtPayoff = 0;
  for (const dateStr of Object.keys(progressMap)) {
    const done = progressMap[dateStr];
    const target = targetsByDate[dateStr] || 0;
    if (done !== null && done !== undefined && done > target) {
      const payoff = done - target;
      if (payoff > maxDebtPayoff) {
        maxDebtPayoff = payoff;
      }
    }
  }
  
  return ACHIEVEMENTS.map(achievement => {
    const unlocked = !!unlockedBadges[achievement.id];
    const unlockedData = unlockedBadges[achievement.id];
    
    let currentProgress = 0;
    
    switch (achievement.requirementType) {
      case 'streak':
        currentProgress = Math.max(stats.currentStreak, stats.bestStreak);
        break;
      case 'total_pushups':
        currentProgress = stats.totalPushups;
        break;
      case 'single_day_pushups':
        currentProgress = stats.bestSingleDay;
        break;
      case 'days_completed':
        currentProgress = stats.daysCompleted;
        break;
      case 'perfect_days':
        currentProgress = stats.perfectDays;
        break;
      case 'debt_payoff':
        currentProgress = maxDebtPayoff;
        break;
      case 'overachiever_ratio':
        currentProgress = unlocked ? 1 : 0;
        break;
    }
    
    const progressPercent = Math.min(100, (currentProgress / achievement.requirement) * 100);
    
    return {
      ...achievement,
      unlocked,
      unlockedAt: unlockedData?.unlockedAt,
      currentProgress,
      progressPercent,
    };
  });
};
