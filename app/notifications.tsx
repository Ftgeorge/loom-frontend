import { AppHeader } from '@/components/AppHeader';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/StateComponents';
import { notificationApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Typography } from '@/theme';
import { timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const TYPE_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
    job_update: { icon: 'briefcase', color: Colors.primary, bg: Colors.primaryLight },
    message: { icon: 'chatbubble', color: Colors.primary, bg: Colors.primaryLight },
    booking: { icon: 'calendar', color: Colors.primary, bg: Colors.primaryLight },
    review: { icon: 'star', color: Colors.accent, bg: Colors.accentLight },
    system: { icon: 'information-circle', color: Colors.muted, bg: Colors.cardBorder + '30' },
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, setNotifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            // GET /notifications
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

    // Wire "Mark all read" to the real endpoint
    const handleMarkAllRead = async () => {
        markAllNotificationsRead(); // optimistic local update
        try { await notificationApi.markAllRead(); } catch { }
    };

    useEffect(() => { load(); }, [load]);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader
                title="Notifications"
                showBack
                onBack={() => router.back()}
                showNotification={false}
                rightAction={
                    <TouchableOpacity onPress={handleMarkAllRead} hitSlop={12}>
                        <Text style={[Typography.label, { color: Colors.primary, textTransform: 'none' }]}>Mark all read</Text>
                    </TouchableOpacity>
                }
            />

            {loading ? (
                <View style={{ padding: 24 }}><SkeletonList count={5} type="notification" /></View>
            ) : notifications.length === 0 ? (
                <EmptyState
                    icon="notifications-off-outline"
                    title="All caught up!"
                    message="When you have new updates, they'll appear here."
                />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item, index }) => {
                        const typeInfo = TYPE_ICONS[item.type] || TYPE_ICONS.system;
                        return (
                            <Animated.View entering={FadeInRight.delay(index * 50)}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: 24,
                                        paddingVertical: 20,
                                        gap: 16,
                                        backgroundColor: item.read ? 'transparent' : Colors.surface,
                                    }}
                                    onPress={() => markNotificationRead(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        backgroundColor: typeInfo.bg || Colors.primaryLight,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Ionicons
                                            name={typeInfo.icon as any}
                                            size={22}
                                            color={typeInfo.color || Colors.primary}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                            <Text style={[Typography.h3, { fontSize: 15, flex: 1 }]} numberOfLines={1}>{item.title}</Text>
                                            <Text style={[Typography.label, { fontSize: 10, color: Colors.muted }]}>{timeAgo(item.createdAt)}</Text>
                                        </View>
                                        <Text
                                            style={[Typography.bodySmall, { color: item.read ? Colors.muted : Colors.textSecondary, lineHeight: 20 }]}
                                            numberOfLines={2}
                                        >
                                            {item.body}
                                        </Text>
                                        {!item.read && (
                                            <View style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: -12,
                                                width: 8,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: Colors.primary,
                                            }} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    }}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.cardBorder + '30' }} />}
                />
            )}
        </View>
    );
}
