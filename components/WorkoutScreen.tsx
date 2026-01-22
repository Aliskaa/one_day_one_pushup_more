import { useTraining } from '@/contexts/TrainingContext';
import { useProgressData } from '@/hooks/useProgressData';
import { storageService } from '@/services/asyncStorage';
import { generateWorkoutAdvice } from '@/services/googleAi';
import log from '@/services/logger';
import { Bot, Quote, Sparkles } from '@tamagui/lucide-icons';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, Card, H3, Paragraph, Spinner, XStack, YStack } from 'tamagui';

export default function WorkoutScreen() {
    const [advice, setAdvice] = useState("");
    const [loading, setLoading] = useState(false);
    const [isCheckingCache, setIsCheckingCache] = useState(true);
    const { trainingType } = useTraining();

    // On récupère aussi 'days' et 'todayIndex' pour avoir la date exacte gérée par l'app
    const { stats, days, todayIndex } = useProgressData(); //

    // Sécurité : si on est hors limites (ex: fin d'année), on ne fait rien
    const todayDateStr = (todayIndex >= 0 && days[todayIndex]) ? days[todayIndex].dateStr : null;
    const STORAGE_KEY = `coach_advice_${trainingType}_${todayDateStr}`;
    const ADVICE_PREFIX = `coach_advice_${trainingType}_`;

    // 1. Charger le message depuis le cache au montage ou changement de jour
    useEffect(() => {
        const loadCachedAdvice = async () => {
            if (!todayDateStr) return;

            try {
                // On remet le flag à true si la date change
                setIsCheckingCache(true);

                const cached = await storageService.getItem<string>(STORAGE_KEY);
                log.warn("📂 Cache vérifié :", cached ? "Trouvé" : "Vide");

                if (cached) {
                    setAdvice(cached);
                }

                // Nettoyage des vieux conseils (en tâche de fond, pas besoin d'await bloquant)
                storageService.cleanupOldKeys(ADVICE_PREFIX, STORAGE_KEY);
            } catch (e) {
                log.error("Erreur cache", e);
            } finally {
                // IMPORTANT : On signale que la vérification est TERMINÉE
                setIsCheckingCache(false);
            }
        };
        loadCachedAdvice();
    }, [todayDateStr]);

    // 2. Logique de déclenchement (API ou Cache)


    // On surveille les stats pour déclencher l'IA si besoin
    useEffect(() => {
        const handleAdviceLogic = async () => {
            if (isCheckingCache || !todayDateStr) return;
            if (advice) return;

            const goalReached = stats.todayDone !== null && stats.todayTarget !== null && stats.todayDone >= stats.todayTarget;

            if (goalReached && !loading) {
                setLoading(true);
                try {
                    // Appel API Gemini
                    log.info("🤖 Génération IA lancée...");
                    const text = await generateWorkoutAdvice(stats); //

                    // Mise à jour de l'état ET sauvegarde locale pour la journée
                    setAdvice(text);
                    await storageService.setItem(STORAGE_KEY, text);
                    log.info("💾 Conseil sauvegardé");
                } catch (error) {
                    log.error("Erreur génération advice", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        handleAdviceLogic();
    }, [
        stats.todayDone,
        stats.todayTarget,
        advice,
        loading,
        todayDateStr,
        isCheckingCache
    ]);

    // Affichage : On ne montre rien si pas de conseil et pas de chargement
    if ((!advice && !loading) || isCheckingCache) {
        return null;
    }

    return (
        <Card
            elevate
            p="$4"
            borderRadius="$6"
            animation="bouncy"
            // Petit effet visuel si c'est en train de charger
            opacity={loading ? 0.7 : 1}
        >
            <YStack gap="$4">
                <XStack justifyContent="space-between" alignItems="center">
                    <XStack gap="$2" alignItems="center">
                        <Bot size={24} color="$color" />
                        <H3 fontSize="$5">Coach IA</H3>
                    </XStack>
                    {/* On peut afficher un Spinner ici pendant le chargement */}
                    {loading ? <Spinner size="small" color="$blue10" /> : <Sparkles size={16} color="$yellow10Dark" />}
                </XStack>

                <AnimatePresence>
                    {advice ? (
                        <XStack gap="$2">
                            <Quote size={12} color="$color" opacity={0.5} style={{ marginTop: 4 }} />
                            <Paragraph fontSize="$4" lineHeight={22} color="$color" style={{ fontStyle: 'italic' }}>
                                {advice}
                            </Paragraph>
                        </XStack>
                    ) : (
                        // Optionnel : Message temporaire pendant le chargement
                        loading && <Paragraph fontSize="$3" opacity={0.5}>Analyse de ta performance...</Paragraph>
                    )}
                </AnimatePresence>
            </YStack>
        </Card>
    );
}