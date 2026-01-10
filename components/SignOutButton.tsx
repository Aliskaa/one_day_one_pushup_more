import { useClerk } from "@clerk/clerk-expo";
import { Alert } from "react-native";
import { Button, Text, Spinner, XStack } from "tamagui";
import { LogOut } from "@tamagui/lucide-icons";
import { useState } from "react";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      "Déconnexion",
      "Es-tu sûr de vouloir te déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await signOut();
            // La redirection est gérée par le contexte d'auth
            setLoading(false);
          },
        },
      ]
    );
  };

  return (
    <Button 
      bg="$danger" 
      color="white"
      size="$4" 
      borderRadius={12}
      onPress={handleSignOut}
      animation="bouncy"
      pressStyle={{ scale: 0.95, opacity: 0.8 }}
      icon={loading ? <Spinner color="white" /> : <LogOut size={18} />}
      disabled={loading}
    >
      <Text fontFamily="$heading" fontWeight="700" color="white">
        {loading ? "Au revoir..." : "Se déconnecter"}
      </Text>
    </Button>
  );
};