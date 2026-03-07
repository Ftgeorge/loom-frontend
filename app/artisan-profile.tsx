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
import { Colors, Radius, Shadows, Typography } from '@/theme';
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
            <LoomThread variant="minimal" opacity={0.3} animated />
            <AppHeader
                title=""
                showBack
                onBack={() => router.back()}
                showNotification={false}
                rightAction={
                    <TouchableOpacity
                        onPress={() => id && toggleSavedArtisan(id)}
                        style={{
                            padding: 8,
                            backgroundColor: Colors.white,
                            borderRadius: Radius.xs,
                            ...Shadows.sm
                        }}
                    >
                        <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={Colors.accent} />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Command Center */}
                <Animated.View entering={FadeInUp.springify()} style={{ alignItems: 'center', marginBottom: 40 }}>
                    <View style={{ position: 'relative' }}>
                        <Avatar name={artisan.name} size={110} />
                        {artisan.verified && (
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: Colors.accent,
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                borderWidth: 4,
                                borderColor: Colors.background,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Ionicons name="checkmark-circle" size={16} color={Colors.white} />
                            </View>
                        )}
                    </View>

                    <Text style={[Typography.label, { color: Colors.primary, marginTop: 24, fontSize: 10, letterSpacing: 2 }]}>PROFESSIONAL</Text>
                    <Text style={[Typography.h1, { marginTop: 8, fontSize: 32 }]}>{artisan.name.toUpperCase()}</Text>
                    <Text style={[Typography.body, { textAlign: 'center', marginTop: 12, color: Colors.muted, paddingHorizontal: 20, lineHeight: 22 }]}>
                        {artisan.bio}
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                        {artisan.skills.map((s) => (
                            <Chip key={s} label={s.toUpperCase().replace('_', ' / ')} selected small />
                        ))}
                    </View>
                </Animated.View>

                {/* Stats */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Card style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        paddingVertical: 24,
                        marginBottom: 20,
                        backgroundColor: Colors.white,
                        borderRadius: Radius.md,
                        borderColor: Colors.cardBorder,
                        borderWidth: 1.5,
                        ...Shadows.md
                    }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[Typography.h1, { color: Colors.primary, fontSize: 24, marginBottom: 4 }]}>{artisan.rating}</Text>
                            <RatingStars rating={artisan.rating} size={8} showValue={false} />
                        </View>
                        <View style={{ width: 1, height: 40, backgroundColor: Colors.gray100 }} />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[Typography.h1, { fontSize: 24, marginBottom: 4 }]}>{artisan.completedJobs}</Text>
                            <Text style={[Typography.label, { fontSize: 8, color: Colors.muted }]}>JOBS</Text>
                        </View>
                        <View style={{ width: 1, height: 40, backgroundColor: Colors.gray100 }} />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[Typography.h1, { fontSize: 24, marginBottom: 4 }]}>{artisan.distance}km</Text>
                            <Text style={[Typography.label, { fontSize: 8, color: Colors.muted }]}>NEARBY</Text>
                        </View>
                    </Card>

                    <Card style={{
                        padding: 24,
                        marginBottom: 40,
                        backgroundColor: Colors.white,
                        borderColor: Colors.cardBorder,
                        borderWidth: 1.5,
                        borderRadius: Radius.md
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={[Typography.label, { color: Colors.muted, fontSize: 8, marginBottom: 8 }]}>PRICE RANGE</Text>
                                <Text style={[Typography.h2, { color: Colors.primary, fontSize: 22 }]}>
                                    {formatNaira(artisan.priceRange.min)} – {formatNaira(artisan.priceRange.max)}
                                </Text>
                            </View>
                            <View style={{
                                backgroundColor: artisan.availability === 'online' ? Colors.primary : Colors.surface,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: Radius.xs,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                borderWidth: 1,
                                borderColor: artisan.availability === 'online' ? Colors.primary : Colors.cardBorder
                            }}>
                                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: artisan.availability === 'online' ? Colors.white : Colors.muted }} />
                                <Text style={[Typography.label, { color: artisan.availability === 'online' ? Colors.white : Colors.muted, fontSize: 8 }]}>
                                    {artisan.availability === 'online' ? 'AVAILABLE' : 'BUSY'}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Reviews */}
                <View style={{ marginBottom: 40 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <View>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 4 }]}>REVIEWS</Text>
                            <Text style={[Typography.h3, { fontSize: 20 }]}>What clients say</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 8, backgroundColor: Colors.white, borderRadius: Radius.xs, borderWidth: 1, borderColor: Colors.cardBorder }}>
                            <Text style={[Typography.label, { color: Colors.accent, fontSize: 9 }]}>VIEW ALL</Text>
                        </TouchableOpacity>
                    </View>

                    {artisan.reviews.map((review, idx) => (
                        <Animated.View key={review.id} entering={FadeInDown.delay(300 + idx * 100).springify()}>
                            <Card style={{
                                marginBottom: 16,
                                padding: 20,
                                backgroundColor: Colors.white,
                                borderRadius: Radius.md,
                                borderWidth: 1.5,
                                borderColor: Colors.cardBorder,
                                ...Shadows.sm
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <View>
                                        <Text style={[Typography.body, { fontWeight: '700', color: Colors.primary, fontSize: 14 }]}>{review.clientName.toUpperCase()}</Text>
                                        <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                            <RatingStars rating={review.rating} size={8} showValue={false} />
                                        </View>
                                    </View>
                                    <Text style={[Typography.label, { fontSize: 8, color: Colors.muted }]}>{formatDate(review.createdAt).toUpperCase()}</Text>
                                </View>
                                <Text style={[Typography.bodySmall, { color: Colors.text, lineHeight: 20, marginBottom: 16, fontStyle: 'italic' }]}>
                                    "{review.comment}"
                                </Text>
                                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                    {review.tags.map((tag) => (
                                        <View key={tag} style={{ backgroundColor: Colors.surface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.xs, borderWidth: 1, borderColor: Colors.cardBorder }}>
                                            <Text style={[Typography.label, { fontSize: 8, color: Colors.primary, letterSpacing: 0 }]}>{tag.toUpperCase()}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Card>
                        </Animated.View>
                    ))}
                </View>

                {/* Actions */}
                <View style={{ gap: 12 }}>
                    <PrimaryButton
                        title="BOOK NOW"
                        onPress={() => router.push({ pathname: '/booking', params: { artisanId: artisan.id } })}
                        icon={<Ionicons name="calendar" size={20} color={Colors.white} style={{ marginRight: 8 }} />}
                        variant="accent"
                        style={{ height: 64, borderRadius: Radius.md, ...Shadows.md }}
                    />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <SecondaryButton
                            title="CHAT"
                            onPress={() => router.push({ pathname: '/chat', params: { threadId: 't1' } })}
                            style={{ flex: 1, height: 60, borderRadius: Radius.md, borderColor: Colors.primary, backgroundColor: Colors.white, borderWidth: 1.5 }}
                            textStyle={{ color: Colors.primary, fontSize: 11, letterSpacing: 1 }}
                            icon={<Ionicons name="chatbubbles-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />}
                        />
                        <SecondaryButton
                            title="CALL"
                            onPress={() => { }}
                            style={{ flex: 1, height: 60, borderRadius: Radius.md, borderColor: Colors.primary, backgroundColor: Colors.white, borderWidth: 1.5 }}
                            textStyle={{ color: Colors.primary, fontSize: 11, letterSpacing: 1 }}
                            icon={<Ionicons name="call-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

