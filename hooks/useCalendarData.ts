import { isDayCompleted, isDayMissed } from '@/helpers/dateUtils';
import { DayDataType } from '@/types/day';
import { useMemo } from 'react';

export function useCalendarData(days: DayDataType[], selectedMonth: number, selectedYear: number) {
  // Stats du mois sélectionné
  const monthStats = useMemo(() => {
    const monthDays = days.filter(d => {
      const date = new Date(d.dateStr);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    const completed = monthDays.filter(d => isDayCompleted(d.done, d.target)).length;
    const missed = monthDays.filter(d => isDayMissed(d.done, d.target)).length;
    const total = monthDays.reduce((sum, d) => sum + (d.done || 0), 0);
    const target = monthDays.reduce((sum, d) => sum + (d.target || 0), 0);

    return { completed, missed, total, target, daysCount: monthDays.length };
  }, [days, selectedMonth, selectedYear]);

  // Générer les jours du calendrier
  const calendarDays = useMemo(() => {
    const firstDay = new Date(Date.UTC(selectedYear, selectedMonth, 1));
    const lastDay = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0));
    const startingDayOfWeek = (firstDay.getUTCDay() + 6) % 7; // Lundi = 0
    const daysInMonth = lastDay.getUTCDate();

    const calendar = [];

    // Jours vides avant le 1er
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(Date.UTC(selectedYear, selectedMonth, day)).toISOString().split('T')[0];
      const dayData = days.find(d => d.dateStr === dateStr);
      calendar.push({ day, dayData, dateStr });
    }

    return calendar;
  }, [selectedMonth, selectedYear, days]);

  return { monthStats, calendarDays };
}
