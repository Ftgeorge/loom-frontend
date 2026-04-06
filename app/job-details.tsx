import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { StatusTimeline, getArtisanJobSteps } from '@/components/ui/StatusTimeline';
import { jobApi } from '@/services/api';
import { mapJob } from '@/services/mappers';
import type { ArtisanJobStatus, JobRequest } from '@/types';
import { formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function JobDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [job, setJob] = useState<JobRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [artisanStatus, setArtisanStatus] = useState<ArtisanJobStatus>('new');

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!id) return;
            const row = await jobApi.getById(id) as any;
            if (row) {
                const mappedJob = mapJob(row);
                setJob(mappedJob);
                
                if (mappedJob.status === 'completed') setArtisanStatus('completed');
                else if (mappedJob.status === 'in_progress') setArtisanStatus('in_progress');
                else if (mappedJob.status === 'on_the_way') setArtisanStatus('on_the_way');
                else if (mappedJob.status === 'accepted') setArtisanStatus('accepted');
                else setArtisanStatus('new');
            }
        } catch (err) {
            console.error('[JobDetails] Error:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleAccept = async () => {
        if (!id) return;
        try {
            await jobApi.accept(id);
            setArtisanStatus('accepted');
            setJob((j) => j ? { ...j, status: 'accepted', artisanStatus: 'accepted' } : null);
        } catch (err: any) {
            Alert.alert('System Error', err.message || 'Failed to accept job');
        }
    };

    const handleDecline = () => {
        Alert.alert('Skip Job', 'Are you sure you don\'t want this job? This cannot be undone.', [
            { text: 'No', style: 'cancel' },
            { text: 'Skip', style: 'destructive', onPress: () => router.back() },
        ]);
    };

    const handleStatusUpdate = async (newStatus: ArtisanJobStatus) => {
        try {
            if (!id) return;
            
            if (newStatus === 'completed') {
                await jobApi.complete(id);
            } else {
                await jobApi.updateStatus(id, newStatus);
            }
            
            setArtisanStatus(newStatus);
            setJob((j) => j ? { ...j, status: newStatus as any, artisanStatus: newStatus } : null);
        } catch (err: any) {
            console.error('[JobDetails] Status Update Error:', err);
            Alert.alert('System Error', err.message ?? 'Could not update mission status.');
        }
    };

    const statusActions: Record<string, { label: string; next: ArtisanJobStatus }> = {
        accepted: { label: "ON MY WAY", next: 'on_the_way' },
        on_the_way: { label: "I'M HERE", next: 'in_progress' },
        in_progress: { label: "ALL DONE", next: 'completed' },
    };

    if (loading) return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.4} scale={1.3} />
            </View>
            <AppHeader title="MISSION DETAILS" showBack onBack={() => router.back()} showNotification={false} />
            <View className="p-6"><SkeletonList count={3} type="request" /></View>
        </View>
    );

    if (error || !job) return (
        <View className="flex-1 bg-background">
            <AppHeader title="MISSION DETAILS" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
            </View>
            <AppHeader title="MISSION DETAILS" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Mission Identity ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.springify()} className="mb-10 px-1">
                    <View className="flex-row items-center gap-2 mb-3">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">MISSION PARAMETERS</Text>
                    </View>
                    <Text className="text-h1 text-[40px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">{job.category.replace('_', ' / ')}</Text>
                    <View className="flex-row items-center gap-4 mt-6">
                        <View className="bg-accent/10 px-4 py-2 rounded-xl border border-accent/20 shadow-sm">
                            <Text className="text-label text-accent text-[11px] font-jakarta-extrabold uppercase tracking-widest italic">{job.status.replace('_', ' ')}</Text>
                        </View>
                        <Text className="text-label text-ink/30 text-[10px] uppercase font-jakarta-extrabold italic tracking-[2px]">REF: {job.id.substring(0, 8)}</Text>
                    </View>
                </Animated.View>

                {/* ─── Protocol Status ───────────────────────────────────────────── */}
                {artisanStatus !== 'new' && artisanStatus !== 'declined' && (
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <View className="mb-10 p-8 bg-white border-[1.5px] border-card-border shadow-2xl rounded-[38px]">
                            <Text className="text-label text-ink/40 mb-8 uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic">OPERATIONAL PROGRESS</Text>
                            <StatusTimeline steps={getArtisanJobSteps(artisanStatus)} />
                        </View>
                    </Animated.View>
                )}

                {/* ─── Tactical Intel ────────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <View className="p-10 bg-white border-[1.5px] border-card-border shadow-2xl rounded-[42px]">
                        <Text className="text-label text-primary mb-10 uppercase tracking-[6px] text-[11px] font-jakarta-extrabold italic">CORE INTEL</Text>

                        <DetailItem label="CLIENT IDENTITY" value={job.clientName.toUpperCase()} />
                        <DetailItem label="SERVICE PROTOCOL" value={job.category.toUpperCase().replace('_', ' ')} />
                        <DetailItem label="OPERATION DEBRIEF" value={job.description} isDescription />
                        <DetailItem label="TARGET LOCATION" value={`${job.location.area.toUpperCase()}, ${job.location.city.toUpperCase() || 'ABUJA'}`} />
                        <DetailItem label="MISSION CREDITS" value={formatNaira(job.budget)} isPrice />
                        <DetailItem label="URGENCY LEVEL" value={job.urgency.toUpperCase().replace('_', ' ')} isUrgency />
                    </View>
                </Animated.View>

                {/* ─── Extraction Assistance ──────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="mt-10 bg-ink rounded-[42px] p-10 items-center shadow-3xl border border-white/10 active:scale-[0.98]"
                    >
                        <View className="w-16 h-16 rounded-3xl bg-white/10 items-center justify-center mb-5 border border-white/20 shadow-inner">
                            <Ionicons name="map-outline" size={28} color="white" />
                        </View>
                        <Text className="text-[22px] text-white uppercase font-jakarta-extrabold italic tracking-tighter">OPEN TARGET NAVIGATOR</Text>
                        <Text className="text-label text-primary/60 mt-3 text-[11px] uppercase font-jakarta-extrabold tracking-[4px] italic">
                            {job.location.area}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* ─── Authorization Actions ─────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(400).springify()} className="mt-12 gap-6 px-1">
                    {artisanStatus === 'new' && (job.status === 'submitted' || job.status === 'matched') && (
                        <View className="gap-5">
                            <PrimaryButton
                                title="ACCEPT MISSION"
                                onPress={handleAccept}
                                variant="accent"
                                className="h-18 rounded-[24px] shadow-2xl border border-white/10"
                            />
                            <TouchableOpacity
                                className="items-center justify-center h-18 rounded-[24px] border-[2px] border-error/30 bg-white/50 shadow-sm active:bg-error/10"
                                onPress={handleDecline}
                            >
                                <Text className="text-[12px] text-error font-jakarta-extrabold uppercase tracking-[4px] italic">DECLINE PROTOCOL</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {statusActions[artisanStatus] && (
                        <PrimaryButton
                            title={statusActions[artisanStatus].label}
                            onPress={() => handleStatusUpdate(statusActions[artisanStatus].next)}
                            variant="accent"
                            className="h-18 rounded-[24px] shadow-2xl border border-white/10"
                        />
                    )}

                    <View className="flex-row gap-5">
                        <TouchableOpacity
                            onPress={async () => {
                                try {
                                    const { threadApi } = await import('@/services/api');
                                    const res = await threadApi.create({ 
                                        jobRequestId: job.id 
                                    });
                                    router.push({ pathname: '/chat', params: { threadId: res.id } });
                                } catch (err) {
                                    console.error('[JobDetails] Chat error:', err);
                                    Alert.alert('Error', 'Unable to start chat with client.');
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
                </Animated.View>
                
                <View className="mt-16 items-center opacity-20 pointer-events-none">
                    <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Field Operation Report • Secure v4.2</Text>
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
