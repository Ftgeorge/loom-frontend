import { AppHeader } from '@/components/AppHeader';
import { Avatar, RatingStars } from '@/components/ui/AvatarRating';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Badge, Card, Chip } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { fetchArtisanById } from '@/services/mockApi';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import type { Artisan } from '@/types';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ArtisanProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { savedArtisans, toggleSavedArtisan } = useAppStore();
    const [artisan, setArtisan] = useState<Artisan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const isSaved = id ? savedArtisans.includes(id) : false;

    const load = useCallback(async () => {
        try {
            setError(false);
            const data = await fetchArtisanById(id || '');
            if (data) setArtisan(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    if (loading) return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Profile" showBack onBack={() => router.back()} showNotification={false} />
            <View className="p-5"><SkeletonList count={3} /></View>
        </View>
    );

    if (error || !artisan) return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Profile" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader
                title=""
                showBack
                onBack={() => router.back()}
                showNotification={false}
                rightAction={
                    <TouchableOpacity onPress={() => id && toggleSavedArtisan(id)}>
                        <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={24} color={Colors.accent} />
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="items-center gap-2">
                    <Avatar name={artisan.name} size={90} />
                    <View className="flex-row items-center gap-2">
                        <Text className="text-[28px] font-bold text-olive">{artisan.name}</Text>
                        {artisan.verified && <Badge variant="verified" />}
                    </View>
                    <Text className="text-base text-gray-500 text-center">{artisan.bio}</Text>
                </View>

                {/* Skills */}
                <View className="flex-row flex-wrap gap-2 justify-center mt-4">
                    {artisan.skills.map((s) => (
                        <Chip key={s} label={s.replace('_', '/')} selected small />
                    ))}
                </View>

                {/* Stats Row */}
                <View className="flex-row justify-center gap-8 my-5">
                    <View className="flex-row items-center gap-1">
                        <RatingStars rating={artisan.rating} size={14} count={artisan.reviewCount} />
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="location-outline" size={16} color={Colors.gray500} />
                        <Text className="text-sm text-gray-500">{artisan.distance}km away</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="briefcase-outline" size={16} color={Colors.gray500} />
                        <Text className="text-sm text-gray-500">{artisan.completedJobs} jobs</Text>
                    </View>
                </View>

                {/* Pricing */}
                <Card className="mb-4">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-sm text-gray-500">Pricing estimate</Text>
                        <Text className="text-xl font-bold text-accent">
                            {formatNaira(artisan.priceRange.min)} – {formatNaira(artisan.priceRange.max)}
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-400 capitalize mt-1">Style: {artisan.pricingStyle}</Text>
                </Card>

                {/* Availability */}
                <Card className="mb-5">
                    <View className="flex-row items-center gap-2">
                        <View className={`w-2.5 h-2.5 rounded-[5px]`} style={{
                            backgroundColor: artisan.availability === 'online' ? Colors.success : artisan.availability === 'busy' ? Colors.warning : Colors.gray400
                        }} />
                        <Text className="text-base font-medium">
                            {artisan.availability === 'online' ? 'Available now' : artisan.availability === 'busy' ? 'Busy' : 'Offline'}
                        </Text>
                    </View>
                    <Text className="text-sm text-gray-500 mt-1">
                        Service areas: {artisan.serviceAreas.join(', ')}
                    </Text>
                </Card>

                {/* Reviews */}
                <Text className="text-lg font-bold text-olive mb-4">Reviews ({artisan.reviewCount})</Text>
                {artisan.reviews.map((review) => (
                    <View key={review.id} className="mb-5 pb-4 border-b border-gray-100">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-base font-semibold">{review.clientName}</Text>
                            <RatingStars rating={review.rating} size={12} showValue={false} />
                        </View>
                        <Text className="text-sm text-gray-600 mt-1">{review.comment}</Text>
                        <View className="flex-row gap-1 mt-2">
                            {review.tags.map((tag) => (
                                <Chip key={tag} label={tag} small />
                            ))}
                        </View>
                        <Text className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</Text>
                    </View>
                ))}

                {/* Actions */}
                <View className="mt-6 gap-4">
                    <PrimaryButton
                        title="Request Booking"
                        onPress={() => router.push({ pathname: '/booking', params: { artisanId: artisan.id } })}
                        icon={<Ionicons name="calendar-outline" size={20} color={Colors.white} />}
                    />
                    <View className="flex-row gap-4">
                        <SecondaryButton
                            title="Message"
                            onPress={() => router.push({ pathname: '/chat', params: { threadId: 't1' } })}
                            style={{ flex: 1 }}
                            icon={<Ionicons name="chatbubble-outline" size={18} color={Colors.deepOlive} />}
                        />
                        <SecondaryButton
                            title="Call"
                            onPress={() => { }}
                            style={{ flex: 1 }}
                            icon={<Ionicons name="call-outline" size={18} color={Colors.deepOlive} />}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
