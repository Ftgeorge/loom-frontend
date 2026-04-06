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
        <LoomThread variant="dense" animated scale={1.5} opacity={0.5} />
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 32, justifyContent: 'center' }}
      >
        <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-14 px-1">
          <Text className="text-label text-primary mb-3 tracking-[2px] uppercase font-jakarta-extrabold italic">LOOM ECOSYSTEM</Text>
          <Text className="text-h1 text-[42px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter">
            How can we{"\n"}help you?
          </Text>
        </Animated.View>

        <View className="gap-8">
          {/* Client Role Identity */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <TouchableOpacity
              className="bg-white rounded-[32px] h-[220px] overflow-hidden border-[1.5px] border-card-border shadow-2xl"
              onPress={() => handleSelect("client")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/client.jpg")}
                className="absolute w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-ink/70" />

              <View className="flex-1 p-8 justify-between">
                <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md shadow-lg">
                  <Ionicons name="search-outline" size={28} color="white" />
                </View>

                <View>
                  <Text className="text-label text-white/60 text-[10px] mb-2 uppercase tracking-widest font-jakarta-bold">IDENTITY: CLIENT</Text>
                  <Text className="text-[28px] font-jakarta-extrabold text-white uppercase italic tracking-tight">
                    {t("iNeedArtisan", language)}
                  </Text>
                </View>
              </View>

              <View className="absolute top-5 right-5">
                <View className="bg-white/10 w-10 h-10 rounded-full items-center justify-center border border-white/20">
                  <Ionicons name="trending-up" size={20} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Artisan Role Identity */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <TouchableOpacity
              className="bg-white rounded-[32px] h-[220px] overflow-hidden border-[1.5px] border-card-border shadow-2xl"
              onPress={() => handleSelect("artisan")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/artisan.jpg")}
                className="absolute w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-primary/70" />

              <View className="flex-1 p-8 justify-between">
                <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md shadow-lg">
                  <Ionicons name="hammer-outline" size={28} color="white" />
                </View>

                <View>
                  <Text className="text-label text-white/60 text-[10px] mb-2 uppercase tracking-widest font-jakarta-bold">IDENTITY: ARTISAN</Text>
                  <Text className="text-[28px] font-jakarta-extrabold text-white uppercase italic tracking-tight">
                    {t("iAmArtisan", language)}
                  </Text>
                </View>
              </View>

              <View className="absolute top-5 right-5">
                <View className="bg-white/10 w-10 h-10 rounded-full items-center justify-center border border-white/20">
                  <Ionicons name="diamond" size={20} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Login Redirection */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <TouchableOpacity
            className="items-center mt-16 p-6 bg-white/50 rounded-2xl border border-card-border shadow-sm mx-1"
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text className="text-label text-muted text-[11px] normal-case leading-none font-jakarta-bold">
              Returning to your terminal?{" "}
              <Text className="text-primary font-jakarta-extrabold uppercase italic">Access Account</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}


