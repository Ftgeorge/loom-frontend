import { SubAppHeader } from '@/components/AppSubHeader';
import { RequestCard } from '@/components/ui/RequestCard';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi, jobApi } from '@/services/api';
import { mapArtisan, mapJob, mapEarnings } from '@/services/mappers';
import { useAppStore } from '@/store';
import type { Artisan, JobRequest, EarningsSummary } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
} from 'react-native-reanimated';

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, delay, accent }: {
    label: string;
    value: string;
    icon: string;
    delay: number;
    accent?: boolean;
}) {
    return (
        <Animated.View
            entering={FadeInUp.delay(delay).springify()}
            className="flex-1"
        >
            <View className={`${
                accent ? "bg-primary border-transparent" : "bg-surface border-card-border"
            } rounded-sm p-[18px] border shadow-sm`}>
                <View className={`w-9 h-9 rounded-[10px] items-center justify-center mb-3 ${
                    accent ? "bg-white/10" : "bg-canvas"
                }`}>
                    <Ionicons 
                        name={icon as any} 
                        size={18} 
                        className={accent ? "text-white" : "text-primary"} 
                    />
                </View>
                <Text className={`text-data text-[22px] mb-1 ${
                    accent ? "text-white" : "text-ink"
                }`}>
                    {value}
                </Text>
                <Text className={`text-label text-[9px] tracking-[0.8px] uppercase ${
                    accent ? "text-white/55" : "text-muted"
                }`}>
                    {label}
                </Text>
            </View>
        </Animated.View>
    );
}

