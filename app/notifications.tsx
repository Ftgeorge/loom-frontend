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

<<<<<<< HEAD
const TYPE_ICONS: Record<string, { icon: string; color: string; bgClass: string; iconColorClass: string }> = {
    job_update: { icon: 'briefcase-outline', color: '#078365', bgClass: 'bg-primary/10', iconColorClass: 'text-primary' },
    message: { icon: 'chatbubbles-outline', color: '#078365', bgClass: 'bg-primary/10', iconColorClass: 'text-primary' },
    booking: { icon: 'calendar-outline', color: '#078365', bgClass: 'bg-primary/10', iconColorClass: 'text-primary' },
    review: { icon: 'star-outline', color: '#F59E0B', bgClass: 'bg-accent/10', iconColorClass: 'text-accent' },
    system: { icon: 'shield-outline', color: '#64748B', bgClass: 'bg-background', iconColorClass: 'text-muted' },
=======
const TYPE_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
    job_update: { icon: 'briefcase-outline', color: Colors.primary, bg: Colors.primaryLight },
    message: { icon: 'chatbubbles-outline', color: Colors.primary, bg: Colors.primaryLight },
    booking: { icon: 'calendar-outline', color: Colors.primary, bg: Colors.primaryLight },
    review: { icon: 'star-outline', color: Colors.accent, bg: Colors.accentLight },
    system: { icon: 'shield-outline', color: Colors.muted, bg: Colors.gray100 },
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.3} animated scale={1.3} />
            </View>
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            <AppHeader
                title="COMM CENTER"
                showBack
                onBack={() => router.back()}
                showNotification={false}
            />

            {!loading && notifications.length > 0 && (
<<<<<<< HEAD
                <View className="flex-row justify-between items-center px-8 py-6">
                    <View className="flex-row items-center gap-2">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">SIGNAL HUB</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={handleMarkAllRead}
                        className="py-2.5 px-5 rounded-full bg-white/60 border border-card-border/50 shadow-sm backdrop-blur-md active:bg-white"
                    >
                        <Text className="text-label text-[10px] text-primary uppercase font-jakarta-extrabold italic tracking-widest">CLEAR ALL SIGNALS</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading ? (
                <View className="px-8 pt-6"><SkeletonList count={6} type="notification" /></View>
=======
                <TouchableOpacity 
                    onPress={handleMarkAllRead}
                    style={{ 
                        alignSelf: 'flex-end', 
                        marginHorizontal: 24, 
                        marginBottom: 16,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: Radius.full,
                        backgroundColor: Colors.surface,
                        borderWidth: 1,
                        borderColor: Colors.cardBorder
                    }}
                >
                    <Text style={[Typography.label, { fontSize: 10, color: Colors.primary }]}>MARK ALL READ</Text>
                </TouchableOpacity>
            )}

            {loading ? (
                <View style={{ padding: 24 }}><SkeletonList count={5} type="notification" /></View>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            ) : notifications.length === 0 ? (
                <View className="flex-1 justify-center items-center px-12">
                     <View className="w-24 h-24 rounded-[32px] bg-white border border-card-border items-center justify-center mb-8 shadow-inner opacity-40">
                        <Ionicons name="notifications-off-outline" size={48} color="#94A3B8" />
                    </View>
                    <Text className="text-h1 text-center text-muted uppercase italic font-jakarta-extrabold tracking-tighter opacity-30 text-[32px]">Silence in Sector</Text>
                    <Text className="text-body text-center mt-4 normal-case font-jakarta-medium italic opacity-40">
                        You're all caught up. The communication grid is currently stable with no pending transmissions.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 32 }}
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
<<<<<<< HEAD
                                    className={`flex-row p-6 gap-5 rounded-[32px] mb-5 border-[1.5px] active:scale-[0.98] transition-transform ${
                                        item.read ? 'bg-background/40 border-card-border/30 opacity-60' : 'bg-white border-card-border/50 shadow-2xl shadow-primary/5'
                                    }`}
                                    onPress={() => markNotificationRead(item.id)}
                                    activeOpacity={0.8}
                                >
                                    <View 
                                        className={`w-14 h-14 rounded-2xl items-center justify-center shadow-inner border border-white/40 ${typeInfo.bgClass}`}
                                    >
                                        <Ionicons
                                            name={typeInfo.icon as any}
                                            size={26}
                                            className={typeInfo.iconColorClass}
                                            color={typeInfo.color}
                                        />
                                    </View>

                                    <View className="flex-1 justify-center">
                                        <View className="flex-row justify-between items-start mb-2">
                                            <Text 
                                                className={`text-[16px] flex-1 text-ink uppercase italic tracking-tight ${
                                                    item.read ? 'font-jakarta-extrabold' : 'font-jakarta-extrabold'
                                                }`} 
=======
                                    style={{
                                        flexDirection: 'row',
                                        padding: 20,
                                        gap: 16,
                                        backgroundColor: item.read ? Colors.canvas : Colors.white,
                                        borderRadius: Radius.lg,
                                        marginBottom: 12,
                                        borderWidth: 1,
                                        borderColor: item.read ? Colors.divider : Colors.cardBorder,
                                        ...(!item.read ? Shadows.md : {})
                                    }}
                                    onPress={() => markNotificationRead(item.id)}
                                    activeOpacity={0.8}
                                >
                                    <View style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: Radius.md,
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
                                            <Text 
                                                style={[Typography.h3, { 
                                                    fontSize: 15, 
                                                    flex: 1, 
                                                    color: Colors.ink,
                                                    fontFamily: item.read ? 'PlusJakartaSans-SemiBold' : 'PlusJakartaSans-Bold'
                                                }]} 
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                                numberOfLines={1}
                                            >
                                                {item.title}
                                            </Text>
                                            {!item.read && (
<<<<<<< HEAD
                                                <View className="w-2.5 h-2.5 rounded-full bg-accent shadow-accent/50 shadow-inner mt-1" />
                                            )}
                                        </View>
                                        <Text
                                            className={`text-[14px] leading-5 normal-case font-jakarta-medium italic ${
                                                item.read ? 'text-ink/40' : 'text-ink/70'
                                            }`}
=======
                                                <View style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: Colors.accent,
                                                }} />
                                            )}
                                        </View>
                                        <Text
                                            style={[Typography.bodySmall, { 
                                                color: item.read ? Colors.muted : Colors.text, 
                                                lineHeight: 20,
                                                fontSize: 13
                                            }]}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                            numberOfLines={2}
                                        >
                                            {item.body}
                                        </Text>
<<<<<<< HEAD
                                        <View className="flex-row items-center gap-2 mt-4">
                                            <Ionicons name="time-outline" size={10} color="#94A3B8" />
                                            <Text className="text-label text-[9px] text-muted uppercase font-jakarta-extrabold italic tracking-widest">
                                                {timeAgo(item.createdAt)}
                                            </Text>
                                        </View>
=======
                                        <Text style={[Typography.label, { fontSize: 9, color: Colors.muted, letterSpacing: 0, marginTop: 8 }]}>
                                            {timeAgo(item.createdAt).toUpperCase()}
                                        </Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    }}
                />
            )}
            
            <View className="absolute bottom-12 left-0 right-0 items-center pointer-events-none opacity-20">
                <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Signal Registry Protocol v4.2 • Secure Encryption Active</Text>
            </View>
        </View>
    );
}
