import { ProgressDataStats } from "@/hooks/useProgressData";
import { GoogleGenerativeAI } from "@google/generative-ai";
import log from "./logger";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_AI_KEY;

interface ConversationMessage {
    role: 'user' | 'model';
    parts: string;
}

// Stocker l'historique de conversation (limité aux 5 derniers messages)
let conversationHistory: ConversationMessage[] = [];

export const generateWorkoutAdvice = async (stats: ProgressDataStats, previousAdvice?: string) => {
    if (!API_KEY) {
        throw new Error("Google AI API key is not defined");
    }
    const genAi = new GoogleGenerativeAI(API_KEY);

    try {
        const retard = Math.abs(stats.ecart);
        const isRetard = stats.ecart < 0;
        
        // Analyser le contexte de performance
        const isStrong = stats.todayDone && stats.todayTarget && stats.todayDone > stats.todayTarget * 1.5;
        const isPerfectStreak = stats.streak > 0 && stats.streak % 7 === 0;
        const isMilestone = stats.totalDone % 1000 === 0 || (stats.totalDone > 1000 && stats.totalDone % 500 === 0);
        const streakLevel = stats.streak >= 30 ? 'exceptionnel' : stats.streak >= 14 ? 'excellent' : stats.streak >= 7 ? 'bon' : 'débutant';

        const prompt = `
Tu es un coach sportif personnel, empathique et motivant. Tu connais bien ton athlète et tu adaptes tes messages à sa progression.

📊 STATISTIQUES ACTUELLES :
- Performance du jour : ${stats.todayDone || 0} répétitions (Objectif : ${stats.todayTarget}) ✅ OBJECTIF ATTEINT${isStrong ? ' ET DÉPASSÉ !' : ''}
- Série actuelle : ${stats.streak} jours consécutifs (Niveau : ${streakLevel})
- Total cumulé : ${stats.totalDone} répétitions
- Situation globale : ${isRetard ? `${retard} répétitions de retard sur l'objectif annuel` : `${retard} répétitions d'avance sur l'objectif annuel`}
- Progression : ${stats.ecart >= 0 ? '📈 En avance' : '📉 À rattraper'}

🎯 CONTEXTE SPÉCIAL :
${isPerfectStreak ? `🔥 SÉRIE PARFAITE : ${stats.streak} jours d'affilée !` : ''}
${isMilestone ? `🏆 MILESTONE : ${stats.totalDone} répétitions au compteur !` : ''}
${isStrong ? '💪 PERFORMANCE EXCEPTIONNELLE : Objectif dépassé de plus de 50% !' : ''}

📝 TON DERNIER MESSAGE (pour éviter répétition) :
${previousAdvice || 'Premier message du jour'}

✍️ INSTRUCTIONS :
Rédige un message court (2-3 phrases max, 280 caractères max) qui :
1. ${isPerfectStreak || isMilestone || isStrong ? 'CÉLÈBRE ce moment spécial avec enthousiasme' : 'Félicite chaleureusement cette victoire quotidienne'}
2. ${isRetard ? 
    'Motive à maintenir cette dynamique pour rattraper le retard (sans culpabiliser)' : 
    'Encourage à maintenir cette avance et viser encore plus haut'}
3. Utilise un ton ${stats.streak >= 14 ? 'complice et fier' : stats.streak >= 7 ? 'encourageant' : 'chaleureux et motivant'}
4. Varie ton vocabulaire par rapport au dernier message
5. Personnalise avec les chiffres concrets (streak, total, écart)

ÉVITE les formulations génériques, reste spontané et humain.
        `;

        const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        
        // Si on a un historique, utiliser le mode conversation
        if (conversationHistory.length > 0 && previousAdvice) {
            conversationHistory.push({
                role: 'user',
                parts: prompt
            });
            
            // Limiter l'historique aux 10 derniers messages
            if (conversationHistory.length > 10) {
                conversationHistory = conversationHistory.slice(-10);
            }
            
            const chat = model.startChat({
                history: conversationHistory.slice(0, -1).map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.parts }]
                }))
            });
            
            const result = await chat.sendMessage(prompt);
            const text = result.response.text();
            
            conversationHistory.push({
                role: 'model',
                parts: text
            });
            
            return text;
        } else {
            // Premier message, sans historique
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            conversationHistory = [
                { role: 'user', parts: prompt },
                { role: 'model', parts: text }
            ];
            
            return text;
        }
    } catch (error) {
        log.error("Error generating workout advice:", error);
        
        // Message de fallback plus contextualisé
        if (stats.streak >= 7) {
            return `Wow, ${stats.streak} jours de suite ! Tu es sur une lancée exceptionnelle. Continue comme ça, champion ! 🔥`;
        } else if (stats.totalDone >= 1000) {
            return `${stats.totalDone} répétitions au compteur ! Chaque jour te rapproche de l'excellence. Fier de toi ! 💪`;
        } else {
            return "Bravo pour cette victoire quotidienne ! Chaque effort compte, tu progresses jour après jour. 🎯";
        }
    }
}