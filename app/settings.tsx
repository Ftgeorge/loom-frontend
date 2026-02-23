import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/ui/CardChipBadge';
import { languageNames } from '@/i18n';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import type { Language, UserRole } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();
    const { language, setLanguage, user, switchRole, signOut } = useAppStore();
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(true);

    const handleRoleSwitch = () => {
        const newRole: UserRole = user?.role === 'client' ? 'artisan' : 'client';
        Alert.alert(
            'Switch Role',
            `Switch to ${newRole === 'client' ? 'Client' : 'Artisan'} mode?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Switch',
                    onPress: () => {
                        switchRole(newRole);
                        router.replace(newRole === 'artisan' ? '/(tabs)/dashboard' : '/(tabs)/home');
                    },
                },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: () => { signOut(); router.replace('/'); } },
        ]);
    };

    return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Settings" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                {/* Language */}
                <Text className="text-xs text-gray-500 font-semibold mt-8 mb-2 ml-1">LANGUAGE</Text>
                <Card noPadding>
                    {(Object.keys(languageNames) as Language[]).map((lang, i, arr) => (
                        <TouchableOpacity
                            key={lang}
                            className={`flex-row items-center justify-between py-5 px-5 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                            onPress={() => setLanguage(lang)}
                        >
                            <Text className="text-base">{languageNames[lang]}</Text>
                            {language === lang && (
                                <Ionicons name="checkmark" size={22} color={Colors.softSageDark} />
                            )}
                        </TouchableOpacity>
                    ))}
                </Card>

                {/* Notifications */}
                <Text className="text-xs text-gray-500 font-semibold mt-8 mb-2 ml-1">NOTIFICATIONS</Text>
                <Card noPadding>
                    <View className="flex-row items-center justify-between py-5 px-5">
                        <Text className="text-base">Push Notifications</Text>
                        <Switch
                            value={notifEnabled}
                            onValueChange={setNotifEnabled}
                            trackColor={{ false: Colors.gray300, true: Colors.softSage }}
                        />
                    </View>
                </Card>

                {/* Role Switch */}
                <Text className="text-xs text-gray-500 font-semibold mt-8 mb-2 ml-1">ACCOUNT</Text>
                <Card noPadding>
                    <TouchableOpacity className="flex-row items-center justify-between py-5 px-5 border-b border-gray-100" onPress={handleRoleSwitch}>
                        <View className="flex-row items-center gap-4">
                            <Ionicons name="swap-horizontal-outline" size={22} color={Colors.deepOlive} />
                            <View>
                                <Text className="text-base">Switch Role</Text>
                                <Text className="text-xs text-gray-400 mt-0.5">
                                    Currently: {user?.role === 'client' ? 'Client' : 'Artisan'}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between py-5 px-5 border-b border-gray-100" onPress={() => router.push('/help')}>
                        <View className="flex-row items-center gap-4">
                            <Ionicons name="help-circle-outline" size={22} color={Colors.deepOlive} />
                            <Text className="text-base">Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between py-5 px-5">
                        <View className="flex-row items-center gap-4">
                            <Ionicons name="document-text-outline" size={22} color={Colors.deepOlive} />
                            <Text className="text-base">Privacy & Terms</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
                    </TouchableOpacity>
                </Card>

                {/* Logout */}
                <TouchableOpacity className="flex-row items-center justify-center gap-2 mt-10 p-5" onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={Colors.error} />
                    <Text className="text-base text-red-500 font-semibold">Log Out</Text>
                </TouchableOpacity>

                <Text className="text-xs text-gray-400 text-center mt-5">Operis v1.0.0</Text>
            </ScrollView>
        </View>
    );
}
