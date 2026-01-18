import { ImageSourcePropType } from "react-native";
import { Card, H4, Image, YStack } from "tamagui";

interface CardButtonProps {
    logo: ImageSourcePropType | undefined;
    title: string;
    onClick: () => void;
}

export const CardButton: React.FC<CardButtonProps> = ({ logo, title, onClick }) => {
    return (
        <Card
            bordered
            animation="bouncy"
            scale={0.96}
            hoverStyle={{ scale: 0.98 }}
            pressStyle={{ scale: 0.94 }}
            onPress={onClick}
            height={180}
            bg="$orange9"
            borderRadius="$6"
            overflow="hidden"
        >
            <YStack flex={1} alignItems="center" justifyContent="space-between" p="$4">
                <Image
                    source={logo}
                    style={{ width: 100, height: 100 }}
                    objectFit="contain"
                />
                <H4 color="white" fontWeight="300" opacity={0.9}>{title}</H4>
            </YStack>
        </Card>
    );
}


