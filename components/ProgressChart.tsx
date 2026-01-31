import { DayDataType } from '@/types/day';
import { BarChart3, Calendar, TrendingUp } from '@tamagui/lucide-icons';
import React, { useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Card, Text, useTheme, XStack, YStack, Button } from 'tamagui';

type TimeRange = 'week' | 'month' | 'year';

interface ProgressChartProps {
  days: DayDataType[];
  todayIndex: number;
}

export function ProgressChart({ days, todayIndex }: ProgressChartProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  
  // Calculer la largeur disponible pour le graphe (largeur écran - padding)
  const chartWidth = Math.min(width - 120, 350);

  const chartData = useMemo(() => {
    // Déterminer la plage de données en fonction du timeRange
    let relevantDays: DayDataType[];
    
    if (timeRange === 'week') {
      // 7 derniers jours
      relevantDays = days.slice(Math.max(0, todayIndex - 6), todayIndex + 1);
    } else if (timeRange === 'month') {
      // 30 derniers jours
      relevantDays = days.slice(Math.max(0, todayIndex - 29), todayIndex + 1);
    } else {
      // Toute l'année
      relevantDays = days.slice(0, todayIndex + 1);
    }
    
    let theoreticalCumul = 0;
    let realCumul = 0;
    
    const theoreticalData: any[] = [];
    const realData: any[] = [];
    
    // Calculer le pas d'échantillonnage pour ne pas surcharger
    const samplingRate = timeRange === 'year' ? 2 : (timeRange === 'month' ? 1 : 1);
    
    relevantDays.forEach((day, index) => {
      theoreticalCumul += day.target;
      realCumul += day.done || 0;
      
      // Échantillonnage intelligent
      const shouldInclude = index === 0 || index === relevantDays.length - 1 || index % samplingRate === 0;
      
      if (shouldInclude) {
        // Format de label selon la plage
        let label = '';
        if (index === 0 || index === relevantDays.length - 1) {
          if (timeRange === 'week') {
            const date = new Date(day.dateStr);
            label = date.toLocaleDateString('fr-FR', { weekday: 'short' }).substring(0, 3);
          } else if (timeRange === 'month') {
            label = `J${day.dayNum}`;
          } else {
            label = `J${day.dayNum}`;
          }
        }
        
        theoreticalData.push({
          value: theoreticalCumul,
          label,
          labelTextStyle: { color: theme.color.val, fontSize: 10 },
        });
        
        realData.push({
          value: realCumul,
          label: '',
        });
      }
    });

    const maxVal = Math.max(theoreticalCumul, realCumul);
    
    // Calculer les stats additionnelles
    const totalDone = relevantDays.reduce((sum, d) => sum + (d.done || 0), 0);
    const totalTarget = relevantDays.reduce((sum, d) => sum + d.target, 0);
    const avgDaily = totalDone / relevantDays.length;
    const avgTarget = totalTarget / relevantDays.length;
    const completionRate = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0;

    return { 
      theoreticalData, 
      realData, 
      maxValue: maxVal,
      stats: {
        totalDone,
        totalTarget,
        avgDaily,
        avgTarget,
        completionRate,
        daysCount: relevantDays.length
      }
    };
  }, [days, todayIndex, theme, timeRange]);

  const isAhead = useMemo(() => {
    const lastReal = chartData.realData[chartData.realData.length - 1]?.value || 0;
    const lastTheoretical = chartData.theoreticalData[chartData.theoreticalData.length - 1]?.value || 0;
    return lastReal >= lastTheoretical;
  }, [chartData]);

    return (
      <Card elevate p="$4" borderRadius={24} bg="$background" animation="lazy" borderTopWidth={4} borderTopColor={isAhead ? "$success" : "$danger"} >
        <YStack gap="$3">
          {/* Header avec sélecteur de période */}
          <YStack gap="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <BarChart3 size={16} color="$success" />
                <Text fontSize={14} fontWeight="600" color="$color" opacity={0.7}>Progression</Text>
              </XStack>
              <XStack 
                bg={isAhead ? '$success' : '$danger'} 
                px="$3" 
                py="$1.5" 
                borderRadius={12}
                alignItems="center" 
                gap="$2"
              >
                <YStack 
                  width={8} 
                  height={8} 
                  borderRadius={4}
                  bg="white"
                />
                <Text fontSize={11} color="white" fontWeight="700">
                  {isAhead ? 'En avance' : 'En retard'}
                </Text>
              </XStack>
            </XStack>

            {/* Boutons de sélection de période */}
            <XStack gap="$2" justifyContent="center">
              <Button
                size="$2"
                backgroundColor={timeRange === 'week' ? '$primary' : '$backgroundHover'}
                borderColor={timeRange === 'week' ? '$primary' : '$borderColor'}
                borderWidth={1}
                onPress={() => setTimeRange('week')}
                pressStyle={{ scale: 0.95 }}
                flex={1}
              >
                <XStack gap="$1" alignItems="center">
                  <Calendar size={12} color={timeRange === 'week' ? 'white' : '$colorMuted'} />
                  <Text fontSize={11} fontWeight="600" color={timeRange === 'week' ? 'white' : '$color'}>
                    7j
                  </Text>
                </XStack>
              </Button>
              <Button
                size="$2"
                backgroundColor={timeRange === 'month' ? '$primary' : '$backgroundHover'}
                borderColor={timeRange === 'month' ? '$primary' : '$borderColor'}
                borderWidth={1}
                onPress={() => setTimeRange('month')}
                pressStyle={{ scale: 0.95 }}
                flex={1}
              >
                <XStack gap="$1" alignItems="center">
                  <TrendingUp size={12} color={timeRange === 'month' ? 'white' : '$colorMuted'} />
                  <Text fontSize={11} fontWeight="600" color={timeRange === 'month' ? 'white' : '$color'}>
                    30j
                  </Text>
                </XStack>
              </Button>
              <Button
                size="$2"
                backgroundColor={timeRange === 'year' ? '$primary' : '$backgroundHover'}
                borderColor={timeRange === 'year' ? '$primary' : '$borderColor'}
                borderWidth={1}
                onPress={() => setTimeRange('year')}
                pressStyle={{ scale: 0.95 }}
                flex={1}
              >
                <XStack gap="$1" alignItems="center">
                  <BarChart3 size={12} color={timeRange === 'year' ? 'white' : '$colorMuted'} />
                  <Text fontSize={11} fontWeight="600" color={timeRange === 'year' ? 'white' : '$color'}>
                    Année
                  </Text>
                </XStack>
              </Button>
            </XStack>
          </YStack>

          <XStack gap="$3" px="$2">
            <XStack alignItems="center" gap="$2">
              <YStack width={12} height={3} bg="#6366f1" borderRadius={2} />
              <Text fontSize={11} color="$color" opacity={0.7}>Théorique</Text>
            </XStack>
            <XStack alignItems="center" gap="$2">
              <YStack width={12} height={3} bg={isAhead ? '#10b981' : '#ef4444'} borderRadius={2} />
              <Text fontSize={11} color="$color" opacity={0.7}>Réel</Text>
            </XStack>
          </XStack>

          <LineChart
            data={chartData.realData}
            data2={chartData.theoreticalData}
            height={200}
            width={chartWidth}
            spacing={chartData.realData.length > 20 ? 12 : 18}
            initialSpacing={5}
            endSpacing={5}
            color1={isAhead ? '#10b981' : '#ef4444'}
            color2="#6366f1"
            thickness={3}
            curved
            hideDataPoints={chartData.realData.length > 30}
            dataPointsHeight={6}
            dataPointsWidth={6}
            dataPointsColor1={isAhead ? '#10b981' : '#ef4444'}
            dataPointsColor2="#6366f1"
            yAxisTextStyle={{ color: theme.color.val, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: theme.color.val, fontSize: 10 }}
            yAxisColor={theme.borderColor.val}
            xAxisColor={theme.borderColor.val}
            backgroundColor={theme.background.val}
            noOfSections={4}
            maxValue={chartData.maxValue * 1.1}
          />

          {/* Stats détaillées en dessous */}
          <XStack justifyContent="space-around" pt="$2" borderTopWidth={1} borderTopColor="$borderColor" flexWrap="wrap" gap="$2">
            <YStack alignItems="center" gap="$1" minWidth="30%">
              <Text fontSize={10} color="$color" opacity={0.6}>Taux</Text>
              <Text fontFamily="$heading" fontSize={16} color={isAhead ? '$success' : '$danger'}>
                {chartData.stats.completionRate}%
              </Text>
            </YStack>
            <YStack alignItems="center" gap="$1" minWidth="30%">
              <Text fontSize={10} color="$color" opacity={0.6}>Moy/jour</Text>
              <Text fontFamily="$heading" fontSize={16} color="$primary">
                {Math.round(chartData.stats.avgDaily)}
              </Text>
            </YStack>
            <YStack alignItems="center" gap="$1" minWidth="30%">
              <Text fontSize={10} color="$color" opacity={0.6}>Écart</Text>
              <Text fontFamily="$heading" fontSize={16} color={isAhead ? '$success' : '$danger'}>
                {isAhead ? '+' : ''}{(chartData.realData[chartData.realData.length - 1]?.value - chartData.theoreticalData[chartData.theoreticalData.length - 1]?.value).toLocaleString()}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </Card>
    );
}
