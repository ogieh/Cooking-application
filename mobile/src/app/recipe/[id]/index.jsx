import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { ChevronLeft, Clock, ChefHat, Play, Heart } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const response = await fetch(`/api/recipes/${id}`);
      if (!response.ok) throw new Error("Failed to fetch recipe");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!recipe) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: recipe.image_url }}
            style={{ width: "100%", height: 400 }}
            contentFit="cover"
          />
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: insets.top + 10,
              left: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.8)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: insets.top + 10,
              right: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.8)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: -30,
            backgroundColor: "#fff",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
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
                fontSize: 14,
                fontWeight: "bold",
                color: "#FF6B6B",
                textTransform: "uppercase",
              }}
            >
              {recipe.cuisine}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ChefHat size={16} color="#9CA3AF" />
              <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>
                {recipe.difficulty}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 12,
            }}
          >
            {recipe.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              lineHeight: 24,
              marginBottom: 24,
            }}
          >
            {recipe.description}
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 32,
              backgroundColor: "#F9FAFB",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#E5E7EB",
              }}
            >
              <Clock size={20} color="#6B7280" />
              <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                Time
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#111827",
                  marginTop: 2,
                }}
              >
                {recipe.prep_time + recipe.cook_time}m
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <ChefHat size={20} color="#6B7280" />
              <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                Servings
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#111827",
                  marginTop: 2,
                }}
              >
                {recipe.servings}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Ingredients
          </Text>
          {recipe.ingredients?.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FF6B6B",
                  marginRight: 12,
                }}
              />
              <Text style={{ flex: 1, fontSize: 16, color: "#4B5563" }}>
                {item.name}
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}
              >
                {item.amount} {item.unit}
              </Text>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          paddingTop: 20,
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(`/recipe/${id}/cook`)}
          style={{
            backgroundColor: "#FF6B6B",
            height: 56,
            borderRadius: 28,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#FF6B6B",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Play size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
            Start Cooking
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
