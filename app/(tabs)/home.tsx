import { AppHeader } from '@/components/AppHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { PrimaryButton } from '@/components/ui/Buttons';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { fetchArtisans } from '@/services/mockApi';
import { useAppStore } from '@/store';
import { Colors, Spacing } from '@/theme';
import type { Artisan } from '@/types';
import { CATEGORIES } from '@/types';
import { getGreeting } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList, RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const CATEGORY_ICONS: Record<string, string> = {
    plumber: 'water-outline',
    electrician: 'flash-outline',
    carpenter: 'hammer-outline',
    tailor: 'cut-outline',
    mechanic: 'car-outline',
    cleaning: 'sparkles-outline',
    hair_beauty: 'heart-outline',
    ac_repair: 'snow-outline',
};

export default function ClientHomeScreen() {
    const router = useRouter();
    const { user, language } = useAppStore();
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            const data = await fetchArtisans();
            setArtisans(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const onRefresh = () => { setRefreshing(true); load(); };

    const topRated = artisans
        .filter((a) => a.availability === 'online')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);

    return (
        <View className="flex-1 bg-background">
            <AppHeader showLocation showNotification onNotification={() => router.push('/notifications')} />

            <ScrollView
                className="flex-1 bg-background"
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Greeting */}
                <View className="mb-5">
                    <View>
                        <Text className="text-[28px] font-bold text-primary">{getGreeting()}, {user?.name || 'there'} 👋</Text>
                        <Text className="text-base text-gray-500 mt-0.5">What do you need help with?</Text>
                    </View>
                </View>

                {/* Post Job CTA */}
                <PrimaryButton
                    title={t('postJob', language)}
                    onPress={() => router.push('/post-job')}
                    icon={<Ionicons name="add-circle-outline" size={20} color={Colors.white} />}
                    style={{ marginBottom: 32 }}
                />

                {/* Categories */}
                <Text className="text-xl font-bold text-primary mb-4 mt-5">Categories</Text>
                <View className="flex-row flex-wrap gap-4">
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            className="w-[22%] aspect-square bg-white rounded-xl items-center justify-center gap-1 border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                            onPress={() => router.push({ pathname: '/search', params: { category: cat.id } })}
                            activeOpacity={0.8}
                        >
                            <View className="w-11 h-11 rounded-[22px] bg-primary/30 items-center justify-center">
                                <Ionicons
                                    name={CATEGORY_ICONS[cat.id] as any || 'construct-outline'}
                                    size={24}
                                    color={Colors.primary}
                                />
                            </View>
                            <Text className="text-[11px] font-medium text-gray-600 text-center">{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Top Rated */}
                <Text className="text-xl font-bold text-primary mb-4 mt-5">{t('topRated', language)}</Text>
                {loading ? (
                    <SkeletonList count={2} />
                ) : error ? (
                    <ErrorState onRetry={load} />
                ) : (
                    <FlatList
                        data={topRated}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: Spacing.md, paddingRight: Spacing.lg }}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ArtisanCard
                                artisan={item}
                                onPress={() => router.push({ pathname: '/artisan-profile', params: { id: item.id } })}
                            />
                        )}
                    />
                )}

                {/* Recently Used */}
                <Text className="text-xl font-bold text-primary mb-4 mt-5">{t('recentlyUsed', language)}</Text>
                {loading ? (
                    <SkeletonList count={2} />
                ) : (
                    <View className="gap-4">
                        {artisans.slice(0, 3).map((art) => (
                            <ArtisanCard
                                key={art.id}
                                artisan={art}
                                onPress={() => router.push({ pathname: '/artisan-profile', params: { id: art.id } })}
                                horizontal
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
