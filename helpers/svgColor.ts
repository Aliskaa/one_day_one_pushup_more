import { useTheme } from 'tamagui';

export const svgColor = (color: string) => {
    const theme = useTheme();

    // 3. Petite fonction utilitaire pour résoudre la couleur
    // Si on passe "$blue10", on cherche dans le thème.
    // Si on passe "red" ou "#000", on garde tel quel.
    const resolveColor = (colorKey: string) => {
        // On enlève le "$" si présent pour chercher dans l'objet theme
        const key = colorKey.startsWith('$') ? colorKey.slice(1) : colorKey;

        // On récupère la valeur. .get() est important pour avoir la string (#123456)
        // Si le token n'existe pas, on retourne la valeur brute (ex: "white")
        return theme[key]?.get() || colorKey;
    };

    return resolveColor(color);
}
