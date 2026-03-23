import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  Filter,
  ChefHat,
  X,
  AlertCircle,
  Globe,
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecipeCard from "../../components/RecipeCard";

const CACHE_KEY = "cached_recipes";

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [cachedRecipes, setCachedRecipes] = useState([]);
  const [ingredientMode, setIngredientMode] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [matchedRecipes, setMatchedRecipes] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState(null);
  const [onlineMode, setOnlineMode] = useState(true);
  const [onlineRecipes, setOnlineRecipes] = useState([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  const {
    data: recipes,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await fetch("/api/recipes");
      if (!response.ok) throw new Error("Failed to fetch recipes");
      const data = await response.json();
      // Cache the fetched data
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    },
    onError: async () => {
      // If offline or error, try to load from cache
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) setCachedRecipes(JSON.parse(cached));
    },
  });

  useEffect(() => {
    const loadCache = async () => {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) setCachedRecipes(JSON.parse(cached));
    };
    loadCache();
  }, []);

  // Auto-search when ingredients change
  useEffect(() => {
    if (ingredients.length > 0 && ingredientMode) {
      findMatchingRecipes();
    } else if (ingredients.length === 0) {
      setMatchedRecipes(null);
    }
  }, [ingredients, ingredientMode]);

  // Search online when user types in browse mode
  useEffect(() => {
    if (!ingredientMode && onlineMode && search) {
      const timer = setTimeout(() => {
        searchOnlineRecipes();
      }, 800); // Debounce search
      return () => clearTimeout(timer);
    } else if (!search) {
      setOnlineRecipes([]);
    }
  }, [search, ingredientMode, onlineMode]);

  const searchOnlineRecipes = async () => {
    if (!search.trim()) {
      setOnlineRecipes([]);
      return;
    }

    setIsSearchingOnline(true);
    try {
      const response = await fetch(
        `/api/recipes/search?query=${encodeURIComponent(search)}`,
      );
      if (!response.ok) throw new Error("Failed to search online");
      const data = await response.json();
      setOnlineRecipes(data);
    } catch (error) {
      console.error("Error searching online:", error);
      Alert.alert(
        "Search Error",
        "Could not search online recipes. Please check your connection.",
      );
    } finally {
      setIsSearchingOnline(false);
    }
  };

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed.toLowerCase()]);
      setIngredientInput("");
      Keyboard.dismiss();
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const findMatchingRecipes = async () => {
    if (ingredients.length === 0) return;

    setIsMatching(true);
    setMatchError(null);
    try {
      console.log("Searching for recipes with ingredients:", ingredients);
      const endpoint = onlineMode
        ? "/api/recipes/match-online"
        : "/api/recipes/match";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to match recipes");
      }

      const data = await response.json();
      console.log("Found matching recipes:", data.length);
      setMatchedRecipes(data);
    } catch (error) {
      console.error("Error matching recipes:", error);
      setMatchError(error.message);
      Alert.alert(
        "Search Error",
        onlineMode
          ? "Could not search online. Please check your connection."
          : "Could not find matching recipes. Please try again.",
      );
    } finally {
      setIsMatching(false);
    }
  };

  const clearIngredientSearch = () => {
    setIngredients([]);
    setMatchedRecipes(null);
    setIngredientInput("");
    setMatchError(null);
  };

  const displayRecipes =
    ingredientMode && matchedRecipes
      ? matchedRecipes
      : onlineMode && !ingredientMode && search
        ? onlineRecipes
        : recipes || cachedRecipes;

  const filteredRecipes =
    !ingredientMode && !onlineMode
      ? displayRecipes?.filter(
          (r) =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.cuisine?.toLowerCase().includes(search.toLowerCase()),
        )
      : displayRecipes;

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: insets.top }}
    >
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 4,
          }}
        >
          Global Flavors
        </Text>
        <Text style={{ fontSize: 16, color: "#6B7280", marginBottom: 16 }}>
          {ingredientMode
            ? onlineMode
              ? "Find recipes online with your ingredients"
              : "Find recipes with your ingredients"
            : onlineMode
              ? "Search millions of recipes online"
              : "Discover recipes from around the world"}
        </Text>

        {/* Online/Local Toggle */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 12,
            gap: 8,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setOnlineMode(!onlineMode)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: onlineMode ? "#10B981" : "#E5E7EB",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              gap: 6,
            }}
          >
            <Globe size={16} color={onlineMode ? "#fff" : "#6B7280"} />
            <Text
              style={{
                color: onlineMode ? "#fff" : "#6B7280",
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              {onlineMode ? "Online Search" : "Local Only"}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "#9CA3AF", fontSize: 12, flex: 1 }}>
            {onlineMode
              ? "Searching millions of recipes"
              : "Browsing saved recipes"}
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={{ flexDirection: "row", marginBottom: 16, gap: 8 }}>
          <TouchableOpacity
            onPress={() => {
              setIngredientMode(false);
              clearIngredientSearch();
            }}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: !ingredientMode ? "#FF6B6B" : "#fff",
              borderWidth: 1,
              borderColor: !ingredientMode ? "#FF6B6B" : "#E5E7EB",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: !ingredientMode ? "#fff" : "#6B7280",
                fontWeight: "600",
                fontSize: 15,
              }}
            >
              Browse All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIngredientMode(true)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: ingredientMode ? "#FF6B6B" : "#fff",
              borderWidth: 1,
              borderColor: ingredientMode ? "#FF6B6B" : "#E5E7EB",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <ChefHat size={18} color={ingredientMode ? "#fff" : "#6B7280"} />
            <Text
              style={{
                color: ingredientMode ? "#fff" : "#6B7280",
                fontWeight: "600",
                fontSize: 15,
              }}
            >
              Ingredient Match
            </Text>
          </TouchableOpacity>
        </View>

        {ingredientMode ? (
          <View>
            {/* Ingredient Input */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 12,
                paddingHorizontal: 12,
                height: 48,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
                marginBottom: 12,
              }}
            >
              <TextInput
                placeholder="Add ingredient (e.g., chicken, rice)..."
                style={{ flex: 1, fontSize: 16, color: "#111827" }}
                value={ingredientInput}
                onChangeText={setIngredientInput}
                onSubmitEditing={addIngredient}
                returnKeyType="done"
              />
              {ingredientInput.length > 0 && (
                <TouchableOpacity onPress={addIngredient}>
                  <Text style={{ color: "#FF6B6B", fontWeight: "600" }}>
                    Add
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Ingredient Chips */}
            {ingredients.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {ingredients.map((ingredient, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#FEF3F2",
                      borderRadius: 20,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      gap: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: "#DC2626",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {ingredient}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeIngredient(ingredient)}
                    >
                      <X size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Status Messages */}
            {isMatching && (
              <View
                style={{
                  backgroundColor: "#FEF3F2",
                  padding: 12,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <ActivityIndicator color="#FF6B6B" size="small" />
                <Text
                  style={{ color: "#DC2626", fontSize: 14, fontWeight: "500" }}
                >
                  Searching recipes...
                </Text>
              </View>
            )}

            {matchedRecipes && !isMatching && (
              <View
                style={{
                  backgroundColor:
                    matchedRecipes.length > 0 ? "#F0F9FF" : "#FEF3F2",
                  padding: 12,
                  borderRadius: 8,
                  borderLeftWidth: 3,
                  borderLeftColor:
                    matchedRecipes.length > 0 ? "#3B82F6" : "#DC2626",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {matchedRecipes.length === 0 && (
                  <AlertCircle size={18} color="#DC2626" />
                )}
                <Text
                  style={{
                    color: matchedRecipes.length > 0 ? "#1E40AF" : "#DC2626",
                    fontSize: 14,
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {matchedRecipes.length > 0
                    ? `Found ${matchedRecipes.length} matching recipe${matchedRecipes.length !== 1 ? "s" : ""}`
                    : "No recipes match these ingredients. Try different ones!"}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingHorizontal: 12,
              height: 48,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Search size={20} color="#9CA3AF" />
            <TextInput
              placeholder={
                onlineMode
                  ? "Search any recipe online..."
                  : "Search recipes or cuisines..."
              }
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 16,
                color: "#111827",
              }}
              value={search}
              onChangeText={setSearch}
            />
            {isSearchingOnline ? (
              <ActivityIndicator size="small" color="#FF6B6B" />
            ) : (
              <Filter size={20} color="#FF6B6B" />
            )}
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#FF6B6B"
          />
        }
      >
        {(isLoading && !displayRecipes?.length) || isSearchingOnline ? (
          <ActivityIndicator
            size="large"
            color="#FF6B6B"
            style={{ marginTop: 40 }}
          />
        ) : filteredRecipes?.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <View key={recipe.id} style={{ marginBottom: 16 }}>
              <RecipeCard recipe={recipe} />
              {ingredientMode && recipe.matchPercentage && (
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    backgroundColor: "#10B981",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                  >
                    {recipe.matchCount}/{recipe.totalIngredients} ingredients
                  </Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text
              style={{ color: "#6B7280", fontSize: 16, textAlign: "center" }}
            >
              {ingredientMode && ingredients.length > 0
                ? "No recipes found with those ingredients"
                : search && onlineMode
                  ? "No recipes found. Try a different search term."
                  : onlineMode && !search && !ingredientMode
                    ? "Type something to search millions of recipes online"
                    : "No recipes found"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
