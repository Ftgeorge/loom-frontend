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
            <LoomThread variant="minimal" opacity={0.4} />
            <AppHeader title="JOB DETAILS" showBack onBack={() => router.back()} showNotification={false} />
            <View className="p-6"><SkeletonList count={3} type="request" /></View>
        </View>
    );

    if (error || !job) return (
        <View className="flex-1 bg-background">
            <AppHeader title="JOB DETAILS" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.2} animated />
            <AppHeader title="JOB DETAILS" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Job Summary */}
                <Animated.View entering={FadeInDown.springify()} className="mb-10 px-1">
                    <Text className="text-label text-primary mb-2 tracking-[2px] uppercase font-jakarta-bold">Job Type</Text>
                    <Text className="text-h1 text-[32px] uppercase italic font-jakarta-extrabold tracking-tight">{job.category.replace('_', ' / ')}</Text>
                    <View className="flex-row items-center gap-3 mt-4">
                        <View className="bg-accent/10 px-3 py-1.5 rounded-xs border border-accent">
                            <Text className="text-label text-accent text-[10px] font-jakarta-extrabold uppercase tracking-widest">{job.status}</Text>
                        </View>
                        <Text className="text-label text-muted text-[10px] uppercase font-jakarta-bold">REF: {job.id.substring(0, 8)}</Text>
                    </View>
                </Animated.View>

                {/* Protocol Progress */}
                {artisanStatus !== 'new' && artisanStatus !== 'declined' && (
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <Card className="mb-8 p-6 bg-white border-[1.5px] border-card-border shadow-md rounded-[20px]">
                            <Text className="text-label text-primary mb-6 uppercase tracking-widest text-[10px] font-jakarta-bold">Mission Status</Text>
                            <StatusTimeline steps={getArtisanJobSteps(artisanStatus)} />
                        </Card>
                    </Animated.View>
                )}

                {/* Client Identity */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Card className="p-8 bg-white border-[1.5px] border-card-border shadow-md rounded-[24px]">
                        <Text className="text-label text-primary mb-8 uppercase tracking-widest text-[10px] font-jakarta-bold">Mission Details</Text>

                        <DetailItem label="CLIENT" value={job.clientName.toUpperCase()} />
                        <DetailItem label="SERVICE" value={job.category.toUpperCase().replace('_', ' ')} />
                        <DetailItem label="DESCRIPTION" value={job.description} />
                        <DetailItem label="LOCATION" value={`${job.location.area.toUpperCase()}, ${job.location.city.toUpperCase() || 'ABUJA'}`} />
                        <DetailItem label="BUDGET预期" value={formatNaira(job.budget)} />
                        <DetailItem label="URGENCY" value={job.urgency.toUpperCase().replace('_', ' ')} />
                    </Card>
                </Animated.View>

                {/* Map Action */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="mt-8 bg-primary rounded-[24px] p-8 items-center shadow-lg border-[1.5px] border-primary"
                    >
                        <View className="w-14 h-14 rounded-xl bg-white/10 items-center justify-center mb-4 border border-white/20">
                            <Ionicons name="map-outline" size={24} color="white" />
                        </View>
                        <Text className="text-h3 text-white uppercase font-jakarta-extrabold italic tracking-tight">Open Map Guidance</Text>
                        <Text className="text-label text-accent mt-2 text-[9px] uppercase font-jakarta-bold tracking-widest">
                            {job.location.area}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Actions Suite */}
                <Animated.View entering={FadeInDown.delay(400).springify()} className="mt-12 gap-5 px-1">
                    {artisanStatus === 'new' && (job.status === 'submitted' || job.status === 'matched') && (
                        <View className="gap-4">
                            <PrimaryButton
                                title="ACCEPT MISSION"
                                onPress={handleAccept}
                                variant="accent"
                                className="h-16 rounded-xl shadow-xl"
                            />
                            <TouchableOpacity
                                className="items-center p-5 rounded-xl border-[1.5px] border-error bg-white shadow-sm"
                                onPress={handleDecline}
                            >
                                <Text className="text-label text-error font-jakarta-extrabold uppercase tracking-widest text-[11px]">Decline Protocol</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {statusActions[artisanStatus] && (
                        <PrimaryButton
                            title={statusActions[artisanStatus].label}
                            onPress={() => handleStatusUpdate(statusActions[artisanStatus].next)}
                            variant="accent"
                            className="h-16 rounded-xl shadow-xl"
                        />
                    )}

                    <View className="flex-row gap-4">
                        <SecondaryButton
                            title="MESSAGE"
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
                            className="flex-1 h-16 rounded-xl border-primary border-[1.5px] bg-white shadow-sm"
                            textStyle={{ color: '#00120C', fontFamily: 'PlusJakartaSans-Bold', fontSize: 10, letterSpacing: 1.2 }}
                        />
                        <SecondaryButton
                            title="CALL"
                            onPress={() => { }}
                            className="flex-1 h-16 rounded-xl border-primary border-[1.5px] bg-white shadow-sm"
                            textStyle={{ color: '#00120C', fontFamily: 'PlusJakartaSans-Bold', fontSize: 10, letterSpacing: 1.2 }}
                            icon={<Ionicons name="call" size={18} color="#00120C" style={{ marginRight: 8 }} />}
                        />
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <View className="mb-8">
            <Text className="text-label text-[9px] text-muted mb-2 uppercase tracking-[1.5px] font-jakarta-extrabold">{label}</Text>
            <Text className="text-body text-primary font-jakarta-bold text-[16px] leading-[22px] normal-case">{value}</Text>
        </View>
    );
}


