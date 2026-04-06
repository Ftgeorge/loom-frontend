import type { JobRequest } from '@/types';
import { formatNaira, timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Badge, Card } from './CardChipBadge';

const STATUS_CONFIG: Record<string, { label: string; variant: any; dotClass: string }> = {
    submitted: { label: 'Open', variant: 'accent', dotClass: 'bg-warning' },
    matched: { label: 'Matched', variant: 'violet', dotClass: 'bg-violet' },
    scheduled: { label: 'Scheduled', variant: 'success', dotClass: 'bg-success' },
    in_progress: { label: 'In Progress', variant: 'warn', dotClass: 'bg-warning' },
    completed: { label: 'Done', variant: 'success', dotClass: 'bg-success' },
    cancelled: { label: 'Cancelled', variant: 'default', dotClass: 'bg-muted' },
};

interface RequestCardProps {
    job: JobRequest;
    onPress: () => void;
    isArtisanView?: boolean;
    className?: string;
}

export const RequestCard = React.memo(({ job, onPress, isArtisanView, className = '' }: RequestCardProps) => {
    const config = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.submitted;

    return (
        <Card
            onPress={onPress}
            className={`p-5 border-card-border rounded-lg bg-surface shadow-sm ${className}`}
        >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-[14px]">
                <View className="bg-canvas px-[10px] py-[5px] rounded-[20px] border-[1px] border-card-border">
                    <Text className="text-[10px] font-inter-semibold text-ink">
                        {job.category === 'not_sure' ? 'GENERAL' : job.category.toUpperCase().replace('_', ' ')}
                    </Text>
                </View>
                <View className="flex-row items-center gap-[5px]">
                    <View className={`w-[6px] h-[6px] rounded-full ${config.dotClass}`} />
                    <Badge label={config.label} variant={config.variant} />
                </View>
            </View>

            {/* Description */}
            <Text
                className="text-[16px] font-jakarta-semibold text-ink leading-[22px] mb-[14px]"
                numberOfLines={2}
            >
                {job.description}
            </Text>

            {/* Meta pills */}
            <View className="flex-row gap-2 mb-4 flex-wrap">
                <View className="flex-row items-center gap-1 bg-canvas rounded-[20px] px-[10px] py-[5px] border-[1px] border-card-border">
                    <Ionicons name="location-outline" size={11} className="text-muted" />
                    <Text className="text-[11px] font-inter text-text-secondary">
                        {job.location.area}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1 bg-accent-light rounded-[20px] px-[10px] py-[5px]">
                    <Ionicons name="cash-outline" size={11} className="text-accent" />
                    <Text className="text-[11px] font-inter-semibold text-accent">
                        {formatNaira(job.budget)}
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-between pt-[14px] border-t-[1px] border-divider">
                <View className="flex-row items-center gap-2">
                    <View className="w-[30px] h-[30px] rounded-sm bg-canvas items-center justify-center border-[1px] border-card-border">
                        <Ionicons name="person-outline" size={14} className="text-primary" />
                    </View>
                    <View>
                        <Text className="text-[9px] font-inter text-muted mb-[2px] uppercase">
                            {isArtisanView ? 'Client' : 'Artisan'}
                        </Text>
                        <Text className="text-[13px] font-inter-semibold text-ink">
                            {isArtisanView ? job.clientName : (job.artisanName || 'Matching...')}
                        </Text>
                    </View>
                </View>
                <Text className="text-[11px] font-inter text-muted">
                    {timeAgo(job.createdAt)}
                </Text>
            </View>
        </Card>
    );
});

RequestCard.displayName = 'RequestCard';

