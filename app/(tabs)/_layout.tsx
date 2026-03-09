import { t } from '@/i18n';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
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
            style={styles.tabButton}
        >
            {/* Active dot indicator */}
            <Animated.View
                style={[
                    styles.activeDot,
                    { opacity },
                ]}
            />

            {/* Icon */}
            <Animated.View style={{ transform: [{ scale }] }}>
                <Ionicons
                    name={(focused ? tab.iconFilled : tab.icon) as any}
                    size={24}
                    color={focused ? Colors.primary : Colors.gray400}
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
            style={[
                styles.barWrapper,
                { bottom: Math.max(insets.bottom, 16) + 4 },
            ]}
        >
            {Platform.OS === 'ios' ? (
                <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            ) : (
                <View style={[StyleSheet.absoluteFill, styles.androidBg]} />
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    barWrapper: {
        position: 'absolute',
        left: 24,
        right: 24,
        height: 64,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.06)',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 12,
        backgroundColor: 'white'
    },
    androidBg: {
        backgroundColor: '#FFFFFF',
    },
    tabButton: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeDot: {
        position: 'absolute',
        top: 10,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.primary,
    },
});
