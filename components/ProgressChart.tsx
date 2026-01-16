import { DayDataType } from '@/types/day';
import { BarChart3 } from '@tamagui/lucide-icons';
import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Card, Text, useTheme, XStack, YStack } from 'tamagui';

interface ProgressChartProps {
  days: DayDataType[];
  todayIndex: number;
}

export function ProgressChart({ days, todayIndex }: ProgressChartProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  
  // Calculer la largeur disponible pour le graphe (largeur écran - padding)
  const chartWidth = Math.min(width - 120, 350);

  const chartData = useMemo(() => {
    // Prendre les données depuis le début de l'année jusqu'à aujourd'hui
    const relevantDays = days.slice(0, todayIndex + 1);
    
    let theoreticalCumul = 0;
    let realCumul = 0;
    
    const theoreticalData: any[] = [];
    const realData: any[] = [];
    
    relevantDays.forEach((day, index) => {
      theoreticalCumul += day.target;
      realCumul += day.done || 0;
      
      // On prend 1 point tous les 1-2 jours pour ne pas surcharger le graphe
      // Mais on garde toujours le dernier point (aujourd'hui)
      const shouldInclude = index === 0 || index === relevantDays.length - 1 || index % 2 === 0;
      
      if (shouldInclude) {
        theoreticalData.push({
          value: theoreticalCumul,
          label: index === 0 || index === relevantDays.length - 1 ? `J${day.dayNum}` : '',
          labelTextStyle: { color: theme.color.val, fontSize: 10 },
        });
        
        realData.push({
          value: realCumul,
          label: '',
        });
      }
    });

    const maxVal = Math.max(theoreticalCumul, realCumul);

    return { theoreticalData, realData, maxValue: maxVal };
  }, [days, todayIndex, theme]);

  const isAhead = useMemo(() => {
    const lastReal = chartData.realData[chartData.realData.length - 1]?.value || 0;
    const lastTheoretical = chartData.theoreticalData[chartData.theoreticalData.length - 1]?.value || 0;
    return lastReal >= lastTheoretical;
  }, [chartData]);

    return (
      <Card elevate p="$4" borderRadius={24} bg="$background" animation="lazy" borderTopWidth={4} borderTopColor={isAhead ? "$success" : "$danger"} >
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
          <XStack justifyContent="space-around" pt="$2" borderTopWidth={1} borderTopColor="$borderColor">
            <YStack alignItems="center" gap="$1">
              <Text fontSize={10} color="$color" opacity={0.6}>Cumul théorique</Text>
              <Text fontFamily="$heading" fontSize={16} color="$primary">
                {chartData.theoreticalData[chartData.theoreticalData.length - 1]?.value.toLocaleString()}
              </Text>
            </YStack>
            <YStack alignItems="center" gap="$1">
              <Text fontSize={10} color="$color" opacity={0.6}>Cumul réel</Text>
              <Text fontFamily="$heading" fontSize={16} color={isAhead ? '$success' : '$danger'}>
                {chartData.realData[chartData.realData.length - 1]?.value.toLocaleString()}
              </Text>
            </YStack>
            <YStack alignItems="center" gap="$1">
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
