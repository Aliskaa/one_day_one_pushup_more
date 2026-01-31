import { DayDataType } from '@/types/day';
import { TrendingUp, TrendingDown, Minus } from '@tamagui/lucide-icons';
import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Card, Text, useTheme, XStack, YStack } from 'tamagui';

interface TrendChartProps {
  days: DayDataType[];
  todayIndex: number;
}

export function TrendChart({ days, todayIndex }: TrendChartProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  
  const chartWidth = Math.min(width - 100, 350);

  const trendData = useMemo(() => {
    // Analyser les 4 dernières semaines
    const weeks: { weekNum: number; total: number; target: number; avg: number }[] = [];
    
    for (let i = 0; i < 4; i++) {
      const weekEnd = todayIndex - (i * 7);
      const weekStart = Math.max(0, weekEnd - 6);
      
      if (weekStart < 0) continue;
      
      const weekDays = days.slice(weekStart, weekEnd + 1);
      const total = weekDays.reduce((sum, d) => sum + (d.done || 0), 0);
      const target = weekDays.reduce((sum, d) => sum + d.target, 0);
      const avg = total / weekDays.length;
      
      weeks.unshift({
        weekNum: 4 - i,
        total,
        target,
        avg
      });
    }

    // Préparer les données pour le graphique
    const barData = weeks.map((week, index) => {
      const completionRate = week.target > 0 ? (week.total / week.target) : 0;
      const color = completionRate >= 1 ? '#10b981' : completionRate >= 0.8 ? '#f59e0b' : '#ef4444';
      
      return {
        value: week.total,
        label: `S${week.weekNum}`,
        frontColor: color,
        labelTextStyle: { color: theme.color.val, fontSize: 10 },
        topLabelComponent: () => (
          <Text fontSize={10} fontWeight="600" color={color}>
            {Math.round(week.avg)}
          </Text>
        ),
      };
    });

    // Calculer la tendance
    const firstWeek = weeks[0]?.avg || 0;
    const lastWeek = weeks[weeks.length - 1]?.avg || 0;
    const trend = lastWeek - firstWeek;
    const trendPercent = firstWeek > 0 ? ((trend / firstWeek) * 100) : 0;

    return {
      barData,
      trend,
      trendPercent,
      weeks
    };
  }, [days, todayIndex, theme]);

  const trendDirection = trendData.trend > 0 ? 'up' : trendData.trend < 0 ? 'down' : 'stable';

  return (
    <Card elevate p="$4" borderRadius={24} bg="$background" animation="lazy">
      <YStack gap="$3">
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$2">
            <TrendingUp size={16} color="$primary" />
            <Text fontSize={14} fontWeight="600" color="$color" opacity={0.7}>
              Tendance (4 semaines)
            </Text>
          </XStack>
          
          <XStack 
            bg={trendDirection === 'up' ? '$success' : trendDirection === 'down' ? '$danger' : '$backgroundHover'} 
            px="$3" 
            py="$1.5" 
            borderRadius={12}
            alignItems="center" 
            gap="$2"
          >
            {trendDirection === 'up' && <TrendingUp size={14} color="white" />}
            {trendDirection === 'down' && <TrendingDown size={14} color="white" />}
            {trendDirection === 'stable' && <Minus size={14} color="$colorMuted" />}
            <Text 
              fontSize={11} 
              color={trendDirection === 'stable' ? '$colorMuted' : 'white'} 
              fontWeight="700"
            >
              {trendDirection === 'up' ? '+' : ''}{Math.round(trendData.trendPercent)}%
            </Text>
          </XStack>
        </XStack>

        {/* Graphique en barres */}
        <YStack alignItems="center" paddingVertical="$2">
          <BarChart
            data={trendData.barData}
            height={160}
            width={chartWidth}
            barWidth={Math.min(50, chartWidth / 6)}
            spacing={Math.min(30, chartWidth / 8)}
            noOfSections={4}
            yAxisTextStyle={{ color: theme.color.val, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: theme.color.val, fontSize: 10 }}
            yAxisColor={theme.borderColor.val}
            xAxisColor={theme.borderColor.val}
            isAnimated
            animationDuration={800}
            showGradient
            gradientColor={theme.background.val}
          />
        </YStack>

        {/* Stats de tendance */}
        <XStack justifyContent="space-around" pt="$2" borderTopWidth={1} borderTopColor="$borderColor">
          <YStack alignItems="center" gap="$1">
            <Text fontSize={10} color="$color" opacity={0.6}>Semaine 1</Text>
            <Text fontFamily="$heading" fontSize={14} color="$color">
              {Math.round(trendData.weeks[0]?.avg || 0)}/j
            </Text>
          </YStack>
          <YStack alignItems="center" gap="$1">
            <Text fontSize={10} color="$color" opacity={0.6}>Semaine 4</Text>
            <Text fontFamily="$heading" fontSize={14} color="$color">
              {Math.round(trendData.weeks[3]?.avg || 0)}/j
            </Text>
          </YStack>
          <YStack alignItems="center" gap="$1">
            <Text fontSize={10} color="$color" opacity={0.6}>Évolution</Text>
            <Text 
              fontFamily="$heading" 
              fontSize={14} 
              color={trendDirection === 'up' ? '$success' : trendDirection === 'down' ? '$danger' : '$color'}
            >
              {trendDirection === 'up' ? '+' : ''}{Math.round(trendData.trend)}/j
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </Card>
  );
}
