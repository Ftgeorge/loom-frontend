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
    const { user, language, jobs } = useAppStore();
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
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

    const topRated = React.useMemo(() => artisans
        .filter((a) => a.availability === 'online')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6), [artisans]);

    const activeJobs = React.useMemo(() => jobs.filter(j =>
        ['matched', 'scheduled', 'in_progress'].includes(j.status)
    ).slice(0, 1), [jobs]);

    const greeting = typeof getGreeting === 'function' ? getGreeting() : "Hello";

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.2} animated />
            <AppHeader showLocation showNotification onNotification={() => router.push('/notifications')} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Greeting & Header */}
                <View style={{ marginBottom: 40 }}>
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8, letterSpacing: 2 }]}>WELCOME BACK</Text>
                        <Text style={[Typography.h1, { fontSize: 36, letterSpacing: -1 }]}>
                            {user?.name?.split(' ')[0]?.toUpperCase() || 'USER'}
                        </Text>
                        <View style={{ height: 2, width: 40, backgroundColor: Colors.accent, marginTop: 16 }} />
                    </Animated.View>
                </View>

                {/* DYNAMIC ACTIVITY HUB: Active Mission Status */}
                {activeJobs.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginBottom: 48 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.primary,
                                borderRadius: Radius.md,
                                padding: 24,
                                ...Shadows.lg,
                                borderWidth: 1,
                                borderColor: Colors.primary,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onPress={() => router.push({ pathname: '/request-details', params: { id: activeJobs[0].id } })}
                            activeOpacity={0.9}
                        >
                            {/* Grid decorative background */}
                            <View style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.15 }}>
                                <Ionicons name="shield-checkmark" size={160} color={Colors.white} />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                <View style={{ backgroundColor: Colors.accent, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.xs }}>
                                    <Text style={[Typography.label, { color: Colors.white, fontSize: 9, fontWeight: '900' }]}>ACTIVE JOB</Text>
                                </View>
                                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.accent, marginLeft: 12 }} />
                                <Text style={[Typography.label, { color: Colors.white, marginLeft: 8, opacity: 0.6, fontSize: 9 }]}>
                                    TRACKING STATUS
                                </Text>
                            </View>

                            <Text style={[Typography.h2, { color: Colors.white, fontSize: 24, marginBottom: 8 }]}>
                                {CATEGORIES.find(c => c.id === activeJobs[0].category)?.label?.toUpperCase() || 'GENERAL REPAIR'}
                            </Text>

                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={[Typography.label, { color: Colors.white, fontSize: 9, opacity: 0.8 }]}>JOB PROGRESS</Text>
                                    <Text style={[Typography.label, { color: Colors.accent, fontSize: 9, fontWeight: '900' }]}>75% COMPLETE</Text>
                                </View>
                                <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                    <View style={{ width: '75%', height: '100%', backgroundColor: Colors.accent }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Search / Signal Broadcast */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.white,
                            height: 72,
                            borderRadius: Radius.md,
                            paddingHorizontal: 20,
                            borderWidth: 1.5,
                            borderColor: Colors.cardBorder,
                            marginBottom: 48,
                            ...Shadows.md
                        }}
                        onPress={() => router.push({ pathname: '/search', params: { category: 'all' } })}
                        activeOpacity={0.9}
                    >
                        <Ionicons name="search" size={24} color={Colors.primary} />
                        <Text style={[Typography.body, { flex: 1, marginLeft: 16, color: Colors.muted, fontWeight: '500' }]}>
                            SEARCH FOR VERIFIED PROS...
                        </Text>
                        <View style={{
                            width: 40,
                            height: 40,
                            borderRadius: Radius.xs,
                            backgroundColor: Colors.surface,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: Colors.cardBorder
                        }}>
                            <Ionicons name="options-outline" size={20} color={Colors.primary} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Discovery Modules */}
                <View style={{ marginBottom: 56 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <View>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 4 }]}>CATEGORIES</Text>
                            <Text style={[Typography.h3, { fontSize: 20 }]}>Service Types</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 8, backgroundColor: Colors.white, borderRadius: Radius.xs, borderWidth: 1, borderColor: Colors.cardBorder }} onPress={() => router.push('/search')}>
                            <Text style={[Typography.label, { color: Colors.accent, fontSize: 9 }]}>VIEW ALL</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24 }} contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}>
                        {CATEGORIES.map((cat, index) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={{
                                    width: 110,
                                    height: 140,
                                    backgroundColor: Colors.white,
                                    borderRadius: Radius.md,
                                    padding: 16,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1.5,
                                    borderColor: Colors.cardBorder,
                                    ...Shadows.sm
                                }}
                                onPress={() => router.push({ pathname: '/search', params: { category: cat.id } })}
                                activeOpacity={0.8}
                            >
                                <View style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: Radius.xs,
                                    backgroundColor: Colors.surface,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                    borderWidth: 1,
                                    borderColor: Colors.cardBorder
                                }}>
                                    <Ionicons
                                        name={CATEGORY_ICONS[cat.id] as any || 'construct-outline'}
                                        size={24}
                                        color={Colors.primary}
                                    />
                                </View>
                                <Text style={[Typography.label, { fontSize: 9, textAlign: 'center', color: Colors.primary, fontWeight: '700' }]}>
                                    {cat.label.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Top Rated Operatives */}
                <View style={{ marginBottom: 56 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <View>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 4 }]}>TOP RATED</Text>
                            <Text style={[Typography.h3, { fontSize: 20 }]}>Recommended Pros</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 8, backgroundColor: Colors.white, borderRadius: Radius.xs, borderWidth: 1, borderColor: Colors.cardBorder }} onPress={() => router.push('/search')}>
                            <Text style={[Typography.label, { color: Colors.primary, fontSize: 9 }]}>VIEW ALL</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <SkeletonHorizontalList count={2} />
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
                            initialNumToRender={3}
                            maxToRenderPerBatch={3}
                            windowSize={3}
                            removeClippedSubviews={true}
                            renderItem={({ item, index }) => (
                                <Animated.View entering={FadeInRight.delay(400 + index * 100).springify()}>
                                    <ArtisanCard
                                        artisan={item}
                                        onPress={() => router.push({ pathname: '/artisan-profile', params: { id: item.id } })}
                                    />
                                </Animated.View>
                            )}
                        />
                    )}
                </View>

                {/* Custom Broadcast CTA */}
                <Animated.View entering={FadeInDown.delay(500).springify()} style={{ marginBottom: 56 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.white,
                            borderRadius: Radius.md,
                            padding: 30,
                            borderWidth: 2,
                            borderColor: Colors.accent,
                            borderStyle: 'dashed',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            ...Shadows.md
                        }}
                        onPress={() => router.push('/post-job')}
                        activeOpacity={0.9}
                    >
                        <View style={{ flex: 1, paddingRight: 20 }}>
                            <Text style={[Typography.label, { color: Colors.accent, marginBottom: 8, fontWeight: '900' }]}>CUSTOM REQUEST</Text>
                            <Text style={[Typography.h3, { color: Colors.primary, fontSize: 22, lineHeight: 28 }]}>Post a Custom Job Task</Text>
                            <Text style={[Typography.bodySmall, { color: Colors.muted, marginTop: 8 }]}>Describe your specific needs and get quotes from verified pros in your area.</Text>
                        </View>
                        <View style={{ backgroundColor: Colors.accent, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="add" size={32} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Nearby Pulse */}
                <View>
                    <View style={{ marginBottom: 24 }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 4 }]}>NEARBY PROS</Text>
                        <Text style={[Typography.h3, { fontSize: 20 }]}>Available Pros Near You</Text>
                    </View>
                    {loading ? (
                        <SkeletonList count={3} />
                    ) : (
                        <View style={{ gap: 16 }}>
                            {artisans.slice(0, 5).map((art, index) => (
                                <Animated.View key={art.id} entering={FadeInDown.delay(600 + index * 100).springify()}>
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
