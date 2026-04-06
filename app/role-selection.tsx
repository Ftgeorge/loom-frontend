import { LoomThread } from "@/components/ui/LoomThread";
import { t } from "@/i18n";
import { useAppStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setRoleSelected, language } = useAppStore();

  const handleSelect = (role: "client" | "artisan") => {
    setRoleSelected(role);
    router.push("/(auth)/sign-up");
  };

  return (
    <View className="flex-1 bg-background">
      <View style={StyleSheet.absoluteFill}>
        <LoomThread variant="dense" animated scale={1.5} opacity={0.5} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 32, justifyContent: 'center' }}>
        <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-12">
          <Text className="text-label text-primary mb-3">LOOM</Text>
          <Text className="text-h1 text-[36px] leading-[38px]">
            How can we{"\n"}help you?
          </Text>
        </Animated.View>

        <View className="gap-6">
          {/* Client Role */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <TouchableOpacity
              className="bg-white rounded-md h-[200px] overflow-hidden border-[1.5px] border-card-border shadow-md"
              onPress={() => handleSelect("client")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/client.jpg")}
                className="absolute w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute top-0 left-0 right-0 bottom-0 bg-[#0A261E]/70" />

              <View className="flex-1 p-6 justify-between">
                <View className="w-12 h-12 rounded-xs bg-white/20 items-center justify-center border border-white/30">
                  <Ionicons name="search-outline" size={24} color="white" />
                </View>

                <View>
                  <Text className="text-label text-gray-300 text-[10px] mb-1">CLIENT</Text>
                  <Text className="text-[24px] font-jakarta-extrabold text-white">
                    {t("iNeedArtisan", language)}
                  </Text>
                </View>
              </View>

              <View className="absolute top-3 right-3">
                <Ionicons name="chevron-forward-circle" size={24} className="text-white/50" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Artisan Role */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <TouchableOpacity
              className="bg-white rounded-md h-[200px] overflow-hidden border-[1.5px] border-card-border shadow-md"
              onPress={() => handleSelect("artisan")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/artisan.jpg")}
                className="absolute w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute top-0 left-0 right-0 bottom-0 bg-[#7C4727]/70" />

              <View className="flex-1 p-6 justify-between">
                <View className="w-12 h-12 rounded-xs bg-white/20 items-center justify-center border border-white/30">
                  <Ionicons name="hammer-outline" size={24} color="white" />
                </View>

                <View>
                  <Text className="text-label text-white/80 text-[10px] mb-1 uppercase">Artisan</Text>
                  <Text className="text-[24px] font-jakarta-extrabold text-white">
                    {t("iAmArtisan", language)}
                  </Text>
                </View>
              </View>

              <View className="absolute top-3 right-3">
                <Ionicons name="chevron-forward-circle" size={24} className="text-white/50" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <TouchableOpacity
            className="items-center mt-14 p-5 bg-white rounded-xs border border-card-border"
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text className="text-label text-muted text-[10px] lowercase leading-none">
              Been here before?{" "}
              <Text className="text-primary font-jakarta-extrabold">Log In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

