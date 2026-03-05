import { LoomThread } from "@/components/ui/LoomThread";
import { t } from "@/i18n";
import { useAppStore } from "@/store";
import { Colors, Radius, Typography } from "@/theme";
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
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4 }}>
        <LoomThread variant="minimal" animated scale={1.2} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 32, justifyContent: 'center' }}>
        <Animated.View entering={FadeInDown.delay(100)} style={{ marginBottom: 40 }}>
          <Text style={[Typography.h1, { fontSize: 35, lineHeight: 42 }]}>
            How do you want{"\n"}to use Loom?
          </Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8 }]}>
            You can always switch later in Settings.
          </Text>
        </Animated.View>

        <View style={{ gap: 20 }}>
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                borderRadius: Radius.lg,
                height: 180,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.cardBorder,
              }}
              onPress={() => handleSelect("client")}
              activeOpacity={0.85}
              accessibilityLabel="Continue as client"
            >
              <ImageBackground
                source={require("../assets/images/client.jpg")}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
              <View style={{ alignItems: 'center', gap: 12, padding: 24 }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Ionicons name="person-outline" size={32} color="white" />
                </View>
                <Text style={{ fontSize: 22, fontWeight: '700', color: 'white', textAlign: 'center' }}>
                  {t("iNeedArtisan", language)}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                borderRadius: Radius.lg,
                height: 180,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.cardBorder,
              }}
              onPress={() => handleSelect("artisan")}
              activeOpacity={0.85}
              accessibilityLabel="Continue as artisan"
            >
              <ImageBackground
                source={require("../assets/images/artisan.jpg")}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
              <View style={{ alignItems: 'center', gap: 12, padding: 24 }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Ionicons name="construct-outline" size={32} color="white" />
                </View>
                <Text style={{ fontSize: 22, fontWeight: '700', color: 'white', textAlign: 'center' }}>
                  {t("iAmArtisan", language)}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(500)}>
          <TouchableOpacity
            style={{ alignItems: 'center', marginTop: 40, padding: 16 }}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={[Typography.body, { color: Colors.textSecondary }]}>
              Already have an account?{" "}
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
