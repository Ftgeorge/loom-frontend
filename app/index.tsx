import { useAppStore } from "@/store";
import { Colors } from "@/theme";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, user } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace(
          user?.role === "artisan" ? "/(tabs)/dashboard" : "/(tabs)/home",
        );
      } else if (hasCompletedOnboarding) {
        router.replace("/role-selection");
      } else {
        router.replace("/onboarding");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <View className="items-center">
      <View className="max-h-fit">
        <Image
          source={require("../assets/images/logo.png")}
          className="size-full"
        />
      </View>
        <Text className="text-base text-white mt-6">
          Find Trusted Artisans Near You
        </Text>
      </View>
      <ActivityIndicator
        color={Colors.primary}
        size="large"
        className="absolute bottom-20"
      />
    </View>
  );
}
