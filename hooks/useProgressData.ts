/**
 * Hook personnalisé pour gérer les données de progression avec Firebase
 * Remplace la logique AsyncStorage par Firestore avec synchronisation temps réel
 */

import { START_YEAR, UI_CONSTANTS } from '@/constants/constants';
import { useTraining } from '@/contexts/TrainingContext';
import { getTodayIndex, isDayCompleted } from '@/helpers/dateUtils';
import { computeRawEcart } from '@/helpers/progressStats';
import {
  generateYearData,
  loadProgressFromFirebase,
  mergeDataWithProgress,
  saveProgressToFirebase,
  subscribeToProgress,
} from '@/services/firebaseStorage';
import log from '@/services/logger';
import { DayDataType } from '@/types/day';
import { ProgressMapType } from '@/types/utils';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useToastController } from '@tamagui/toast';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { syncPublicStats } from '@/services/leaderboardSync';

export type ProgressDataStats = {
  totalDone: number;
  daysCompleted: number;
  todayTarget: number;
  todayDone: number | null;
  /** Affiché sur l’accueil : banque (si en avance) ou retard réel */
  ecart: number;
  /** Cumul réel − objectifs (sans effet banque sur l’affichage quand tu es en avance) */
  physicalEcart: number;
  percent: number;
  streak: number;
  /** Prélèvement déjà appliqué aujourd’hui sur la banque */
  todayBankUsed: number;
  /** Solde banque affiché (diminue quand tu préleves) */
  surplusReserve: number;
};

export interface UseProgressDataReturn {
  days: DayDataType[];
  todayIndex: number;
  isLoading: boolean;
  error: string | null;
  updateDay: (index: number, value: string) => void;
  withdrawFromBank: () => void;
  refreshData: () => Promise<void>;
  stats: ProgressDataStats;
}

