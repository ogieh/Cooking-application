import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Mic,
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function CookingModeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: recipe } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const response = await fetch(`/api/recipes/${id}`);
      return response.json();
    },
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const steps = recipe?.steps || [];
  const currentStep = steps[currentStepIndex];

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentStep?.timer_seconds) {
      setTimeLeft(currentStep.timer_seconds);
      setIsTimerRunning(false);
    } else {
      setTimeLeft(0);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, currentStep]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      alert("Timer finished!");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      alert("Cooking complete! Enjoy your meal!");
      router.back();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStepIndex(currentStepIndex - 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const simulateVoiceCommand = () => {
    setIsVoiceActive(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      setIsVoiceActive(false);
      handleNext();
    }, 1500);
  };

  if (!recipe) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#111827" }}>
      <StatusBar style="light" />
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Step {currentStepIndex + 1} of {steps.length}
          </Text>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {recipe.title}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 40 }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 24,
              lineHeight: 36,
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {currentStep?.instruction}
          </Text>
        </Animated.View>
      </View>

      <View style={{ paddingBottom: insets.bottom + 40, alignItems: "center" }}>
        {timeLeft > 0 && (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: 24,
              borderRadius: 24,
              marginBottom: 40,
              alignItems: "center",
              width: 200,
            }}
          >
            <TimerIcon size={32} color="#FF6B6B" style={{ marginBottom: 8 }} />
            <Text
              style={{
                color: "#fff",
                fontSize: 48,
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              {formatTime(timeLeft)}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => setIsTimerRunning(!isTimerRunning)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#FF6B6B",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                {isTimerRunning ? (
                  <Pause size={24} color="#fff" />
                ) : (
                  <Play size={24} color="#fff" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setTimeLeft(currentStep.timer_seconds);
                  setIsTimerRunning(false);
                }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RotateCcw size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 40,
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            disabled={currentStepIndex === 0}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(255,255,255,0.1)",
              alignItems: "center",
              justifyContent: "center",
              opacity: currentStepIndex === 0 ? 0.3 : 1,
            }}
          >
            <ChevronLeft size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={simulateVoiceCommand}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: isVoiceActive
                ? "#FF6B6B"
                : "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: isVoiceActive ? "#fff" : "transparent",
            }}
          >
            <Mic size={32} color="#fff" />
            {isVoiceActive && (
              <View
                style={{
                  position: "absolute",
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: "#FF6B6B",
                  opacity: 0.5,
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "#FF6B6B",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: "rgba(255,255,255,0.5)",
            marginTop: 20,
            fontSize: 12,
          }}
        >
          Say "Next Step" or tap the microphone
        </Text>
      </View>
    </View>
  );
}
