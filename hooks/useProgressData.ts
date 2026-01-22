/**
 * Hook personnalisé pour gérer les données de progression avec Firebase
 * Remplace la logique AsyncStorage par Firestore avec synchronisation temps réel
 */

import { START_YEAR, UI_CONSTANTS } from '@/constants/constants';
import { useTraining } from '@/contexts/TrainingContext';
import { getTodayIndex } from '@/helpers/dateUtils';
import {
  generateYearData,
  loadProgressFromFirebase,
  mergeDataWithProgress,
  saveProgressToFirebase,
  subscribeToProgress
} from '@/services/firebaseStorage';
import log from '@/services/logger';
import { DayDataType } from '@/types/day';
import { ProgressMapType } from '@/types/utils';
import { useAuth } from '@clerk/clerk-expo';
import { useToastController } from '@tamagui/toast';
import { useCallback, useEffect, useRef, useState } from 'react';

export type ProgressDataStats = {
  totalDone: number;
  daysCompleted: number;
  todayTarget: number;
  todayDone: number | null;
  ecart: number;
  percent: number;
  streak: number;
};

export interface UseProgressDataReturn {
  days: DayDataType[];
  todayIndex: number;
  isLoading: boolean;
  error: string | null;
  updateDay: (index: number, value: string) => void;
  refreshData: () => Promise<void>;
  stats: ProgressDataStats;
}

export const useProgressData = (): UseProgressDataReturn => {
  const { userId } = useAuth();
  const toast = useToastController();
  const { trainingType } = useTraining();

  const [days, setDays] = useState<DayDataType[]>([]);
  const [progressMap, setProgressMap] = useState<ProgressMapType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Référence pour le debounce de sauvegarde
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdatesRef = useRef<ProgressMapType>({});

  // Calcul de l'index d'aujourd'hui
  const todayIndex = getTodayIndex(START_YEAR, days.length);

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      if (!userId || !trainingType) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 1. Générer les données de l'année
        const generatedDays = generateYearData();

        // 2. Charger les données depuis Firebase
        const savedProgress = await loadProgressFromFirebase(userId, trainingType);

        // 3. Fusionner les données
        const mergedDays = mergeDataWithProgress(generatedDays, savedProgress);

        setDays(mergedDays);
        setProgressMap(savedProgress);

        log.info('✅ Données chargées:', {
          totalDays: mergedDays.length,
          savedEntries: Object.keys(savedProgress).length,
        });
      } catch (err) {
        log.error('❌ Erreur de chargement:', err);
        setError('Impossible de charger les données');

        // Fallback: générer les données localement
        const generatedDays = generateYearData();
        setDays(generatedDays);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, trainingType]);

  // Écoute des changements en temps réel (synchronisation multi-appareils)
  useEffect(() => {
    if (!userId || !trainingType) return;

    const unsubscribe = subscribeToProgress(userId, trainingType, (newProgressMap) => {
      setProgressMap(newProgressMap);

      // Mettre à jour les days avec les nouvelles données
      setDays(prevDays =>
        prevDays.map(day => ({
          ...day,
          done: newProgressMap[day.dateStr] ?? null,
        }))
      );
    });

    return () => unsubscribe();
  }, [userId, trainingType]);

  // Fonction de sauvegarde avec debounce
  const debouncedSave = useCallback((updates: ProgressMapType) => {
    if (!userId || !trainingType) return;

    // Annuler le timeout précédent
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Accumuler les mises à jour
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };

    // Programmer la sauvegarde
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const allUpdates = { ...progressMap, ...pendingUpdatesRef.current };
        await saveProgressToFirebase(userId, trainingType, allUpdates);
        pendingUpdatesRef.current = {};
        log.info('💾 Sauvegarde effectuée');
      } catch (err) {
        log.error('❌ Erreur de sauvegarde:', err);
        setError('Erreur de sauvegarde');
      }
    }, UI_CONSTANTS.DEBOUNCE_SAVE_DELAY);
  }, [userId, trainingType, progressMap]);

  // Mise à jour d'un jour
  const updateDay = useCallback((index: number, value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);

    // Validation
    if (numValue !== null && (isNaN(numValue) || numValue < 0 || numValue > UI_CONSTANTS.MAX_INPUT_VALUE)) {
      toast.show('⚠️ Limite dépassée', {
        message: `La valeur maximale est ${UI_CONSTANTS.MAX_INPUT_VALUE} pompes`,
        duration: 3000,
      });
      return;
    }

    setDays(prevDays => {
      const newDays = [...prevDays];
      const day = newDays[index];

      if (day) {
        newDays[index] = { ...day, done: numValue };

        // Mettre à jour le progressMap local
        const newProgressMap = { ...progressMap, [day.dateStr]: numValue ?? 0 };
        setProgressMap(newProgressMap);

        // Sauvegarder avec debounce
        debouncedSave({ [day.dateStr]: numValue ?? 0 });
      }

      return newDays;
    });
  }, [progressMap, debouncedSave, toast]);

  // Rafraîchir les données
  const refreshData = useCallback(async () => {
    if (!userId || !trainingType) return;

    try {
      setIsLoading(true);
      const savedProgress = await loadProgressFromFirebase(userId, trainingType);
      const generatedDays = generateYearData();
      const mergedDays = mergeDataWithProgress(generatedDays, savedProgress);

      setDays(mergedDays);
      setProgressMap(savedProgress);
    } catch (err) {
      log.error('❌ Erreur de rafraîchissement:', err);
      setError('Erreur de rafraîchissement');
    } finally {
      setIsLoading(false);
    }
  }, [userId, trainingType]);

  // Calcul des statistiques
  const stats = (() => {
    const totalDone = days.reduce((sum, day) => sum + (day.done || 0), 0);
    const daysCompleted = days.filter(d => d.done !== null && d.done >= d.target).length;

    const today = days[todayIndex];
    const todayTarget = today?.target || 0;
    const todayDone = today?.done ?? null;

    // Calcul de l'écart (positif = en avance, négatif = en retard)
    const expectedCumul = days.slice(0, todayIndex + 1).reduce((sum, d) => sum + d.target, 0);
    const realCumul = days.slice(0, todayIndex + 1).reduce((sum, d) => sum + (d.done || 0), 0);
    const ecart = realCumul - expectedCumul;

    // Pourcentage de progression annuelle
    const totalTarget = days.reduce((sum, d) => sum + d.target, 0);
    const percent = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100 * 10) / 10 : 0;

    // Calcul de la série en cours (streak)
    let streak = 0;
    if (today && today.done !== null && today.done >= today.target) {
      streak++;
    }
    for (let i = todayIndex - 1; i >= 0; i--) {
      const day = days[i];
      if (day && day.done !== null && day.done >= day.target) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalDone,
      daysCompleted,
      todayTarget,
      todayDone,
      ecart,
      percent,
      streak,
    };
  })();

  // Nettoyage du timeout au démontage
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    days,
    todayIndex,
    isLoading,
    error,
    updateDay,
    refreshData,
    stats,
  };
};
