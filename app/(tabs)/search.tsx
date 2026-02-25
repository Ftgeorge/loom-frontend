import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { Chip } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { AppTextInput } from '@/components/ui/TextInputs';
import { fetchArtisans } from '@/services/mockApi';
import { Colors } from '@/theme';
import type { Artisan, CategoryId } from '@/types';
import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ category?: string }>();
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(params.category ?? null);
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const search = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await fetchArtisans({
                category: selectedCategory as CategoryId | undefined,
                search: query || undefined,
            });
            setArtisans(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [query, selectedCategory]);

    useEffect(() => { search(); }, [search]);

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            <View className="px-6 pt-8 pb-4">
                <Text className="text-3xl font-bold text-graphite tracking-tight mb-6">Search</Text>
                <AppTextInput
                    placeholder="Search artisans, skills..."
                    value={query}
                    onChangeText={setQuery}
                    leftIcon={<Ionicons name="search-outline" size={20} color={Colors.gray400} />}
                    style={{ marginBottom: 0 }}
                />
            </View>

            <FlatList
                data={artisans}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24, gap: 16 }}
                ListHeaderComponent={
                    <View className="pb-4">
                        <FlatList
                            data={[{ id: 'all', label: 'All' }, ...CATEGORIES]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="-mx-6"
                            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12, gap: 10 }}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Chip
                                    label={item.label}
                                    selected={item.id === 'all' ? !selectedCategory : selectedCategory === item.id}
                                    onPress={() => setSelectedCategory(item.id === 'all' ? null : item.id)}
                                />
                            )}
                        />

                        {loading ? (
                            <View className="pt-4">
                                <SkeletonList count={4} />
                            </View>
                        ) : error ? (
                            <View className="pt-4">
                                <ErrorState onRetry={search} />
                            </View>
                        ) : artisans.length === 0 ? (
                            <View className="pt-10">
                                <EmptyState
                                    icon="search-outline"
                                    title="No results found"
                                    message="Try a different search or browse categories"
                                />
                            </View>
                        ) : (
                            <View className="pt-2 pb-2">
                                <Text className="text-xs font-semibold text-muted tracking-widest uppercase">
                                    {artisans.length} {artisans.length === 1 ? 'artisan' : 'artisans'} found
                                </Text>
                            </View>
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    loading || error || artisans.length === 0 ? null : (
                        <ArtisanCard
                            artisan={item}
                            onPress={() => router.push({ pathname: '/artisan-profile', params: { id: item.id } })}
                            horizontal
                        />
                    )
                )}
            />
        </View>
    );
}
