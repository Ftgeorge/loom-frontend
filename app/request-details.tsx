import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { StatusTimeline, getJobStatusSteps } from '@/components/ui/StatusTimeline';
import { jobApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Typography } from '@/theme';
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
            const row = await jobApi.getById(id || '') as any;
            if (row) {
                setJob({
                    id: row.id,
                    clientId: row.customer_id,
                    clientName: row.customer_first_name
                        ? `${row.customer_first_name} ${row.customer_last_name ?? ''}`.trim()
                        : row.customer_email ?? 'Client',
                    category: (row.title ?? 'other') as any,
                    description: row.description,
                    budget: 0,
                    urgency: 'today' as const,
                    location: { area: row.location ?? '', city: '', state: '' },
                    status: (row.status === 'open' ? 'submitted'
                        : row.status === 'assigned' ? 'matched'
                            : row.status === 'completed' ? 'completed'
                                : 'cancelled') as any,
                    createdAt: row.created_at,
                });
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleCancel = () => {
        Alert.alert('Cancel Request', 'Are you sure you want to cancel this request?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: async () => {
                    if (id) {
                        try {
                            await jobApi.cancel(id);
                            updateStoreJob(id, 'cancelled');
                            setJob((j) => j ? { ...j, status: 'cancelled' } : null);
                            Alert.alert('Success', 'Request cancelled successfully');
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'Failed to cancel request');
                        }
                    }
                },
            },
        ]);
    };

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
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

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Status Timeline */}
                {job.status !== 'cancelled' && (
                    <Animated.View entering={FadeInDown.delay(100)}>
                        <Card style={{ marginBottom: 24, padding: 20 }}>
                            <Text style={[Typography.h3, { marginBottom: 20 }]}>Status Tracker</Text>
                            <StatusTimeline steps={getJobStatusSteps(job.status)} />
                        </Card>
                    </Animated.View>
                )}

                {/* Details */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <Card style={{ padding: 20 }}>
                        <Text style={[Typography.h3, { marginBottom: 20 }]}>Job Information</Text>

                        <DetailItem label="Category" value={job.category === 'not_sure' ? 'Not Sure' : job.category} capitalize />
                        <DetailItem label="Description" value={job.description} />
                        <DetailItem label="Location" value={`${job.location.area}, ${job.location.city}`} capitalize />
                        <DetailItem label="Budget" value={formatNaira(job.budget)} />
                        <DetailItem label="Urgency" value={job.urgency.replace('_', ' ')} capitalize />
                        <DetailItem label="Submitted" value={formatDate(job.createdAt)} />

                        {job.scheduledDate && (
                            <DetailItem label="Scheduled For" value={`${job.scheduledDate} at ${job.scheduledTime}`} />
                        )}
                    </Card>
                </Animated.View>

                {/* Artisan info */}
                {job.artisanName && (
                    <Animated.View entering={FadeInDown.delay(300)}>
                        <Card style={{ marginTop: 24, padding: 20 }}>
                            <Text style={[Typography.h3, { marginBottom: 16 }]}>Assigned Professional</Text>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 16,
                                    backgroundColor: Colors.background,
                                    padding: 12,
                                    borderRadius: Radius.md,
                                    borderWidth: 1,
                                    borderColor: Colors.cardBorder
                                }}
                                onPress={() => job.artisanId && router.push({ pathname: '/artisan-profile', params: { id: job.artisanId } })}
                            >
                                <View style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: Colors.primaryLight,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={[Typography.h3, { color: Colors.primary }]}>{job.artisanName[0]}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={Typography.h3}>{job.artisanName}</Text>
                                    <Text style={[Typography.bodySmall, { color: Colors.primary }]}>View Profile</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.muted} />
                            </TouchableOpacity>
                        </Card>
                    </Animated.View>
                )}

                {/* Actions */}
                <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: 40, gap: 16 }}>
                    {job.artisanName && (
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <SecondaryButton
                                title="Message"
                                onPress={() => router.push({ pathname: '/chat', params: { threadId: 't1' } })}
                                style={{ flex: 1 }}
                            />
                            <SecondaryButton
                                title="Call"
                                onPress={() => { }}
                                style={{ flex: 1 }}
                                icon={<Ionicons name="call-outline" size={18} color={Colors.primary} />}
                            />
                        </View>
                    )}

                    {job.status === 'completed' && (
                        <PrimaryButton
                            title="Rate & Review Experience"
                            onPress={() => router.push({ pathname: '/rate-review', params: { jobId: job.id } })}
                        />
                    )}

                    {!['completed', 'cancelled'].includes(job.status) && (
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                padding: 16,
                                borderRadius: Radius.md,
                                borderWidth: 1,
                                borderColor: Colors.error + '30',
                                marginTop: 8
                            }}
                            onPress={handleCancel}
                        >
                            <Text style={[Typography.body, { color: Colors.error, fontFamily: 'MontserratAlternates-SemiBold' }]}>Cancel Request</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}

function DetailItem({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={Typography.label}>{label}</Text>
            <Text style={[Typography.body, {
                marginTop: 4,
                color: Colors.text,
                textTransform: capitalize ? 'capitalize' : 'none'
            }]}>{value}</Text>
        </View>
    );
}

