import { SubAppHeader } from '@/components/AppSubHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi } from '@/services/api';
import { useAppStore } from '@/store';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, StretchInY } from 'react-native-reanimated';

export default function EarningsScreen() {
    const router = useRouter();
    const { setEarnings, earnings } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            const data = await artisanApi.meEarnings();
            const totalEarned = Number(data.total_earned || 0);
            const pendingPayout = Number(data.pending_payout || 0);
            
            const txs = (data.transactions || []).map((t: any) => ({
                id: t.id,
                description: t.description,
                amount: Number(t.amount),
                date: t.created_at,
                type: t.type,
                status: t.status
            }));

            setEarnings({
                totalEarnings: totalEarned,
                thisWeek: totalEarned,
                thisMonth: totalEarned,
                pendingPayments: pendingPayout,
                weeklyData: ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => ({
                    day,
                    amount: 0,
                })),
                transactions: txs,
            });
        } catch (err) {
            console.error("Earnings load error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [setEarnings]);

    useEffect(() => { load(); }, [load]);

    const maxBar = React.useMemo(() => earnings ? Math.max(...earnings.weeklyData.map((d) => d.amount), 1) : 1, [earnings]);

    if (loading) return (
        <View className="flex-1 bg-background">
            <SubAppHeader label="FINANCIAL RECORDS" title="EARNINGS" description="Initializing financial log synchronization..." onNotification={() => router.push('/notifications')} />
            <View className="p-6"><SkeletonList count={4} /></View>
        </View>
    );

    if (error || !earnings) return (
        <View className="flex-1 bg-background">
            <SubAppHeader label="FINANCIAL RECORDS" title="EARNINGS" description="Sync protocol failed." onNotification={() => router.push('/notifications')} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated />
            </View>
            <SubAppHeader
                label="FINANCIAL COMMAND"
                title="MY EARNINGS"
                description="Monitor your operative yield and manage payout protocols."
                onNotification={() => router.push('/notifications')}
            />

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 140 }} 
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Balance Terminal ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View className="bg-white p-8 rounded-[28px] border-[1.5px] border-card-border shadow-2xl overflow-hidden">
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <Text className="text-label text-muted text-[10px] tracking-[2px] uppercase font-jakarta-extrabold italic">AVAILABLE BALANCE</Text>
                                </View>
                                <Text 
                                    className="text-h1 text-primary text-[42px] font-jakarta-extrabold italic tracking-tighter"
                                    adjustsFontSizeToFit
                                    numberOfLines={1}
                                >
                                    {formatNaira(earnings.totalEarnings)}
                                </Text>
                            </View>
                            <View className="w-14 h-14 rounded-2xl bg-background items-center justify-center border border-card-border shadow-sm">
                                <Ionicons name="wallet-outline" size={30} color="#00120C" />
                            </View>
                        </View>

                        <View className="flex-row mt-8 pt-7 border-t border-card-border/50 justify-between">
                            <View>
                                <Text className="text-label text-muted text-[9px] uppercase font-jakarta-bold italic tracking-widest">WEEKLY CYCLE</Text>
                                <Text className="text-h3 text-primary mt-1.5 text-lg font-jakarta-extrabold italic">{formatNaira(earnings.thisWeek)}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-label text-muted text-[9px] uppercase font-jakarta-bold italic tracking-widest">PENDING PAYOUT</Text>
                                <Text className="text-h3 text-accent mt-1.5 text-lg font-jakarta-extrabold italic">{formatNaira(earnings.pendingPayments)}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* ─── Strategic Withdrawal Trigger ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-6">
                    <PrimaryButton
                        title="INITIALIZE WITHDRAWAL"
                        onPress={() => { }}
                        variant="accent"
                        className="h-16 rounded-xl shadow-xl border border-accent/20"
                        icon={<Ionicons name="send" size={18} color="white" />}
                    />
                </Animated.View>

                {/* ─── Performance Velocity Chart ────────────────────────────────────────── */}
                <Animated.View entering={FadeInUp.delay(300).springify()}>
                    <View className="flex-row justify-between items-end mt-14 mb-6 px-1">
                        <View>
                            <Text className="text-label text-primary mb-1.5 uppercase font-jakarta-extrabold italic tracking-[2px]">PERFORMANCE METRIC</Text>
                            <Text className="text-h2 text-[24px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">YIELD VELOCITY</Text>
                        </View>
                        <View className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                            <Text className="text-label text-primary text-[10px] font-jakarta-extrabold italic">THIS WEEK</Text>
                        </View>
                    </View>

                    <View className="py-8 px-6 mb-8 rounded-[28px] bg-white border-[1.5px] border-card-border shadow-sm">
                        <View className="flex-row justify-between h-[130px] items-end -mx-1">
                            {earnings.weeklyData.map((d, i) => (
                                <View key={`${d.day}-${i}`} className="items-center flex-1 px-1">
                                    <Animated.View
                                        entering={StretchInY.delay(400 + i * 50)}
                                        className={`rounded-full w-4 ${
                                            i === 4 ? 'bg-primary' : 'bg-primary/10'
                                        }`}
                                        style={{
                                            height: `${Math.max((d.amount / maxBar) * 100, 10)}%`,
                                        }}
                                    />
                                    <Text className="text-label text-[9px] text-muted mt-3 font-jakarta-bold uppercase italic">{d.day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </Animated.View>

                {/* ─── Transaction History Ledger ────────────────────────────────────────── */}
                <View className="mt-10">
                    <View className="flex-row items-center gap-2 mb-4 px-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <Text className="text-label text-primary uppercase font-jakarta-extrabold italic tracking-[2px]">ACTIVITY LEDGER</Text>
                    </View>
                    
                    {earnings.transactions.length === 0 ? (
                        <View className="p-12 items-center bg-white border-[2px] border-dashed border-card-border rounded-[28px] shadow-inner">
                            <View className="w-16 h-16 bg-background rounded-2xl items-center justify-center mb-4">
                                <Ionicons name="receipt-outline" size={32} color="#94A3B8" />
                            </View>
                            <Text className="text-body-sm text-ink/40 font-jakarta-bold uppercase tracking-widest italic">ZERO SETTLEMENTS LOGGED</Text>
                        </View>
                    ) : (
                        <View className="gap-4">
                            {earnings.transactions.map((tx, index) => (
                                <Animated.View key={tx.id} entering={FadeInUp.delay(500 + index * 100).springify()}>
                                    <TouchableOpacity
                                        className="flex-row items-center gap-4 p-5 bg-white rounded-2xl border-[1.5px] border-card-border shadow-sm active:bg-gray-50"
                                    >
                                        <View
                                            className={`w-11 h-11 rounded-xl items-center justify-center shadow-sm border ${
                                                tx.type === 'credit' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
                                            }`}
                                        >
                                            <Ionicons
                                                name={tx.type === 'credit' ? 'arrow-down-outline' : 'arrow-up-outline'}
                                                size={18}
                                                color={tx.type === 'credit' ? '#10B981' : '#F59E0B'}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-body text-ink font-jakarta-extrabold italic text-[15px] leading-5 uppercase" numberOfLines={1}>{tx.description}</Text>
                                            <Text className="text-label text-muted text-[10px] mt-1 font-jakarta-bold italic uppercase tracking-tighter">{formatDate(tx.date)} • COMPLETED</Text>
                                        </View>
                                        <Text className={`text-h3 text-lg font-jakarta-extrabold italic ${tx.type === 'credit' ? 'text-primary' : 'text-accent'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}{formatNaira(tx.amount)}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>
                    )}
                </View>

                <View className="mt-16 items-center flex-row justify-center gap-2 opacity-20">
                    <Ionicons name="shield-checkmark" size={14} color="#64748B" />
                    <Text className="text-[9px] text-muted uppercase tracking-[3px] font-jakarta-bold italic">Audit Logs Encrypted • Stable Branch</Text>
                </View>
            </ScrollView>
        </View>
    );
}


