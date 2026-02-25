import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { fetchEarnings } from '@/services/mockApi';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function EarningsScreen() {
    const { language, setEarnings, earnings } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            const data = await fetchEarnings();
            setEarnings(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [setEarnings]);

    useEffect(() => { load(); }, [load]);

    if (loading) return (
        <View className="flex-1 bg-background">
            <AppHeader title={t('earnings', language)} showNotification={false} />
            <View className="p-5"><SkeletonList count={4} /></View>
        </View>
    );

    if (error || !earnings) return (
        <View className="flex-1 bg-background">
            <AppHeader title={t('earnings', language)} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    const maxBar = Math.max(...earnings.weeklyData.map((d) => d.amount), 1);

    return (
        <View className="flex-1 bg-background">
            <AppHeader title={t('earnings', language)} showNotification={false} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Total Earnings Card */}
                <Card className="bg-graphite p-8 rounded-[24px] shadow-sm" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 }}>
                    <Text className="text-sm text-white/60 font-medium tracking-wide uppercase">Total Earnings</Text>
                    <Text className="text-[40px] font-extrabold tracking-tight text-white my-2">{formatNaira(earnings.totalEarnings)}</Text>
                    <View className="flex-row mt-6 gap-6">
                        <View>
                            <Text className="text-xs text-white/50 tracking-wide">This Week</Text>
                            <Text className="text-base text-white font-semibold mt-1">{formatNaira(earnings.thisWeek)}</Text>
                        </View>
                        <View>
                            <Text className="text-xs text-white/50 tracking-wide">This Month</Text>
                            <Text className="text-base text-white font-semibold mt-1">{formatNaira(earnings.thisMonth)}</Text>
                        </View>
                        <View>
                            <Text className="text-xs text-white/50 tracking-wide">Pending</Text>
                            <Text className="text-base text-white/70 font-semibold mt-1 flex-shrink">
                                {formatNaira(earnings.pendingPayments)}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Weekly Chart */}
                <Text className="text-lg font-extrabold tracking-tight text-graphite mb-4 mt-8">This Week</Text>
                <Card className="py-5 px-4 mb-4 rounded-[24px] border border-gray-50 shadow-sm" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                    <View className="flex-row justify-between h-[120px] items-end">
                        {earnings.weeklyData.map((d) => (
                            <View key={d.day} className="items-center flex-1">
                                <View className="w-7 h-[100px] justify-end">
                                    <View
                                        className="bg-primary/10 rounded min-h-[4px] w-full"
                                        style={[{ height: `${Math.max((d.amount / maxBar) * 100, 4)}%` }]}
                                    />
                                </View>
                                <Text className="text-xs text-gray-500 mt-1.5">{d.day}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Withdrawal Button */}
                <PrimaryButton
                    title="Withdraw Funds"
                    onPress={() => { }}
                    icon={<Ionicons name="arrow-down-circle-outline" size={20} color={Colors.white} />}
                    style={{ marginVertical: 24 }}
                    className="bg-graphite"
                />

                {/* Transactions */}
                <Text className="text-lg font-extrabold tracking-tight text-graphite mb-4 mt-5">Recent Transactions</Text>
                {earnings.transactions.map((tx) => (
                    <View key={tx.id} className="flex-row items-center py-4 gap-4 border-b border-gray-100">
                        <View
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: tx.type === 'credit' ? Colors.success + '20' : Colors.error + '15' }}
                        >
                            <Ionicons
                                name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                                size={18}
                                color={tx.type === 'credit' ? Colors.success : Colors.error}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-medium text-graphite" numberOfLines={1}>{tx.description}</Text>
                            <Text className="text-xs text-muted mt-0.5">{formatDate(tx.date)}</Text>
                        </View>
                        <Text className="text-base font-semibold" style={{ color: tx.type === 'credit' ? Colors.success : Colors.error }}>
                            {tx.type === 'credit' ? '+' : '-'}{formatNaira(tx.amount)}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
