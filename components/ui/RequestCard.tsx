import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { JobRequest } from '@/types';
import { formatNaira, timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Badge, Card } from './CardChipBadge';

const STATUS_VARIANTS: Record<string, 'default' | 'success' | 'warn' | 'accent'> = {
    submitted: 'accent',
    matched: 'accent',
    scheduled: 'success',
    in_progress: 'warn',
    completed: 'success',
    cancelled: 'default',
};

const STATUS_LABELS: Record<string, string> = {
    submitted: 'INITIATED',
    matched: 'PROTOCOL ACTIVE',
    scheduled: 'DEPLOYED',
    in_progress: 'OPERATIONAL',
    completed: 'RESOLVED',
    cancelled: 'TERMINATED',
};

interface RequestCardProps {
    job: JobRequest;
    onPress: () => void;
    isArtisanView?: boolean;
}

export const RequestCard = React.memo(({ job, onPress, isArtisanView }: RequestCardProps) => {
    const statusVariant = STATUS_VARIANTS[job.status] ?? 'default';

    return (
        <Card onPress={onPress} style={{ padding: 24, ...Shadows.sm, borderColor: Colors.cardBorder, borderWidth: 1.5, backgroundColor: Colors.white }}>
            {/* Header: Category + Status */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <View style={{
                    backgroundColor: Colors.surface,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: Radius.xs,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder
                }}>
                    <Text style={[Typography.label, { color: Colors.primary, fontSize: 8, fontWeight: '900' }]}>
                        {job.category === 'not_sure' ? 'GENERAL SECTOR' : job.category.toUpperCase().replace('_', ' / ')}
                    </Text>
                </View>
                <Badge
                    label={STATUS_LABELS[job.status]}
                    variant={statusVariant}
                />
            </View>

            {/* Description */}
            <Text
                style={[Typography.h3, { marginBottom: 16, color: Colors.primary, fontSize: 18, lineHeight: 26 }]}
                numberOfLines={2}
            >
                {job.description}
            </Text>

            {/* Technical Meta */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="location-outline" size={14} color={Colors.primary} />
                    <Text style={[Typography.label, { color: Colors.primary, fontSize: 10, fontWeight: '700' }]}>{job.location.area.toUpperCase()}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="card-outline" size={14} color={Colors.accent} />
                    <Text style={[Typography.label, { color: Colors.accent, fontSize: 10, fontWeight: '900' }]}>{formatNaira(job.budget).toUpperCase()}</Text>
                </View>
            </View>

            {/* Footer: Operative Info + Time */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 20,
                borderTopWidth: 1.5,
                borderTopColor: Colors.gray100
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: Radius.xs,
                        backgroundColor: Colors.surface,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: Colors.cardBorder
                    }}>
                        <Ionicons name="person-outline" size={16} color={Colors.primary} />
                    </View>
                    <View>
                        <Text style={[Typography.label, { fontSize: 8, color: Colors.muted }]}>
                            {isArtisanView ? 'CLIENT IDENTITY' : 'OPERATIVE ASSIGNED'}
                        </Text>
                        <Text style={[Typography.bodySmall, { color: Colors.primary, fontSize: 13, fontWeight: '700' }]}>
                            {isArtisanView ? job.clientName.toUpperCase() : (job.artisanName || 'PENDING ASSIGNMENT').toUpperCase()}
                        </Text>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[Typography.label, { fontSize: 8, color: Colors.muted }]}>SYSTEM SIGNAL</Text>
                    <Text style={[Typography.bodySmall, { color: Colors.primary, fontSize: 10, fontWeight: '700' }]}>
                        {timeAgo(job.createdAt).toUpperCase()}
                    </Text>
                </View>
            </View>
        </Card>
    );
});

