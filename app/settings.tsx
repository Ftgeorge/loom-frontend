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

  const SettingItem = ({ icon, label, value, onPress, isLast = false, colorClass = 'bg-primary/10', iconColor = '#078365' }: any) => (
    <TouchableOpacity
      className={`flex-row items-center py-5 px-6 bg-white ${!isLast ? 'border-b border-card-border' : ''}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 shadow-sm border border-card-border/50 ${colorClass}`}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-body text-[15px] font-jakarta-bold text-ink uppercase tracking-tight">{label}</Text>
        {value && <Text className="text-body-sm text-[12px] text-muted mt-1 normal-case italic font-jakarta-medium">{value}</Text>}
      </View>
      {onPress && <Ionicons name="chevron-forward" size={18} color="#94A3B8" />}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <SubAppHeader
        label="PREFERENCES"
        title="SETTINGS"
        description="Customize your ecosystem experience and profile security."
        showBack
        onBack={() => router.back()}
        onNotification={() => {}}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Identity Card */}
        <Animated.View entering={FadeInUp.delay(100).springify()} className="mb-10">
          <Card className="p-6 flex-row items-center gap-5 bg-white rounded-[24px] border-[1.5px] border-card-border shadow-md">
            <View className="w-16 h-16 rounded-full bg-primary items-center justify-center border-4 border-primary/10 shadow-lg">
              <Text className="text-h2 text-white text-[24px] font-jakarta-extrabold uppercase italic">{user?.name?.[0]}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-h3 text-ink uppercase font-jakarta-extrabold italic tracking-tight">{user?.name}</Text>
              <View className="flex-row items-center gap-1.5 mt-1">
                <View className="w-1.5 h-1.5 rounded-full bg-accent shadow-sm" />
                <Text className="text-body-sm text-muted uppercase text-[9px] tracking-widest font-jakarta-bold">{user?.role === 'artisan' ? 'Professional Artisan' : 'Active Client'}</Text>
              </View>
            </View>
            <TouchableOpacity 
              className="p-3 bg-surface rounded-xl border border-card-border shadow-sm"
              onPress={() => router.push('/profile-completion')}
            >
              <Ionicons name="pencil-outline" size={20} color="#00120C" />
            </TouchableOpacity>
          </Card>
        </Animated.View>

        {/* Section: Localization */}
        <Text className="text-label mb-3 ml-2 uppercase tracking-widest text-[10px] text-primary font-jakarta-bold">Localization</Text>
        <Card className="mb-10 overflow-hidden p-0 bg-white rounded-[24px] border-[1.5px] border-card-border shadow-sm">
          {(Object.keys(languageNames) as Language[]).map((lang, i, arr) => (
            <TouchableOpacity
              key={lang}
              className={`flex-row items-center justify-between py-5 px-6 ${i < arr.length - 1 ? 'border-b border-card-border' : ''}`}
              onPress={() => setLanguage(lang)}
            >
              <Text className={`text-body uppercase tracking-tight ${language === lang ? 'text-primary font-jakarta-extrabold italic' : 'text-ink font-jakarta-bold'}`}>{languageNames[lang]}</Text>
              {language === lang && (
                <View className="bg-primary/10 w-7 h-7 rounded-full items-center justify-center">
                  <Ionicons name="checkmark-circle" size={20} color="#00120C" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Section: Operational Preferences */}
        <Text className="text-label mb-3 ml-2 uppercase tracking-widest text-[10px] text-primary font-jakarta-bold">Operations</Text>
        <Card className="mb-10 overflow-hidden p-0 bg-white rounded-[24px] border-[1.5px] border-card-border shadow-sm">
          {/* Push Intelligence */}
          <View className="flex-row items-center p-6 border-b border-card-border">
            <View className="w-10 h-10 rounded-xl bg-info/10 items-center justify-center mr-4 border border-info/20 shadow-xs">
              <Ionicons name="notifications-outline" size={22} color="#3B82F6" />
            </View>
            <Text className="text-body flex-1 font-jakarta-extrabold uppercase tracking-tight text-ink">Push Intelligence</Text>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: '#E2E8F0', true: '#22C55E40' }}
              thumbColor={notifEnabled ? '#1AB26C' : '#64748B'}
            />
          </View>

          {/* Aesthetic Appearance */}
          <View className="p-6">
            <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 rounded-xl bg-violet-500/10 items-center justify-center mr-4 border border-violet-500/20 shadow-xs">
                <Ionicons name="moon-outline" size={22} color="#8B5CF6" />
              </View>
              <Text className="text-body flex-1 font-jakarta-extrabold uppercase tracking-tight text-ink">Mission Aesthetics</Text>
            </View>
            <View className="flex-row gap-3">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setThemeMode(mode)}
                  className={`flex-1 py-4 rounded-xl items-center border shadow-sm ${
                    themeMode === mode ? 'bg-primary border-primary' : 'bg-surface border-card-border'
                  }`}
                  style={{ transform: [{ scale: themeMode === mode ? 1.02 : 1 }] }}
                >
                  <Ionicons
                    name={mode === 'light' ? 'sunny-outline' : mode === 'dark' ? 'moon-outline' : 'phone-portrait-outline'}
                    size={18}
                    color={themeMode === mode ? 'white' : '#64748B'}
                  />
                  <Text className={`text-[10px] font-jakarta-extrabold mt-2 uppercase tracking-widest ${
                    themeMode === mode ? 'text-white' : 'text-muted'
                  }`}>
                    {mode === 'system' ? 'Auto' : mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* Section: Security & Protocol */}
        <Text className="text-label mb-3 ml-2 uppercase tracking-widest text-[10px] text-primary font-jakarta-bold">Security & Protocols</Text>
        <Card className="mb-10 overflow-hidden p-0 bg-white rounded-[24px] border-[1.5px] border-card-border shadow-sm">
          <SettingItem
            icon="swap-horizontal"
            label="Switch Protocol"
            value={`Active Role: ${user?.role === 'artisan' ? 'Professional Artisan' : 'Private Client'}`}
            onPress={handleRoleSwitch}
            colorClass="bg-accent/10"
            iconColor="#7DCCFF"
          />
          <SettingItem
            icon="help-circle-outline"
            label="Mission Support"
            onPress={() => router.push("/help")}
            colorClass="bg-info/10"
            iconColor="#3B82F6"
          />
          <SettingItem
            icon="shield-checkmark-outline"
            label="Legal Integrity"
            onPress={() => { }}
            isLast={true}
            colorClass="bg-success/10"
            iconColor="#1AB26C"
          />
        </Card>

        {/* Terminate Session */}
        <TouchableOpacity
          className="flex-row items-center justify-center gap-3 mt-4 p-6 bg-error/10 rounded-[20px] border border-error/20 shadow-sm"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text className="text-body text-error font-jakarta-extrabold uppercase tracking-widest text-[11px]">Terminate Session</Text>
        </TouchableOpacity>

        <View className="mt-16 items-center">
          <View className="flex-row items-center gap-2 mb-2 opacity-50">
            <Ionicons name="infinite" size={14} color="#64748B" />
            <Text className="text-label text-[9px] text-muted uppercase tracking-widest font-jakarta-bold italic">Loom Tactical Marketplace</Text>
          </View>
          <Text className="text-label text-[8px] text-muted uppercase tracking-tighter opacity-30 font-jakarta-medium">Build Core 1.0.4 • Stable Branch</Text>
        </View>
      </ScrollView>
    </View >
  );
}



