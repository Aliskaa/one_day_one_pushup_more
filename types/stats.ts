export interface StatsDataType {
  todayTarget: number;
  todayDone: number | null;
  realCumul: number;
  theoreticalCumul: number;
  ecart: number;
  ecartColor: string;
  ecartLabel: string;
  percent: string;
  weekStats?: WeekStatsType;
  monthStats?: MonthStatsType;
}

export interface WeekStatsType {
  weekNumber: number;
  daysCompleted: number;
  totalDays: number;
  weekTarget: number;
  weekDone: number;
  weekPercent: number;
}

export interface MonthStatsType {
  monthName: string;
  daysInMonth: number;
  daysCompleted: number;
  monthTarget: number;
  monthDone: number;
  monthPercent: number;
}