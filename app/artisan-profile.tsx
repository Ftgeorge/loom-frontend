import { SubAppHeader } from '@/components/AppSubHeader';
import { Avatar, RatingStars } from '@/components/ui/AvatarRating';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Badge, Card, Chip } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonProfile } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi, jobApi } from '@/services/api';
import { mapArtisan, mapJob } from '@/services/mappers';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { Artisan, ArtisanReview, JobRequest } from '@/types';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ArtisanProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { savedArtisans, toggleSavedArtisan, user } = useAppStore();
    const [artisan, setArtisan] = useState<Artisan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showAddWork, setShowAddWork] = useState(false);
    const [newWork, setNewWork] = useState({ title: '', description: '', imageUrl: '', ratingId: '' });
    const [completedJobs, setCompletedJobs] = useState<JobRequest[]>([]);
    const isSaved = id ? savedArtisans.includes(id) : false;
    const isOwner = user?.id === artisan?.userId;

    useEffect(() => {
        if (showAddWork && isOwner) {
            jobApi.list({ status: 'completed' }).then(res => {
                const mapped = (res.results as any[]).map(mapJob).filter(j => j.ratingId);
                setCompletedJobs(mapped);
            });
        }
    }, [showAddWork, isOwner]);

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
            <SubAppHeader
                label="PROFILE"
                title="Artisan"
                description="Loading professional profile details..."
                showBack
                onBack={() => router.back()}
                onNotification={() => { }}
            />
            <View style={{ padding: 24 }}><SkeletonProfile /></View>
        </View>
    );

    if (error || !artisan) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <SubAppHeader
                label="ERROR"
                title="Profile"
                description="Unable to load artisan details."
                showBack
                onBack={() => router.back()}
                onNotification={() => {}}
            />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
            <SubAppHeader
                label="PROFESSIONAL"
                title={artisan.name}
                description={artisan.bio}
                showBack
                onBack={() => router.back()}
                onNotification={() => {}}
            />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header content moved to SubAppHeader */}

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
                            <Text style={[Typography.label, { fontSize: 8, color: Colors.muted }]}>COMPLETED</Text>
                        </View>
                        <View style={{ width: 1, height: 40, backgroundColor: Colors.gray100 }} />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[Typography.h1, { fontSize: 24, marginBottom: 4 }]}>{artisan.distance}km</Text>
                            <Text style={[Typography.label, { fontSize: 8, color: Colors.muted }]}>DISTANCE</Text>
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
                                <Text style={[Typography.label, { color: Colors.muted, fontSize: 8, marginBottom: 8 }]}>SERVICE FEE</Text>
                                <Text style={[Typography.h2, { color: Colors.primary, fontSize: 22 }]}>
                                    From {formatNaira(artisan.baseFee)}
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
                                    {artisan.availability === 'online' ? 'AVAILABLE' : 'UNAVAILABLE'}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Work Showcase Gallery */}
                {artisan.portfolio && artisan.portfolio.length > 0 && (
                    <View style={{ marginBottom: 40 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <View>
                                <Text style={[Typography.label, { color: Colors.primary, marginBottom: 4 }]}>EXPERIENCE</Text>
                                <Text style={[Typography.h3, { fontSize: 20 }]}>Work Gallery</Text>
                            </View>
                            {isOwner && (
                                <TouchableOpacity
                                    onPress={() => setShowAddWork(true)}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        backgroundColor: Colors.white,
                                        borderRadius: Radius.xs,
                                        borderWidth: 1.5,
                                        borderColor: Colors.primary
                                    }}
                                >
                                    <Text style={[Typography.label, { color: Colors.primary, fontSize: 10 }]}>+ ADD WORK</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 24 }}>
                            {artisan.portfolio.map((item, idx) => (
                                <Animated.View
                                    key={item.id}
                                    entering={FadeInDown.delay(300 + idx * 100).springify()}
                                    style={{ width: 300 }}
                                >
                                    <Card style={{
                                        padding: 0,
                                        overflow: 'hidden',
                                        borderRadius: Radius.lg,
                                        borderWidth: 1.5,
                                        borderColor: Colors.cardBorder,
                                        backgroundColor: Colors.white,
                                        ...Shadows.sm
                                    }}>
                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            style={{ width: '100%', height: 180, backgroundColor: Colors.surface }}
                                        />
                                        <View style={{ padding: 16 }}>
                                            <Text style={[Typography.h3, { fontSize: 16, color: Colors.ink }]} numberOfLines={1}>{item.title}</Text>
                                            <Text style={[Typography.bodySmall, { color: Colors.muted, marginTop: 4, height: 40 }]} numberOfLines={2}>{item.description}</Text>

                                            {item.rating && (
                                                <View style={{
                                                    marginTop: 12,
                                                    paddingTop: 12,
                                                    borderTopWidth: 1,
                                                    borderTopColor: Colors.gray100
                                                }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                                        <RatingStars rating={item.rating} size={10} showValue={false} />
                                                        <Text style={[Typography.label, { fontSize: 10, color: Colors.ink, fontWeight: '700' }]}>{item.customerName}</Text>
                                                    </View>
                                                    <Text style={[Typography.bodySmall, { fontSize: 12, fontStyle: 'italic', color: Colors.text, lineHeight: 18 }]} numberOfLines={2}>
                                                        "{item.comment}"
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </Card>
                                </Animated.View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Reviews */}
                <View style={{ marginBottom: 40 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <View>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 4 }]}>REVIEWS</Text>
                            <Text style={[Typography.h3, { fontSize: 20 }]}>Client Feedback</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 8, backgroundColor: Colors.white, borderRadius: Radius.xs, borderWidth: 1, borderColor: Colors.cardBorder }}>
                            <Text style={[Typography.label, { color: Colors.accent, fontSize: 9 }]}>SEE ALL</Text>
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
                        title="BOOK SERVICE"
                        onPress={() => router.push({ pathname: '/booking', params: { artisanId: artisan.id } })}
                        icon={<Ionicons name="calendar-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />}
                        variant="accent"
                        style={{ height: 64, borderRadius: Radius.md, ...Shadows.md }}
                    />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <SecondaryButton
                            title="MESSAGE"
                            onPress={async () => {
                                try {
                                    const { threadApi } = await import('@/services/api');
                                    const res = await threadApi.create({ artisanProfileId: artisan.id });
                                    router.push({ pathname: '/chat', params: { threadId: res.id } });
                                } catch (err) {
                                    console.error('Failed to create thread:', err);
                                    Alert.alert('Error', 'Unable to start a conversation at this time.');
                                }
                            }}
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

            {/* Add Work Modal */}
            <Modal visible={showAddWork} animationType="slide" transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{
                        backgroundColor: Colors.white,
                        borderTopLeftRadius: Radius.xl,
                        borderTopRightRadius: Radius.xl,
                        padding: 24,
                        paddingBottom: 40
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <Text style={Typography.h2}>Showcase New Work</Text>
                            <TouchableOpacity onPress={() => setShowAddWork(false)}>
                                <Ionicons name="close" size={24} color={Colors.muted} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[Typography.label, { marginBottom: 8 }]}>WORK TITLE</Text>
                        <TextInput
                            style={{
                                backgroundColor: Colors.surface,
                                padding: 16,
                                borderRadius: Radius.md,
                                marginBottom: 16,
                                borderWidth: 1,
                                borderColor: Colors.cardBorder
                            }}
                            placeholder="e.g., Luxury Bathroom Installation"
                            value={newWork.title}
                            onChangeText={(t) => setNewWork({ ...newWork, title: t })}
                        />

                        {completedJobs.length > 0 && (
                            <View style={{ marginBottom: 16 }}>
                                <Text style={[Typography.label, { marginBottom: 8 }]}>LINK TO A RATED JOB</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                                    {completedJobs.map(job => (
                                        <TouchableOpacity
                                            key={job.id}
                                            onPress={() => {
                                                setNewWork({
                                                    ...newWork,
                                                    ratingId: job.ratingId || '',
                                                    title: job.category !== 'not_sure' ? job.category.toUpperCase() : newWork.title
                                                });
                                            }}
                                            style={{
                                                padding: 12,
                                                borderRadius: Radius.md,
                                                borderWidth: 1.5,
                                                borderColor: newWork.ratingId === job.ratingId ? Colors.primary : Colors.cardBorder,
                                                backgroundColor: Colors.white,
                                                width: 160
                                            }}
                                        >
                                            <Text style={[Typography.label, { fontSize: 10, marginBottom: 4 }]} numberOfLines={1}>{job.category.toUpperCase()}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                <RatingStars rating={job.ratingValue || 0} size={8} showValue={false} />
                                                <Text style={{ fontSize: 9, color: Colors.muted }}>{job.ratingValue}/5</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <Text style={[Typography.label, { marginBottom: 8 }]}>DESCRIPTION</Text>
                        <TextInput
                            style={{
                                backgroundColor: Colors.surface,
                                padding: 16,
                                borderRadius: Radius.md,
                                marginBottom: 16,
                                borderWidth: 1,
                                borderColor: Colors.cardBorder,
                                minHeight: 100
                            }}
                            placeholder="Describe what you did..."
                            multiline
                            value={newWork.description}
                            onChangeText={(t) => setNewWork({ ...newWork, description: t })}
                        />

                        <Text style={[Typography.label, { marginBottom: 8 }]}>IMAGE URL</Text>
                        <TextInput
                            style={{
                                backgroundColor: Colors.surface,
                                padding: 16,
                                borderRadius: Radius.md,
                                marginBottom: 24,
                                borderWidth: 1,
                                borderColor: Colors.cardBorder
                            }}
                            placeholder="Paste work image link..."
                            value={newWork.imageUrl}
                            onChangeText={(t) => setNewWork({ ...newWork, imageUrl: t })}
                        />

                        <PrimaryButton
                            title="UPLOAD TO FEED"
                            onPress={async () => {
                                if (!newWork.title || !newWork.imageUrl) return Alert.alert("Error", "Title and Image are required.");
                                try {
                                    await artisanApi.addPortfolioItem(newWork);
                                    setShowAddWork(false);
                                    setNewWork({ title: '', description: '', imageUrl: '', ratingId: '' });
                                    load(); // Refresh profile
                                } catch (err) {
                                    Alert.alert("Error", "Failed to add work showcase.");
                                }
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

