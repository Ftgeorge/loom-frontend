import { LoomThread } from "@/components/ui/LoomThread";
import { t } from "@/i18n";
import { useAppStore } from "@/store";
import { Colors, Radius, Shadows, Typography } from "@/theme";
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
<<<<<<< HEAD
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
=======
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={StyleSheet.absoluteFill}>
        <LoomThread variant="dense" animated scale={1.5} opacity={0.5} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 32, justifyContent: 'center' }}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 48 }}>
          <Text style={[Typography.label, { color: Colors.primary, marginBottom: 12 }]}>LOOM</Text>
          <Text style={[Typography.h1, { fontSize: 36, lineHeight: 38 }]}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            How can we{"\n"}help you?
          </Text>
        </Animated.View>

<<<<<<< HEAD
        <View className="gap-8">
          {/* Client Role Identity */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <TouchableOpacity
              className="bg-white rounded-[40px] h-[240px] overflow-hidden border-[1.5px] border-card-border shadow-2xl"
=======
        <View style={{ gap: 24 }}>
          {/* Client Role */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.white,
                borderRadius: Radius.md,
                height: 200,
                overflow: 'hidden',
                borderWidth: 1.5,
                borderColor: Colors.cardBorder,
                ...Shadows.md
              }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
              onPress={() => handleSelect("client")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/client.jpg")}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode="cover"
              />
<<<<<<< HEAD
              <View className="absolute inset-0 bg-ink/70" />

              <View className="flex-1 p-8 justify-between z-10">
                <View className="w-16 h-16 rounded-3xl bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md shadow-lg">
                  <Ionicons name="search-outline" size={30} color="white" />
                </View>

                <View>
                  <Text className="text-label text-white/60 text-[10px] mb-2 uppercase tracking-[2px] font-jakarta-bold italic">IDENTITY: CLIENT</Text>
                  <Text className="text-[30px] font-jakarta-extrabold text-white uppercase italic tracking-tighter leading-tight">
=======
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,38,30,0.7)' }} />

              <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: Radius.xs,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)'
                }}>
                  <Ionicons name="search-outline" size={24} color="white" />
                </View>

                <View>
                  <Text style={[Typography.label, { color: Colors.gray300, fontSize: 10, marginBottom: 4 }]}>CLIENT</Text>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    {t("iNeedArtisan", language)}
                  </Text>
                </View>
              </View>

<<<<<<< HEAD
              <View className="absolute top-6 right-6">
                <View className="bg-white/10 w-12 h-12 rounded-full items-center justify-center border border-white/20">
                  <Ionicons name="trending-up" size={22} color="white" />
                </View>
=======
              <View style={{ position: 'absolute', top: 12, right: 12 }}>
                <Ionicons name="chevron-forward-circle" size={24} color="rgba(255,255,255,0.5)" />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Artisan Role Identity */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <TouchableOpacity
<<<<<<< HEAD
              className="bg-white rounded-[40px] h-[240px] overflow-hidden border-[1.5px] border-card-border shadow-2xl"
=======
              style={{
                backgroundColor: Colors.white,
                borderRadius: Radius.md,
                height: 200,
                overflow: 'hidden',
                borderWidth: 1.5,
                borderColor: Colors.cardBorder,
                ...Shadows.md
              }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
              onPress={() => handleSelect("artisan")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/artisan.jpg")}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode="cover"
              />
<<<<<<< HEAD
              <View className="absolute inset-0 bg-primary/70" />

              <View className="flex-1 p-8 justify-between z-10">
                <View className="w-16 h-16 rounded-3xl bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md shadow-lg">
                  <Ionicons name="hammer-outline" size={30} color="white" />
                </View>

                <View>
                  <Text className="text-label text-white/60 text-[10px] mb-2 uppercase tracking-[2px] font-jakarta-bold italic">IDENTITY: ARTISAN</Text>
                  <Text className="text-[30px] font-jakarta-extrabold text-white uppercase italic tracking-tighter leading-tight">
=======
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(124,71,39,0.7)' }} />

              <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: Radius.xs,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)'
                }}>
                  <Ionicons name="hammer-outline" size={24} color="white" />
                </View>

                <View>
                  <Text style={[Typography.label, { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginBottom: 4 }]}>ARTISAN</Text>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    {t("iAmArtisan", language)}
                  </Text>
                </View>
              </View>

<<<<<<< HEAD
              <View className="absolute top-6 right-6">
                <View className="bg-white/10 w-12 h-12 rounded-full items-center justify-center border border-white/20">
                  <Ionicons name="diamond" size={22} color="white" />
                </View>
=======
              <View style={{ position: 'absolute', top: 12, right: 12 }}>
                <Ionicons name="chevron-forward-circle" size={24} color="rgba(255,255,255,0.5)" />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Login Redirection Matrix */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <TouchableOpacity
<<<<<<< HEAD
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
=======
            style={{
              alignItems: 'center',
              marginTop: 56,
              padding: 20,
              backgroundColor: Colors.white,
              borderRadius: Radius.xs,
              borderWidth: 1,
              borderColor: Colors.cardBorder
            }}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={[Typography.label, { color: Colors.muted, fontSize: 10, textTransform: 'none' }]}>
              Been here before?{" "}
              <Text style={{ color: Colors.primary, fontWeight: '800' }}>Log In</Text>
            </Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
          </TouchableOpacity>
        </Animated.View>
        
        <View className="mt-12 items-center opacity-20">
            <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Protocol Selection Matrix v4.2</Text>
        </View>
      </ScrollView>
    </View>
  );
}
<<<<<<< HEAD



=======
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