// ─── Online Toggle ──────────────────────────────────────────────────────────────
function OnlineToggle({ online, onToggle }: { online: boolean; onToggle: () => void }) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const handlePress = () => {
        scale.value = withSequence(
            withSpring(0.92, { damping: 6 }),
            withSpring(1, { damping: 10 })
        );
        onToggle();
    };

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={1}
                className={`flex-row items-center gap-2 px-4 py-[10px] rounded-[24px] border-[1.5px] ${
                    online ? "bg-success/10 border-success/60" : "bg-canvas border-card-border"
                }`}
            >
                <View className={`w-2 h-2 rounded-full ${online ? "bg-success" : "bg-muted"}`} />
                <Text className={`text-[12px] font-jakarta-bold ${online ? "text-success" : "text-muted"}`}>
                    {online ? "AVAILABLE" : "OFFLINE"}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function ArtisanDashboard() {
    const router = useRouter();
    const { user, artisanOnline, setArtisanOnline } = useAppStore();
    const [jobs, setJobs] = useState<JobRequest[]>([]);
    const [profile, setProfile] = useState<Artisan | null>(null);
    const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!refreshing) setLoading(true);

            const [jobsRes, profileRes, earningsRes, verifyRes] = await Promise.all([
                jobApi.list({ limit: 30 }),
                artisanApi.meProfile(),
                artisanApi.meEarnings(),
                artisanApi.getVerification().catch(() => null)
            ]);

            setJobs(((jobsRes.results || []) as any[]).map(mapJob));
            if (profileRes) setProfile(mapArtisan(profileRes));
            setEarnings(mapEarnings(earningsRes));
            setVerificationStatus(verifyRes?.status || 'unverified');
        } catch (err) {
            console.error('[Dashboard] Error loading data:', err);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);

    useEffect(() => { load(); }, [load]);
    const onRefresh = useCallback(() => { setRefreshing(true); load(); }, [load]);

    const newJobs = React.useMemo(() => jobs.filter(j => j.status === 'submitted' || j.status === 'matched'), [jobs]);
    const activeJobs = React.useMemo(() => jobs.filter(j => ['accepted', 'on_the_way', 'in_progress'].includes(j.status)), [jobs]);

    const firstName = user?.name?.split(' ')[0] || 'Pro';

    return (
        <View className="flex-1 bg-canvas">
            <SubAppHeader
                showLocation={false}
                label="DASHBOARD"
                title={firstName}
                description="Manage your business and track incoming job requests."
                onNotification={() => router.push('/notifications')}
            />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 130 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00120C" />}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Verification Banner ──────────────────────────────────── */}
                {verificationStatus !== 'approved' && (
                    <Animated.View entering={FadeInUp.springify()} className="mb-5">
                        <TouchableOpacity 
                            onPress={() => router.push('/verification')}
                            activeOpacity={0.9}
                            className={`flex-row items-center gap-3 p-4 rounded-sm border ${
                                verificationStatus === 'pending' ? 'bg-warning/10 border-warning/20' : 'bg-error/10 border-error/20'
                            }`}
                        >
                            <View className={`w-9 h-9 rounded-full items-center justify-center ${
                                verificationStatus === 'pending' ? 'bg-warning' : 'bg-error'
                            }`}>
                                <Ionicons 
                                    name={verificationStatus === 'pending' ? "time-outline" : "alert-circle-outline"} 
                                    size={20} 
                                    color="white" 
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-label text-[13px] text-ink font-jakarta-bold">
                                    {verificationStatus === 'pending' ? "Verification in Progress" : "Complete Your Verification"}
                                </Text>
                                <Text className="text-body-sm text-muted text-[11px] mt-[1px]">
                                    {verificationStatus === 'pending' 
                                        ? "We're reviewing your documents. Hang tight!" 
                                        : "Verify your ID to unlock all features and start earning."}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} className="text-muted" />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* ─── Status Row ───────────────────────────────────────────── */}
                <View className="mb-8 flex-row justify-end">
                    <Animated.View entering={FadeInRight.delay(160).springify()}>
                        <OnlineToggle online={artisanOnline} onToggle={() => setArtisanOnline(!artisanOnline)} />
                    </Animated.View>
                </View>

                {/* ─── Earnings Hero Card ───────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mb-5">
                    <View className="bg-primary rounded-sm p-6 shadow-brand overflow-hidden">
                        {/* Decorative */}
                        <View className="absolute -right-[30px] -top-[30px] opacity-[0.04]">
                            <Ionicons name="wallet" size={200} color="white" />
                        </View>

                        <Text className="text-[10px] font-jakarta-bold text-white/50 tracking-[1px] uppercase mb-2">
                            Total Earnings
                        </Text>
                        <Text className="text-[38px] font-inter-bold text-white tracking-[-1px] mb-1">
                            ₦{Number(earnings?.totalEarnings ?? 0).toLocaleString()}
                        </Text>
                        <Text className="text-[12px] font-inter text-white/45 mb-6">
                            All time · Updated just now
                        </Text>

                        <View className="flex-row gap-5">
                            <View>
                                <Text className="text-[9px] font-jakarta-bold text-white/40 tracking-[0.6px] uppercase">
                                    This week
                                </Text>
                                <Text className="text-[17px] font-inter-bold text-white mt-[2px]">
                                    ₦{Number(earnings?.thisWeek ?? 0).toLocaleString()}
                                </Text>
                            </View>
                            <View className="w-[1px] bg-white/10" />
                            <View>
                                <Text className="text-[9px] font-jakarta-bold text-white/40 tracking-[0.6px] uppercase">
                                    Completed
                                </Text>
                                <Text className="text-[17px] font-inter-bold text-white mt-[2px]">
                                    {profile?.completedJobs ?? 0} jobs
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* ─── Stats Row ───────────────────────────────────────────── */}
                <View className="flex-row gap-3 mb-10">
                    <StatCard
                        label="New Jobs"
                        value={`${newJobs.length}`}
                        icon="flash-outline"
                        delay={280}
                        accent
                    />
                    <StatCard
                        label="Active Jobs"
                        value={`${activeJobs.length}`}
                        icon="briefcase-outline"
                        delay={360}
                    />
                    <StatCard
                        label="Rating"
                        value={profile?.rating && profile.rating > 0 ? profile.rating.toFixed(1) : '5.0'}
                        icon="star-outline"
                        delay={440}
                    />
                </View>

                {/* ─── New Gigs ─────────────────────────────────────────────── */}
                <View>
                    <View className="flex-row justify-between items-end mb-5">
                        <View>
                            <Text className="text-label text-muted mb-1">Incoming</Text>
                            <Text className="text-h2 text-[20px]">New Job Requests</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/jobs')}
                            className="bg-canvas py-[6px]"
                        >
                            <Text className="text-[12px] font-inter-semibold text-primary">
                                All Jobs
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <SkeletonList count={2} type="request" />
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : newJobs.length === 0 ? (
                        <View className="bg-surface rounded-xl p-12 items-center border-[1.5px] border-dashed border-card-border">
                            <View className="w-[60px] h-[60px] rounded-[20px] bg-canvas items-center justify-center mb-4">
                                <Ionicons name="notifications-off-outline" size={28} className="text-muted" />
                            </View>
                            <Text className="text-h3 text-center mb-2">
                                No jobs yet
                            </Text>
                            <Text className="text-body text-center text-[14px]">
                                Stay online and you&apos;ll be notified when a job comes in.
                            </Text>
                        </View>
                    ) : (
                        <View className="gap-3">
                            {newJobs.slice(0, 4).map((job, index) => (
                                <Animated.View key={job.id} entering={FadeInDown.delay(500 + index * 80).springify()}>
                                    <RequestCard
                                        job={job}
                                        isArtisanView
                                        onPress={() => router.push({ pathname: '/job-details', params: { id: job.id } })}
                                    />
                                </Animated.View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
