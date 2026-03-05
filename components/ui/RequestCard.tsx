import { Colors, Radius, Typography } from '@/theme';
import type { JobRequest } from '@/types';
import { formatNaira, timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Badge, Card } from './CardChipBadge';

const STATUS_VARIANTS: Record<string, 'default' | 'success' | 'warn'> = {
    submitted: 'default',
    matched: 'default',
    scheduled: 'success',
    in_progress: 'warn',
    completed: 'success',
    cancelled: 'default',
};

const STATUS_LABELS: Record<string, string> = {
    submitted: 'New',
    matched: 'Matched',
    scheduled: 'Scheduled',
    in_progress: 'Active',
    completed: 'Done',
    cancelled: 'Cancelled',
};

interface RequestCardProps {
    job: JobRequest;
    onPress: () => void;
    isArtisanView?: boolean;
}

export function RequestCard({ job, onPress, isArtisanView }: RequestCardProps) {
    const statusVariant = STATUS_VARIANTS[job.status] ?? 'default';

    return (
        <Card onPress={onPress} style={{ padding: 20 }}>
            {/* Header: Category + Status */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <View style={{
                    backgroundColor: Colors.primaryLight,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: Radius.md
                }}>
                    <Text style={[Typography.label, { color: Colors.primary, fontSize: 10 }]}>
                        {job.category === 'not_sure' ? 'Other' : job.category.replace('_', ' ')}
                    </Text>
                </View>
                <Badge
                    label={STATUS_LABELS[job.status]}
                    variant={statusVariant}
                />
            </View>

            {/* Description */}
            <Text
                style={[Typography.bodyLarge, { marginBottom: 12, color: Colors.text }]}
                numberOfLines={2}
            >
                {job.description}
            </Text>

            {/* Meta Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="location-outline" size={14} color={Colors.muted} />
                    <Text style={[Typography.bodySmall, { color: Colors.muted }]}>{job.location.area}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="wallet-outline" size={14} color={Colors.muted} />
                    <Text style={[Typography.bodySmall, { color: Colors.muted }]}>{formatNaira(job.budget)}</Text>
                </View>
            </View>

            {/* Footer: User Info + Time */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: Colors.cardBorder
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: Colors.background,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Ionicons name="person" size={14} color={Colors.muted} />
                    </View>
                    <Text style={[Typography.bodySmall, { fontFamily: 'MontserratAlternates-SemiBold', color: Colors.text }]}>
                        {isArtisanView ? job.clientName : job.artisanName || 'Unassigned'}
                    </Text>
                </View>
                <Text style={[Typography.bodySmall, { color: Colors.muted, fontSize: 11 }]}>
                    {timeAgo(job.createdAt)}
                </Text>
            </View>
        </Card>
    );
}

