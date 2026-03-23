import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heart } from "lucide-react-native";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Heart size={64} color="#E5E7EB" />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#111827",
          marginTop: 20,
        }}
      >
        Your Favorites
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Recipes you save will appear here. Start exploring!
      </Text>
    </View>
  );
}
