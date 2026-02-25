import { AppHeader } from '@/components/AppHeader';
import { Avatar } from '@/components/ui/AvatarRating';
import { Badge } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { fetchThreads } from '@/services/mockApi';
import { useAppStore } from '@/store';
import { timeAgo } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function MessagesScreen() {
    const router = useRouter();
    const { threads, setThreads, language } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            const data = await fetchThreads();
            setThreads(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <View className="flex-1 bg-background">
            <AppHeader title={t('messages', language)} onNotification={() => router.push('/notifications')} />

            {loading ? (
                <View className="p-5"><SkeletonList count={4} /></View>
            ) : error ? (
                <ErrorState onRetry={load} />
            ) : threads.length === 0 ? (
                <EmptyState icon="chatbubbles-outline" title={t('noMessages', language)} message="Start a conversation by booking an artisan" />
            ) : (
                <FlatList
                    data={threads}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex-row items-center px-6 py-4 gap-4"
                            onPress={() => router.push({ pathname: '/chat', params: { threadId: item.id } })}
                            activeOpacity={0.8}
                        >
                            <Avatar name={item.participantName} size={50} />
                            <View className="flex-1">
                                <View className="flex-row justify-between items-center mb-0.5">
                                    <Text className="text-base font-bold text-graphite tracking-tight flex-1" numberOfLines={1}>
                                        {item.participantName}
                                    </Text>
                                    <Text className="text-xs font-medium text-gray-400">{timeAgo(item.lastMessageTime)}</Text>
                                </View>
                                <Text
                                    className={`text-sm ${item.unreadCount > 0 ? 'text-graphite font-semibold' : 'text-muted font-normal'}`}
                                    numberOfLines={1}
                                    style={{ lineHeight: 20 }}
                                >
                                    {item.lastMessage}
                                </Text>
                            </View>
                            {item.unreadCount > 0 && <Badge count={item.unreadCount} />}
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-50 ml-[88px]" />}
                />
            )}
        </View>
    );
}
