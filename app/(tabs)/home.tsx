import { mapArtisan } from '@/services/mappers';
import { AppHeader } from '@/components/AppHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonHorizontalList, SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { artisanApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
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
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const CATEGORY_ICONS: Record<string, string> = {
    plumber: 'construct-outline',
    electrician: 'flash-outline',
    carpenter: 'hammer-outline',
    tailor: 'cut-outline',
    mechanic: 'settings-outline',
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
            // GET /artisans — browse all artisans, sorted by rating
            const res = await artisanApi.list({ limit: 30 });
            const normalised = (res.results as any[]).map(mapArtisan);
            setArtisans(normalised);
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

    const greeting = typeof getGreeting === 'function' ? getGreeting() : "Hello";

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.65} animated />
            <AppHeader showLocation showNotification onNotification={() => router.push('/notifications')} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Greeting */}
                <Animated.View entering={FadeInDown.delay(100)} style={{ marginBottom: 32 }}>
                    <Text style={Typography.h1}>
                        {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
                    </Text>
                    <Text style={[Typography.body, { marginTop: 4, color: Colors.textSecondary }]}>
                        Find trusted pros for your home needs.
                    </Text>
                </Animated.View>

                {/* Search Bar */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.surface,
                            height: 60,
                            borderRadius: Radius.md,
                            paddingHorizontal: 20,
                            borderWidth: 1,
                            borderColor: Colors.cardBorder,
                            marginBottom: 40,
                            ...Shadows.sm
                        }}
                        onPress={() => router.push({ pathname: '/search', params: { category: 'all' } })}
                        activeOpacity={0.9}
                    >
                        <Ionicons name="search" size={20} color={Colors.muted} />
                        <Text style={[Typography.body, { flex: 1, marginLeft: 12, color: Colors.muted }]}>
                            Search for plumbers, tailors...
                        </Text>
                        <View style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: Colors.accentLight,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Ionicons name="options-outline" size={16} color={Colors.accent} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Post Job CTA */}
                <Animated.View entering={FadeInDown.delay(300)}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.accent,
                            borderRadius: Radius.lg,
                            padding: 24,
                            marginBottom: 48,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            ...Shadows.lg,
                            shadowColor: Colors.accent // Match shadow to color
                        }}
                        onPress={() => router.push('/post-job')}
                        activeOpacity={0.9}
                    >
                        <View style={{ flex: 1, paddingRight: 16 }}>
                            <Text style={[Typography.h2, { color: Colors.white, fontSize: 20 }]}>Need something custom?</Text>
                            <Text style={[Typography.bodySmall, { color: Colors.accentLight, marginTop: 4, opacity: 0.9 }]}>Post a request and let top pros find you.</Text>
                        </View>
                        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Categories */}
                <View style={{ marginBottom: 48 }}>
                    <Text style={[Typography.h3, { marginBottom: 20 }]}>Popular Services</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
                        {CATEGORIES.map((cat, index) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={{
                                    width: '22%',
                                    aspectRatio: 1,
                                    backgroundColor: Colors.surface,
                                    borderRadius: Radius.md,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: Colors.cardBorder,
                                    ...Shadows.sm
                                }}
                                onPress={() => router.push({ pathname: '/search', params: { category: cat.id } })}
                                activeOpacity={0.8}
                            >
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: Colors.background,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 8
                                }}>
                                    <Ionicons
                                        name={CATEGORY_ICONS[cat.id] as any || 'construct-outline'}
                                        size={20}
                                        color={Colors.primary}
                                    />
                                </View>
                                <Text style={[Typography.label, { fontSize: 9, textAlign: 'center', color: Colors.text, textTransform: 'none' }]}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Top Rated Horizontal Scroll */}
                <View style={{ marginBottom: 48 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Text style={Typography.h3}>{t('topRated', language)}</Text>
                        <TouchableOpacity onPress={() => router.push('/search')}>
                            <Text style={[Typography.label, { color: Colors.primary, textTransform: 'none' }]}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <SkeletonHorizontalList count={3} />
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : (
                        <FlatList
                            data={topRated}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginHorizontal: -24 }}
                            contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <Animated.View entering={FadeInRight.delay(400 + index * 100)}>
                                    <ArtisanCard
                                        artisan={item}
                                        onPress={() => router.push({ pathname: '/artisan-profile', params: { id: item.id } })}
                                    />
                                </Animated.View>
                            )}
                        />
                    )}
                </View>

                {/* Pros Near You */}
                <View>
                    <Text style={[Typography.h3, { marginBottom: 20 }]}>Pros Near You</Text>
                    {loading ? (
                        <SkeletonList count={3} />
                    ) : (
                        <View style={{ gap: 16 }}>
                            {artisans.slice(0, 5).map((art, index) => (
                                <Animated.View key={art.id} entering={FadeInDown.delay(600 + index * 100)}>
                                    <ArtisanCard
                                        artisan={art}
                                        onPress={() => router.push({ pathname: '/artisan-profile', params: { id: art.id } })}
                                        horizontal
                                    />
                                </Animated.View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
