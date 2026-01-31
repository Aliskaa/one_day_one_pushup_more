import { DayDataType } from '@/types/day';
import { useState } from 'react';

export function useDayEdit(days: DayDataType[], updateDay: (index: number, value: string) => void) {
  const [selectedDay, setSelectedDay] = useState<{
    dayData: DayDataType | undefined;
    index: number;
    dateStr: string;
  } | null>(null);
  const [editValue, setEditValue] = useState('');

  const checkIsEditable = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(dateStr);
    clickedDate.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return clickedDate.getTime() === today.getTime() || clickedDate.getTime() === yesterday.getTime();
  };

  const handleDayClick = (dayData: DayDataType | undefined, dateStr: string) => {
    const index = days.findIndex(d => d.dateStr === dateStr);
    setSelectedDay({ dayData, index, dateStr });

    if (dayData) {
      setEditValue((dayData.done || 0).toString());
    } else {
      setEditValue('0');
    }
  };

  const handleSaveEdit = () => {
    if (selectedDay && selectedDay.index !== -1) {
      updateDay(selectedDay.index, editValue);
      setSelectedDay(null);
    }
  };

  const handleCloseSheet = () => {
    setSelectedDay(null);
    setEditValue('');
  };

  const isEditable = selectedDay ? checkIsEditable(selectedDay.dateStr) : false;

  return {
    selectedDay,
    editValue,
    isEditable,
    setEditValue,
    handleDayClick,
    handleSaveEdit,
    handleCloseSheet
  };
}
