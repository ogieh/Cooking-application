import { Image } from "expo-image";
import { Link } from "expo-router";
import { Clock, ChefHat } from "lucide-react-native";
import { Text, View, Pressable } from "react-native";

export default function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipe/${recipe.id}`} asChild>
      <Pressable
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#f3f4f6",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Image
          source={{ uri: recipe.image_url }}
          style={{ width: "100%", height: 200 }}
          contentFit="cover"
          transition={200}
        />
        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#FF6B6B",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {recipe.cuisine}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f9fafb",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <ChefHat size={12} color="#6B7280" />
              <Text
                style={{
                  fontSize: 10,
                  color: "#6B7280",
                  marginLeft: 4,
                  fontWeight: "500",
                }}
              >
                {recipe.difficulty}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 4,
            }}
            numberOfLines={1}
          >
            {recipe.title}
          </Text>
          <Text
            style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}
            numberOfLines={2}
          >
            {recipe.description}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Clock size={14} color="#9CA3AF" />
              <Text style={{ fontSize: 12, color: "#6B7280", marginLeft: 4 }}>
                {recipe.prep_time + recipe.cook_time} mins
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ChefHat size={14} color="#9CA3AF" />
              <Text style={{ fontSize: 12, color: "#6B7280", marginLeft: 4 }}>
                {recipe.servings} servings
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
