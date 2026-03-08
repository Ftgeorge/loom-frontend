import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { JobRequest } from '@/types';
import { formatNaira, timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Badge, Card } from './CardChipBadge';

const STATUS_CONFIG: Record<string, { label: string; variant: any; dot: string }> = {
    submitted: { label: 'Open', variant: 'accent', dot: Colors.warning },
    matched: { label: 'Matched', variant: 'violet', dot: Colors.violet },
    scheduled: { label: 'Scheduled', variant: 'success', dot: Colors.success },
    in_progress: { label: 'In Progress', variant: 'warn', dot: Colors.warning },
    completed: { label: 'Done', variant: 'success', dot: Colors.success },
    cancelled: { label: 'Cancelled', variant: 'default', dot: Colors.muted },
};

interface RequestCardProps {
    job: JobRequest;
    onPress: () => void;
    isArtisanView?: boolean;
}

export const RequestCard = React.memo(({ job, onPress, isArtisanView }: RequestCardProps) => {
    const config = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.submitted;

    return (
        <Card
            onPress={onPress}
            style={{
                padding: 20,
                borderWidth: 1,
                borderColor: Colors.cardBorder,
                borderRadius: Radius.lg,
                backgroundColor: Colors.surface,
                ...Shadows.sm,
            }}
        >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <View style={{
                    backgroundColor: Colors.canvas,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                }}>
                    <Text style={{
                        fontSize: 10,
                        fontFamily: 'Inter-SemiBold',
                        color: Colors.ink,
                    }}>
                        {job.category === 'not_sure' ? 'General' : job.category.replace('_', ' ')}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: config.dot }} />
                    <Badge label={config.label} variant={config.variant} />
                </View>
            </View>

            {/* Description */}
            <Text
                style={{ fontSize: 16, fontFamily: 'PlusJakartaSans-SemiBold', color: Colors.ink, lineHeight: 22, marginBottom: 14 }}
                numberOfLines={2}
            >
                {job.description}
            </Text>

            {/* Meta pills */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <View style={{
                    flexDirection: 'row', alignItems: 'center', gap: 4,
                    backgroundColor: Colors.canvas, borderRadius: 20,
                    paddingHorizontal: 10, paddingVertical: 5,
                    borderWidth: 1, borderColor: Colors.cardBorder,
                }}>
                    <Ionicons name="location-outline" size={11} color={Colors.muted} />
                    <Text style={{ fontSize: 11, fontFamily: 'Inter-Regular', color: Colors.textSecondary }}>
                        {job.location.area}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row', alignItems: 'center', gap: 4,
                    backgroundColor: Colors.accentLight, borderRadius: 20,
                    paddingHorizontal: 10, paddingVertical: 5,
                }}>
                    <Ionicons name="cash-outline" size={11} color={Colors.accent} />
                    <Text style={{ fontSize: 11, fontFamily: 'Inter-SemiBold', color: Colors.accent }}>
                        {formatNaira(job.budget)}
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: Colors.divider,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{
                        width: 30, height: 30, borderRadius: 10,
                        backgroundColor: Colors.canvas,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 1, borderColor: Colors.cardBorder,
                    }}>
                        <Ionicons name="person-outline" size={14} color={Colors.primary} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 9, fontFamily: 'Inter-Regular', color: Colors.muted, marginBottom: 2 }}>
                            {isArtisanView ? 'Client' : 'Assigned pro'}
                        </Text>
                        <Text style={{ fontSize: 13, fontFamily: 'Inter-SemiBold', color: Colors.ink }}>
                            {isArtisanView ? job.clientName : (job.artisanName || 'Matching...')}
                        </Text>
                    </View>
                </View>
                <Text style={{ fontSize: 11, fontFamily: 'Inter-Regular', color: Colors.muted }}>
                    {timeAgo(job.createdAt)}
                </Text>
            </View>
        </Card>
    );
});
