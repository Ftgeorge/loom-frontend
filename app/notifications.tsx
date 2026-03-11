import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/StateComponents';
import { notificationApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const TYPE_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
    job_update: { icon: 'briefcase-outline', color: Colors.primary, bg: Colors.primaryLight },
    message: { icon: 'chatbubbles-outline', color: Colors.primary, bg: Colors.primaryLight },
    booking: { icon: 'calendar-outline', color: Colors.primary, bg: Colors.primaryLight },
    review: { icon: 'star-outline', color: Colors.accent, bg: Colors.accentLight },
    system: { icon: 'shield-outline', color: Colors.muted, bg: Colors.gray100 },
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, setNotifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const res = await notificationApi.list({ limit: 50 });
            const mapped = (res.results as any[]).map((row: any) => ({
                id: row.id,
                type: row.type ?? 'system',
                title: row.title,
                body: row.body,
                message: row.body,
                read: Boolean(row.read),
                createdAt: row.created_at,
            }));
            setNotifications(mapped || []);
        } catch {
        } finally {
            setLoading(false);
        }
    }, [setNotifications]);

    const handleMarkAllRead = async () => {
        markAllNotificationsRead();
        try { await notificationApi.markAllRead(); } catch { }
    };

    useEffect(() => { load(); }, [load]);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
            <AppHeader
                title="Notifications"
                showBack
                onBack={() => router.back()}
                showNotification={false}
                rightAction={
                    <TouchableOpacity
                        onPress={handleMarkAllRead}
                        style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            backgroundColor: Colors.white,
                            borderRadius: Radius.xs,
                            borderWidth: 1,
                            borderColor: Colors.cardBorder,
                            ...Shadows.sm
                        }}
                    >
                        <Text style={[Typography.label, { color: Colors.primary, fontSize: 8 }]}>CLEAR ALL</Text>
                    </TouchableOpacity>
                }
            />

            {loading ? (
                <View style={{ padding: 24 }}><SkeletonList count={5} type="notification" /></View>
            ) : notifications.length === 0 ? (
                <EmptyState
                    icon="notifications-off-outline"
                    title="No Notifications"
                    message="You're all caught up! We'll let you know when something new arrives."
                />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    initialNumToRender={15}
                    maxToRenderPerBatch={15}
                    windowSize={5}
                    removeClippedSubviews={true}
                    renderItem={({ item, index }) => {
                        const typeInfo = TYPE_ICONS[item.type] || TYPE_ICONS.system;
                        return (
                            <Animated.View entering={FadeInRight.delay(index * 30).springify()}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: 24,
                                        paddingVertical: 24,
                                        gap: 20,
                                        backgroundColor: item.read ? 'transparent' : Colors.white,
                                        borderBottomWidth: 1,
                                        borderBottomColor: Colors.gray100
                                    }}
                                    onPress={() => markNotificationRead(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: Radius.xs,
                                        backgroundColor: typeInfo.bg || Colors.primaryLight,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: item.read ? 'transparent' : typeInfo.color + '20'
                                    }}>
                                        <Ionicons
                                            name={typeInfo.icon as any}
                                            size={24}
                                            color={typeInfo.color || Colors.primary}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                            <Text style={[Typography.h3, { fontSize: 16, flex: 1, color: Colors.text }]} numberOfLines={1}>{item.title}</Text>
                                            <Text style={[Typography.label, { fontSize: 9, color: Colors.muted, letterSpacing: 0 }]}>{timeAgo(item.createdAt).toUpperCase()}</Text>
                                        </View>
                                        <Text
                                            style={[Typography.bodySmall, { color: item.read ? Colors.muted : Colors.textSecondary, lineHeight: 22 }]}
                                            numberOfLines={2}
                                        >
                                            {item.body}
                                        </Text>
                                        {!item.read && (
                                            <View style={{
                                                position: 'absolute',
                                                top: 6,
                                                left: -12,
                                                width: 6,
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: Colors.accent,
                                                ...Shadows.sm
                                            }} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    }}
                />
            )}
        </View>
    );
}
