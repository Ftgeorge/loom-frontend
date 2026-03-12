import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { SubAppHeader } from '@/components/AppSubHeader';
import { Chip } from '@/components/ui/CardChipBadge';
import LayoutSwitch from '@/components/ui/LayoutSwitch';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { AppTextInput } from '@/components/ui/TextInputs';
import { artisanApi } from '@/services/api';
import { mapArtisan } from '@/services/mappers';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { Artisan } from '@/types';
import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScanningBar = () => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(progress.value, [0, 1], [0, 600]) }],
        opacity: interpolate(progress.value, [0, 0.1, 0.5, 0.9, 1], [0, 1, 1, 1, 0]),
    }));

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: Colors.accent,
                    zIndex: 20,
                    shadowColor: Colors.accent,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 10,
                    elevation: 5,
                },
                animatedStyle,
            ]}
        />
    );
};

export default function SearchScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ category?: string }>();
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
    const { user } = useAppStore();
    // Sync with params
    useEffect(() => {
        if (params.category) {
            setSelectedCategory(params.category === 'all' ? null : params.category);
        }
    }, [params.category]);

    const search = useCallback(async (catId: string | null, q: string, isInitial: boolean = false) => {
        try {
            if (isInitial) setLoading(true);
            setIsSearching(true);
            setError(false);

            let results: Artisan[] = [];
            const locationParams = {
                city: user?.location?.city,
                state: user?.location?.state,
                area: user?.location?.area
            };

            if (catId) {
                const category = CATEGORIES.find(c => c.id === catId);
                const skillName = category ? category.label : catId;
                const res = await artisanApi.search({ skill: skillName, limit: 30, ...locationParams });
                results = (res.results as any[]).map(mapArtisan);
            } else {
                const res = await artisanApi.list({ limit: 30, ...locationParams });
                results = (res.results as any[]).map(mapArtisan);
            }

            const filtered = q
                ? results.filter(
                    (a) =>
                        a.name.toLowerCase().includes(q.toLowerCase()) ||
                        a.bio.toLowerCase().includes(q.toLowerCase()) ||
                        a.skills.some((s) => s.toLowerCase().includes(q.toLowerCase()))
                )
                : results;
            
            setArtisans(filtered);
        } catch (err) {
            console.error('[Search] Error fetching artisans:', err);
            setError(true);
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    }, [user?.location]);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            search(selectedCategory, query, artisans.length === 0);
        }, query ? 400 : 0);
        return () => clearTimeout(debounceRef.current);
    }, [query, selectedCategory, search]);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.2} animated />
            {(loading || isSearching) && <ScanningBar />}
            
            <SubAppHeader
                label="EXPLORE"
                title="Find a Pro"
                description="Discover skilled artisans in your area."
                onNotification={() => router.push('/notifications')}
            />

            <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
                <AppTextInput
                    placeholder="Search by name, skill, or location..."
                    value={query}
                    onChangeText={setQuery}
                    containerStyle={{
                        borderRadius: Radius.lg,
                        backgroundColor: Colors.white,
                        borderWidth: 1.5,
                        borderColor: isSearching ? Colors.primary : Colors.cardBorder,
                        ...Shadows.sm
                    }}
                    leftIcon={
                        <View style={{ paddingLeft: 20 }}>
                            <Ionicons name="search" size={22} color={Colors.muted} />
                        </View>
                    }
                />
            </View>

            <FlatList
                key={viewLayout}
                data={artisans}
                keyExtractor={(item) => item.id}
                numColumns={viewLayout === 'grid' ? 2 : 1}
                columnWrapperStyle={viewLayout === 'grid' ? { gap: 12, marginBottom: 16 } : undefined}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 24 }}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                ListHeaderComponent={
                    <View style={{ marginBottom: 24 }}>
                        <FlatList
                            data={[{ id: 'all', label: 'ALL SERVICES' }, ...CATEGORIES]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginHorizontal: -24 }}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12, gap: 10 }}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Chip
                                    label={item.label.toUpperCase()}
                                    selected={
                                        item.id === 'all' ? !selectedCategory : selectedCategory === item.id
                                    }
                                    onPress={() =>
                                        setSelectedCategory(item.id === 'all' ? null : item.id)
                                    }
                                />
                            )}
                        />

                        {/* <LayoutSwitch/> */}

                        {loading ? (
                            <View style={{ marginTop: 24 }}>
                                <SkeletonList count={4} type="artisan" />
                            </View>
                        ) : error ? (
                            <View style={{ marginTop: 24 }}>
                                <ErrorState onRetry={() => search(selectedCategory, query)} />
                            </View>
                        ) : artisans.length === 0 ? (
                            <View style={{
                                marginTop: 64,
                                padding: 48,
                                alignItems: 'center',
                                borderStyle: 'dashed',
                                backgroundColor: Colors.white,
                                borderColor: Colors.cardBorder,
                                borderRadius: Radius.md,
                                borderWidth: 1.5
                            }}>
                                <Ionicons name="search" size={48} color={Colors.cardBorder} />
                                <Text style={[Typography.h3, { textAlign: 'center', color: Colors.primary, marginTop: 24 }]}>
                                    NO RESULTS
                                </Text>
                                <Text style={[Typography.bodySmall, { textAlign: 'center', color: Colors.muted, marginTop: 12, lineHeight: 20 }]}>
                                    We couldn't find any pros matching your current search parameters.
                                </Text>
                            </View>
                        ) : (
                            <View style={{ marginTop: 24, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent }} />
                                    <Text style={[Typography.label, { fontSize: 10, color: Colors.primary, letterSpacing: 1, fontWeight: '700' }]}>
                                        FOUND {artisans.length} PROFESSIONALS
                                    </Text>
                                </View>
                                <LayoutSwitch
                                    viewLayout={viewLayout}
                                    setViewLayout={setViewLayout}
                                />
                            </View>
                        )}
                    </View>
                }
                renderItem={({ item, index }) => (
                        <Animated.View
                            entering={FadeInDown.delay(100 + index * 50).springify()}
                            style={{
                                marginBottom: 16,
                                flex: viewLayout === 'grid' ? 0.5 : 1,
                                paddingHorizontal: viewLayout === 'grid' ? 0 : 0 // handled by columnWrapperStyle or paddingHorizontal above
                            }}
                        >
                            <ArtisanCard
                                artisan={item}
                                grid={viewLayout === 'grid'}
                                list={viewLayout === 'list'}
                                onPress={() =>
                                    router.push({
                                        pathname: '/artisan-profile',
                                        params: { id: item.id },
                                    })
                                }
                            />
                        </Animated.View>
                    )
                }
            />
        </View>
    );
}
