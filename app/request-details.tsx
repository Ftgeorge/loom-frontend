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
import { Colors, Radius, Shadows, Typography } from '@/theme';
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
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.4} />
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />
            <View style={{ padding: 24 }}><SkeletonList count={3} /></View>
        </View>
    );

    if (error || !job) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    const isTerminated = job.status === 'cancelled';

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.2} animated />
            <AppHeader title="Mission Log" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Service Identity */}
                <Animated.View entering={FadeInDown.springify()} style={{ marginBottom: 40 }}>
                    <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8, letterSpacing: 2 }]}>SERVICE TYPE</Text>
                    <Text style={[Typography.h1, { fontSize: 32 }]}>{job.category.toUpperCase().replace('_', ' / ')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
                        <View style={{
                            backgroundColor: isTerminated ? Colors.error + '10' : Colors.success + '10',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: Radius.xs,
                            borderWidth: 1,
                            borderColor: isTerminated ? Colors.error : Colors.success
                        }}>
                            <Text style={[Typography.label, { color: isTerminated ? Colors.error : Colors.success, fontSize: 10, fontWeight: '900' }]}>
                                {isTerminated ? 'CANCELLED' : 'ACTIVE'}
                            </Text>
                        </View>
                        <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>REF: {job.id.substring(0, 8).toUpperCase()}</Text>
                    </View>
                </Animated.View>

                {/* Status Timeline */}
                {!isTerminated && (
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <Card style={{ marginBottom: 24, padding: 24, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.cardBorder, ...Shadows.sm }}>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 20 }]}>PROGRESS TRACKER</Text>
                            <StatusTimeline steps={getJobStatusSteps(job.status)} />
                        </Card>
                    </Animated.View>
                )}

                {/* Operational Details */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Card style={{ padding: 24, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.cardBorder, ...Shadows.sm }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 24 }]}>DETAILS</Text>

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
                        <Card style={{ marginTop: 24, padding: 24, backgroundColor: Colors.primary, ...Shadows.md }}>
                            <Text style={[Typography.label, { color: Colors.white, marginBottom: 20, opacity: 0.6 }]}>ARTISAN ASSIGNED</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 16,
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    padding: 16,
                                    borderRadius: Radius.md,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.2)'
                                }}
                                onPress={() => job.artisanId && router.push({ pathname: '/artisan-profile', params: { id: job.artisanId } })}
                            >
                                <View style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: Radius.xs,
                                    backgroundColor: Colors.white,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={[Typography.h3, { color: Colors.primary }]}>{job.artisanName[0].toUpperCase()}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[Typography.h3, { color: Colors.white }]}>{job.artisanName.toUpperCase()}</Text>
                                    <Text style={[Typography.label, { color: Colors.accent, fontSize: 8, marginTop: 4 }]}>VIEW PROFILE</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.white} />
                            </TouchableOpacity>
                        </Card>
                    </Animated.View>
                )}

                {/* Actions */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={{ marginTop: 48, gap: 16 }}>
                    {job.artisanName && (
                        <View style={{ flexDirection: 'row', gap: 12 }}>
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
                                style={{ flex: 1, height: 64, borderRadius: Radius.md, borderColor: Colors.primary, borderWidth: 1.5 }}
                                textStyle={[Typography.label, { color: Colors.primary }]}
                            />
                            <SecondaryButton
                                title="CALL"
                                onPress={() => { }}
                                style={{ flex: 1, height: 64, borderRadius: Radius.md, borderColor: Colors.primary, borderWidth: 1.5 }}
                                textStyle={[Typography.label, { color: Colors.primary }]}
                                icon={<Ionicons name="call" size={18} color={Colors.primary} />}
                            />
                        </View>
                    )}

                    {job.status === 'completed' && (
                        <PrimaryButton
                            title="RATE & REVIEW"
                            onPress={() => router.push({ pathname: '/rate-review', params: { jobId: job.id } })}
                            variant="accent"
                            style={{ height: 64, borderRadius: Radius.md }}
                        />
                    )}

                    {!['completed', 'cancelled'].includes(job.status) && (
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                padding: 20,
                                borderRadius: Radius.md,
                                borderWidth: 1.5,
                                borderColor: Colors.error,
                                marginTop: 12,
                                backgroundColor: Colors.white
                            }}
                            onPress={handleCancel}
                        >
                            <Text style={[Typography.label, { color: Colors.error, fontWeight: '900', letterSpacing: 1 }]}>CANCEL REQUEST</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <View style={{ marginBottom: 24 }}>
            <Text style={[Typography.label, { fontSize: 8, color: Colors.muted, marginBottom: 8 }]}>{label}</Text>
            <Text style={[Typography.body, {
                color: Colors.primary,
                fontWeight: '700',
                fontSize: 15,
                lineHeight: 22
            }]}>{value}</Text>
        </View>
    );
}