export const useProgressData = (): UseProgressDataReturn => {
  const { userId } = useAuth();
  const { user } = useUser();
  const toast = useToastController();
  const { trainingType } = useTraining();

  const [days, setDays] = useState<DayDataType[]>([]);
  const [progressMap, setProgressMap] = useState<ProgressMapType>({});
  const [surplusReserve, setSurplusReserve] = useState(0);
  const [bankByDate, setBankByDate] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdatesRef = useRef<ProgressMapType>({});

  const progressMapRef = useRef(progressMap);
  const surplusReserveRef = useRef(surplusReserve);
  const bankByDateRef = useRef(bankByDate);

  useEffect(() => {
    progressMapRef.current = progressMap;
  }, [progressMap]);
  useEffect(() => {
    surplusReserveRef.current = surplusReserve;
  }, [surplusReserve]);
  useEffect(() => {
    bankByDateRef.current = bankByDate;
  }, [bankByDate]);

  const todayIndex = getTodayIndex(START_YEAR, days.length);

  useEffect(() => {
    const loadData = async () => {
      if (!userId || !trainingType) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const generatedDays = generateYearData();
        const saved = await loadProgressFromFirebase(userId, trainingType);
        const mergedDays = mergeDataWithProgress(
          generatedDays,
          saved.progressMap,
          saved.bankByDate
        );
        const ti = getTodayIndex(START_YEAR, mergedDays.length);
        const rawInit = computeRawEcart(mergedDays, ti);
        const reserveInit =
          saved.surplusReserve != null && !Number.isNaN(saved.surplusReserve)
            ? saved.surplusReserve
            : Math.max(0, rawInit);

        setDays(mergedDays);
        setProgressMap(saved.progressMap);
        setBankByDate(saved.bankByDate);
        setSurplusReserve(reserveInit);
        surplusReserveRef.current = reserveInit;
        bankByDateRef.current = saved.bankByDate;

        if (saved.surplusReserve == null) {
          await saveProgressToFirebase(userId, trainingType, saved.progressMap, {
            surplusReserve: reserveInit,
            bankByDate: saved.bankByDate,
          });
        }

        log.info('✅ Données chargées:', {
          totalDays: mergedDays.length,
          savedEntries: Object.keys(saved.progressMap).length,
        });
      } catch (err) {
        log.error('❌ Erreur de chargement:', err);
        setError('Impossible de charger les données');
        const generatedDays = generateYearData();
        setDays(generatedDays);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, trainingType]);

  useEffect(() => {
    if (!userId || !trainingType) return;

    const unsubscribe = subscribeToProgress(userId, trainingType, (payload) => {
      setProgressMap(payload.progressMap);
      progressMapRef.current = payload.progressMap;

      if (payload.surplusReserve !== undefined && payload.surplusReserve !== null) {
        setSurplusReserve(payload.surplusReserve);
        surplusReserveRef.current = payload.surplusReserve;
      }

      setBankByDate(payload.bankByDate);
      bankByDateRef.current = payload.bankByDate;

      setDays(prevDays =>
        prevDays.map(day => ({
          ...day,
          done: payload.progressMap[day.dateStr] ?? null,
          bankUsed: payload.bankByDate[day.dateStr] ?? 0,
        }))
      );
    });

    return () => unsubscribe();
  }, [userId, trainingType]);

  const debouncedSave = useCallback(
    (updates: ProgressMapType) => {
      if (!userId || !trainingType) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const allUpdates = {
            ...progressMapRef.current,
            ...pendingUpdatesRef.current,
          };
          const reserve = surplusReserveRef.current;
          const banks = bankByDateRef.current;

          await saveProgressToFirebase(userId, trainingType, allUpdates, {
            surplusReserve: reserve,
            bankByDate: banks,
          });
          pendingUpdatesRef.current = {};
          log.info('💾 Sauvegarde effectuée');

          if (user) {
            const displayName =
              user.username ||
              user.fullName ||
              (user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : null) ||
              user.firstName ||
              user.primaryEmailAddress?.emailAddress?.split('@')[0] ||
              'Utilisateur';

            await syncPublicStats(
              userId,
              displayName,
              trainingType,
              allUpdates,
              user.imageUrl
            );
          }
        } catch (err) {
          log.error('❌ Erreur de sauvegarde:', err);
          setError('Erreur de sauvegarde');
        }
      }, UI_CONSTANTS.DEBOUNCE_SAVE_DELAY);
    },
    [userId, trainingType, user]
  );

  const updateDay = useCallback(
    (index: number, value: string) => {
      const numValue = value === '' ? null : parseInt(value, 10);

      if (
        numValue !== null &&
        (isNaN(numValue) || numValue < 0 || numValue > UI_CONSTANTS.MAX_INPUT_VALUE)
      ) {
        toast.show('⚠️ Limite dépassée', {
          message: `La valeur maximale est ${UI_CONSTANTS.MAX_INPUT_VALUE} pompes`,
          duration: 3000,
        });
        return;
      }

      setDays(prevDays => {
        const ti = getTodayIndex(START_YEAR, prevDays.length);
        const oldRaw = computeRawEcart(prevDays, ti);
        const newDays = [...prevDays];
        const day = newDays[index];

        if (!day) return prevDays;

        const prevBank = day.bankUsed ?? 0;
        const doneNum = numValue ?? 0;
        const maxBank = Math.max(0, day.target - doneNum);
        const newBank = Math.min(prevBank, maxBank);
        const refund = prevBank - newBank;

        newDays[index] = { ...day, done: numValue, bankUsed: newBank };

        const newRaw = computeRawEcart(newDays, ti);

        setSurplusReserve(prevRes => {
          const next = Math.max(0, prevRes + refund + (newRaw - oldRaw));
          surplusReserveRef.current = next;
          return next;
        });

        let nextBankByDate = { ...bankByDateRef.current };
        if (newBank !== prevBank) {
          if (newBank <= 0) {
            delete nextBankByDate[day.dateStr];
          } else {
            nextBankByDate[day.dateStr] = newBank;
          }
          bankByDateRef.current = nextBankByDate;
          setBankByDate(nextBankByDate);
        }

        const newProgressMap = {
          ...progressMapRef.current,
          [day.dateStr]: numValue ?? 0,
        };
        progressMapRef.current = newProgressMap;
        setProgressMap(newProgressMap);
        debouncedSave({ [day.dateStr]: numValue ?? 0 });

        return newDays;
      });
    },
    [debouncedSave, toast]
  );

  const withdrawFromBank = useCallback(() => {
    if (todayIndex === -1 || !userId || !trainingType) return;

    const day = days[todayIndex];
    if (!day) return;

    const doneBase = day.done === null ? 0 : day.done;
    const bankUsed = day.bankUsed ?? 0;
    const effective = doneBase + bankUsed;
    const shortfall = day.target - effective;
    if (shortfall <= 0) return;

    const w = Math.min(shortfall, surplusReserve);
    if (w <= 0) {
      toast.show('Banque vide', {
        message: "Tu n'as plus de surplus à utiliser pour aujourd'hui.",
        duration: 3000,
      });
      return;
    }

    const newDone = day.done === null ? 0 : day.done;
    const newBank = bankUsed + w;
    const newReserve = Math.max(0, surplusReserve - w);
    const nextBankByDate = { ...bankByDate, [day.dateStr]: newBank };

    setSurplusReserve(newReserve);
    surplusReserveRef.current = newReserve;
    setBankByDate(nextBankByDate);
    bankByDateRef.current = nextBankByDate;

    setDays(prev => {
      const copy = [...prev];
      copy[todayIndex] = {
        ...day,
        done: newDone,
        bankUsed: newBank,
      };
      return copy;
    });

    const newProgressMap = {
      ...progressMapRef.current,
      [day.dateStr]: newDone ?? 0,
    };
    progressMapRef.current = newProgressMap;
    setProgressMap(newProgressMap);

    debouncedSave({ [day.dateStr]: newDone ?? 0 });
  }, [
    todayIndex,
    userId,
    trainingType,
    days,
    surplusReserve,
    bankByDate,
    debouncedSave,
    toast,
  ]);

  const refreshData = useCallback(async () => {
    if (!userId || !trainingType) return;

    try {
      setIsLoading(true);
      const saved = await loadProgressFromFirebase(userId, trainingType);
      const generatedDays = generateYearData();
      const mergedDays = mergeDataWithProgress(
        generatedDays,
        saved.progressMap,
        saved.bankByDate
      );
      const ti = getTodayIndex(START_YEAR, mergedDays.length);
      const rawInit = computeRawEcart(mergedDays, ti);
      const reserveInit =
        saved.surplusReserve != null && !Number.isNaN(saved.surplusReserve)
          ? saved.surplusReserve
          : Math.max(0, rawInit);

      setDays(mergedDays);
      setProgressMap(saved.progressMap);
      setBankByDate(saved.bankByDate);
      setSurplusReserve(reserveInit);
      surplusReserveRef.current = reserveInit;
      bankByDateRef.current = saved.bankByDate;
    } catch (err) {
      log.error('❌ Erreur de rafraîchissement:', err);
      setError('Erreur de rafraîchissement');
    } finally {
      setIsLoading(false);
    }
  }, [userId, trainingType]);

  const stats = useMemo(() => {
    const totalDone = days.reduce((sum, d) => sum + (d.done || 0), 0);
    const daysCompleted = days.filter(d =>
      isDayCompleted(d.done, d.target, d.bankUsed)
    ).length;

    const today = days[todayIndex];
    const todayTarget = today?.target || 0;
    const todayDone = today?.done ?? null;
    const todayBankUsed = today?.bankUsed ?? 0;

    const physicalEcart = computeRawEcart(days, todayIndex);
    const ecart =
      physicalEcart < 0
        ? physicalEcart
        : surplusReserve > 0
          ? surplusReserve
          : physicalEcart;

    const totalTarget = days.reduce((sum, d) => sum + d.target, 0);
    const percent =
      totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100 * 10) / 10 : 0;

    let streak = 0;
    if (today && isDayCompleted(today.done, today.target, today.bankUsed)) {
      streak++;
    }
    for (let i = todayIndex - 1; i >= 0; i--) {
      const d = days[i];
      if (d && isDayCompleted(d.done, d.target, d.bankUsed)) {
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
      physicalEcart,
      percent,
      streak,
      todayBankUsed,
      surplusReserve,
    };
  }, [days, todayIndex, surplusReserve]);

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
    withdrawFromBank,
    refreshData,
    stats,
  };
};
