import { mapArtisan } from '@/services/mappers';
import { AppHeader } from '@/components/AppHeader';
import { Avatar, RatingStars } from '@/components/ui/AvatarRating';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Badge, Card, Chip } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonProfile } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Typography } from '@/theme';
import type { Artisan, ArtisanReview } from '@/types';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

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
            if (!id) return;
            // GET /artisans/:id
            const row: any = await artisanApi.getById(id);
            if (row) {
                const normalised: Artisan = mapArtisan(row);
                setArtisan(normalised);
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.4} />
            <AppHeader title="Profile" showBack onBack={() => router.back()} showNotification={false} />
            <View style={{ padding: 24 }}><SkeletonProfile /></View>
        </View>
    );

    if (error || !artisan) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Profile" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="dense" opacity={0.3} animated />
            <AppHeader
                title=""
                showBack
                onBack={() => router.back()}
                showNotification={false}
                rightAction={
                    <TouchableOpacity onPress={() => id && toggleSavedArtisan(id)} style={{ padding: 8 }}>
                        <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={24} color={Colors.primary} />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <Animated.View entering={FadeInUp.delay(100)} style={{ alignItems: 'center', marginBottom: 32 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Avatar name={artisan.name} size={100} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}>
                            <Text style={Typography.h1}>{artisan.name}</Text>
                            {artisan.verified && <Badge variant="verified" />}
                        </View>
                        <Text style={[Typography.body, { textAlign: 'center', marginTop: 8, color: Colors.textSecondary, paddingHorizontal: 20 }]}>
                            {artisan.bio}
                        </Text>
                    </View>
                </Animated.View>

                {/* Skills */}
                <Animated.View entering={FadeInDown.delay(200)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
                    {artisan.skills.map((s) => (
                        <Chip key={s} label={s.replace('_', '/')} selected small />
                    ))}
                </Animated.View>

                {/* Vertical Info Grid */}
                <Animated.View entering={FadeInDown.delay(300)}>
                    <Card style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={Typography.h3}>{artisan.rating}</Text>
                                <RatingStars rating={artisan.rating} size={12} showValue={false} />
                            </View>
                            <View style={{ width: 1, height: 30, backgroundColor: Colors.cardBorder }} />
                            <View style={{ alignItems: 'center' }}>
                                <Text style={Typography.h3}>{artisan.completedJobs}</Text>
                                <Text style={[Typography.label, { fontSize: 10, textTransform: 'none', color: Colors.muted }]}>Jobs Done</Text>
                            </View>
                            <View style={{ width: 1, height: 30, backgroundColor: Colors.cardBorder }} />
                            <View style={{ alignItems: 'center' }}>
                                <Text style={Typography.h3}>{artisan.distance}km</Text>
                                <Text style={[Typography.label, { fontSize: 10, textTransform: 'none', color: Colors.muted }]}>Distance</Text>
                            </View>
                        </View>
                    </Card>

                    <Card style={{ marginBottom: 32 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text style={[Typography.label, { textTransform: 'none', color: Colors.muted }]}>Estimated Rate</Text>
                            <Text style={[Typography.h2, { color: Colors.primary, fontSize: 18 }]}>
                                {formatNaira(artisan.priceRange.min)} – {formatNaira(artisan.priceRange.max)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: artisan.availability === 'online' ? Colors.success : Colors.warning }} />
                            <Text style={[Typography.bodySmall, { fontWeight: '600' }]}>
                                {artisan.availability === 'online' ? 'Currently Online' : 'Busy at the moment'}
                            </Text>
                        </View>
                    </Card>
                </Animated.View>

                {/* Reviews */}
                <View style={{ marginBottom: 40 }}>
                    <Text style={[Typography.h3, { marginBottom: 20 }]}>Reviews ({artisan.reviewCount})</Text>
                    {artisan.reviews.map((review, idx) => (
                        <Card key={review.id} style={{ marginBottom: 16 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <View>
                                    <Text style={[Typography.body, { fontWeight: '700' }]}>{review.clientName}</Text>
                                    <View style={{ marginTop: 2 }}>
                                        <RatingStars rating={review.rating} size={10} showValue={false} />
                                    </View>
                                </View>
                                <Text style={[Typography.label, { fontSize: 9, color: Colors.muted }]}>{formatDate(review.createdAt)}</Text>
                            </View>
                            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, lineHeight: 18 }]}>{review.comment}</Text>
                            <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
                                {review.tags.map((tag) => (
                                    <Chip key={tag} label={tag} small />
                                ))}
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Actions */}
                <View style={{ gap: 12 }}>
                    <PrimaryButton
                        title="Book Service"
                        onPress={() => router.push({ pathname: '/booking', params: { artisanId: artisan.id } })}
                        icon={<Ionicons name="calendar-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />}
                        variant="accent"
                    />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <SecondaryButton
                            title="Message"
                            onPress={() => router.push({ pathname: '/chat', params: { threadId: 't1' } })}
                            style={{ flex: 1 }}
                            icon={<Ionicons name="chatbubble" size={18} color={Colors.primary} style={{ marginRight: 4 }} />}
                        />
                        <SecondaryButton
                            title="Call Now"
                            onPress={() => { }}
                            style={{ flex: 1 }}
                            icon={<Ionicons name="call" size={18} color={Colors.primary} style={{ marginRight: 4 }} />}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

