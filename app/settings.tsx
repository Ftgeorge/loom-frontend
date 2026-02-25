import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/CardChipBadge";
import { languageNames } from "@/i18n";
import { useAppStore } from "@/store";
import { Colors } from "@/theme";
import type { Language, UserRole } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { language, setLanguage, user, switchRole, signOut } = useAppStore();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleRoleSwitch = () => {
    const newRole: UserRole = user?.role === "client" ? "artisan" : "client";
    Alert.alert(
      "Switch Role",
      `Switch to ${newRole === "client" ? "Client" : "Artisan"} mode?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch",
          onPress: () => {
            switchRole(newRole);
            router.replace(
              newRole === "artisan" ? "/(tabs)/dashboard" : "/(tabs)/home",
            );
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure?", [
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

  return (
    <View className="flex-1 bg-background">
      <AppHeader
        title="Settings"
        showBack
        onBack={() => router.back()}
        showNotification={false}
      />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Language */}
        <Text className="text-xs font-semibold tracking-widest text-muted mt-8 mb-3 ml-2 uppercase">
          LANGUAGE
        </Text>
        <Card
          className="rounded-[24px] border-gray-50"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 }}
          noPadding
        >
          {(Object.keys(languageNames) as Language[]).map((lang, i, arr) => (
            <TouchableOpacity
              key={lang}
              className={`flex-row items-center justify-between py-5 px-6 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}
              onPress={() => setLanguage(lang)}
            >
              <Text className="text-base font-medium text-graphite">{languageNames[lang]}</Text>
              {language === lang && (
                <Ionicons name="checkmark" size={24} color={Colors.graphite} />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Notifications */}
        <Text className="text-xs font-semibold tracking-widest text-muted mt-8 mb-3 ml-2 uppercase">
          NOTIFICATIONS
        </Text>
        <Card
          className="rounded-[24px] border-gray-50"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 }}
          noPadding
        >
          <View className="flex-row items-center justify-between py-5 px-6">
            <Text className="text-base font-medium text-graphite">Push Notifications</Text>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: Colors.gray300, true: Colors.success }}
            />
          </View>
        </Card>

        {/* Role Switch */}
        <Text className="text-xs font-semibold tracking-widest text-muted mt-8 mb-3 ml-2 uppercase">
          ACCOUNT
        </Text>
        <Card
          className="rounded-[24px] border-gray-50"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 }}
          noPadding
        >
          <TouchableOpacity
            className="flex-row items-center justify-between py-5 px-6 border-b border-gray-50"
            onPress={handleRoleSwitch}
          >
            <View className="flex-row items-center gap-4">
              <Ionicons
                name="swap-horizontal-outline"
                size={24}
                color={Colors.muted}
              />
              <View>
                <Text className="text-base font-medium text-graphite">Switch Role</Text>
                <Text className="text-xs text-muted mt-0.5">
                  Currently: {user?.role === "client" ? "Client" : "Artisan"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray300} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-5 px-6 border-b border-gray-50"
            onPress={() => router.push("/help")}
          >
            <View className="flex-row items-center gap-4">
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={Colors.muted}
              />
              <Text className="text-base font-medium text-graphite">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray300} />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-5 px-6">
            <View className="flex-row items-center gap-4">
              <Ionicons
                name="document-text-outline"
                size={24}
                color={Colors.muted}
              />
              <Text className="text-base font-medium text-graphite">Privacy & Terms</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray300} />
          </TouchableOpacity>
        </Card>

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 mt-10 p-5"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
          <Text className="text-base text-red-500 font-semibold">Log Out</Text>
        </TouchableOpacity>

        <Text className="text-xs font-semibold tracking-wide text-muted text-center mt-5 uppercase">
          Loom v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
