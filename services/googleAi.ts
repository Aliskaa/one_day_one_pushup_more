import { ProgressDataStats } from "@/hooks/useProgressData";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_AI_KEY;

export const generateWorkoutAdvice = async (stats: ProgressDataStats) => {
    if (!API_KEY) {
        throw new Error("Google AI API key is not defined");
    }
    const genAi = new GoogleGenerativeAI(API_KEY);

    try {

        const retard = Math.abs(stats.ecart);
        const isRetard = stats.ecart < 0;

        const prompt = `
            Agis comme un coach sportif enthousiaste et fier.
            L'utilisateur vient de TERMINER sa séance et a ATTEINT son objectif du jour !
            
            Voici ses statistiques :
            - Performance du jour : ${stats.todayDone || 0} répétitions (Objectif : ${stats.todayTarget}) -> C'est validé !
            - Série en cours (Streak) : ${stats.streak} jours de suite.
            - Total cumulé depuis le début : ${stats.totalDone}.
            - Situation globale : ${isRetard ? `En retard de ${retard} répétitions sur l'année` : "En avance sur le programme"}.

            Rédige un message court (2 phrases maximum) et percutant :
            1. Félicite-le franchement pour cette victoire quotidienne (utilise le total cumulé ou la série pour valoriser l'effort).
            2. ${isRetard
                ? "Encourage-le à garder ce rythme : c'est la seule façon de grignoter son retard."
                : "Encourage-le à viser encore plus haut pour rester en tête."}
        `;

        const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error generating workout advice:", error);
        return "Continue comme ça, tu fais du super boulot ! Chaque répétition te rapproche de ton objectif.";
    }
}