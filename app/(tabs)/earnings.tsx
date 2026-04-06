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
            
            // Map transactions from backend TransactionRow to frontend Transaction
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
                thisWeek: totalEarned, // For now, use total as we don't have weekly split yet
                thisMonth: totalEarned,
                pendingPayments: pendingPayout,
                weeklyData: ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => ({
                    day,
                    amount: 0, // Should be calculated if we add temporal queries
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
            <SubAppHeader label="FINANCIALS" title="Earnings" description="Loading your financial data..." onNotification={() => router.push('/notifications')} />
            <View className="p-6"><SkeletonList count={4} /></View>
        </View>
    );

    if (error || !earnings) return (
        <View className="flex-1 bg-background">
            <SubAppHeader label="FINANCIALS" title="Earnings" description="Something went wrong." onNotification={() => router.push('/notifications')} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.2} animated />
            <SubAppHeader
                label="FINANCIALS"
                title="My Earnings"
                description="Track your revenue and manage your payouts."
                onNotification={() => router.push('/notifications')}
            />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                {/* Balance Hub */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <Card className="bg-white p-8 rounded-sm border-[1.5px] border-card-border shadow-md">
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1">
                                <View className="flex-row items-center gap-[6px] mb-2">
                                    <View className="w-1 h-1 rounded-full bg-primary" />
                                    <Text className="text-label text-muted text-[9px] tracking-[1.2px]">AVAILABLE BALANCE</Text>
                                </View>
                                <Text 
                                    className="text-display text-primary text-[36px] font-jakarta-extrabold"
                                    adjustsFontSizeToFit
                                    numberOfLines={1}
                                >
                                    {formatNaira(earnings.totalEarnings)}
                                </Text>
                            </View>
                            <View className="w-[52px] h-[52px] rounded-md bg-surface items-center justify-center border border-card-border">
                                <Ionicons name="wallet" size={26} color="#00120C" />
                            </View>
                        </View>

                        <View className="flex-row mt-8 pt-6 border-t border-divider justify-between">
                            <View>
                                <Text className="text-label text-muted text-[8px]">WEEKLY REVENUE</Text>
                                <Text className="text-h3 text-primary mt-1 text-base">{formatNaira(earnings.thisWeek)}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-label text-muted text-[8px]">PENDING PAYOUT</Text>
                                <Text className="text-h3 text-accent mt-1 text-base">{formatNaira(earnings.pendingPayments)}</Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Balance Hub Actions */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-6">
                    <PrimaryButton
                        title="WITHDRAW FUNDS"
                        onPress={() => { }}
                        variant="accent"
                        className="h-16 rounded-sm shadow-md"
                        icon={<Ionicons name="paper-plane" size={20} color="white" />}
                    />
                </Animated.View>

                {/* Velocity Visualization */}
                <Animated.View entering={FadeInUp.delay(300).springify()}>
                    <View className="flex-row justify-between items-end mt-12 mb-5">
                        <View>
                            <Text className="text-label text-primary mb-1 uppercase">Earnings Overview</Text>
                            <Text className="text-h3 text-[20px]">Performance</Text>
                        </View>
                        <View className="bg-primary/5 px-3 py-[6px] rounded-full">
                            <Text className="text-label text-primary text-[10px]">THIS WEEK</Text>
                        </View>
                    </View>

                    <Card className="py-7 px-5 mb-6 rounded-sm bg-white border border-card-border">
                        <View className="flex-row justify-between h-[120px] items-end">
                            {earnings.weeklyData.map((d, i) => (
                                <View key={`${d.day}-${i}`} className="items-center flex-1">
                                    <Animated.View
                                        entering={StretchInY.delay(400 + i * 50)}
                                        className={`rounded-[3px] w-[14px] ${
                                            i === 4 ? 'bg-accent opacity-100' : 'bg-primary opacity-[0.12]'
                                        }`}
                                        style={{
                                            height: `${Math.max((d.amount / maxBar) * 100, 8)}%`,
                                        }}
                                    />
                                    <Text className="text-label text-[8px] text-muted mt-3">{d.day}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>
                </Animated.View>

                {/* Activity Ledger */}
                <View className="mt-10">
                    <Text className="text-label text-primary mb-3">PAYMENT HISTORY</Text>
                    {earnings.transactions.length === 0 ? (
                        <Card className="p-12 items-center bg-surface border-dashed border-card-border rounded-sm">
                            <Ionicons name="receipt-outline" size={32} color="#8F9B94" />
                            <Text className="text-body-sm text-muted mt-4 uppercase">No transactions yet</Text>
                        </Card>
                    ) : (
                        <View className="gap-3">
                            {earnings.transactions.map((tx, index) => (
                                <Animated.View key={tx.id} entering={FadeInUp.delay(500 + index * 100).springify()}>
                                    <TouchableOpacity
                                        className="flex-row items-center gap-4 p-5 bg-white rounded-sm border-[1.5px] border-card-border shadow-sm"
                                    >
                                        <View
                                            className="w-9 h-9 rounded-xs items-center justify-center bg-surface border border-card-border"
                                        >
                                            <Ionicons
                                                name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                                                size={16}
                                                className={tx.type === 'credit' ? 'text-primary' : 'text-accent'}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-body text-ink font-jakarta-bold text-base" numberOfLines={1}>{tx.description}</Text>
                                            <Text className="text-label text-muted text-[9px] mt-1 lowercase">{formatDate(tx.date)}</Text>
                                        </View>
                                        <Text className={`text-h3 text-base ${tx.type === 'credit' ? 'text-primary' : 'text-accent'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}{formatNaira(tx.amount)}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

