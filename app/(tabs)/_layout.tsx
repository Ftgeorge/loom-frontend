import { t } from '@/i18n';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
    const { user, language } = useAppStore();
    const isArtisan = user?.role === 'artisan';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopColor: Colors.cardBorder,
                    borderTopWidth: 1,
                    height: 88,
                    paddingTop: 8,
                    paddingBottom: 28,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.gray400,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            {/* CLIENT TABS */}
            <Tabs.Screen
                name="home"
                options={{
                    title: t('home', language),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                    href: isArtisan ? null : '/home',
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: t('search', language),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search-outline" size={size} color={color} />
                    ),
                    href: isArtisan ? null : '/search',
                }}
            />

            {/* ARTISAN TABS */}
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: t('dashboard', language),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid-outline" size={size} color={color} />
                    ),
                    href: isArtisan ? '/dashboard' : null,
                }}
            />
            <Tabs.Screen
                name="jobs"
                options={{
                    title: t('jobs', language),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="briefcase-outline" size={size} color={color} />
                    ),
                    href: isArtisan ? '/jobs' : null,
                }}
            />

            {/* SHARED: Requests (Client) */}
            <Tabs.Screen
                name="requests"
                options={{
                    title: t('requests', language),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    ),
                    href: isArtisan ? null : '/requests',
                }}
            />

            {/* SHARED: Messages */}
            <Tabs.Screen
                name="messages"
                options={{
                    title: t('messages', language),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* ARTISAN: Earnings */}
            <Tabs.Screen
                name="earnings"
                options={{
                    title: t('earnings', language),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet-outline" size={size} color={color} />
                    ),
                    href: isArtisan ? '/earnings' : null,
                }}
            />

            {/* SHARED: Profile */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('profile', language),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
