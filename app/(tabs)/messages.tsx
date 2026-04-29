import { AppHeader } from '@/components/AppHeader';
import { SubAppHeader } from '@/components/AppSubHeader';
import { Avatar } from '@/components/ui/AvatarRating';
import { Badge } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { threadApi } from '@/services/api';
import { useAppStore } from '@/store';
import { timeAgo } from '@/utils/helpers';
<<<<<<< HEAD
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
=======
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)

export default function MessagesScreen() {
    const router = useRouter();
    const { threads, setThreads, language } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!refreshing) setLoading(true);
            const res = await threadApi.list();
            const mapped = (res.results as any[]).map((row: any) => ({
                id: row.id,
                participantId: row.customer_id ?? row.artisan_profile_id,
                participantName: [
                    row.other_user_first_name,
                    row.other_user_last_name,
                ].filter(Boolean).join(' ') || row.other_user_email || 'Unknown',
                lastMessage: row.last_message ?? 'OPEN CHANNEL',
                lastMessageTime: row.last_message_at ?? row.created_at,
                unreadCount: Number(row.unread_count ?? 0),
                participantRole: 'artisan' as const,
                messages: [],
            }));
            setThreads(mapped);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);

    useEffect(() => { load(); }, [load]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        load();
    }, [load]);

    return (
        <View className="flex-1 bg-background">
            <SubAppHeader
                label="ENCRYPTED CHANNEL"
                title="CONVERSATIONS"
                description="Secure communication gateway with your assigned artisans."
                onNotification={() => router.push('/notifications')}
            />

            {loading ? (
                <View className="p-6"><SkeletonList count={5} type="message" /></View>
            ) : error ? (
                <ErrorState onRetry={load} />
            ) : threads.length === 0 ? (
                <View className="flex-1 justify-center p-8">
                    <View className="bg-white p-16 rounded-[32px] border-[2px] border-dashed border-card-border items-center shadow-inner">
                        <View className="w-20 h-20 bg-background rounded-3xl items-center justify-center mb-6 shadow-sm border border-card-border">
                            <Ionicons name="chatbubbles-outline" size={42} color="#94A3B8" />
                        </View>
                        <Text className="text-h3 text-center text-ink uppercase font-jakarta-extrabold italic tracking-tight">
                            NO ACTIVE TRANSMISSIONS
                        </Text>
                        <Text className="text-body text-center text-ink/50 mt-4 leading-5 font-jakarta-medium max-w-[240px]">
                            Initialize a contract to establish secure communication frequencies.
                        </Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={threads}
                    keyExtractor={(item) => item.id}
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 150 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00120C" />
                    }
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
                            <TouchableOpacity
                                className="flex-row items-center px-6 py-5 gap-4 active:bg-white/50"
                                onPress={() => router.push({ pathname: '/chat', params: { threadId: item.id } })}
                                activeOpacity={0.7}
                            >
                                <View className="relative">
                                    <Avatar name={item.participantName} size={56} />
                                    <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full items-center justify-center border-2 border-white">
                                        <View className="w-2 h-2 bg-success rounded-full shadow-[0_0_8px_rgba(26,178,108,0.6)]" />
                                    </View>
                                </View>
                                
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-[17px] font-jakarta-extrabold text-ink italic tracking-tighter uppercase flex-1" numberOfLines={1}>
                                            {item.participantName}
                                        </Text>
                                        <Text className="text-[10px] font-jakarta-bold text-muted uppercase italic tracking-widest">{timeAgo(item.lastMessageTime)}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <Text
                                            className={`text-[13px] font-jakarta-medium flex-1 ${item.unreadCount > 0 ? 'text-ink font-jakarta-bold' : 'text-ink/40'}`}
                                            numberOfLines={1}
                                        >
                                            {item.lastMessage}
                                        </Text>
                                        {item.unreadCount > 0 && (
                                            <View className="bg-primary px-2.5 py-1 rounded-full shadow-sm">
                                                <Text className="text-[10px] font-jakarta-extrabold text-white">{item.unreadCount}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    ItemSeparatorComponent={() => <View className="h-[1.5px] bg-card-border/30 ml-20 mr-6" />}
                />
            )}
            
            <View className="absolute bottom-10 left-0 right-0 items-center pointer-events-none opacity-20">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="lock-closed" size={10} color="#64748B" />
                    <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">End-to-End Encrypted Communication</Text>
                </View>
            </View>
        </View>
    );
}

