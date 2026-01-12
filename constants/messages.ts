export const MOTIVATIONAL_MESSAGES = [
  "💪 La régularité bat le talent !",
  "🔥 Un jour à la fois, une pompe de plus !",
  "⚡ Vous êtes plus fort que vous ne le pensez !",
  "🎯 Chaque pompe compte vers votre objectif !",
  "🚀 Continuez, le progrès est réel !",
  "🌟 Votre future vous remercie !",
  "💎 La discipline forge les champions !",
  "🏆 Vous êtes en train d'écrire votre légende !",
  "🌊 Vague après vague, on devient l'océan !",
  "⭐ Petit à petit, l'oiseau fait son nid !",
];

export const CELEBRATION_MESSAGES = [
  "🎉 Objectif du jour ÉCRASÉ !",
  "🏆 Champion ! Objectif validé !",
  "⚡ Incroyable ! Vous l'avez fait !",
  "🔥 En feu ! Objectif atteint !",
  "💪 Bravo ! Encore un jour de gagné !",
  "🌟 Excellent travail ! C'est validé !",
  "🎊 Fantastique ! Mission accomplie !",
  "🚀 Vous déchirez ! Objectif atteint !",
];

export const STREAK_MESSAGES = {
  3: "🔥 3 jours d'affilée ! Vous prenez le rythme !",
  7: "⭐ Une semaine parfaite ! Vous êtes incroyable !",
  14: "💎 2 semaines de suite ! Vous êtes un champion !",
  21: "🏆 21 jours ! L'habitude est ancrée !",
  30: "👑 Un mois complet ! Vous êtes une légende !",
  50: "🌟 50 jours consécutifs ! Phénoménal !",
  100: "🔱 100 JOURS ! Vous êtes INARRÊTABLE !",
};

export const REMINDER_MESSAGES = [
  "⏰ N'oubliez pas vos pompes du jour !",
  "💪 C'est l'heure de se dépasser !",
  "🎯 Votre objectif vous attend !",
  "🔥 Gardez la flamme allumée !",
  "⚡ Quelques pompes pour rester dans la course !",
];

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getStreakMessage(streak: number): string {
  // Trouver le message correspondant au jalon le plus proche
  const milestones = Object.keys(STREAK_MESSAGES)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const milestone of milestones) {
    if (streak >= milestone) {
      return STREAK_MESSAGES[milestone as keyof typeof STREAK_MESSAGES];
    }
  }
  
  return `🔥 ${streak} jours de suite ! Continuez comme ça !`;
}
