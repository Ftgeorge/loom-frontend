import { t } from '@/i18n';
import { useAppStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Tab definition ─────────────────────────────────────────────────────────
interface TabDef {
    name: string;
    icon: string;        // outline variant
    iconFilled: string;  // filled variant (no -outline suffix)
    label: string;
}

// ─── Single tab button ───────────────────────────────────────────────────────
function TabButton({
    tab,
    focused,
    onPress,
}: {
    tab: TabDef;
    focused: boolean;
    onPress: () => void;
}) {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1.12 : 1,
            useNativeDriver: true,
            damping: 12,
            stiffness: 200,
        }).start();
        Animated.timing(opacity, {
            toValue: focused ? 1 : 0,
            duration: 180,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    const handlePress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            className="flex-1 h-full items-center justify-center relative"
        >
            {/* Active dot indicator */}
            <Animated.View
                style={{ opacity }}
                className="absolute top-[10px] w-1 h-1 rounded-full bg-primary"
            />

            {/* Icon */}
            <Animated.View style={{ transform: [{ scale }] }}>
                <Ionicons
                    name={(focused ? tab.iconFilled : tab.icon) as any}
                    size={24}
                    className={focused ? 'text-primary' : 'text-gray-400'}
                />
            </Animated.View>
        </TouchableOpacity>
    );
}

// Which tabs each role should see — explicit and reliable
const CLIENT_TABS = ['home', 'search', 'requests', 'messages', 'profile'];
const ARTISAN_TABS = ['dashboard', 'jobs', 'messages', 'earnings', 'profile'];

// ─── Custom floating tab bar ─────────────────────────────────────────────────
function FloatingTabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();
    const { user } = useAppStore();
    const isArtisan = user?.role === 'artisan';

    const allowedNames = isArtisan ? ARTISAN_TABS : CLIENT_TABS;

    const visibleRoutes = state.routes.filter(
        (route: any) => allowedNames.includes(route.name),
    );

    return (
        <View
            style={{ bottom: Math.max(insets.bottom, 16) + 4 }}
            className="absolute left-6 right-6 h-16 rounded-[32px] flex-row items-center justify-around overflow-hidden border-[2px] border-black/5 shadow-lg bg-white"
        >
            {Platform.OS === 'ios' ? (
                <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            ) : (
                <View style={StyleSheet.absoluteFill} className="bg-white" />
            )}

            {visibleRoutes.map((route: any) => {
                const focused = state.routes[state.index]?.name === route.name;
                const opts = descriptors[route.key]?.options as any;

                return (
                    <TabButton
                        key={route.key}
                        tab={{
                            name: route.name,
                            icon: opts?._icon ?? 'ellipse-outline',
                            iconFilled: opts?._iconFilled ?? 'ellipse',
                            label: opts?.title ?? route.name,
                        }}
                        focused={focused}
                        onPress={() => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!focused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        }}
                    />
                );
            })}
        </View>
    );
}

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

