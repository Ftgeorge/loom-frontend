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
import { LoomThread } from "@/components/ui/LoomThread";
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SettingItem } from "@/components/ui/SettingItem";

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

  return (
    <View className="flex-1 bg-background">
      <View className="absolute inset-0">
         <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
      </View>
      <SubAppHeader
        label="CORE PREFERENCES"
        title="SETTINGS"
        description="Customize your ecosystem experience and profile security protocols."
        showBack
        onBack={() => router.back()}
        onNotification={() => router.push('/notifications')}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Profile Identity Matrix ────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(100).springify()} className="mb-12">
          <View className="p-8 flex-row items-center gap-6 bg-white rounded-[42px] border-[1.5px] border-card-border/50 shadow-2xl">
            <View className="w-18 h-18 rounded-[24px] bg-primary items-center justify-center border-[4px] border-primary/10 shadow-xl">
              <Text className="text-[28px] text-white font-jakarta-extrabold uppercase italic tracking-tighter">{user?.name?.[0]}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[22px] text-ink uppercase font-jakarta-extrabold italic tracking-tighter leading-tight" numberOfLines={1}>{user?.name}</Text>
              <View className="flex-row items-center gap-2 mt-2">
                <View className="w-2 h-2 rounded-full bg-accent shadow-accent/50 shadow-inner" />
                <Text className="text-body-sm text-ink/50 uppercase text-[10px] tracking-[4px] font-jakarta-extrabold italic">{user?.role === 'artisan' ? 'PROFESSIONAL' : 'ACTIVE CLIENT'}</Text>
              </View>
            </View>
            <TouchableOpacity 
              className="w-12 h-12 bg-background rounded-2xl border border-card-border/50 items-center justify-center shadow-inner active:scale-95"
              onPress={() => router.push('/profile-completion')}
            >
              <Ionicons name="pencil-outline" size={20} color="#00120C" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ─── Localization Registry ────────────────────────────────────────── */}
        <View className="flex-row items-center gap-2 mb-4 px-1">
            <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
            <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">LOCALIZATION</Text>
        </View>
        <View className="mb-12 overflow-hidden bg-white rounded-[42px] border-[1.5px] border-card-border/50 shadow-2xl">
          {(Object.keys(languageNames) as Language[]).map((lang, i, arr) => (
            <TouchableOpacity
              key={lang}
              className={`flex-row items-center justify-between py-6 px-8 ${i < arr.length - 1 ? 'border-b border-card-border/30' : ''} active:bg-gray-50`}
              onPress={() => setLanguage(lang)}
            >
              <Text className={`text-[15px] uppercase tracking-tighter ${language === lang ? 'text-primary font-jakarta-extrabold italic scale-105' : 'text-ink font-jakarta-extrabold italic opacity-40'}`}>{languageNames[lang].toUpperCase()}</Text>
              {language === lang && (
                <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center border border-primary/20">
                  <Ionicons name="checkmark-done" size={18} color="#00120C" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Operational Controls ────────────────────────────────────────── */}
        <View className="flex-row items-center gap-2 mb-4 px-1">
            <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
            <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">OPERATIONAL CONTROL</Text>
        </View>
        <View className="mb-12 overflow-hidden bg-white rounded-[42px] border-[1.5px] border-card-border/50 shadow-2xl">
          {/* Push Intelligence */}
          <View className="flex-row items-center p-8 border-b border-card-border/30">
            <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center mr-5 border border-primary/20 shadow-inner">
              <Ionicons name="notifications-outline" size={24} color="#078365" />
            </View>
            <View className="flex-1">
                <Text className="text-[15px] font-jakarta-extrabold uppercase italic tracking-tighter text-ink">PUSH INTEL</Text>
                <Text className="text-[11px] text-ink/40 mt-1 italic font-jakarta-bold">REAL-TIME GRID ALERTS</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: '#E2E8F0', true: '#22C55E40' }}
              thumbColor={notifEnabled ? '#1AB26C' : '#64748B'}
            />
          </View>

          {/* Mission Aesthetics */}
          <View className="p-8">
            <View className="flex-row items-center mb-8">
              <View className="w-12 h-12 rounded-2xl bg-accent/10 items-center justify-center mr-5 border border-accent/20 shadow-inner">
                <Ionicons name="color-palette-outline" size={24} color="#00120C" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-jakarta-extrabold uppercase italic tracking-tighter text-ink">AESTHETIC GRID</Text>
                <Text className="text-[11px] text-ink/40 mt-1 italic font-jakarta-bold">SYSTEM INTERFACE MODE</Text>
              </View>
            </View>
            <View className="flex-row gap-4">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setThemeMode(mode)}
                  className={`flex-1 py-5 rounded-2xl items-center border shadow-xl transition-all ${
                    themeMode === mode ? 'bg-primary border-primary shadow-primary/20' : 'bg-background border-card-border/30 opacity-60'
                  }`}
                  style={{ transform: [{ scale: themeMode === mode ? 1.05 : 1 }] }}
                >
                  <Ionicons
                    name={mode === 'light' ? 'sunny' : mode === 'dark' ? 'moon' : 'infinite'}
                    size={22}
                    color={themeMode === mode ? 'white' : '#64748B'}
                  />
                  <Text className={`text-[10px] font-jakarta-extrabold mt-3 uppercase tracking-[3px] italic ${
                    themeMode === mode ? 'text-white' : 'text-muted'
                  }`}>
                    {mode === 'system' ? 'AUTO' : mode.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ─── Security Protocols ────────────────────────────────────────── */}
        <View className="flex-row items-center gap-2 mb-4 px-1">
            <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
            <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">SECURITY & PROTOCOL</Text>
        </View>
        <View className="mb-14 overflow-hidden bg-white rounded-[42px] border-[1.5px] border-card-border/50 shadow-2xl">
          <SettingItem
            icon="swap-horizontal"
            label="SWITCH PROTOCOL"
            value={`CURRENT IDENTITY: ${user?.role === 'artisan' ? 'PROFESSIONAL ARTISAN' : 'PRIVATE CLIENT'}`}
            onPress={handleRoleSwitch}
            colorClass="bg-accent/10"
            iconColor="#00120C"
          />
          <SettingItem
            icon="help-circle-outline"
            label="MISSION SUPPORT"
            value="DIRECT LINE TO COMMAND CENTER"
            onPress={() => router.push("/help")}
            colorClass="bg-info/10"
            iconColor="#3B82F6"
          />
          <SettingItem
            icon="shield-checkmark-outline"
            label="LEGAL INTEGRITY"
            value="PRIVACY & OPERATIONAL TERMS"
            onPress={() => { }}
            isLast={true}
            colorClass="bg-success/10"
            iconColor="#1AB26C"
          />
        </View>

        {/* ─── Termination Protocol ─────────────────────────────────────── */}
        <TouchableOpacity
          className="flex-row items-center justify-center gap-4 p-8 bg-error/10 rounded-[32px] border-[2px] border-error/20 shadow-2xl active:bg-error/20"
          onPress={handleLogout}
        >
          <Ionicons name="power-outline" size={24} color="#EF4444" />
          <Text className="text-[13px] text-error font-jakarta-extrabold uppercase tracking-[4px] italic">TERMINATE SESSION</Text>
        </TouchableOpacity>

        <View className="mt-20 items-center opacity-30 pointer-events-none">
          <View className="flex-row items-center gap-3 mb-3">
            <Ionicons name="infinite" size={16} color="#64748B" />
            <Text className="text-label text-[10px] text-muted uppercase tracking-[6px] font-jakarta-extrabold italic">LOOM TACTICAL SYSTEM</Text>
          </View>
          <Text className="text-label text-[8px] text-muted uppercase tracking-widest font-jakarta-extrabold">BUILD v4.2.0 • CORE STABLE</Text>
        </View>
      </ScrollView>
    </View >
  );
}
