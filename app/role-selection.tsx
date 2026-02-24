import { t } from "@/i18n";
import { useAppStore } from "@/store";
import { Colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setRoleSelected, language } = useAppStore();

  const handleSelect = (role: "client" | "artisan") => {
    setRoleSelected(role);
    router.push("/(auth)/sign-up");
  };

  return (
    <View className="flex-1 bg-background px-8 justify-center">
      <View className="mb-10">
        <Text className="text-[30px] font-bold leading-tight text-black">
          How do you want{"\n"}to use Loom?
        </Text>
        <Text className="text-base text-gray-500 mt-2">
          You can always switch later in Settings.
        </Text>
      </View>

      <View className="gap-5">
        <TouchableOpacity
          className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] items-center gap-4"
          onPress={() => handleSelect("client")}
          activeOpacity={0.85}
          accessibilityLabel="Continue as client"
        >
          <View className="w-20 h-20 rounded-full items-center justify-center bg-primary/30">
            <Ionicons name="person-outline" size={40} color={Colors.primary} />
          </View>
          <Text className="text-xl font-bold text-center text-black">
            {t("iNeedArtisan", language)}
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            {t("clientDesc", language)}
          </Text>
          <View className="px-3 py-1 bg-primary/25 rounded-full">
            <Text className="text-xs font-semibold text-primary">Client</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] items-center gap-4"
          onPress={() => handleSelect("artisan")}
          activeOpacity={0.85}
          accessibilityLabel="Continue as artisan"
        >
          <View className="w-20 h-20 rounded-full items-center justify-center bg-accent/20">
            <Ionicons
              name="construct-outline"
              size={40}
              color={Colors.accent}
            />
          </View>
          <Text className="text-xl font-bold text-center text-black">
            {t("iAmArtisan", language)}
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            {t("artisanDesc", language)}
          </Text>
          <View className="px-3 py-1 rounded-full bg-accent/15">
            <Text
              className="text-xs font-semibold text-accent"
              style={{ color: "#E66A2B" }}
            >
              Artisan
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="items-center mt-10 p-4"
        onPress={() => router.push("/(auth)/sign-in")}
      >
        <Text className="text-base text-gray-500">
          Already have an account?{" "}
          <Text className="text-primary font-semibold">Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
