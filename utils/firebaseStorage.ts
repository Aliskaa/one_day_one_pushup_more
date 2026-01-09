/**
 * Service Firebase pour la gestion des données de progression
 * Remplace AsyncStorage par Firestore pour la synchronisation cloud
 */

import { START_YEAR } from '@/constants/constants';
import { DayDataType } from '@/types/Day';
import { ProgressMapType } from '@/types/utils';
import {
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    Unsubscribe,
    updateDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Collections Firestore
const USERS_COLLECTION = 'users';
const PROGRESS_COLLECTION = 'progress';

/**
 * Structure des données utilisateur dans Firestore
 */
interface UserProgressDoc {
  year: number;
  progressMap: ProgressMapType;
  lastUpdated: Date;
  totalDone: number;
}

/**
 * Calcule le nombre de jours dans une année (gère les années bissextiles)
 */
const getDaysInYear = (year: number): number => {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  return isLeapYear ? 366 : 365;
};

/**
 * Génère les données pour toute l'année
 */
export const generateYearData = (): DayDataType[] => {
  const generatedDays: DayDataType[] = [];
  const daysInYear = getDaysInYear(START_YEAR);
  
  for (let i = 0; i < daysInYear; i++) {
    const currentDate = new Date(START_YEAR, 0, 1 + i);
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    generatedDays.push({
      dateStr,
      dayNum: i + 1,
      target: i + 1,
      done: null,
    });
  }
  
  console.log('🗓️ Génération des dates:', {
    first: generatedDays[0]?.dateStr,
    last: generatedDays[daysInYear - 1]?.dateStr,
    total: generatedDays.length,
  });
  
  return generatedDays;
};

/**
 * Récupère le document de référence pour un utilisateur
 */
const getUserProgressRef = (userId: string) => {
  return doc(db, USERS_COLLECTION, userId, PROGRESS_COLLECTION, `year_${START_YEAR}`);
};

/**
 * Charge les données de progression depuis Firestore
 */
export const loadProgressFromFirebase = async (userId: string): Promise<ProgressMapType> => {
  try {
    const docRef = getUserProgressRef(userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProgressDoc;
      console.log('✅ Données chargées depuis Firebase:', {
        totalEntries: Object.keys(data.progressMap || {}).length,
        lastUpdated: data.lastUpdated
      });
      return data.progressMap || {};
    }
    
    console.log('📝 Aucune donnée existante, création du document...');
    return {};
  } catch (error) {
    console.error('❌ Erreur lors du chargement Firebase:', error);
    throw error;
  }
};

/**
 * Sauvegarde les données de progression dans Firestore
 */
export const saveProgressToFirebase = async (
  userId: string, 
  progressMap: ProgressMapType
): Promise<void> => {
  try {
    const docRef = getUserProgressRef(userId);
    
    // Calcul du total pour les stats
    const totalDone = Object.values(progressMap).reduce((sum, val) => sum + (val || 0), 0);
    
    const data: UserProgressDoc = {
      year: START_YEAR,
      progressMap,
      lastUpdated: new Date(),
      totalDone,
    };
    
    await setDoc(docRef, data, { merge: true });
    console.log('💾 Données sauvegardées dans Firebase');
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde Firebase:', error);
    throw error;
  }
};

/**
 * Met à jour un jour spécifique (optimisé pour éviter d'écrire tout le document)
 */
export const updateDayProgress = async (
  userId: string,
  dateStr: string,
  value: number | null
): Promise<void> => {
  try {
    const docRef = getUserProgressRef(userId);
    
    await updateDoc(docRef, {
      [`progressMap.${dateStr}`]: value,
      lastUpdated: new Date(),
    });
    
    console.log(`✅ Jour ${dateStr} mis à jour: ${value}`);
  } catch (error) {
    // Si le document n'existe pas encore, on le crée
    console.log('Document inexistant, création...');
    await saveProgressToFirebase(userId, { [dateStr]: value ?? 0 });
  }
};

/**
 * Écoute en temps réel les changements de progression
 * Utile pour la synchronisation multi-appareils
 */
export const subscribeToProgress = (
  userId: string,
  onUpdate: (progressMap: ProgressMapType) => void
): Unsubscribe => {
  const docRef = getUserProgressRef(userId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProgressDoc;
      onUpdate(data.progressMap || {});
    }
  }, (error) => {
    console.error('❌ Erreur de synchronisation:', error);
  });
};

/**
 * Fusionne les données générées avec les données sauvegardées
 */
export const mergeDataWithProgress = (
  generatedDays: DayDataType[],
  savedProgress: ProgressMapType
): DayDataType[] => {
  return generatedDays.map(day => ({
    ...day,
    done: savedProgress[day.dateStr] ?? null
  }));
};

/**
 * Supprime toutes les données de l'utilisateur pour l'année en cours
 */
export const clearUserData = async (userId: string): Promise<void> => {
  try {
    const docRef = getUserProgressRef(userId);
    await setDoc(docRef, {
      year: START_YEAR,
      progressMap: {},
      lastUpdated: new Date(),
      totalDone: 0,
    });
    console.log('🗑️ Données réinitialisées');
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques globales de l'utilisateur
 */
export const getUserStats = async (userId: string) => {
  try {
    const docRef = getUserProgressRef(userId);
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
    console.error('❌ Erreur lors de la récupération des stats:', error);
    throw error;
  }
};
