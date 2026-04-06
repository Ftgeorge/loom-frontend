import { t } from '@/i18n';
import { useAppStore } from '@/store';
import { Tabs } from 'expo-router';
import React from 'react';

import { FloatingTabBar } from '@/components/navigation/TabBar';

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function TabsLayout() {
    const { user, language } = useAppStore();
    const isArtisan = user?.role === 'artisan';

    return (
        <Tabs
            tabBar={(props) => <FloatingTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            {/* CLIENT */}
            <Tabs.Screen
                name="home"
                options={{
                    title: t('home', language),
                    href: isArtisan ? null : undefined,
                    // @ts-ignore custom props for our tab bar
                    _icon: 'home-outline',
                    _iconFilled: 'home',
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: t('search', language),
                    href: isArtisan ? null : undefined,
                    // @ts-ignore
                    _icon: 'search-outline',
                    _iconFilled: 'search',
                }}
            />

            {/* ARTISAN */}
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: t('dashboard', language),
                    href: isArtisan ? undefined : null,
                    // @ts-ignore
                    _icon: 'grid-outline',
                    _iconFilled: 'grid',
                }}
            />
            <Tabs.Screen
                name="jobs"
                options={{
                    title: t('jobs', language),
                    href: isArtisan ? undefined : null,
                    // @ts-ignore
                    _icon: 'briefcase-outline',
                    _iconFilled: 'briefcase',
                }}
            />

            {/* CLIENT: Requests */}
            <Tabs.Screen
                name="requests"
                options={{
                    title: t('requests', language),
                    href: isArtisan ? null : undefined,
                    // @ts-ignore
                    _icon: 'document-text-outline',
                    _iconFilled: 'document-text',
                }}
            />

            {/* SHARED: Messages */}
            <Tabs.Screen
                name="messages"
                options={{
                    title: t('messages', language),
                    // @ts-ignore
                    _icon: 'chatbubbles-outline',
                    _iconFilled: 'chatbubbles',
                }}
            />

            {/* ARTISAN: Earnings */}
            <Tabs.Screen
                name="earnings"
                options={{
                    title: t('earnings', language),
                    href: isArtisan ? undefined : null,
                    // @ts-ignore
                    _icon: 'wallet-outline',
                    _iconFilled: 'wallet',
                }}
            />

            {/* SHARED: Profile */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('profile', language),
                    // @ts-ignore
                    _icon: 'person-outline',
                    _iconFilled: 'person',
                }}
            />
        </Tabs>
    );
}

