import { AnimatedCounter, Card, GhostButton, PrimaryButton, StatCard } from '@/components/ui';
import { useTraining } from '@/contexts/TrainingContext';
import { isDayCompleted, isDayMissed } from '@/helpers/dateUtils';
import { useProgressData } from '@/hooks/useProgressData';
import { DayDataType } from '@/types/day';
import { Calendar, Check, ChevronLeft, ChevronRight, Edit3 } from '@tamagui/lucide-icons';
import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, H2, H3, Input, ScrollView, Sheet, Spinner, Text, XStack, YStack } from 'tamagui';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function DaysCalendarScreen() {
  const { days, updateDay, isLoading, error } = useProgressData();
  const { trainingType } = useTraining();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<{ dayData: DayDataType | undefined; index: number; dateStr: string } | null>(null);
  const [editValue, setEditValue] = useState('');

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


  const handlePreviousMonth = () => {
    if (selectedMonth > 0) setSelectedMonth(selectedMonth - 1);
  };

  const handleNextMonth = () => {
    if (selectedMonth < 11) setSelectedMonth(selectedMonth + 1);
  };

  const handleDayClick = (dayData: DayDataType | undefined, dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(dateStr);
    clickedDate.setHours(0, 0, 0, 0);

    // Permettre la modification uniquement pour aujourd'hui et hier
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (clickedDate.getTime() === today.getTime() || clickedDate.getTime() === yesterday.getTime()) {
      const index = days.findIndex(d => d.dateStr === dateStr);
      setSelectedDay({ dayData, index, dateStr });
      setEditValue((dayData?.done || 0).toString());
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

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4">
        <Text color="$danger" fontSize={18} fontWeight="700">❌ {error}</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$backgroundHover">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" gap="$5" paddingBottom="$10">

            {/* HEADER */}
            <YStack gap="$2" alignItems="center" paddingTop="$2">
              <Calendar size={48} color="$primary" />
              <H2 fontSize={28} fontWeight="800" color="$color">
                Calendrier
              </H2>
              <Text fontSize={14} color="$colorMuted" textAlign="center">
                Suivez votre progression jour par jour
              </Text>
            </YStack>

            {/* NAVIGATION MOIS */}
            <Card elevated paddingVertical="$3" paddingHorizontal="$4">
              <XStack alignItems="center" justifyContent="space-between">
                <Button
                  size="$4"
                  chromeless
                  icon={ChevronLeft}
                  onPress={handlePreviousMonth}
                  disabled={selectedMonth === 0}
                  opacity={selectedMonth === 0 ? 0.3 : 1}
                />
                <Text fontSize={20} fontWeight="700" color="$color">
                  {MONTHS[selectedMonth]} {selectedYear}
                </Text>
                <Button
                  size="$4"
                  chromeless
                  icon={ChevronRight}
                  onPress={handleNextMonth}
                  disabled={selectedMonth === 11}
                  opacity={selectedMonth === 11 ? 0.3 : 1}
                />
              </XStack>
            </Card>

            {/* STATS DU MOIS */}
            <YStack gap="$3">
              <Text fontSize={14} fontWeight="700" color="$colorMuted" textTransform="uppercase" marginLeft="$2">
                Ce mois
              </Text>
              <XStack gap="$3">
                <StatCard flex={1} variant="success">
                  <Text fontSize={11} color="$colorMuted" fontWeight="600">Validés</Text>
                  <AnimatedCounter value={monthStats.completed} fontSize={28} fontWeight="800" color="$success" />
                  <Text fontSize={10} color="$colorMuted">jours</Text>
                </StatCard>

                <StatCard flex={1} variant="primary">
                  <Text fontSize={11} color="$colorMuted" fontWeight="600">Ratés</Text>
                  <AnimatedCounter value={monthStats.missed} fontSize={28} fontWeight="800" color="$danger" />
                  <Text fontSize={10} color="$colorMuted">jours</Text>
                </StatCard>

                <StatCard flex={1}>
                  <Text fontSize={11} color="$colorMuted" fontWeight="600">Total</Text>
                  <AnimatedCounter value={monthStats.total} fontSize={24} fontWeight="800" color="$color" />
                  <Text fontSize={10} color="$colorMuted">{trainingType === 'pushup' ? 'pompes' : 'crunchs'}</Text>
                </StatCard>
              </XStack>
            </YStack>

            {/* CALENDRIER HEATMAP */}
            <Card elevated padding="$4">
              <YStack gap="$3">
                {/* Jours de la semaine */}
                <XStack justifyContent="space-around">
                  {WEEKDAYS.map((day, i) => (
                    <YStack key={i} width={40} alignItems="center">
                      <Text fontSize={12} fontWeight="700" color="$colorMuted">
                        {day}
                      </Text>
                    </YStack>
                  ))}
                </XStack>

                {/* Grille calendrier */}
                <YStack gap="$2">
                  {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
                    const week = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);

                    // Si la semaine est incomplète (dernière ligne), on ajoute des "null" pour arriver à 7
                    while (week.length < 7) {
                      week.push(null);
                    }

                    return (
                      <XStack key={weekIndex} justifyContent="space-around" gap="$2">
                        {week.map((item, dayIndex) => {
                          if (!item) {
                            return <YStack key={dayIndex} width={40} height={40} />;
                          }

                          const { day, dayData, dateStr } = item;
                          const isToday = dateStr === new Date().toISOString().split('T')[0];
                          const isCompleted = dayData && isDayCompleted(dayData.done, dayData.target);
                          const isMissed = dayData && isDayMissed(dayData.done, dayData.target);
                          const isPending = dayData && dayData.done !== null && !isCompleted;
                          const isFuture = new Date(dateStr) > new Date();

                          // Vérifier si c'est aujourd'hui ou hier (éditable)
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const clickedDate = new Date(dateStr);
                          clickedDate.setHours(0, 0, 0, 0);
                          const yesterday = new Date(today);
                          yesterday.setDate(today.getDate() - 1);
                          const isEditable = clickedDate.getTime() === today.getTime() || clickedDate.getTime() === yesterday.getTime();

                          let bgColor = '$backgroundHover';
                          let textColor = '$colorMuted';

                          if (isCompleted) {
                            bgColor = '$green10Dark';
                            textColor = 'white';
                          } else if (isPending) {
                            bgColor = '$orange10Dark';
                            textColor = 'white';
                          } else if (isMissed) {
                            bgColor = '$red10Dark';
                            textColor = 'white';
                          } else if (isToday) {
                            bgColor = '$primary';
                            textColor = 'white';
                          } else if (isFuture) {
                            textColor = '$colorMuted';
                          }

                          return (
                            <YStack
                              key={dayIndex}
                              width={40}
                              height={40}
                              backgroundColor={bgColor}
                              borderRadius={8}
                              alignItems="center"
                              justifyContent="center"
                              borderWidth={isToday ? 2 : 0}
                              borderColor="$color"
                              onPress={isEditable ? () => handleDayClick(dayData, dateStr) : undefined}
                              pressStyle={isEditable ? { opacity: 0.7, scale: 0.95 } : undefined}
                              cursor={isEditable ? 'pointer' : 'default'}
                            >
                              <Text fontSize={14} fontWeight={isToday ? '800' : '600'} color={textColor}>
                                {day}
                              </Text>
                              {isEditable && (
                                <YStack position="absolute" top={2} right={2}>
                                  <Edit3 size={8} color={textColor} opacity={0.6} />
                                </YStack>
                              )}
                            </YStack>
                          );
                        })}
                      </XStack>
                    );
                  })}
                </YStack>

                {/* Légende */}
                <XStack gap="$3" marginTop="$3" justifyContent="center" flexWrap="wrap">
                  <XStack gap="$2" alignItems="center">
                    <YStack width={16} height={16} backgroundColor="$green10Dark" borderRadius={4} />
                    <Text fontSize={11} color="$colorMuted">Validé</Text>
                  </XStack>
                  <XStack gap="$2" alignItems="center">
                    <YStack width={16} height={16} backgroundColor="$red10Dark" borderRadius={4} />
                    <Text fontSize={11} color="$colorMuted">Raté</Text>
                  </XStack>
                  <XStack gap="$2" alignItems="center">
                    <YStack width={16} height={16} backgroundColor="$orange10Dark" borderRadius={4} />
                    <Text fontSize={11} color="$colorMuted">En cours</Text>
                  </XStack>
                  <XStack gap="$2" alignItems="center">
                    <YStack width={16} height={16} backgroundColor="$primary" borderRadius={4} />
                    <Text fontSize={11} color="$colorMuted">Aujourd'hui</Text>

                    {/* SHEET D'ÉDITION */}
                    <Sheet
                      modal
                      open={selectedDay !== null}
                      onOpenChange={(open: boolean) => !open && handleCloseSheet()}
                      snapPoints={[45]}
                      dismissOnSnapToBottom
                    >
                      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
                      <Sheet.Frame backgroundColor="$background" padding="$4" borderTopLeftRadius={20} borderTopRightRadius={20}>
                        <YStack gap="$4" paddingBottom="$4">
                          {/* Handle */}
                          <YStack alignItems="center">
                            <YStack width={40} height={4} backgroundColor="$borderColor" borderRadius={10} />
                          </YStack>

                          {/* Header */}
                          <YStack alignItems="center" gap="$2">
                            <H3 fontSize={20} fontWeight="700" color="$color">
                              Modifier
                            </H3>
                            <Text fontSize={14} color="$colorMuted">
                              {selectedDay && new Date(selectedDay.dateStr).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </Text>
                          </YStack>

                          {/* Infos */}
                          {selectedDay?.dayData && (
                            <Card backgroundColor="$backgroundHover" padding="$3">
                              <XStack justifyContent="space-between">
                                <Text fontSize={13} color="$colorMuted">Objectif</Text>
                                <Text fontSize={13} fontWeight="700" color="$color">
                                  {selectedDay.dayData.target} {trainingType === 'pushup' ? 'pompes' : 'crunchs'}
                                </Text>
                              </XStack>
                            </Card>
                          )}

                          {/* Input */}
                          <YStack gap="$2">
                            <Text fontSize={13} fontWeight="600" color="$color">
                              Nombre réalisé
                            </Text>
                            <Input
                              size="$5"
                              value={editValue}
                              onChangeText={setEditValue}
                              keyboardType="numeric"
                              placeholder="0"
                              fontSize={18}
                              textAlign="center"
                              backgroundColor="$backgroundHover"
                              borderColor="$borderColor"
                              focusStyle={{ borderColor: '$primary' }}
                            />
                          </YStack>

                          {/* Boutons */}
                          <XStack gap="$3">
                            <GhostButton flex={1} onPress={handleCloseSheet}>
                              Annuler
                            </GhostButton>
                            <PrimaryButton flex={1} onPress={handleSaveEdit} icon={Check}>
                              Valider
                            </PrimaryButton>
                          </XStack>
                        </YStack>
                      </Sheet.Frame>
                    </Sheet>
                  </XStack>
                </XStack>
              </YStack>
            </Card>

          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}
