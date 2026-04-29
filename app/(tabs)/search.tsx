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
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated />
            </View>
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.2} animated />
            {(loading || isSearching) && <ScanningBar />}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            
            <SubAppHeader
                label="DISCOVERY ENGINE"
                title="FIND ARTISANS"
                description="Initialize localized search for certified professional operatives."
                onNotification={() => router.push('/notifications')}
            />

<<<<<<< HEAD
            <View className="px-6 pb-6 pt-2 bg-white/50 backdrop-blur-xl border-b border-card-border/30">
=======
            <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                <AppTextInput
                    placeholder="Search by mission name, skill, or sector..."
                    value={query}
                    onChangeText={setQuery}
<<<<<<< HEAD
                    className="h-14 bg-white border-[1.5px] border-card-border rounded-full shadow-2xl px-6"
                    leftIcon={
                        <View className="pl-6">
                            <Ionicons 
                                name={isSearching ? "sync-outline" : "search-outline"} 
                                size={20} 
                                color={isSearching ? "#1AB26C" : "#94A3B8"} 
                            />
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        </View>
                    }
                />
            </View>

            <FlatList
                key={viewLayout}
                data={artisans}
                keyExtractor={(item) => item.id}
                className="flex-1"
                numColumns={viewLayout === 'grid' ? 2 : 1}
                columnWrapperStyle={viewLayout === 'grid' ? { gap: 16, marginBottom: 16 } : undefined}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 24 }}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                ListHeaderComponent={
                    <View style={{ marginBottom: 24 }}>
                        <FlatList
                            data={[{ id: 'all', label: 'ALL SECTORS' }, ...CATEGORIES]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
<<<<<<< HEAD
                            className="-mx-6"
                            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16, gap: 12 }}
=======
                            style={{ marginHorizontal: -24 }}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12, gap: 10 }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
                            <View className="mt-16 p-16 items-center border-[2px] border-dashed bg-white border-card-border rounded-[32px] shadow-inner text-center">
                                <View className="w-20 h-20 bg-background rounded-3xl items-center justify-center mb-6 shadow-sm border border-card-border">
                                    <Ionicons name="search-outline" size={42} color="#94A3B8" />
                                </View>
                                <Text className="text-h3 text-center text-ink uppercase font-jakarta-extrabold italic tracking-tight">
                                    ZERO RESULTS FOUND
                                </Text>
                                <Text className="text-body text-center text-ink/50 mt-4 leading-5 font-jakarta-medium max-w-[240px]">
                                    We couldn&apos;t localize any artisans matching your current discovery encryption.
                                </Text>
                            </View>
                        ) : (
                            <View className="mt-6 mb-4 flex-row items-center justify-between px-1">
                                <View className="flex-row items-center gap-2">
                                    <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                                    <Text className="text-label text-[10px] text-primary tracking-[2px] font-jakarta-extrabold italic uppercase">
                                        FOUND {artisans.length} OPERATIVES
=======
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
                                    We couldn&apos;t find any artisans matching your current search parameters.
                                </Text>
                            </View>
                        ) : (
                            <View style={{ marginTop: 24, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent }} />
                                    <Text style={[Typography.label, { fontSize: 10, color: Colors.primary, letterSpacing: 1, fontWeight: '700' }]}>
                                        FOUND {artisans.length} ARTISANS
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
            
            <View className="absolute bottom-10 left-0 right-0 items-center pointer-events-none opacity-20">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="shield-checkmark" size={10} color="#64748B" />
                    <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Secure Discovery Logic Active • Loom v4.2</Text>
                </View>
            </View>
        </View>
    );
}
<<<<<<< HEAD


=======
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
