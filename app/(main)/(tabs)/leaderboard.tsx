import { Award, Crown, Medal, RefreshCw, TrendingUp, Users, Zap, Upload } from "@tamagui/lucide-icons";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Card, H2, H3, Separator, ScrollView, Spinner, Text, XStack, YStack } from "tamagui";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useTraining } from "@/contexts/TrainingContext";
import { LeaderboardEntry, LeaderboardSortBy } from "@/types/leaderboard";
import { ActivityIndicator } from "react-native";
import { useSyncToLeaderboard } from "@/hooks/useSyncToLeaderboard";
import { useToastController } from "@tamagui/toast";
import { useState } from "react";

// Composant pour une entrée du leaderboard
const LeaderboardRow = ({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }) => {
    const { profile, stats, rank } = entry;
    
    // Icônes et couleurs selon le rang
    const getRankDisplay = () => {
        if (rank === 1) return { icon: <Crown size={24} color="#FFD700" />, color: "$amber200" };
        if (rank === 2) return { icon: <Medal size={24} color="#C0C0C0" />, color: "$gray200" };
        if (rank === 3) return { icon: <Medal size={24} color="#CD7F32" />, color: "$orange200" };
        return { icon: null, color: "$color" };
    };

    const { icon, color } = getRankDisplay();

    return (
        <Card
            backgroundColor={isCurrentUser ? "$amber50" : "$background"}
            borderWidth={isCurrentUser ? 2 : 1}
            borderColor={isCurrentUser ? "$amber400" : "$borderColor"}
            padding="$3"
            marginBottom="$2"
            animation="quick"
            pressStyle={{ scale: 0.98 }}
        >
            <XStack alignItems="center" gap="$3">
                {/* Rang */}
                <YStack width={40} alignItems="center">
                    {icon ? (
                        icon
                    ) : (
                        <Text fontSize={20} fontWeight="bold" color={color}>
                            #{rank}
                        </Text>
                    )}
                </YStack>

                {/* Avatar */}
                <Avatar circular size="$5">
                    <Avatar.Image source={{ uri: profile.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/png?seed=' + profile.userId }} />
                    <Avatar.Fallback backgroundColor="$amber200" />
                </Avatar>

                {/* Infos utilisateur */}
                <YStack flex={1}>
                    <XStack alignItems="center" gap="$2">
                        {isCurrentUser && (
                            <Text fontSize={12} color="$amber500" fontWeight="600">
                                (Vous)
                            </Text>
                        )}
                    </XStack>
                    <XStack gap="$3" marginTop="$1">
                        <XStack alignItems="center" gap="$1">
                            <TrendingUp size={14} color="$colorMuted" />
                            <Text fontSize={13} color="$colorMuted">
                                {stats.totalDone.toLocaleString()}
                            </Text>
                        </XStack>
                        <XStack alignItems="center" gap="$1">
                            <Zap size={14} color="$colorMuted" />
                            <Text fontSize={13} color="$colorMuted">
                                {stats.currentStreak}j
                            </Text>
                        </XStack>
                    </XStack>
                </YStack>

                {/* Stats principales */}
                <YStack alignItems="flex-end">
                    <Text fontSize={18} fontWeight="800" color="$amber500">
                        {stats.totalDone.toLocaleString()}
                    </Text>
                    <Text fontSize={12} color="$colorMuted">
                        Total
                    </Text>
                </YStack>
            </XStack>
        </Card>
    );
};

export default function Leaderboard() {
    const { user } = useUser();
    const { trainingType } = useTraining();
    const { entries, loading, error, sortBy, setSortBy, refresh } = useLeaderboard();
    const { syncCurrentTraining, syncing } = useSyncToLeaderboard();
    const toast = useToastController();
    const [showSyncHint, setShowSyncHint] = useState(true);

    // Vérifier si l'utilisateur est dans le classement
    const isUserInLeaderboard = entries.some(entry => entry.profile.userId === user?.id);

    const handleSync = async () => {
        await syncCurrentTraining();
        toast.show('✅ Synchronisé', {
            message: 'Vos données ont été publiées dans le classement',
            duration: 3000,
        });
        setShowSyncHint(false);
        // Rafraîchir le leaderboard après sync
        setTimeout(() => refresh(), 1000);
    };

    const sortOptions: { value: LeaderboardSortBy; label: string; icon: any }[] = [
        { value: 'totalDone', label: 'Total', icon: TrendingUp },
        { value: 'currentStreak', label: 'Série', icon: Zap },
        { value: 'bestStreak', label: 'Record', icon: Award },
    ];

    return (
        <YStack flex={1} backgroundColor="$backgroundHover">
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <YStack padding="$4" gap="$5" paddingBottom="$10">

                        {/* HEADER */}
                        <YStack gap="$2" alignItems="center" paddingTop="$2">
                            <Users size={48} color="$amber200" />
                            <H2 fontSize={28} fontWeight="800" color="$color" fontFamily="$heading">
                                Classement
                            </H2>
                            <Text fontSize={14} color="$colorMuted" textAlign="center" fontFamily="$body">
                                Comparez vos performances avec les autres membres de la communauté
                            </Text>
                        </YStack>

                        {/* FILTRES DE TRI */}
                        <Card backgroundColor="$background" padding="$3">
                            <Text fontSize={14} fontWeight="600" color="$color" marginBottom="$2">
                                Trier par :
                            </Text>
                            <XStack gap="$2" flexWrap="wrap">
                                {sortOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        size="$3"
                                        backgroundColor={sortBy === option.value ? "$amber200" : "$backgroundHover"}
                                        color={sortBy === option.value ? "$amber900" : "$color"}
                                        borderWidth={1}
                                        borderColor={sortBy === option.value ? "$amber400" : "$borderColor"}
                                        onPress={() => setSortBy(option.value)}
                                        icon={<option.icon size={16} />}
                                        pressStyle={{ scale: 0.95 }}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                                <Button
                                    size="$3"
                                    backgroundColor="$backgroundHover"
                                    borderWidth={1}
                                    borderColor="$borderColor"
                                    icon={<RefreshCw size={16} />}
                                    onPress={refresh}
                                    disabled={loading}
                                    pressStyle={{ scale: 0.95 }}
                                >
                                    Rafraîchir
                                </Button>
                            </XStack>
                        </Card>

                        {/* CONTENU */}
                        {loading ? (
                            <YStack padding="$8" alignItems="center">
                                <Spinner size="large" color="$amber200" />
                                <Text marginTop="$3" color="$colorMuted">
                                    Chargement du classement...
                                </Text>
                            </YStack>
                        ) : error ? (
                            <Card backgroundColor="$red50" padding="$4" borderWidth={1} borderColor="$red200">
                                <YStack gap="$3">
                                    <Text color="$red700" fontWeight="600" textAlign="center">
                                        ⚠️ Configuration requise
                                    </Text>
                                    <Text color="$red600" textAlign="center" fontSize={14}>
                                        {error}
                                    </Text>
                                    {error.includes('Firebase') && (
                                        <YStack gap="$2" marginTop="$2" backgroundColor="$red100" padding="$3" borderRadius="$4">
                                            <Text color="$red700" fontSize={13} fontWeight="600">
                                                📝 Solution :
                                            </Text>
                                            <Text color="$red700" fontSize={12}>
                                                1. Ouvrez la console Firebase{'\n'}
                                                2. Créez les index requis (détails dans FIREBASE_INDEX_SETUP.md){'\n'}
                                                3. Attendez 1-2 minutes{'\n'}
                                                4. Rafraîchissez l'app
                                            </Text>
                                            <Text color="$red600" fontSize={11} marginTop="$2" fontStyle="italic">
                                                💡 Firebase fournit un lien direct dans les logs pour créer l'index automatiquement
                                            </Text>
                                        </YStack>
                                    )}
                                </YStack>
                            </Card>
                        ) : entries.length === 0 ? (
                            <Card backgroundColor="$background" padding="$6">
                                <YStack alignItems="center" gap="$2">
                                    <Users size={48} color="$colorMuted" />
                                    <H3 color="$color">Aucune donnée</H3>
                                    <Text color="$colorMuted" textAlign="center">
                                        Soyez le premier à apparaître dans le classement !
                                    </Text>
                                </YStack>
                            </Card>
                        ) : (
                            <YStack gap="$1">
                                <Text fontSize={13} color="$colorMuted" marginBottom="$2" marginLeft="$2">
                                    {entries.length} participant{entries.length > 1 ? 's' : ''}

                        {/* SYNC HINT - Si l'utilisateur n'est pas dans le leaderboard */}
                        {!loading && !isUserInLeaderboard && showSyncHint && (
                            <Card backgroundColor="$amber50" padding="$4" borderWidth={1} borderColor="$amber200">
                                <YStack gap="$3">
                                    <XStack alignItems="center" gap="$2">
                                        <Upload size={20} color="$amber700" />
                                        <Text fontSize={14} fontWeight="600" color="$amber700">
                                            Vous n'apparaissez pas encore
                                        </Text>
                                    </XStack>
                                    <Text fontSize={13} color="$amber600">
                                        Synchronisez vos données existantes pour apparaître dans le classement
                                    </Text>
                                    <XStack gap="$2">
                                        <Button
                                            flex={1}
                                            size="$3"
                                            backgroundColor="$amber500"
                                            color="white"
                                            icon={syncing ? <Spinner size="small" color="white" /> : <Upload size={16} />}
                                            onPress={handleSync}
                                            disabled={syncing}
                                            pressStyle={{ opacity: 0.8 }}
                                        >
                                            {syncing ? 'Synchronisation...' : 'Synchroniser'}
                                        </Button>
                                        <Button
                                            size="$3"
                                            backgroundColor="$amber100"
                                            color="$amber700"
                                            onPress={() => setShowSyncHint(false)}
                                            pressStyle={{ opacity: 0.8 }}
                                        >
                                            Plus tard
                                        </Button>
                                    </XStack>
                                </YStack>
                            </Card>
                        )}
                                </Text>
                                {entries.map((entry) => (
                                    <LeaderboardRow
                                        key={entry.profile.userId}
                                        entry={entry}
                                        isCurrentUser={entry.profile.userId === user?.id}
                                    />
                                ))}
                            </YStack>
                        )}

                        {/* INFO */}
                        <Card backgroundColor="$blue50" padding="$3" borderWidth={1} borderColor="$blue200">
                            <Text fontSize={13} color="$blue700" textAlign="center">
                                💡 Votre position est mise à jour automatiquement à chaque entraînement
                            </Text>
                        </Card>
                    </YStack>
                </ScrollView>
            </SafeAreaView>
        </YStack>
    );
}