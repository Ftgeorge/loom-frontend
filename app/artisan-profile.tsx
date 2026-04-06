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
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.4} scale={1.3} />
            </View>
            <SubAppHeader
                label="PROFILE"
                title="ARTISAN"
                description="Loading professional profile details..."
                showBack
                onBack={() => router.back()}
                onNotification={() => router.push('/notifications')}
            />
            <View className="p-6"><SkeletonProfile /></View>
        </View>
    );

    if (error || !artisan) return (
        <View className="flex-1 bg-background">
            <SubAppHeader
                label="ERROR"
                title="PROFILE"
                description="Unable to load artisan details into the system terminal."
                showBack
                onBack={() => router.back()}
                onNotification={() => router.push('/notifications')}
            />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
            </View>
            <SubAppHeader
                label="OPERATIVE IDENTITY"
                title={artisan.name.toUpperCase()}
                description={artisan.bio}
                showBack
                onBack={() => router.back()}
                onNotification={() => router.push('/notifications')}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Stats Matrix ────────────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="px-6 mt-6">
                    <View className="flex-row justify-around items-center py-10 mb-6 bg-white rounded-[42px] border-[1.5px] border-card-border shadow-2xl">
                        <View className="items-center">
                            <Text className="font-jakarta-extrabold text-primary text-[32px] tracking-tighter mb-1">{artisan.rating}</Text>
                            <RatingStars rating={artisan.rating} size={10} showValue={false} />
                        </View>
                        <View className="w-[1.5px] h-14 bg-card-border/30" />
                        <View className="items-center">
                            <Text className="font-jakarta-extrabold text-ink text-[32px] tracking-tighter mb-1">{artisan.completedJobs}</Text>
                            <Text className="text-label text-[10px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">JOBS</Text>
                        </View>
                        <View className="w-[1.5px] h-14 bg-card-border/30" />
                        <View className="items-center">
                            <Text className="font-jakarta-extrabold text-ink text-[32px] tracking-tighter mb-1">{artisan.distance}<Text className="text-base">km</Text></Text>
                            <Text className="text-label text-[10px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">AWAY</Text>
                        </View>
                    </View>

                    {/* ─── Mission Cost Terminal ────────────────────────────────────────── */}
                    <View className="p-8 mb-10 bg-white border-[1.5px] border-card-border rounded-[42px] shadow-2xl">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-label text-ink/40 text-[11px] mb-2 uppercase tracking-[5px] font-jakarta-bold italic">MISSION COST</Text>
                                <Text className="text-[26px] font-jakarta-extrabold text-primary uppercase italic tracking-tighter">
                                    FROM {formatNaira(artisan.baseFee)}
                                </Text>
                            </View>
                            <View className={`px-5 py-2.5 rounded-full flex-row items-center gap-2.5 border shadow-sm ${
                                artisan.availability === 'online' ? 'bg-success border-success/20 shadow-success/40' : 'bg-white border-card-border'
                            }`}>
                                <View className={`w-2.5 h-2.5 rounded-full shadow-white ${
                                    artisan.availability === 'online' ? 'bg-white shadow-[0_0_12px_rgba(26,178,108,0.8)]' : 'bg-muted'
                                }`} />
                                <Text className={`text-[11px] uppercase font-jakarta-extrabold tracking-widest italic ${
                                    artisan.availability === 'online' ? 'text-white' : 'text-muted'
                                }`}>
                                    {artisan.availability === 'online' ? 'ONLINE' : 'OFFLINE'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* ─── Operational Log Gallery ─────────────────────────────────────── */}
                    {artisan.portfolio && artisan.portfolio.length > 0 && (
                        <View className="mb-12">
                            <View className="flex-row justify-between items-end mb-8 px-2">
                                <View>
                                    <Text className="text-label text-primary mb-1.5 uppercase tracking-[5px] font-jakarta-bold italic text-[11px]">OPERATIONAL LOG</Text>
                                    <Text className="text-[24px] uppercase font-jakarta-extrabold italic tracking-tighter text-ink">WORK SHOWCASE</Text>
                                </View>
                                {isOwner && (
                                    <TouchableOpacity
                                        onPress={() => setShowAddWork(true)}
                                        className="px-6 py-3 bg-white rounded-2xl border-2 border-primary shadow-xl active:bg-gray-50"
                                    >
                                        <Text className="text-[12px] text-primary uppercase font-jakarta-extrabold tracking-tighter italic">+ ADD WORK</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false} 
                                contentContainerStyle={{ gap: 24, paddingRight: 40, paddingLeft: 4 }}
                                snapToAlignment="start"
                                decelerationRate="fast"
                                snapToInterval={300 + 24}
                            >
                                {artisan.portfolio.map((item, idx) => (
                                    <Animated.View
                                        key={item.id}
                                        entering={FadeInDown.delay(300 + idx * 100).springify()}
                                        className="w-[310px]"
                                    >
                                        <View className="bg-white rounded-[48px] border-[1.5px] border-card-border shadow-2xl overflow-hidden active:scale-[0.98]">
                                            <View className="p-4">
                                                <Image
                                                    source={{ uri: item.imageUrl }}
                                                    className="w-full h-[200px] rounded-[38px] bg-background shadow-inner"
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            <View className="p-7 pt-2">
                                                <Text className="text-[20px] text-ink uppercase tracking-tighter font-jakarta-extrabold italic" numberOfLines={1}>{item.title}</Text>
                                                <Text className="text-[13px] text-ink/60 mt-3 h-12 leading-5 font-jakarta-medium italic" numberOfLines={2}>{item.description}</Text>

                                                {item.rating && (
                                                    <View className="mt-6 pt-6 border-t border-card-border/30">
                                                        <View className="flex-row items-center gap-3 mb-3">
                                                            <RatingStars rating={item.rating} size={10} showValue={false} />
                                                            <Text className="text-label text-[11px] text-ink font-jakarta-extrabold uppercase italic tracking-tighter">{item.customerName}</Text>
                                                        </View>
                                                        <Text className="text-[14px] italic text-ink/70 leading-5 font-jakarta-medium" numberOfLines={2}>
                                                            &quot;{item.comment}&quot;
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </Animated.View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* ─── Client Feedback Ledger ───────────────────────────────────────── */}
                    <View className="mb-12">
                        <View className="flex-row justify-between items-end mb-8 px-2">
                            <View>
                                <Text className="text-label text-primary mb-1.5 uppercase tracking-[5px] font-jakarta-bold italic text-[11px]">CLIENT DEBRIEF</Text>
                                <Text className="text-[24px] uppercase font-jakarta-extrabold italic tracking-tighter text-ink">FEEDBACK LOOP</Text>
                            </View>
                            <TouchableOpacity className="px-5 py-2.5 bg-white rounded-2xl border border-card-border shadow-sm active:bg-gray-50">
                                <Text className="text-[10px] text-ink uppercase font-jakarta-extrabold italic tracking-wider">SEE ALL</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="gap-6">
                            {artisan.reviews.map((review, idx) => (
                                <Animated.View key={review.id} entering={FadeInDown.delay(300 + idx * 100).springify()}>
                                    <View className="p-8 bg-white rounded-[38px] border-[1.5px] border-card-border shadow-xl">
                                        <View className="flex-row justify-between items-start mb-5">
                                            <View>
                                                <Text className="text-[16px] font-jakarta-extrabold text-primary uppercase italic tracking-tight">{review.clientName}</Text>
                                                <View className="mt-2 flex-row items-center gap-1.5">
                                                    <RatingStars rating={review.rating} size={8} showValue={false} />
                                                </View>
                                            </View>
                                            <Text className="text-label text-[9px] text-muted uppercase tracking-[3px] font-jakarta-bold italic">{formatDate(review.createdAt)}</Text>
                                        </View>
                                        <Text className="text-[15px] text-ink/80 italic leading-6 mb-7 font-jakarta-medium">
                                            &quot;{review.comment}&quot;
                                        </Text>
                                        <View className="flex-row gap-2.5 flex-wrap">
                                            {review.tags.map((tag) => (
                                                <View key={tag} className="bg-background px-4 py-2 rounded-full border border-card-border/50 shadow-sm">
                                                    <Text className="text-[9px] text-primary uppercase font-jakarta-extrabold tracking-widest">{tag}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </Animated.View>
                            ))}
                        </View>
                    </View>

                    {/* ─── Mission Terminal Actions ─────────────────────────────────────── */}
                    {!isOwner && (
                        <View className="gap-6 mt-4">
                            <PrimaryButton
                                title="INITIALIZE BOOKING"
                                onPress={() => router.push({ pathname: '/booking', params: { artisanId: artisan.id } })}
                                icon={<Ionicons name="calendar-outline" size={22} color="white" />}
                                variant="accent"
                                className="h-18 rounded-3xl shadow-2xl border border-white/10"
                            />
                            <View className="flex-row gap-5">
                                <TouchableOpacity
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
                                    className="flex-1 h-18 rounded-3xl bg-white border-[2.5px] border-primary items-center justify-center flex-row gap-3 shadow-lg active:bg-gray-50"
                                >
                                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#00120C" />
                                    <Text className="text-primary font-jakarta-extrabold uppercase italic tracking-tighter text-[13px]">MESSAGE</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => Alert.alert("Voice Transmission", "Initializing secure line via system gateway...")}
                                    className="flex-1 h-18 rounded-3xl bg-white border-[2.5px] border-primary items-center justify-center flex-row gap-3 shadow-lg active:bg-gray-50"
                                >
                                    <Ionicons name="phone-portrait-outline" size={20} color="#00120C" />
                                    <Text className="text-primary font-jakarta-extrabold uppercase italic tracking-tighter text-[13px]">CALL</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            {/* ─── Operational Showcase Modal ────────────────────────────────────── */}
            <Modal visible={showAddWork} animationType="slide" transparent>
                <View className="flex-1 bg-ink/75 justify-end">
                    <View className="bg-white rounded-t-[56px] p-10 pb-16 shadow-3xl">
                        <View className="flex-row justify-between items-center mb-10">
                            <Text className="text-[32px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">MISSION SHOWCASE</Text>
                            <TouchableOpacity onPress={() => setShowAddWork(false)} className="bg-background w-12 h-12 rounded-full items-center justify-center border border-card-border/50 shadow-sm">
                                <Ionicons name="close" size={30} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-6">
                            <Text className="text-label mb-3 uppercase tracking-[4px] text-[10px] text-primary font-jakarta-extrabold italic">MISSION TITLE</Text>
                            <TextInput
                                className="h-16 bg-background px-7 rounded-3xl border border-card-border/50 text-ink font-jakarta-extrabold italic uppercase text-[15px] tracking-tight shadow-inner"
                                placeholder="E.G. LUXURY ASSET INSTALLATION"
                                value={newWork.title}
                                placeholderTextColor="#94A3B8"
                                onChangeText={(t) => setNewWork({ ...newWork, title: t })}
                            />
                        </View>

                        {completedJobs.length > 0 && (
                            <View className="mb-8">
                                <Text className="text-label mb-4 uppercase tracking-[4px] text-[10px] text-primary font-jakarta-extrabold italic">LINK RATED MISSION</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
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
                                            className={`p-6 rounded-[28px] border-2 bg-white w-52 shadow-xl ${
                                                newWork.ratingId === job.ratingId ? 'border-primary' : 'border-card-border/20'
                                            }`}
                                        >
                                            <Text className="text-[13px] mb-3 uppercase font-jakarta-extrabold italic tracking-tighter text-ink" numberOfLines={1}>{job.category}</Text>
                                            <View className="flex-row items-center gap-2">
                                                <RatingStars rating={job.ratingValue || 0} size={10} showValue={false} />
                                                <Text className="text-[11px] text-muted font-jakarta-extrabold italic tracking-tighter">{job.ratingValue}/5.0</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <View className="mb-6">
                            <Text className="text-label mb-3 uppercase tracking-[4px] text-[10px] text-primary font-jakarta-extrabold italic">MISSION DEBRIEF</Text>
                            <TextInput
                                className="bg-background px-7 py-6 rounded-[32px] border border-card-border/50 min-h-[140px] text-ink font-jakarta-medium italic text-[15px] leading-6 shadow-inner"
                                placeholder="Describe the operational procedure..."
                                multiline
                                placeholderTextColor="#94A3B8"
                                value={newWork.description}
                                onChangeText={(t) => setNewWork({ ...newWork, description: t })}
                                style={{ textAlignVertical: 'top' }}
                            />
                        </View>

                        <View className="mb-10">
                            <Text className="text-label mb-3 uppercase tracking-[4px] text-[10px] text-primary font-jakarta-extrabold italic">ASSET TRANSMISSION</Text>
                            <TextInput
                                className="h-16 bg-background px-7 rounded-3xl border border-card-border/50 text-ink font-jakarta-medium italic text-[14px] shadow-inner"
                                placeholder="PASTE ASSET URL PROTOCOL"
                                placeholderTextColor="#94A3B8"
                                value={newWork.imageUrl}
                                onChangeText={(t) => setNewWork({ ...newWork, imageUrl: t })}
                            />
                        </View>

                        <PrimaryButton
                            title="UPLOAD TO OPERATIONAL LOG"
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
                            className="h-18 rounded-2xl shadow-2xl border border-white/10"
                        />
                    </View>
                </View>
            </Modal>
            
            <View className="absolute bottom-12 left-0 right-0 items-center pointer-events-none opacity-20">
                <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Identity Portal Sync • Loom Operative v4.2</Text>
            </View>
        </View>
    );
}
