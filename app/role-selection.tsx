import { LoomThread } from "@/components/ui/LoomThread";
import { t } from "@/i18n";
import { useAppStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
      <View className="absolute inset-0">
        <LoomThread variant="dense" animated scale={1.5} opacity={0.4} />
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 32, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-14 px-1">
          <View className="flex-row items-center gap-2 mb-4">
              <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
              <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic">LOOM ECOSYSTEM</Text>
          </View>
          <Text className="text-h1 text-[44px] leading-[48px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">
            How can we{"\n"}help you?
          </Text>
        </Animated.View>

        <View className="gap-8">
          {/* Client Role Identity */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <TouchableOpacity
              className="bg-white rounded-[40px] h-[240px] overflow-hidden border-[1.5px] border-card-border shadow-2xl"
              onPress={() => handleSelect("client")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/client.jpg")}
                className="absolute w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-ink/70" />

              <View className="flex-1 p-8 justify-between z-10">
                <View className="w-16 h-16 rounded-3xl bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md shadow-lg">
                  <Ionicons name="search-outline" size={30} color="white" />
                </View>

                <View>
                  <Text className="text-label text-white/60 text-[10px] mb-2 uppercase tracking-[2px] font-jakarta-bold italic">IDENTITY: CLIENT</Text>
                  <Text className="text-[30px] font-jakarta-extrabold text-white uppercase italic tracking-tighter leading-tight">
                    {t("iNeedArtisan", language)}
                  </Text>
                </View>
              </View>

              <View className="absolute top-6 right-6">
                <View className="bg-white/10 w-12 h-12 rounded-full items-center justify-center border border-white/20">
                  <Ionicons name="trending-up" size={22} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Artisan Role Identity */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <TouchableOpacity
              className="bg-white rounded-[40px] h-[240px] overflow-hidden border-[1.5px] border-card-border shadow-2xl"
              onPress={() => handleSelect("artisan")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/artisan.jpg")}
                className="absolute w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-primary/70" />

              <View className="flex-1 p-8 justify-between z-10">
                <View className="w-16 h-16 rounded-3xl bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md shadow-lg">
                  <Ionicons name="hammer-outline" size={30} color="white" />
                </View>

                <View>
                  <Text className="text-label text-white/60 text-[10px] mb-2 uppercase tracking-[2px] font-jakarta-bold italic">IDENTITY: ARTISAN</Text>
                  <Text className="text-[30px] font-jakarta-extrabold text-white uppercase italic tracking-tighter leading-tight">
                    {t("iAmArtisan", language)}
                  </Text>
                </View>
              </View>

              <View className="absolute top-6 right-6">
                <View className="bg-white/10 w-12 h-12 rounded-full items-center justify-center border border-white/20">
                  <Ionicons name="diamond" size={22} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Login Redirection Matrix */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <TouchableOpacity
            className="items-center mt-16 p-7 bg-white/60 rounded-[28px] border border-card-border shadow-sm mx-1 active:bg-white/90"
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <View className="flex-row items-center gap-3">
                <Ionicons name="finger-print-outline" size={16} color="#475569" />
                <Text className="text-label text-ink/70 text-[12px] normal-case leading-none font-jakarta-bold">
                  Returning to your terminal?{" "}
                  <Text className="text-primary font-jakarta-extrabold uppercase italic tracking-wider">Access Account</Text>
                </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <View className="mt-12 items-center opacity-20">
            <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Protocol Selection Matrix v4.2</Text>
        </View>
      </ScrollView>
    </View>
  );
}



