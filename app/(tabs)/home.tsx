import { AppHeader } from '@/components/AppHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
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
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero / Greeting */}
                <View className="mb-8">
                    <Text className="text-3xl font-bold text-graphite tracking-tight">
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
                    </Text>
                    <Text className="text-base text-muted mt-2 leading-relaxed">
                        What service are you looking for today?
                    </Text>
                </View>

                {/* Fake Search Bar */}
                <TouchableOpacity
                    className="flex-row items-center bg-white h-14 rounded-2xl px-5 border border-gray-100 mb-10 shadow-sm"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}
                    onPress={() => router.push({ pathname: '/search', params: { category: 'all' } })}
                    activeOpacity={0.9}
                >
                    <Ionicons name="search-outline" size={20} color={Colors.gray400} />
                    <Text className="flex-1 text-base text-gray-400 ml-3">
                        Search for plumbers, electricians...
                    </Text>
                    <View className="w-8 h-8 rounded-full bg-surface items-center justify-center">
                        <Ionicons name="options-outline" size={16} color={Colors.graphite} />
                    </View>
                </TouchableOpacity>

                {/* Post Job Premium Banner */}
                <TouchableOpacity
                    className="bg-graphite rounded-3xl p-6 mb-12 flex-row items-center justify-between"
                    style={{ shadowColor: Colors.graphite, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 6 }}
                    onPress={() => router.push('/post-job')}
                    activeOpacity={0.9}
                >
                    <View className="flex-1 pr-6">
                        <Text className="text-white text-lg font-bold mb-1 tracking-tight">Need something specific?</Text>
                        <Text className="text-gray-300 text-sm leading-relaxed">Post a custom job request and let top artisans come to you.</Text>
                    </View>
                    <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
                        <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                    </View>
                </TouchableOpacity>

                {/* Categories */}
                <View className="mb-12">
                    <Text className="text-xl font-bold text-graphite tracking-tight mb-5">Categories</Text>
                    <View className="flex-row flex-wrap justify-between gap-y-4">
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                className="w-[23%] h-24 bg-white rounded-2xl items-center justify-center border border-gray-50 bg-white"
                                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}
                                onPress={() => router.push({ pathname: '/search', params: { category: cat.id } })}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={CATEGORY_ICONS[cat.id] as any || 'construct-outline'}
                                    size={24}
                                    color={Colors.graphite}
                                    style={{ marginBottom: 6 }}
                                />
                                <Text className="text-[11px] font-medium text-muted text-center leading-tight px-1">
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Top Rated */}
                <View className="mb-10">
                    <View className="flex-row items-center justify-between mb-5">
                        <Text className="text-xl font-bold text-graphite tracking-tight">{t('topRated', language)}</Text>
                        <TouchableOpacity onPress={() => router.push('/search')} activeOpacity={0.7}>
                            <Text className="text-sm font-semibold text-primary">See all</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <SkeletonList count={2} />
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : (
                        <>
                            {/* Negative margin to pull the list to the screen edge, inner padding to push content back to safe area start */}
                            <FlatList
                                data={topRated}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="-mx-6"
                                contentContainerStyle={{ gap: Spacing.md, paddingHorizontal: 24 }}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <ArtisanCard
                                        artisan={item}
                                        onPress={() => router.push({ pathname: '/artisan-profile', params: { id: item.id } })}
                                    />
                                )}
                            />
                        </>
                    )}
                </View>

                {/* Recently Used */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-5">
                        <Text className="text-xl font-bold text-graphite tracking-tight">{t('recentlyUsed', language)}</Text>
                    </View>
                    {loading ? (
                        <SkeletonList count={2} />
                    ) : (
                        <View className="gap-5">
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
                </View>
            </ScrollView>
        </View>
    );
}
