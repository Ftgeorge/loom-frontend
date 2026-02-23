import { AppHeader } from '@/components/AppHeader';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/StateComponents';
import { fetchNotifications } from '@/services/mockApi';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import { timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
    job_update: { icon: 'briefcase-outline', color: Colors.info },
    message: { icon: 'chatbubble-outline', color: Colors.softSageDark },
    booking: { icon: 'calendar-outline', color: Colors.accent },
    review: { icon: 'star-outline', color: Colors.warning },
    system: { icon: 'information-circle-outline', color: Colors.gray500 },
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, setNotifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch {
        } finally {
            setLoading(false);
        }
    }, [setNotifications]);

    useEffect(() => { load(); }, [load]);

    return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader
                title="Notifications"
                showBack
                onBack={() => router.back()}
                showNotification={false}
                rightAction={
                    <TouchableOpacity onPress={markAllNotificationsRead}>
                        <Text className="text-sm text-accent font-medium">Mark all read</Text>
                    </TouchableOpacity>
                }
            />

            {loading ? (
                <View className="p-5"><SkeletonList count={5} /></View>
            ) : notifications.length === 0 ? (
                <EmptyState icon="notifications-off-outline" title="No notifications" message="You're all caught up!" />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => {
                        const typeInfo = TYPE_ICONS[item.type] || TYPE_ICONS.system;
                        return (
                            <TouchableOpacity
                                className={`flex-row p-5 gap-4 items-start ${!item.read ? 'bg-sage-200/10' : ''}`}
                                onPress={() => markNotificationRead(item.id)}
                                activeOpacity={0.8}
                            >
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{ backgroundColor: typeInfo.color + '20' }}
                                >
                                    <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-semibold">{item.title}</Text>
                                    <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={2}>{item.body}</Text>
                                    <Text className="text-xs text-gray-400 mt-1">{timeAgo(item.createdAt)}</Text>
                                </View>
                                {!item.read && <View className="w-2 h-2 rounded-full bg-accent mt-1.5" />}
                            </TouchableOpacity>
                        );
                    }}
                    ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-100" />}
                />
            )}
        </View>
    );
}
