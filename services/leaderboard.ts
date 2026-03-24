/**
 * Service Firebase pour le système de leaderboard/classement
 * Gère les profils publics et les stats des utilisateurs
 */

import { TrainingName } from '@/contexts/TrainingContext';
import {
  LeaderboardEntry,
  LeaderboardFilters,
  PublicUserProfile,
  PublicUserStats,
} from '@/types/leaderboard';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { db, TRAINING_COLLECTION } from './firebase';
import log from './logger';

// Collections Firestore
const PUBLIC_PROFILES_COLLECTION = 'publicProfiles';
const PUBLIC_STATS_COLLECTION = 'publicStats';

/**
 * Crée ou met à jour le profil public d'un utilisateur
 * Note: Avec Clerk, pas de vérification Firebase Auth côté serveur
 */
export const updatePublicProfile = async (
  userId: string,
  username: string,
  avatarUrl?: string
): Promise<void> => {
  try {
    const profileRef = doc(db, PUBLIC_PROFILES_COLLECTION, userId);
    const existingProfile = await getDoc(profileRef);

    const profileData: PublicUserProfile = {
      userId,
      username,
      avatarUrl,
      createdAt: existingProfile.exists()
        ? existingProfile.data().createdAt
        : new Date(),
      lastActive: new Date(),
    };

    await setDoc(profileRef, profileData);
    log.info('✅ Profil public mis à jour:', username);
  } catch (error) {
    log.error('❌ Erreur mise à jour profil public:', error);
    throw error;
  }
};

/**
 * Met à jour les stats publiques d'un utilisateur pour un type d'entraînement
 */
export const updatePublicStats = async (
  userId: string,
  trainingType: TrainingName,
  stats: {
    totalDone: number;
    currentStreak: number;
    bestStreak: number;
    daysCompleted: number;
    weekTotal?: number;
    monthTotal?: number;
  }
): Promise<void> => {
  try {
    // Structure PLATE pour faciliter les requêtes du leaderboard
    // Format: publicStats/{userId}_{trainingType}
    const statsRef = doc(
      db,
      PUBLIC_STATS_COLLECTION,
      `${userId}_${trainingType}`
    );

    const statsData: PublicUserStats = {
      userId,
      trainingType,
      ...stats,
      lastUpdated: new Date(),
    };

    await setDoc(statsRef, statsData);
    log.info(`✅ Stats publiques mises à jour (${trainingType}):`, stats);
  } catch (error) {
    log.error('❌ Erreur mise à jour stats publiques:', error);
    throw error;
  }
};

/**
 * Récupère le leaderboard avec filtres
 */
export const getLeaderboard = async (
  filters: LeaderboardFilters
): Promise<LeaderboardEntry[]> => {
  try {
    const { trainingType, sortBy, limit: maxResults = 100 } = filters;

    // Mapping des critères de tri
    const orderByField =
      sortBy === 'totalDone'
        ? 'totalDone'
        : sortBy === 'currentStreak'
          ? 'currentStreak'
          : 'bestStreak';

    // Requête des stats avec filtre et tri
    const statsQuery = query(
      collection(db, PUBLIC_STATS_COLLECTION),
      where('trainingType', '==', trainingType),
      orderBy(orderByField, 'desc'),
      limit(maxResults)
    );

    const statsSnapshot = await getDocs(statsQuery);
    
    // Récupération des profils correspondants
    const entries: LeaderboardEntry[] = [];
    
    for (const statDoc of statsSnapshot.docs) {
      const stats = statDoc.data() as PublicUserStats;
      
      // Récupérer le profil public
      const profileRef = doc(db, PUBLIC_PROFILES_COLLECTION, stats.userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const profile = profileSnap.data() as PublicUserProfile;
        entries.push({
          profile,
          stats,
        });
      }
    }

    // Ajouter les rangs
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    log.info(`🏆 Leaderboard récupéré: ${entries.length} entrées`);
    return entries;
  } catch (error: any) {
    log.error('❌ Erreur récupération leaderboard:', error);
    
    // Message spécifique pour l'erreur d'index manquant
    if (error?.message?.includes('index')) {
      log.error('🔥 INDEX MANQUANT - Suivez les instructions dans FIREBASE_INDEX_SETUP.md');
      log.error('Ou cliquez sur le lien ci-dessus dans la console Firebase');
    }
    
    throw error;
  }
};

/**
 * Récupère les stats publiques d'un utilisateur spécifique
 */
export const getUserPublicStats = async (
  userId: string,
  trainingType: TrainingName
): Promise<PublicUserStats | null> => {
  try {
    // Structure PLATE: publicStats/{userId}_{trainingType}
    const statsRef = doc(
      db,
      PUBLIC_STATS_COLLECTION,
      `${userId}_${trainingType}`
    );
    const statsSnap = await getDoc(statsRef);

    if (statsSnap.exists()) {
      return statsSnap.data() as PublicUserStats;
    }

    return null;
  } catch (error) {
    log.error('❌ Erreur récupération stats utilisateur:', error);
    throw error;
  }
};

/**
 * Récupère le rang d'un utilisateur dans le classement
 */
export const getUserRank = async (
  userId: string,
  trainingType: TrainingName,
  sortBy: 'totalDone' | 'currentStreak' | 'bestStreak' = 'totalDone'
): Promise<number | null> => {
  try {
    const userStats = await getUserPublicStats(userId, trainingType);
    if (!userStats) return null;

    const orderByField = sortBy;
    const userValue = userStats[orderByField];

    // Compter combien d'utilisateurs ont un meilleur score
    const statsQuery = query(
      collection(db, PUBLIC_STATS_COLLECTION),
      where('trainingType', '==', trainingType),
      where(orderByField, '>', userValue)
    );

    const betterStats = await getDocs(statsQuery);
    const rank = betterStats.size + 1;

    log.info(`📊 Rang de l'utilisateur: ${rank}`);
    return rank;
  } catch (error) {
    log.error('❌ Erreur calcul du rang:', error);
    return null;
  }
};

/**
 * S'abonne aux changements du leaderboard en temps réel
 */
export const subscribeToLeaderboard = (
  filters: LeaderboardFilters,
  onUpdate: (entries: LeaderboardEntry[]) => void
): Unsubscribe => {
  const { trainingType, sortBy, limit: maxResults = 100 } = filters;

  const orderByField =
    sortBy === 'totalDone'
      ? 'totalDone'
      : sortBy === 'currentStreak'
        ? 'currentStreak'
        : 'bestStreak';

  const statsQuery = query(
    collection(db, PUBLIC_STATS_COLLECTION),
    where('trainingType', '==', trainingType),
    orderBy(orderByField, 'desc'),
    limit(maxResults)
  );

  return onSnapshot(
    statsQuery,
    async (snapshot) => {
      const entries: LeaderboardEntry[] = [];

      for (const statDoc of snapshot.docs) {
        const stats = statDoc.data() as PublicUserStats;

        const profileRef = doc(db, PUBLIC_PROFILES_COLLECTION, stats.userId);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profile = profileSnap.data() as PublicUserProfile;
          entries.push({ profile, stats });
        }
      }

      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      onUpdate(entries);
    },
    (error) => {
      log.error('❌ Erreur subscription leaderboard:', error);
    }
  );
};
