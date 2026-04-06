import { SubAppHeader } from "@/components/AppSubHeader";
import { Card } from "@/components/ui/CardChipBadge";
import { languageNames } from "@/i18n";
import { useAppStore } from "@/store";
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
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function SettingsScreen() {
  const router = useRouter();
  const { language, setLanguage, user, switchRole, signOut, themeMode, setThemeMode } = useAppStore();
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleRoleSwitch = () => {
    const newRole: UserRole = user?.role === "client" ? "artisan" : "client";
    Alert.alert(
      "Switch Role",
      `Switch to ${newRole === "client" ? "Client" : "Artisan"} mode?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch Now",
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
    ], { cancelable: true });
  };

  const SettingItem = ({ icon, label, value, onPress, isLast = false, color = '#078365' }: any) => (
    <TouchableOpacity
      className={`flex-row items-center py-[18px] px-5 bg-surface ${!isLast ? 'border-b border-card-border' : ''}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View 
        className="w-9 h-9 rounded-[10px] items-center justify-center mr-4"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-body text-[15px] font-jakarta-bold text-ink">{label}</Text>
        {value && <Text className="text-body-sm text-[13px] text-muted mt-[2px]">{value}</Text>}
      </View>
      {onPress && <Ionicons name="chevron-forward" size={18} color="#E2E8F0" />}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <SubAppHeader
        label="PREFERENCES"
        title="Settings"
        description="Customize your experience and manage account security."
        showBack
        onBack={() => router.back()}
        onNotification={() => {}}
      />

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animated.View entering={FadeInUp.delay(100)} className="mb-8">
          <Card className="p-5 flex-row items-center gap-4">
            <View className="w-14 h-14 rounded-full bg-primary items-center justify-center">
              <Text className="text-h2 text-white text-[20px]">{user?.name?.[0]}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-h3 text-ink uppercase">{user?.name}</Text>
              <Text className="text-body-sm text-muted uppercase">{user?.role === 'artisan' ? 'Artisan' : 'Client'}</Text>
            </View>
            <TouchableOpacity 
              className="p-2"
              onPress={() => router.push('/profile-completion')}
            >
              <Ionicons name="pencil-outline" size={20} color="#078365" />
            </TouchableOpacity>
          </Card>
        </Animated.View>

        {/* Section: Language */}
        <Text className="text-label mb-3 ml-1 uppercase">Language</Text>
        <Card className="mb-8 overflow-hidden p-0">
          {(Object.keys(languageNames) as Language[]).map((lang, i, arr) => (
            <TouchableOpacity
              key={lang}
              className={`flex-row items-center justify-between py-[18px] px-5 ${i < arr.length - 1 ? 'border-b border-card-border' : ''}`}
              onPress={() => setLanguage(lang)}
            >
              <Text className={`text-body uppercase ${language === lang ? 'text-primary font-jakarta-bold' : 'text-ink font-jakarta-semibold'}`}>{languageNames[lang]}</Text>
              {language === lang && <Ionicons name="checkmark-circle" size={20} color="#078365" />}
            </TouchableOpacity>
          ))}
        </Card>


        <Text className="text-label mb-3 ml-1 uppercase">Preferences</Text>
        <Card className="mb-8 overflow-hidden p-0">
          {/* Push Notifications */}
          <View className="flex-row items-center p-5 border-b border-card-border">
            <View className="w-9 h-9 rounded-[10px] bg-info/10 items-center justify-center mr-4">
              <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
            </View>
            <Text className="text-body flex-1 font-jakarta-bold uppercase">Push Notifications</Text>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: '#E2E8F0', true: '#22C55E40' }}
              thumbColor={notifEnabled ? '#22C55E' : '#64748B'}
            />
          </View>

          {/* Dark Mode */}
          <View className="p-5">
            <View className="flex-row items-center mb-4">
              <View className="w-9 h-9 rounded-[10px] bg-violet-500/10 items-center justify-center mr-4">
                <Ionicons name="moon-outline" size={20} color="#8B5CF6" />
              </View>
              <Text className="text-body flex-1 font-jakarta-bold uppercase">Appearance</Text>
            </View>
            <View className="flex-row gap-2">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setThemeMode(mode)}
                  className={`flex-1 py-[10px] rounded-lg items-center border ${
                    themeMode === mode ? 'bg-violet-500 border-violet-500' : 'bg-gray-100 border-card-border'
                  }`}
                >
                  <Ionicons
                    name={mode === 'light' ? 'sunny-outline' : mode === 'dark' ? 'moon-outline' : 'phone-portrait-outline'}
                    size={16}
                    color={themeMode === mode ? 'white' : '#64748B'}
                  />
                  <Text className={`text-[10px] font-jakarta-bold mt-1 uppercase ${
                    themeMode === mode ? 'text-white' : 'text-muted'
                  }`}>
                    {mode === 'system' ? 'Auto' : mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* Section: Account & Support */}
        <Text className="text-label mb-3 ml-1 uppercase">Account & Support</Text>
        <Card className="mb-8 overflow-hidden p-0">
          <SettingItem
            icon="swap-horizontal"
            label="Switch Role"
            value={`Currently using as ${user?.role === 'artisan' ? 'Artisan' : 'Client'}`}
            onPress={handleRoleSwitch}
            color="#F59E0B"
          />
          <SettingItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => router.push("/help")}
            color="#3B82F6"
          />
          <SettingItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => { }}
            isLast={true}
            color="#22C55E"
          />
        </Card>

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 mt-4 p-4 bg-error/10 rounded-lg"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-body text-error font-jakarta-extrabold uppercase">Sign Out</Text>
        </TouchableOpacity>

        <View className="mt-12 items-center">
          <Text className="text-label text-[10px] text-muted normal-case italic">Loom for Africa • Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View >
  );
}


