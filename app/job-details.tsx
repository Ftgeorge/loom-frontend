import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { StatusTimeline, getArtisanJobSteps } from '@/components/ui/StatusTimeline';
import { jobApi } from '@/services/api';
import { mapJob } from '@/services/mappers';
import { Colors, Radius, Shadows, Typography } from '@/theme';
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
                setJob(mapJob(row));
                setArtisanStatus('new');
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
            setJob((j) => j ? { ...j, status: 'matched', artisanStatus: 'accepted' } : null);
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
        setArtisanStatus(newStatus);
        setJob((j) => j ? { ...j, artisanStatus: newStatus } : null);

        if (newStatus === 'completed' && id) {
            try {
                await jobApi.complete(id);
            } catch (err: any) {
                Alert.alert('System Error', err.message ?? 'Could not mark mission complete on server.');
            }
        }
    };

    const statusActions: Record<string, { label: string; next: ArtisanJobStatus }> = {
        accepted: { label: "ON MY WAY", next: 'on_the_way' },
        on_the_way: { label: "I'M HERE", next: 'in_progress' },
        in_progress: { label: "ALL DONE", next: 'completed' },
    };

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.4} />
            <AppHeader title="Job Details" showBack onBack={() => router.back()} showNotification={false} />
            <View style={{ padding: 24 }}><SkeletonList count={3} type="request" /></View>
        </View>
    );

    if (error || !job) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Job Details" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.2} animated />
            <AppHeader title="Job Details" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Job Summary */}
                <Animated.View entering={FadeInDown.springify()} style={{ marginBottom: 40 }}>
                    <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8, letterSpacing: 2 }]}>JOB TYPE</Text>
                    <Text style={[Typography.h1, { fontSize: 32 }]}>{job.category.toUpperCase().replace('_', ' / ')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
                        <View style={{
                            backgroundColor: Colors.accent + '10',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: Radius.xs,
                            borderWidth: 1,
                            borderColor: Colors.accent
                        }}>
                            <Text style={[Typography.label, { color: Colors.accent, fontSize: 10, fontWeight: '900' }]}>{job.status.toUpperCase()}</Text>
                        </View>
                        <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>REF: {job.id.substring(0, 8).toUpperCase()}</Text>
                    </View>
                </Animated.View>

                {/* Protocol Progress */}
                {artisanStatus !== 'new' && artisanStatus !== 'declined' && (
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <Card style={{ marginBottom: 24, padding: 24, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.cardBorder, ...Shadows.sm }}>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 20 }]}>STATUS</Text>
                            <StatusTimeline steps={getArtisanJobSteps(artisanStatus)} />
                        </Card>
                    </Animated.View>
                )}

                {/* Client Identity */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Card style={{ padding: 24, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.cardBorder, ...Shadows.sm }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 24 }]}>DETAILS</Text>

                        <DetailItem label="CLIENT" value={job.clientName.toUpperCase()} />
                        <DetailItem label="SERVICE" value={job.category.toUpperCase()} />
                        <DetailItem label="DESCRIPTION" value={job.description} />
                        <DetailItem label="LOCATION" value={`${job.location.area.toUpperCase()}, ${job.location.city.toUpperCase() || 'ABUJA'}`} />
                        <DetailItem label="BUDGET" value={formatNaira(job.budget)} />
                        <DetailItem label="URGENCY" value={job.urgency.toUpperCase().replace('_', ' ')} />
                    </Card>
                </Animated.View>

                {/* Map Action */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            marginTop: 24,
                            backgroundColor: Colors.primary,
                            borderRadius: Radius.md,
                            padding: 32,
                            alignItems: 'center',
                            ...Shadows.md
                        }}
                    >
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: Radius.xs,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)'
                        }}>
                            <Ionicons name="location" size={24} color={Colors.white} />
                        </View>
                        <Text style={[Typography.h3, { color: Colors.white }]}>OPEN MAP</Text>
                        <Text style={[Typography.label, { color: Colors.accent, marginTop: 8, fontSize: 8 }]}>
                            AREA: {job.location.area.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Actions */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={{ marginTop: 48, gap: 16 }}>
                    {artisanStatus === 'new' && (
                        <View style={{ gap: 16 }}>
                            <PrimaryButton
                                title="ACCEPT JOB"
                                onPress={handleAccept}
                                variant="accent"
                                style={{ height: 64, borderRadius: Radius.md }}
                            />
                            <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    padding: 20,
                                    borderRadius: Radius.md,
                                    borderWidth: 1.5,
                                    borderColor: Colors.error,
                                    backgroundColor: Colors.white
                                }}
                                onPress={handleDecline}
                            >
                                <Text style={[Typography.label, { color: Colors.error, fontWeight: '900' }]}>DECLINE</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {statusActions[artisanStatus] && (
                        <PrimaryButton
                            title={statusActions[artisanStatus].label}
                            onPress={() => handleStatusUpdate(statusActions[artisanStatus].next)}
                            variant="accent"
                            style={{ height: 64, borderRadius: Radius.md }}
                        />
                    )}

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <SecondaryButton
                            title="MESSAGE"
                            onPress={async () => {
                                try {
                                    const { threadApi } = await import('@/services/api');
                                    const res = await threadApi.create({ 
                                        artisanProfileId: '', // Backend will infer from user id
                                        jobRequestId: job.id 
                                    });
                                    router.push({ pathname: '/chat', params: { threadId: res.id } });
                                } catch (err) {
                                    console.error('[JobDetails] Chat error:', err);
                                    Alert.alert('Error', 'Unable to start chat with client.');
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
