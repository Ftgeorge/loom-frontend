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
            <LoomThread variant="minimal" opacity={0.4} />
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />
            <View className="p-6"><SkeletonList count={3} /></View>
        </View>
    );

    if (error || !job) return (
        <View className="flex-1 bg-background">
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    const isTerminated = job.status === 'cancelled';

    return (
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.2} animated />
            <AppHeader title="Mission Log" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Service Identity */}
                <Animated.View entering={FadeInDown.springify()} className="mb-10">
                    <Text className="text-label text-primary mb-2 tracking-[2px] uppercase">Service Type</Text>
                    <Text className="text-h1 text-[32px] uppercase">{job.category.replace('_', ' / ')}</Text>
                    <View className="flex-row items-center gap-3 mt-4">
                        <View className={`px-3 py-1 rounded-xs border shadow-sm ${
                            isTerminated ? 'bg-error/5 border-error' : 'bg-success/5 border-success'
                        }`}>
                            <Text className={`text-label text-[10px] font-jakarta-extrabold uppercase ${
                                isTerminated ? 'text-error' : 'text-success'
                            }`}>
                                {isTerminated ? 'CANCELLED' : 'ACTIVE'}
                            </Text>
                        </View>
                        <Text className="text-label text-muted text-[10px] uppercase">REF: {job.id.substring(0, 8)}</Text>
                    </View>
                </Animated.View>

                {/* Status Timeline */}
                {!isTerminated && (
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <Card className="mb-6 p-6 bg-white border-[1.5px] border-card-border shadow-sm">
                            <Text className="text-label text-primary mb-5 uppercase">Progress Tracker</Text>
                            <StatusTimeline steps={getJobStatusSteps(job.status)} />
                        </Card>
                    </Animated.View>
                )}

                {/* Operational Details */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Card className="p-6 bg-white border-[1.5px] border-card-border shadow-sm">
                        <Text className="text-label text-primary mb-6 uppercase">Details</Text>

                        <DetailItem label="AREA" value={job.location.area.toUpperCase()} />
                        <DetailItem label="DESCRIPTION" value={job.description} />
                        <DetailItem label="BUDGET" value={formatNaira(job.budget)} />
                        <DetailItem label="URGENCY" value={job.urgency.toUpperCase().replace('_', ' ')} />
                        <DetailItem label="POSTED ON" value={formatDate(job.createdAt).toUpperCase()} />
                    </Card>
                </Animated.View>

                {/* Artisan assigned info */}
                {job.artisanName && (
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <Card className="mt-6 p-6 bg-primary shadow-md">
                            <Text className="text-label text-white/60 mb-5 uppercase">Artisan Assigned</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className="flex-row items-center gap-4 bg-white/10 p-4 rounded-md border border-white/20"
                                onPress={() => job.artisanId && router.push({ pathname: '/artisan-profile', params: { id: job.artisanId } })}
                            >
                                <View className="w-12 h-12 rounded-xs bg-white items-center justify-center">
                                    <Text className="text-h3 text-primary uppercase">{job.artisanName[0]}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-h3 text-white uppercase">{job.artisanName}</Text>
                                    <Text className="text-label text-accent text-[8px] mt-1 uppercase">View Profile</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="white" />
                            </TouchableOpacity>
                        </Card>
                    </Animated.View>
                )}

                {/* Actions */}
                <Animated.View entering={FadeInDown.delay(400).springify()} className="mt-12 gap-4">
                    {job.artisanName && (
                        <View className="flex-row gap-3">
                            <SecondaryButton
                                title="MESSAGE"
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
                                className="flex-1 h-16 rounded-md border-primary border-[1.5px]"
                                textStyle={{ color: '#00120C', fontFamily: 'PlusJakartaSans-Bold', fontSize: 10, letterSpacing: 1.2 }}
                            />
                            <SecondaryButton
                                title="CALL"
                                onPress={() => { }}
                                className="flex-1 h-16 rounded-md border-primary border-[1.5px]"
                                textStyle={{ color: '#00120C', fontFamily: 'PlusJakartaSans-Bold', fontSize: 10, letterSpacing: 1.2 }}
                                icon={<Ionicons name="call" size={18} color="#00120C" />}
                            />
                        </View>
                    )}

                    {job.status === 'completed' && (
                        <PrimaryButton
                            title="RATE & REVIEW"
                            onPress={() => router.push({ pathname: '/rate-review', params: { jobId: job.id } })}
                            variant="accent"
                            className="h-16 rounded-md shadow-md"
                        />
                    )}

                    {!['completed', 'cancelled'].includes(job.status) && (
                        <TouchableOpacity
                            className="items-center p-5 rounded-md border-[1.5px] border-error mt-3 bg-white shadow-sm"
                            onPress={handleCancel}
                        >
                            <Text className="text-label text-error font-jakarta-extrabold tracking-[1px] uppercase">Cancel Request</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <View className="mb-6">
            <Text className="text-label text-[8px] text-muted mb-2 uppercase">{label}</Text>
            <Text className="text-body text-primary font-jakarta-bold text-[15px] leading-[22px]">{value}</Text>
        </View>
    );
}


