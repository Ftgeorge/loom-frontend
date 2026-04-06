import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/StateComponents';
import { notificationApi } from '@/services/api';
import { useAppStore } from '@/store';
import { timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const TYPE_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
    job_update: { icon: 'briefcase-outline', color: '#078365', bg: '#0783651A' },
    message: { icon: 'chatbubbles-outline', color: '#078365', bg: '#0783651A' },
    booking: { icon: 'calendar-outline', color: '#078365', bg: '#0783651A' },
    review: { icon: 'star-outline', color: '#F59E0B', bg: '#F59E0B1A' },
    system: { icon: 'shield-outline', color: '#64748B', bg: '#F1F5F9' },
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
                metadata: row.metadata,
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
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.3} animated />
            <AppHeader
                title="Notifications"
                showBack
                onBack={() => router.back()}
                showNotification={false}
            />

            {!loading && notifications.length > 0 && (
                <TouchableOpacity 
                    onPress={handleMarkAllRead}
                    className="self-end mx-6 mb-4 py-2 px-3 rounded-full bg-surface border border-card-border"
                >
                    <Text className="text-label text-[10px] text-primary uppercase">Mark all read</Text>
                </TouchableOpacity>
            )}

            {loading ? (
                <View className="p-6"><SkeletonList count={5} type="notification" /></View>
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
                    contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 24 }}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={15}
                    maxToRenderPerBatch={15}
                    windowSize={5}
                    removeClippedSubviews={true}
                    renderItem={({ item, index }) => {
                        const typeInfo = TYPE_ICONS[item.type] || TYPE_ICONS.system;
                        return (
                            <Animated.View entering={FadeInRight.delay(index * 30).springify()}>
                                <TouchableOpacity
                                    className={`flex-row p-5 gap-4 rounded-lg mb-3 border ${
                                        item.read ? 'bg-canvas border-divider' : 'bg-white border-card-border shadow-md'
                                    }`}
                                    onPress={() => markNotificationRead(item.id)}
                                    activeOpacity={0.8}
                                >
                                    <View 
                                        className="w-12 h-12 rounded-md items-center justify-center"
                                        style={{ backgroundColor: typeInfo.bg }}
                                    >
                                        <Ionicons
                                            name={typeInfo.icon as any}
                                            size={22}
                                            color={typeInfo.color}
                                        />
                                    </View>

                                    <View className="flex-1">
                                        <View className="flex-row justify-between items-center mb-1">
                                            <Text 
                                                className={`text-h3 text-[15px] flex-1 text-ink uppercase ${
                                                    item.read ? 'font-jakarta-semibold' : 'font-jakarta-bold'
                                                }`} 
                                                numberOfLines={1}
                                            >
                                                {item.title}
                                            </Text>
                                            {!item.read && (
                                                <View className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                            )}
                                        </View>
                                        <Text
                                            className={`text-body-sm text-[13px] leading-[20px] normal-case ${
                                                item.read ? 'text-muted' : 'text-body'
                                            }`}
                                            numberOfLines={2}
                                        >
                                            {item.body}
                                        </Text>
                                        <Text className="text-label text-[9px] text-muted mt-2 uppercase italic tracking-normal">
                                            {timeAgo(item.createdAt)}
                                        </Text>
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

