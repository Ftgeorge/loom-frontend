import { AppHeader } from "@/components/AppHeader";
import { Avatar } from "@/components/ui/AvatarRating";
import { Card } from "@/components/ui/CardChipBadge";
import { languageNames, t } from "@/i18n";
import { useAppStore } from "@/store";
import { Colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, language, signOut, savedArtisans } = useAppStore();
  const isArtisan = user?.role === "artisan";

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
          onPress: () => { },
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
          onPress: () => { },
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
    <View className="flex-1 bg-background">
      <AppHeader title={t("profile", language)} showNotification={false} />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="items-center py-8">
          <Avatar name={user?.name || "U"} size={88} />
          <Text className="text-[28px] font-bold text-graphite tracking-tight mt-5">
            {user?.name}
          </Text>
          <Text className="text-base text-muted font-medium mt-1.5">
            {isArtisan ? "Artisan" : "Client"} • {user?.location.city}
          </Text>
          <Text className="text-sm text-gray-400 mt-1">{user?.phone}</Text>
        </View>

        {/* Menu */}
        <Card
          className="mt-5 rounded-[24px] border-gray-50"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 }}
          noPadding
        >
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              className={`flex-row items-center py-5 px-6 gap-4 ${i < menuItems.length - 1 ? "border-b border-gray-50" : ""}`}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={item.danger ? Colors.error : Colors.muted}
              />
              <Text
                className={`text-base font-medium flex-1 ${item.danger ? "text-red-500" : "text-graphite"}`}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.gray300}
              />
            </TouchableOpacity>
          ))}
        </Card>

        <Text className="text-xs font-semibold tracking-wide text-muted text-center mt-8 uppercase">
          Loom v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
