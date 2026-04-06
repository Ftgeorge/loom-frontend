import { SubAppHeader } from '@/components/AppSubHeader';
import { RatingStars } from '@/components/ui/AvatarRating';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonProfile } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi, jobApi } from '@/services/api';
import { mapArtisan, mapJob } from '@/services/mappers';
import { useAppStore } from '@/store';
import type { Artisan, JobRequest } from '@/types';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ArtisanProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAppStore();
    const [artisan, setArtisan] = useState<Artisan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showAddWork, setShowAddWork] = useState(false);
    const [newWork, setNewWork] = useState({ title: '', description: '', imageUrl: '', ratingId: '' });
    const [completedJobs, setCompletedJobs] = useState<JobRequest[]>([]);
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
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.4} />
            <SubAppHeader
                label="PROFILE"
                title="Artisan"
                description="Loading professional profile details..."
                showBack
                onBack={() => router.back()}
                onNotification={() => { }}
            />
            <View className="p-6"><SkeletonProfile /></View>
        </View>
    );

    if (error || !artisan) return (
        <View className="flex-1 bg-background">
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
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.3} animated />
            <SubAppHeader
                label="ARTISAN"
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
                {/* Stats */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Card className="flex-row justify-around items-center py-6 mb-5 bg-white rounded-md border-[1.5px] border-card-border shadow-md">
                        <View className="items-center">
                            <Text className="font-jakarta-bold text-primary text-[24px] mb-1">{artisan.rating}</Text>
                            <RatingStars rating={artisan.rating} size={8} showValue={false} />
                        </View>
                        <View className="w-[1px] h-10 bg-gray-100" />
                        <View className="items-center">
                            <Text className="font-jakarta-bold text-ink text-[24px] mb-1">{artisan.completedJobs}</Text>
                            <Text className="text-label text-[8px] text-muted uppercase">Completed</Text>
                        </View>
                        <View className="w-[1px] h-10 bg-gray-100" />
                        <View className="items-center">
                            <Text className="font-jakarta-bold text-ink text-[24px] mb-1">{artisan.distance}km</Text>
                            <Text className="text-label text-[8px] text-muted uppercase">Distance</Text>
                        </View>
                    </Card>

                    <Card className="p-6 mb-10 bg-white border-[1.5px] border-card-border rounded-md">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-label text-muted text-[8px] mb-2 uppercase">Service Fee</Text>
                                <Text className="text-h2 text-primary text-[22px] uppercase">
                                    From {formatNaira(artisan.baseFee)}
                                </Text>
                            </View>
                            <View className={`px-3 py-2 rounded-xs flex-row items-center gap-2 border ${
                                artisan.availability === 'online' ? 'bg-primary border-primary' : 'bg-surface border-card-border'
                            }`}>
                                <View className={`w-[6px] h-[6px] rounded-full ${
                                    artisan.availability === 'online' ? 'bg-white' : 'bg-muted'
                                }`} />
                                <Text className={`text-label text-[8px] uppercase ${
                                    artisan.availability === 'online' ? 'text-white' : 'text-muted'
                                }`}>
                                    {artisan.availability === 'online' ? 'AVAILABLE' : 'UNAVAILABLE'}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Work Showcase Gallery */}
                {artisan.portfolio && artisan.portfolio.length > 0 && (
                    <View className="mb-10">
                        <View className="flex-row justify-between items-center mb-5">
                            <View>
                                <Text className="text-label text-primary mb-1 uppercase">Experience</Text>
                                <Text className="text-h3 text-[20px] uppercase">Work Gallery</Text>
                            </View>
                            {isOwner && (
                                <TouchableOpacity
                                    onPress={() => setShowAddWork(true)}
                                    className="px-3 py-2 bg-white rounded-xs border-[1.5px] border-primary"
                                >
                                    <Text className="text-label text-primary text-[10px] uppercase">+ Add Work</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 24 }}>
                            {artisan.portfolio.map((item, idx) => (
                                <Animated.View
                                    key={item.id}
                                    entering={FadeInDown.delay(300 + idx * 100).springify()}
                                    className="w-[300px]"
                                >
                                    <Card className="p-0 overflow-hidden rounded-lg border-[1.5px] border-card-border bg-white shadow-sm">
                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            className="w-full h-[180px] bg-surface"
                                        />
                                        <View className="p-4">
                                            <Text className="text-h3 text-base text-ink uppercase" numberOfLines={1}>{item.title}</Text>
                                            <Text className="text-body-sm text-muted mt-1 h-10" numberOfLines={2}>{item.description}</Text>

                                            {item.rating && (
                                                <View className="mt-3 pt-3 border-t border-gray-100">
                                                    <View className="flex-row items-center gap-[6px] mb-1">
                                                        <RatingStars rating={item.rating} size={10} showValue={false} />
                                                        <Text className="text-label text-[10px] text-ink font-jakarta-bold uppercase">{item.customerName}</Text>
                                                    </View>
                                                    <Text className="text-body-sm text-[12px] italic text-ink/70 leading-[18px]" numberOfLines={2}>
                                                        &quot;{item.comment}&quot;
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
                <View className="mb-10">
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-label text-primary mb-1 uppercase">Reviews</Text>
                            <Text className="text-h3 text-[20px] uppercase">Client Feedback</Text>
                        </View>
                        <TouchableOpacity className="p-2 bg-white rounded-xs border border-card-border">
                            <Text className="text-label text-accent text-[9px] uppercase">See All</Text>
                        </TouchableOpacity>
                    </View>

                    {artisan.reviews.map((review, idx) => (
                        <Animated.View key={review.id} entering={FadeInDown.delay(300 + idx * 100).springify()}>
                            <Card className="mb-4 p-5 bg-white rounded-md border-[1.5px] border-card-border shadow-sm">
                                <View className="flex-row justify-between items-start mb-3">
                                    <View>
                                        <Text className="text-body font-jakarta-bold text-primary text-[14px] uppercase">{review.clientName}</Text>
                                        <View className="mt-1 flex-row items-center gap-1">
                                            <RatingStars rating={review.rating} size={8} showValue={false} />
                                        </View>
                                    </View>
                                    <Text className="text-label text-[8px] text-muted uppercase">{formatDate(review.createdAt)}</Text>
                                </View>
                                <Text className="text-body-sm text-ink italic leading-5 mb-4">
                                    &quot;{review.comment}&quot;
                                </Text>
                                <View className="flex-row gap-2 flex-wrap">
                                    {review.tags.map((tag) => (
                                        <View key={tag} className="bg-surface px-2 py-1 rounded-xs border border-card-border">
                                            <Text className="text-label text-[8px] text-primary uppercase">{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Card>
                        </Animated.View>
                    ))}
                </View>

                {/* Actions */}
                {!isOwner && (
                    <View className="gap-3">
                        <PrimaryButton
                            title="BOOK SERVICE"
                            onPress={() => router.push({ pathname: '/booking', params: { artisanId: artisan.id } })}
                            icon={<Ionicons name="calendar-outline" size={20} color="white" style={{ marginRight: 8 }} />}
                            variant="accent"
                            className="h-16 rounded-md shadow-md"
                        />
                        <View className="flex-row gap-3">
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
                                className="flex-1 h-[60px] rounded-md border-primary bg-white border-[1.5px]"
                                textStyle={{ color: '#00120C', fontFamily: 'PlusJakartaSans-Bold', fontSize: 11, letterSpacing: 1 }}
                                icon={<Ionicons name="chatbubbles-outline" size={18} color="#00120C" style={{ marginRight: 8 }} />}
                            />
                            <SecondaryButton
                                title="CALL"
                                onPress={() => { }}
                                className="flex-1 h-[60px] rounded-md border-primary bg-white border-[1.5px]"
                                textStyle={{ color: '#00120C', fontFamily: 'PlusJakartaSans-Bold', fontSize: 11, letterSpacing: 1 }}
                                icon={<Ionicons name="call-outline" size={18} color="#00120C" style={{ marginRight: 8 }} />}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Add Work Modal */}
            <Modal visible={showAddWork} animationType="slide" transparent>
                <View className="flex-1 bg-ink/50 justify-end">
                    <View className="bg-white rounded-t-xl p-6 pb-10">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-h2 uppercase">Showcase New Work</Text>
                            <TouchableOpacity onPress={() => setShowAddWork(false)}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-label mb-2 uppercase">Work Title</Text>
                        <TextInput
                            className="bg-surface p-4 rounded-md mb-4 border border-card-border"
                            placeholder="e.g., Luxury Bathroom Installation"
                            value={newWork.title}
                            placeholderTextColor="#94A3B8"
                            onChangeText={(t) => setNewWork({ ...newWork, title: t })}
                        />

                        {completedJobs.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-label mb-2 uppercase">Link to a Rated Job</Text>
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
                                            className={`p-3 rounded-md border-[1.5px] bg-white w-40 ${
                                                newWork.ratingId === job.ratingId ? 'border-primary' : 'border-card-border'
                                            }`}
                                        >
                                            <Text className="text-label text-[10px] mb-1 uppercase" numberOfLines={1}>{job.category}</Text>
                                            <View className="flex-row items-center gap-1">
                                                <RatingStars rating={job.ratingValue || 0} size={8} showValue={false} />
                                                <Text className="text-[9px] text-muted">{job.ratingValue}/5</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <Text className="text-label mb-2 uppercase">Description</Text>
                        <TextInput
                            className="bg-surface p-4 rounded-md mb-4 border border-card-border min-h-[100px]"
                            placeholder="Describe what you did..."
                            multiline
                            placeholderTextColor="#94A3B8"
                            value={newWork.description}
                            onChangeText={(t) => setNewWork({ ...newWork, description: t })}
                        />

                        <Text className="text-label mb-2 uppercase">Image URL</Text>
                        <TextInput
                            className="bg-surface p-4 rounded-md mb-6 border border-card-border"
                            placeholder="Paste work image link..."
                            placeholderTextColor="#94A3B8"
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
                                    load();
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


