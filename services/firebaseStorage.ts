/**
 * Service Firebase pour la gestion des données de progression
 * Remplace AsyncStorage par Firestore pour la synchronisation cloud
 */

import { DAYS_IN_YEAR, START_YEAR } from '@/constants/constants';
import { TrainingName } from '@/contexts/TrainingContext';
import { DayDataType } from '@/types/day';
import { UserProgressDoc } from '@/types/firebase';
import { ProgressMapType } from '@/types/utils';
import {
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
  updateDoc
} from 'firebase/firestore';
import { formatDateString, getProgressDocRef } from './firebaseHelpers';
import log from './logger';

/**
 * Génère les données pour toute l'année
 */
export const generateYearData = (): DayDataType[] => {
  const generatedDays: DayDataType[] = [];
  
  for (let i = 0; i < DAYS_IN_YEAR; i++) {
    const currentDate = new Date(START_YEAR, 0, 1 + i);
    const dateStr = formatDateString(currentDate);
    
    generatedDays.push({
      dateStr,
      dayNum: i + 1,
      target: i + 1,
      done: null,
    });
  }
  
  log.info('🗓️ Génération des dates:', {
    first: generatedDays[0]?.dateStr,
    last: generatedDays[DAYS_IN_YEAR - 1]?.dateStr,
    total: generatedDays.length,
  });
  
  return generatedDays;
};

export type LoadedProgressDoc = {
  progressMap: ProgressMapType;
  bankByDate: Record<string, number>;
  surplusReserve: number | undefined;
};

/**
 * Charge les données de progression depuis Firestore
 */
export const loadProgressFromFirebase = async (userId: string, trainingType: TrainingName): Promise<LoadedProgressDoc> => {
  try {
    const docRef = getProgressDocRef(userId, trainingType);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProgressDoc;
      log.info('✅ Données chargées depuis Firebase:', {
        totalEntries: Object.keys(data.progressMap || {}).length,
        lastUpdated: data.lastUpdated
      });
      return {
        progressMap: data.progressMap || {},
        bankByDate: data.bankByDate || {},
        surplusReserve: data.surplusReserve,
      };
    }
    
    log.info('📝 Aucune donnée existante, création du document...');
    return { progressMap: {}, bankByDate: {}, surplusReserve: undefined };
  } catch (error) {
    log.error('❌ Erreur lors du chargement Firebase:', error);
    throw error;
  }
};

/**
 * Sauvegarde les données de progression dans Firestore
 */
export type SaveProgressMeta = {
  surplusReserve?: number;
  bankByDate?: Record<string, number>;
};

export const saveProgressToFirebase = async (
  userId: string,
  trainingType: TrainingName,
  progressMap: ProgressMapType,
  meta?: SaveProgressMeta
): Promise<void> => {
  try {
    const docRef = getProgressDocRef(userId, trainingType);
    
    // Calcul du total pour les stats
    const totalDone = Object.values(progressMap).reduce((sum, val) => sum + (val || 0), 0);
    
    const data: UserProgressDoc = {
      year: START_YEAR,
      progressMap,
      lastUpdated: new Date(),
      totalDone,
      ...(meta?.surplusReserve !== undefined ? { surplusReserve: meta.surplusReserve } : {}),
      ...(meta?.bankByDate !== undefined ? { bankByDate: meta.bankByDate } : {}),
    };
    
    await setDoc(docRef, data, { merge: true });
    log.info('💾 Données sauvegardées dans Firebase');
  } catch (error) {
    log.error('❌ Erreur lors de la sauvegarde Firebase:', error);
    throw error;
  }
};

/**
 * Met à jour un jour spécifique (optimisé pour éviter d'écrire tout le document)
 */
export const updateDayProgress = async (
  userId: string,
  trainingType: TrainingName,
  dateStr: string,
  value: number | null
): Promise<void> => {
  try {
    const docRef = getProgressDocRef(userId, trainingType);
    
    await updateDoc(docRef, {
      [`progressMap.${dateStr}`]: value,
      lastUpdated: new Date(),
    });
    
    log.info(`✅ Jour ${dateStr} mis à jour: ${value}`);
  } catch (error) {
    // Si le document n'existe pas encore, on le crée
    log.info('Document inexistant, création...');
    await saveProgressToFirebase(userId, trainingType, { [dateStr]: value ?? 0 });
  }
};

/**
 * Écoute en temps réel les changements de progression
 * Utile pour la synchronisation multi-appareils
 */
export const subscribeToProgress = (
  userId: string,
  trainingType: TrainingName,
  onUpdate: (payload: LoadedProgressDoc) => void
): Unsubscribe => {
  const docRef = getProgressDocRef(userId, trainingType);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProgressDoc;
      onUpdate({
        progressMap: data.progressMap || {},
        bankByDate: data.bankByDate || {},
        surplusReserve: data.surplusReserve,
      });
    }
  }, (error) => {
    log.error('❌ Erreur de synchronisation:', error);
  });
};

/**
 * Fusionne les données générées avec les données sauvegardées
 */
export const mergeDataWithProgress = (
  generatedDays: DayDataType[],
  savedProgress: ProgressMapType,
  bankByDate: Record<string, number> = {}
): DayDataType[] => {
  return generatedDays.map(day => ({
    ...day,
    done: savedProgress[day.dateStr] ?? null,
    bankUsed: bankByDate[day.dateStr] ?? 0,
  }));
};

/**
 * Supprime toutes les données de l'utilisateur pour l'année en cours
 */
export const clearUserData = async (userId: string, trainingType: TrainingName): Promise<void> => {
  try {
    const docRef = getProgressDocRef(userId, trainingType);
    await setDoc(docRef, {
      year: START_YEAR,
      progressMap: {},
      lastUpdated: new Date(),
      totalDone: 0,
      surplusReserve: 0,
      bankByDate: {},
    });
    log.info('🗑️ Données réinitialisées');
  } catch (error) {
    log.error('❌ Erreur lors de la réinitialisation:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques globales de l'utilisateur
 */
export const getUserStats = async (userId: string, trainingType: TrainingName) => {
  try {
    const docRef = getProgressDocRef(userId, trainingType);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProgressDoc;
      const progressMap = data.progressMap || {};
      
      const totalDone = Object.values(progressMap).reduce((sum, val) => sum + (val || 0), 0);
      const daysCompleted = Object.values(progressMap).filter(val => val !== null && val > 0).length;
      
      return {
        totalDone,
        daysCompleted,
        lastUpdated: data.lastUpdated,
      };
    }
    
    return { totalDone: 0, daysCompleted: 0, lastUpdated: null };
  } catch (error) {
    log.error('❌ Erreur lors de la récupération des stats:', error);
    throw error;
  }
};
