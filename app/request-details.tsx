import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { StatusTimeline, getJobStatusSteps } from '@/components/ui/StatusTimeline';
import { jobApi } from '@/services/api';
import { mapJob } from '@/services/mappers';
import { useAppStore } from '@/store';
import type { JobRequest } from '@/types';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RequestDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { updateJobStatus: updateStoreJob } = useAppStore();
    const [job, setJob] = useState<JobRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!id) return;
            const row = await jobApi.getById(id) as any;
            if (row) {
                setJob(mapJob(row));
            }
        } catch (err) {
            console.error('[RequestDetails] Load error:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleCancel = () => {
        Alert.alert('CANCEL REQUEST', 'Are you sure you want to cancel this request?', [
            { text: 'NO, GO BACK', style: 'cancel' },
            {
                text: 'YES, CANCEL',
                style: 'destructive',
                onPress: async () => {
                    if (id) {
                        try {
                            await jobApi.cancel(id);
                            updateStoreJob(id, 'cancelled');
                            setJob((j) => j ? { ...j, status: 'cancelled' } : null);
                        } catch (err: any) {
                            Alert.alert('System Error', err.message || 'Failed to cancel request');
                        }
                    }
                },
            },
        ]);
    };

    if (loading) return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.4} scale={1.3} />
            </View>
            <AppHeader title="REQUEST LOG" showBack onBack={() => router.back()} showNotification={false} />
            <View className="p-6"><SkeletonList count={3} /></View>
        </View>
    );

    if (error || !job) return (
        <View className="flex-1 bg-background">
            <AppHeader title="REQUEST LOG" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    const isTerminated = job.status === 'cancelled';

    return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
            </View>
            <AppHeader title="MISSION LOG" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Service Identity ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.springify()} className="mb-10 px-1">
                    <View className="flex-row items-center gap-2 mb-3">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">MISSION PARAMETERS</Text>
                    </View>
                    <Text className="text-h1 text-[40px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">{job.category.replace('_', ' / ')}</Text>
                    <View className="flex-row items-center gap-4 mt-6">
                        <View className={`px-4 py-2 rounded-xl border shadow-sm ${
                            isTerminated ? 'bg-error/10 border-error/20' : 'bg-success/10 border-success/20'
                        }`}>
                            <Text className={`text-label text-[11px] font-jakarta-extrabold uppercase tracking-widest italic ${
                                isTerminated ? 'text-error' : 'text-success'
                            }`}>
                                {isTerminated ? 'CANCELLED' : 'ACTIVE'}
                            </Text>
                        </View>
                        <Text className="text-label text-ink/30 text-[10px] uppercase font-jakarta-extrabold italic tracking-[2px]">REF: {job.id.substring(0, 8)}</Text>
                    </View>
                </Animated.View>

                {/* ─── Status Timeline ───────────────────────────────────────────── */}
                {!isTerminated && (
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <View className="mb-10 p-8 bg-white border-[1.5px] border-card-border shadow-2xl rounded-[38px]">
                            <Text className="text-label text-ink/40 mb-8 uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic">MISSION PROGRESS</Text>
                            <StatusTimeline steps={getJobStatusSteps(job.status)} />
                        </View>
                    </Animated.View>
                )}

                {/* ─── Operational Intel ────────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <View className="p-10 bg-white border-[1.5px] border-card-border shadow-2xl rounded-[42px]">
                        <Text className="text-label text-primary mb-10 uppercase tracking-[6px] text-[11px] font-jakarta-extrabold italic">CORE INTEL</Text>

                        <DetailItem label="TARGET AREA" value={job.location.area.toUpperCase()} />
                        <DetailItem label="OPERATION DEBRIEF" value={job.description} isDescription />
                        <DetailItem label="MISSION CREDITS" value={formatNaira(job.budget)} isPrice />
                        <DetailItem label="URGENCY LEVEL" value={job.urgency.toUpperCase().replace('_', ' ')} isUrgency />
                        <DetailItem label="INITIALIZED AT" value={formatDate(job.createdAt).toUpperCase()} />
                    </View>
                </Animated.View>

                {/* ─── Operative Assigned ────────────────────────────────────────── */}
                {job.artisanName && (
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <View className="mt-10 p-8 bg-ink shadow-3xl rounded-[42px] border border-white/10 overflow-hidden">
                             {/* Decorative Background Thread */}
                            <View className="absolute -top-10 -right-10 opacity-10">
                                <Ionicons name="shield-checkmark" size={180} color="white" />
                            </View>

                            <Text className="text-label text-white/40 mb-8 uppercase tracking-[6px] text-[10px] font-jakarta-extrabold italic">OPERATIVE ASSIGNED</Text>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                className="flex-row items-center gap-5 bg-white/10 p-6 rounded-[32px] border border-white/20 shadow-inner backdrop-blur-md active:scale-[0.98]"
                                onPress={() => job.artisanId && router.push({ pathname: '/artisan-profile', params: { id: job.artisanId } })}
                            >
                                <View className="w-14 h-14 rounded-2xl bg-white items-center justify-center border border-white/40 shadow-sm">
                                    <Text className="text-h3 text-ink uppercase font-jakarta-extrabold text-[20px]">{job.artisanName[0]}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[18px] font-jakarta-extrabold text-white uppercase italic tracking-tighter" numberOfLines={1}>{job.artisanName}</Text>
                                    <Text className="text-label text-primary mt-1.5 text-[10px] uppercase font-jakarta-extrabold tracking-[3px] italic">VIEW PROFILE</Text>
                                </View>
                                <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20">
                                    <Ionicons name="chevron-forward" size={20} color="white" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

                {/* ─── Authorization Actions ─────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(400).springify()} className="mt-12 gap-6 px-1">
                    {job.artisanName && (
                        <View className="flex-row gap-5">
                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        const { threadApi } = await import('@/services/api');
                                        if (!job.artisanId) return Alert.alert('Stay Tuned', 'An artisan will be matched to your request soon.');
                                        const res = await threadApi.create({ 
                                            artisanProfileId: job.artisanId,
                                            jobRequestId: job.id 
                                        });
                                        router.push({ pathname: '/chat', params: { threadId: res.id } });
                                    } catch (err) {
                                        console.error('[RequestDetails] Chat error:', err);
                                        Alert.alert('Error', 'Unable to start chat at this time.');
                                    }
                                }}
                                className="flex-1 h-18 rounded-[24px] border-[2.5px] border-primary bg-white items-center justify-center flex-row gap-3 shadow-lg active:bg-gray-50"
                            >
                                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#00120C" />
                                <Text className="text-primary font-jakarta-extrabold uppercase italic tracking-tighter text-[13px]">MESSAGE</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={() => Alert.alert("Voice Link", "Initializing secure encrypted line...")}
                                className="flex-1 h-18 rounded-[24px] border-[2.5px] border-primary bg-white items-center justify-center flex-row gap-3 shadow-lg active:bg-gray-50"
                            >
                                <Ionicons name="call-outline" size={20} color="#00120C" />
                                <Text className="text-primary font-jakarta-extrabold uppercase italic tracking-tighter text-[13px]">CALL</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {job.status === 'completed' && (
                        <PrimaryButton
                            title="RATE & REVIEW OPERATIVE"
                            onPress={() => router.push({ pathname: '/rate-review', params: { jobId: job.id } })}
                            variant="accent"
                            className="h-18 rounded-[24px] shadow-2xl border border-white/10"
                        />
                    )}

                    {!['completed', 'cancelled'].includes(job.status) && (
                        <TouchableOpacity
                            className="items-center justify-center p-6 rounded-[24px] border-[2px] border-error/30 mt-4 bg-white/50 shadow-sm active:bg-error/10"
                            onPress={handleCancel}
                        >
                            <Text className="text-[12px] text-error font-jakarta-extrabold tracking-[4px] uppercase italic">CANCEL MISSION PROTOCOL</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
                
                <View className="mt-16 items-center opacity-20 pointer-events-none">
                    <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Operational Report Log • Secure v4.2</Text>
                </View>
            </ScrollView>
        </View>
    );
}

function DetailItem({ label, value, isDescription, isPrice, isUrgency }: { label: string; value: string; isDescription?: boolean; isPrice?: boolean; isUrgency?: boolean }) {
    return (
        <View className="mb-10">
            <Text className="text-label text-[10px] text-muted mb-3 uppercase tracking-[3px] font-jakarta-extrabold italic">{label}</Text>
            <Text className={`text-ink ${
                isPrice ? 'text-[22px] font-jakarta-extrabold italic tracking-tight text-primary' : 
                isUrgency ? 'text-[18px] font-jakarta-extrabold italic tracking-tighter text-accent' :
                isDescription ? 'text-[15px] font-jakarta-medium italic leading-6' :
                'text-[18px] font-jakarta-extrabold italic tracking-tighter'
            } uppercase`}>
                {value}
            </Text>
        </View>
    );
}
