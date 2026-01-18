// Constantes globales de l'application

export const START_YEAR = 2026;
export const APP_NAME = 'One Day One More';

// Calcul du total dynamique (gère année bissextile)
const getDaysInYear = (year: number): number => {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  return isLeapYear ? 366 : 365;
};

export const DAYS_IN_YEAR = getDaysInYear(START_YEAR);
// Somme de 1+2+3...+n = n*(n+1)/2
export const TOTAL_TARGET_YEAR = (DAYS_IN_YEAR * (DAYS_IN_YEAR + 1)) / 2;

// Constantes UI Layout
export const UI_CONSTANTS = {
  TABBAR_HEIGHT: 65,
  TABBAR_BOTTOM_OFFSET: 80,
  LIST_BOTTOM_PADDING: 120,
  TODAY_BUTTON_BOTTOM_OFFSET: 100,
  DAY_ROW_HEIGHT: 80,
  DEBOUNCE_SAVE_DELAY: 500,
  MAX_INPUT_VALUE: 999,
};
