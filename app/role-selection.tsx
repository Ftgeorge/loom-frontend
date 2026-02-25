import { t } from "@/i18n";
import { useAppStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setRoleSelected, language } = useAppStore();

  const handleSelect = (role: "client" | "artisan") => {
    setRoleSelected(role);
    router.push("/(auth)/sign-up");
  };

  return (
    <View className="flex-1 bg-background px-8 justify-center">
      <Animated.View entering={FadeInDown.delay(100)} className="mb-10">
        <Text className="text-[35px] font-extrabold leading-tight text-graphite tracking-tight">
          How do you want{"\n"}to use Loom?
        </Text>
        <Text className="text-base text-muted mt-2">
          You can always switch later in Settings.
        </Text>
      </Animated.View>

      <View className="gap-5">
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <TouchableOpacity
            className="bg-white rounded-[20px] border border-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] items-center gap-4 relative overflow-hidden"
            onPress={() => handleSelect("client")}
            activeOpacity={0.85}
            accessibilityLabel="Continue as client"
          >
            <ImageBackground
              source={require("../assets/images/client.jpg")}
              className="absolute w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/60" />
            <View className="flex flex-col items-center p-8 gap-4 w-full">
              <View className="w-20 h-20 rounded-full items-center justify-center bg-white/30">
                <Ionicons name="person-outline" size={40} color="white" />
              </View>
              <Text className="text-xl font-bold text-center text-white">
                {t("iNeedArtisan", language)}
              </Text>
              <Text className="text-sm text-gray-200 text-center">
                {t("clientDesc", language)}
              </Text>
              <View className="px-3 py-1 bg-graphite rounded-full">
                <Text className="text-xs font-semibold text-white">Client</Text>
              </View>
            </View>

          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <TouchableOpacity
            className="bg-white rounded-[20px] border border-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] items-center gap-4 relative overflow-hidden"
            onPress={() => handleSelect("artisan")}
            activeOpacity={0.85}
            accessibilityLabel="Continue as artisan"
          >
            <ImageBackground
              source={require("../assets/images/artisan.jpg")}
              className="absolute w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/60" />
            <View className="flex flex-col items-center p-8 gap-4 w-full">
              <View className="w-20 h-20 rounded-full items-center justify-center bg-white/20">
                <Ionicons
                  name="construct-outline"
                  size={40}
                  color="white"
                />
              </View>
              <Text className="text-xl font-bold text-center text-white">
                {t("iAmArtisan", language)}
              </Text>
              <Text className="text-sm text-gray-200 text-center">
                {t("artisanDesc", language)}
              </Text>
              <View className="px-3 py-1 rounded-full bg-graphite">
                <Text className="text-xs font-semibold text-white">
                  Artisan
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500)}>
        <TouchableOpacity
          className="items-center mt-10 p-4"
          onPress={() => router.push("/(auth)/sign-in")}
        >
          <Text className="text-base text-muted">
            Already have an account?{" "}
            <Text className="text-graphite font-bold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
