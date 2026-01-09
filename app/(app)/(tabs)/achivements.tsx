import { YStack, Text, Card, XStack, H2, ScrollView, Progress } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, Award, Zap, Heart, TrendingUp, Calendar } from '@tamagui/lucide-icons';

export default function TabTwoScreen() {
  const achievements = [
    { title: '7 jours consécutifs', desc: 'Une semaine complète !', icon: Calendar, unlocked: true, color: '#FF9800' },
    { title: '100 pompes en un jour', desc: 'Force maximale', icon: Zap, unlocked: true, color: '#FFC107' },
    { title: 'Jamais en dette', desc: 'Toujours à jour', icon: TrendingUp, unlocked: false, color: '#4CAF50' },
    { title: '30 jours consécutifs', desc: 'Mois parfait', icon: Award, unlocked: false, color: '#2196F3' },
    { title: '500 pompes total', desc: 'Dépassé !', icon: Target, unlocked: true, color: '#9C27B0' },
    { title: 'Cœur de champion', desc: '365 jours complets', icon: Heart, unlocked: false, color: '#E91E63' },
  ];

  const weekProgress = [
    { day: 'L', done: 45, target: 50, percent: 90 },
    { day: 'M', done: 51, target: 51, percent: 100 },
    { day: 'M', done: 52, target: 52, percent: 100 },
    { day: 'J', done: 53, target: 53, percent: 100 },
    { day: 'V', done: 54, target: 54, percent: 100 },
    { day: 'S', done: 30, target: 55, percent: 55 },
    { day: 'D', done: 0, target: 56, percent: 0 },
  ];

  return (
    <ScrollView bg="$background" showsVerticalScrollIndicator={false}>
      <YStack p="$4" gap="$4" pb="$8">
        {/* Header */}
        <Card elevate size="$4" p="$0" overflow="hidden" borderRadius={25}>
          <LinearGradient
            colors={['#9C27B0', '#E91E63']}
            style={{ padding: 24 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <YStack gap="$2" items="center">
              <YStack
                width={70}
                height={70}
                rounded="$8"
                bg="rgba(255,255,255,0.2)"
                items="center"
                justify="center"
              >
                <Award size={40} color="#fff" />
              </YStack>
              <H2 color="#fff" fontSize={28} fontWeight="900" verticalAlign="center">
                Accomplissements
              </H2>
              <Text color="rgba(255,255,255,0.9)" fontSize={14} verticalAlign="center">
                5 / 6 débloqués
              </Text>
            </YStack>
          </LinearGradient>
        </Card>

        {/* Progrès de la semaine */}
        <YStack gap="$3">
          <Text fontSize={18} fontWeight="800" color="$purple12">
            📅 Cette semaine
          </Text>
          
          <Card elevate p="$4" borderRadius={20}>
            <XStack gap="$2" justify="space-between">
              {weekProgress.map((day, idx) => (
                <YStack key={idx} items="center" gap="$2" flex={1}>
                  <Text fontSize={12} fontWeight="700" color="$purple11">
                    {day.day}
                  </Text>
                  <YStack
                    height={4}
                    width="100%"
                    maxW={40}
                    background="$purple3"
                    rounded={8}
                    justify="flex-end"
                    overflow="hidden"
                  >
                    <YStack
                      height={`${day.percent}%`}
                      background={day.percent === 100 ? '$green9' : day.percent > 0 ? '$orange9' : '$purple5'}
                    />
                  </YStack>
                  <Text fontSize={10} color="$purple10" fontWeight="600">
                    {day.done}
                  </Text>
                </YStack>
              ))}
            </XStack>
          </Card>
        </YStack>

        {/* Badges */}
        <YStack gap="$3">
          <Text fontSize={18} fontWeight="800" color="$purple12">
            🏆 Badges
          </Text>
          
          {achievements.map((achievement, idx) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={idx}
                elevate={achievement.unlocked}
                p="$4"
                borderRadius={20}
                background={achievement.unlocked ? '$background' : '$purple2'}
                opacity={achievement.unlocked ? 1 : 0.6}
                borderStartWidth={4}
                borderStartColor={achievement.unlocked ? achievement.color : '$purple6'}
              >
                <XStack items="center" gap="$3">
                  <YStack
                    width={50}
                    height={50}
                    rounded={25}
                    background={achievement.unlocked ? achievement.color : '$purple6'}
                    items="center"
                    justify="center"
                  >
                    <Icon size={26} color="#fff" />
                  </YStack>
                  
                  <YStack flex={1} gap="$1">
                    <Text fontSize={16} fontWeight="800" color="$purple12">
                      {achievement.title}
                    </Text>
                    <Text fontSize={13} color="$purple11">
                      {achievement.desc}
                    </Text>
                  </YStack>
                  
                  {achievement.unlocked && (
                    <YStack
                      width={30}
                      height={30}
                      rounded={15}
                      background="$green9"
                      items="center"
                      justify="center"
                    >
                      <Text fontSize={18}>✓</Text>
                    </YStack>
                  )}
                </XStack>
              </Card>
            );
          })}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
