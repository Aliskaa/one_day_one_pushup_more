// Utilitaires pour la gestion du stockage AsyncStorage

import { START_YEAR, STORAGE_KEY } from '@/constants/constants';
import { DayDataType } from '@/types/Day';
import { ProgressMapType } from '@/types/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Calcule le nombre de jours dans une année (gère les années bissextiles)
 */
const getDaysInYear = (year: number): number => {
  // Une année est bissextile si divisible par 4, sauf si divisible par 100 (sauf si divisible par 400)
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
    // Utilisation de new Date(year, month, day) pour éviter les problèmes de fuseau horaire
    const currentDate = new Date(START_YEAR, 0, 1 + i); // Janvier = 0
    
    // Construction manuelle de la string pour éviter le bug de toISOString() avec les fuseaux horaires
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
  
  // Log de debug pour vérifier les premières et dernières dates
  console.log('🗓️ Génération des dates:', {
    first: generatedDays[0]?.dateStr,
    last: generatedDays[daysInYear - 1]?.dateStr,
    total: generatedDays.length,
    isLeapYear: daysInYear === 366
  });
  
  return generatedDays;
};

/**
 * Charge les données sauvegardées depuis AsyncStorage
 */
export const loadProgressData = async (): Promise<ProgressMapType> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!jsonValue) return {};
    
    // Validation et recovery en cas de JSON corrompu
    const parsed = JSON.parse(jsonValue);
    
    // Vérifier que c'est bien un objet
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      console.warn('Données corrompues détectées, réinitialisation');
      return {};
    }
    
    // Valider que les valeurs sont des nombres
    const validated: ProgressMapType = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'number' && !isNaN(value) && value >= 0) {
        validated[key] = value;
      }
    }
    
    return validated;
  } catch (e) {
    console.error("Erreur lors du chargement des données, réinitialisation", e);
    // Au lieu de throw, on retourne un objet vide pour recovery
    return {};
  }
};

/**
 * Sauvegarde les données dans AsyncStorage
 */
export const saveProgressData = async (progressMap: ProgressMapType): Promise<void> => {
  try {
    // Validation avant sauvegarde
    const validated: ProgressMapType = {};
    for (const [key, value] of Object.entries(progressMap)) {
      if (typeof value === 'number' && !isNaN(value) && value >= 0) {
        validated[key] = value;
      }
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
  } catch (e) {
    console.error("Erreur lors de la sauvegarde des données", e);
    throw e;
  }
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
 * Réinitialise toutes les données (utile pour le debug ou reset)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Erreur lors de la suppression des données", e);
    throw e;
  }
};
