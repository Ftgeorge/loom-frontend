import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/CardChipBadge";
import { languageNames } from "@/i18n";
import { useAppStore } from "@/store";
import { Colors, Radius, Typography } from "@/theme";
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
  const { language, setLanguage, user, switchRole, signOut } = useAppStore();
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleRoleSwitch = () => {
    const newRole: UserRole = user?.role === "client" ? "artisan" : "client";
    Alert.alert(
      "Switch Mode",
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
    ]);
  };

  const SettingItem = ({ icon, label, value, onPress, isLast = false, color = Colors.primary }: any) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: Colors.surface,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: Colors.cardBorder
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: color + '10', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[Typography.body, { fontSize: 15, fontFamily: 'MontserratAlternates-SemiBold', color: Colors.text }]}>{label}</Text>
        {value && <Text style={[Typography.bodySmall, { fontSize: 13, color: Colors.muted, marginTop: 2 }]}>{value}</Text>}
      </View>
      {onPress && <Ionicons name="chevron-forward" size={18} color={Colors.cardBorder} />}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title="Settings"
        showBack
        onBack={() => router.back()}
        showNotification={false}
      />

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animated.View entering={FadeInUp.delay(100)} style={{ marginBottom: 32 }}>
          <Card style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[Typography.h2, { color: Colors.white, fontSize: 20 }]}>{user?.name?.[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={Typography.h3}>{user?.name}</Text>
              <Text style={[Typography.bodySmall, { color: Colors.muted }]}>{user?.role === 'artisan' ? 'Artisan Partner' : 'Loom Customer'}</Text>
            </View>
            <TouchableOpacity style={{ padding: 8 }}>
              <Ionicons name="pencil-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </Card>
        </Animated.View>

        {/* Section: Language */}
        <Text style={[Typography.label, { marginBottom: 12, marginLeft: 4 }]}>Language Preference</Text>
        <Card noPadding style={{ marginBottom: 32, overflow: 'hidden' }}>
          {(Object.keys(languageNames) as Language[]).map((lang, i, arr) => (
            <TouchableOpacity
              key={lang}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 18,
                paddingHorizontal: 20,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                borderBottomColor: Colors.cardBorder
              }}
              onPress={() => setLanguage(lang)}
            >
              <Text style={[Typography.body, { color: language === lang ? Colors.primary : Colors.text, fontFamily: language === lang ? 'MontserratAlternates-SemiBold' : 'MontserratAlternates' }]}>{languageNames[lang]}</Text>
              {language === lang && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Section: Preferences */}
        <Text style={[Typography.label, { marginBottom: 12, marginLeft: 4 }]}>Preferences</Text>
        <Card noPadding style={{ marginBottom: 32, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.info + '10', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <Ionicons name="notifications-outline" size={20} color={Colors.info} />
            </View>
            <Text style={[Typography.body, { flex: 1, fontFamily: 'MontserratAlternates-SemiBold' }]}>Push Notifications</Text>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: Colors.cardBorder, true: Colors.success + '40' }}
              thumbColor={notifEnabled ? Colors.success : Colors.muted}
            />
          </View>
        </Card>

        {/* Section: Account & Support */}
        <Text style={[Typography.label, { marginBottom: 12, marginLeft: 4 }]}>Support & Legal</Text>
        <Card noPadding style={{ marginBottom: 32, overflow: 'hidden' }}>
          <SettingItem
            icon="swap-horizontal"
            label="Switch Mode"
            value={`Usage as ${user?.role === 'artisan' ? 'Client' : 'Artisan'}`}
            onPress={handleRoleSwitch}
            color={Colors.warning}
          />
          <SettingItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => router.push("/help")}
            color={Colors.info}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => { }}
            isLast={true}
            color={Colors.success}
          />
        </Card>

        {/* Logout */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,
            padding: 16,
            backgroundColor: Colors.error + '10',
            borderRadius: Radius.lg
          }}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={[Typography.body, { color: Colors.error, fontFamily: 'MontserratAlternates-Bold' }]}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 48, alignItems: 'center' }}>
          <Text style={[Typography.label, { fontSize: 10, color: Colors.muted }]}>Loom for Africa • Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

