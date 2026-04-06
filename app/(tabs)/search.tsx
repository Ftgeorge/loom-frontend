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
import type { Artisan } from '@/types';
import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform, Text, View } from 'react-native';
import Animated, { FadeInDown} from 'react-native-reanimated';

export default function SearchScreen() {
    const router = useRouter();
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
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.2} animated />
            
            <SubAppHeader
                label="EXPLORE"
                title="Find an Artisan"
                description="Discover skilled artisans in your area."
                onNotification={() => router.push('/notifications')}
            />

            <View className="px-6 pb-4">
                <AppTextInput
                    placeholder="Search by name, skill, or location..."
                    value={query}
                    onChangeText={setQuery}
                    containerStyle={{
                        borderRadius: 24,
                        backgroundColor: 'white',
                        borderWidth: 1.5,
                        borderColor: isSearching ? '#00120C' : '#F0F0EE',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 10,
                        elevation: 2
                    }}
                    leftIcon={
                        <View className="pl-5">
                            <Ionicons name="search" size={22} className="text-muted" />
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
                removeClippedSubviews={Platform.OS !== 'web'}
                ListHeaderComponent={
                    <View className="mb-6">
                        <FlatList
                            data={[{ id: 'all', label: 'ALL SERVICES' }, ...CATEGORIES]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="-mx-6"
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

                        {loading ? (
                            <View className="mt-6">
                                <SkeletonList count={4} type="artisan" />
                            </View>
                        ) : error ? (
                            <View className="mt-6">
                                <ErrorState onRetry={() => search(selectedCategory, query)} />
                            </View>
                        ) : artisans.length === 0 ? (
                            <View className="mt-16 p-12 items-center border-dashed bg-white border-card-border rounded-md border-[1.5px]">
                                <Ionicons name="search" size={48} className="text-card-border" />
                                <Text className="text-h3 text-center text-primary mt-6">
                                    NO RESULTS
                                </Text>
                                <Text className="text-body-sm text-center text-muted mt-3 leading-5">
                                    We couldn&apos;t find any artisans matching your current search parameters.
                                </Text>
                            </View>
                        ) : (
                            <View className="mt-6 mb-2 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-2">
                                    <View className="w-[6px] h-[6px] rounded-full bg-accent" />
                                    <Text className="text-label text-[10px] text-primary tracking-[1px] font-jakarta-bold uppercase">
                                        FOUND {artisans.length} ARTISANS
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
                            className={`mb-4 ${viewLayout === 'grid' ? 'flex-[0.5]' : 'flex-1'}`}
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

