import { AppHeader } from "@/components/AppHeader";
import { Avatar } from "@/components/ui/AvatarRating";
import { Card } from "@/components/ui/CardChipBadge";
import { LoomThread } from "@/components/ui/LoomThread";
import { languageNames, t } from "@/i18n";
import { useAppStore } from "@/store";
import { Colors, Radius, Shadows, Typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, language, signOut, savedArtisans } = useAppStore();
  const isArtisan = user?.role === "artisan";

  const [artisanId, setArtisanId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isArtisan) {
      import('@/services/api').then(({ artisanApi }) => {
        artisanApi.meProfile().then((res: any) => {
          if (res?.artisan_profile_id) setArtisanId(res.artisan_profile_id);
        }).catch(() => { });
      });
    }
  }, [isArtisan]);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut();
          router.replace("/");
        },
      },
    ]);
  };

  const menuItems = [
    ...(isArtisan
      ? [
        {
          icon: "eye-outline",
          label: "View My Profile",
          onPress: () => artisanId && router.push({ pathname: '/artisan-profile', params: { id: artisanId } }),
        },
        { icon: "star-outline", label: "My Reviews", onPress: () => { } },
        {
          icon: "shield-checkmark-outline",
          label: "Verification",
          onPress: () => { },
        },
        {
          icon: "construct-outline",
          label: "My Skills",
          onPress: () => router.push("/artisan-onboarding"),
        },
      ]
      : [
        {
          icon: "bookmark-outline",
          label: `Saved Professionals (${savedArtisans.length})`,
          onPress: () => { },
        },
        { icon: "card-outline", label: "Payment History", onPress: () => { } },
      ]),
    {
      icon: "settings-outline",
      label: "Settings",
      onPress: () => router.push("/settings"),
    },
    {
      icon: "language-outline",
      label: `Language: ${languageNames[language]}`,
      onPress: () => router.push("/settings"),
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      onPress: () => router.push("/help"),
    },
    {
      icon: "log-out-outline",
      label: "Sign Out",
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LoomThread variant="minimal" opacity={0.2} animated />
      <AppHeader title="Profile" showNotification={false} />

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Command Center */}
        <Animated.View entering={FadeInDown.springify()} style={{ alignItems: "center", paddingVertical: 50 }}>
          <View style={{ position: 'relative' }}>
            <View style={{
              padding: 4,
              borderRadius: 60,
              borderWidth: 2,
              borderColor: Colors.primary,
              borderStyle: 'dashed'
            }}>
              <Avatar name={user?.name || "U"} size={100} />
            </View>
            <View style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              backgroundColor: Colors.accent,
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 4,
              borderColor: Colors.background,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </View>
          </View>

          <Text style={[Typography.label, { color: Colors.primary, marginTop: 24, fontSize: 10, letterSpacing: 2 }]}>PROFILE</Text>
          <Text style={[Typography.h1, { marginTop: 8, fontSize: 32 }]}>
            {user?.name?.toUpperCase()}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <View style={{
              backgroundColor: Colors.white,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: Radius.xs,
              borderWidth: 1,
              borderColor: Colors.cardBorder
            }}>
              <Text style={[Typography.label, { color: Colors.primary, fontSize: 9 }]}>{isArtisan ? "PROFESSIONAL" : "CLIENT"}</Text>
            </View>
            <Text style={[Typography.bodySmall, { color: Colors.muted, fontWeight: '600' }]}>
              {user?.location?.city?.toUpperCase() || "LOCATION NOT SET"}
            </Text>
          </View>
        </Animated.View>

        {/* Action Grille */}
        <View style={{ gap: 12 }}>
          {menuItems.map((item, i) => (
            <Animated.View key={item.label} entering={FadeInDown.delay(200 + i * 50).springify()}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                  backgroundColor: Colors.white,
                  borderRadius: Radius.md,
                  gap: 16,
                  borderWidth: 1.5,
                  borderColor: Colors.cardBorder,
                  ...Shadows.sm
                }}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View style={{
                  width: 38,
                  height: 38,
                  borderRadius: Radius.xs,
                  backgroundColor: item.danger ? Colors.error + '08' : Colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: item.danger ? Colors.error + '20' : Colors.cardBorder
                }}>
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={item.danger ? Colors.error : Colors.primary}
                  />
                </View>
                <Text
                  style={[
                    Typography.body,
                    { flex: 1, fontWeight: '700', color: item.danger ? Colors.error : Colors.primary, fontSize: 14 }
                  ]}
                >
                  {item.label}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={Colors.gray400}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={{ marginTop: 64, alignItems: 'center' }}>
          <View style={{ height: 1, width: 40, backgroundColor: Colors.cardBorder, marginBottom: 16 }} />
          <Text style={[Typography.label, { textAlign: 'center', opacity: 0.3, fontSize: 8, letterSpacing: 4 }]}>
            LOOM v4.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
