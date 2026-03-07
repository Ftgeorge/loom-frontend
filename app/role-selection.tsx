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
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LoomThread variant="minimal" animated scale={1.2} opacity={0.3} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 32, justifyContent: 'center' }}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 48 }}>
          <Text style={[Typography.label, { color: Colors.primary, marginBottom: 12 }]}>GET STARTED</Text>
          <Text style={[Typography.h1, { fontSize: 32, lineHeight: 38 }]}>
            How would you like{"\n"}to use Loom?
          </Text>
        </Animated.View>

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
              onPress={() => handleSelect("client")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/client.jpg")}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode="cover"
              />
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
                  <Text style={[Typography.label, { color: Colors.accent, fontSize: 10, marginBottom: 4 }]}>I NEED A SERVICE</Text>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>
                    {t("iNeedArtisan", language)}
                  </Text>
                </View>
              </View>

              <View style={{ position: 'absolute', top: 12, right: 12 }}>
                <Ionicons name="chevron-forward-circle" size={24} color="rgba(255,255,255,0.5)" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Artisan Role */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
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
              onPress={() => handleSelect("artisan")}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require("../assets/images/artisan.jpg")}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode="cover"
              />
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
                  <Text style={[Typography.label, { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginBottom: 4 }]}>I AM A PROFESSIONAL</Text>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>
                    {t("iAmArtisan", language)}
                  </Text>
                </View>
              </View>

              <View style={{ position: 'absolute', top: 12, right: 12 }}>
                <Ionicons name="chevron-forward-circle" size={24} color="rgba(255,255,255,0.5)" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <TouchableOpacity
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
              Already registered?{" "}
              <Text style={{ color: Colors.primary, fontWeight: '800' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
