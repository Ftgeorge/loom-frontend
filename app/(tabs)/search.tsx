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
            <View className="px-5 pt-3">
                <AppTextInput
                    placeholder="Search artisans, skills..."
                    value={query}
                    onChangeText={setQuery}
                    leftIcon={<Ionicons name="search-outline" size={20} color={Colors.gray400} />}
                    style={{ marginBottom: 0 }}
                />
            </View>

            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={
                    <>
                        <FlatList
                            data={[{ id: 'all', label: 'All' }, ...CATEGORIES]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, gap: 8 }}
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
                            <View className="p-5">
                                <SkeletonList count={4} />
                            </View>
                        ) : error ? (
                            <ErrorState onRetry={search} />
                        ) : artisans.length === 0 ? (
                            <EmptyState
                                icon="search-outline"
                                title="No results found"
                                message="Try a different search or browse categories"
                            />
                        ) : (
                            <View className="px-5 gap-4">
                                <Text className="text-xs text-gray-500 mb-1">{artisans.length} artisans found</Text>
                                {artisans.map((art) => (
                                    <ArtisanCard
                                        key={art.id}
                                        artisan={art}
                                        onPress={() => router.push({ pathname: '/artisan-profile', params: { id: art.id } })}
                                        horizontal
                                    />
                                ))}
                            </View>
                        )}
                    </>
                }
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
}
