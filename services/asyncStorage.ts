import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageService = {/**
   * Sauvegarde une valeur (String, Nombre, Objet, Tableau...)
   * @param key Clé unique de stockage
   * @param value La donnée à stocker
   */
    setItem: async (key: string, value: any): Promise<void> => {
        try {
            // Si c'est un objet ou autre, on le stringify. Si c'est déjà une string, on garde tel quel.
            const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error(`❌ Erreur AsyncStorage [setItem] pour la clé "${key}":`, e);
        }
    },/**
   * Récupère une valeur.
   * Tente de parser le JSON automatiquement si possible.
   * @param key Clé unique de stockage
   * @returns La donnée typée ou null
   */
    getItem: async <T>(key: string): Promise<T | null> => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            if (jsonValue === null) return null;

            // On essaie de parser, si ça échoue (c'est une simple string), on renvoie la string
            try {
                return JSON.parse(jsonValue) as T;
            } catch {
                return jsonValue as unknown as T;
            }
        } catch (e) {
            console.error(`❌ Erreur AsyncStorage [getItem] pour la clé "${key}":`, e);
            return null;
        }
    },

    /**
     * Supprime une valeur spécifique
     */
    removeItem: async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error(`❌ Erreur AsyncStorage [removeItem] pour la clé "${key}":`, e);
        }
    },

    /**
   * Vide tout le stockage (Attention !)
   * Utile lors de la déconnexion de l'utilisateur par exemple.
   */
    clearAll: async (): Promise<void> => {
        try {
            await AsyncStorage.clear();
            console.log('🧹 AsyncStorage vidé entièrement.');
        } catch (e) {
            console.error('❌ Erreur AsyncStorage [clearAll]:', e);
        }
    },

    /**
   * Supprime toutes les clés commençant par un préfixe, SAUF celle d'aujourd'hui.
   * @param prefix Le début de la clé à chercher (ex: "coach_advice_")
   * @param currentKeyToKeep La clé active à ne PAS supprimer
   */
    cleanupOldKeys: async (prefix: string, currentKeyToKeep: string): Promise<void> => {
        try {
            // 1. Récupérer toutes les clés de l'app
            const allKeys = await AsyncStorage.getAllKeys();

            // 2. Filtrer : On veut celles qui ont le préfixe MAIS qui ne sont pas celle d'aujourd'hui
            const keysToRemove = allKeys.filter(key =>
                key.startsWith(prefix) && key !== currentKeyToKeep
            );

            // 3. Supprimer en lot (plus performant)
            if (keysToRemove.length > 0) {
                await AsyncStorage.multiRemove(keysToRemove);
                console.log(`🧹 Nettoyage : ${keysToRemove.length} anciens conseils supprimés.`);
            }
        } catch (e) {
            console.error('❌ Erreur lors du nettoyage des anciennes clés:', e);
        }
    }
};
