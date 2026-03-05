import { AppHeader } from "@/components/AppHeader";
import { Avatar } from "@/components/ui/AvatarRating";
import { Card } from "@/components/ui/CardChipBadge";
import { LoomThread } from "@/components/ui/LoomThread";
import { languageNames, t } from "@/i18n";
import { useAppStore } from "@/store";
import { Colors, Typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
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
          label: "Public Profile Preview",
          onPress: () => artisanId && router.push({ pathname: '/artisan-profile', params: { id: artisanId } }),
        },
        { icon: "star-outline", label: "My Reviews", onPress: () => { } },
        {
          icon: "shield-checkmark-outline",
          label: "Verification",
          onPress: () => { },
        },
        {
          icon: "create-outline",
          label: "Edit Profile & Skills",
          onPress: () => router.push("/artisan-onboarding"),
        },
      ]
      : [
        {
          icon: "bookmark-outline",
          label: `Saved Artisans (${savedArtisans.length})`,
          onPress: () => { },
        },
        { icon: "card-outline", label: "Payment Methods", onPress: () => { } },
      ]),
    {
      icon: "settings-outline",
      label: t("settings", language),
      onPress: () => router.push("/settings"),
    },
    {
      icon: "language-outline",
      label: `${t("language", language)}: ${languageNames[language]}`,
      onPress: () => router.push("/settings"),
    },
    {
      icon: "notifications-outline",
      label: t("notifications", language),
      onPress: () => router.push("/notifications"),
    },
    {
      icon: "help-circle-outline",
      label: t("helpSupport", language),
      onPress: () => router.push("/help"),
    },
    {
      icon: "log-out-outline",
      label: t("logOut", language),
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LoomThread variant="minimal" opacity={0.3} animated />
      <AppHeader title={t("profile", language)} showNotification={false} />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <Avatar name={user?.name || "U"} size={88} />
          <Text style={[Typography.h1, { marginTop: 24 }]}>
            {user?.name}
          </Text>
          <Text style={[Typography.body, { marginTop: 4, color: Colors.textSecondary, fontWeight: '500' }]}>
            {isArtisan ? "Artisan" : "Client"} • {user?.location?.city || "Set location"}
          </Text>
          <Text style={[Typography.bodySmall, { color: Colors.muted, marginTop: 4 }]}>{user?.phone}</Text>
        </View>

        {/* Menu */}
        <Card noPadding style={{ marginTop: 12 }}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 20,
                paddingHorizontal: 24,
                gap: 16,
                borderBottomWidth: i < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: Colors.cardBorder + '50'
              }}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={item.danger ? Colors.error : Colors.muted}
              />
              <Text
                style={[
                  Typography.body,
                  { flex: 1, fontWeight: '500', color: item.danger ? Colors.error : Colors.text }
                ]}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.cardBorder}
              />
            </TouchableOpacity>
          ))}
        </Card>

        <Text style={[Typography.label, { textAlign: 'center', marginTop: 32, opacity: 0.5 }]}>
          Loom v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
