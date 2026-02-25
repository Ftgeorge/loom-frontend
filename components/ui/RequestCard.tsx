import { Colors } from '@/theme';
import type { JobRequest } from '@/types';
import { formatNaira, timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    submitted: { bg: Colors.info + '20', text: Colors.info },
    matched: { bg: Colors.primary + '20', text: Colors.primary },
    scheduled: { bg: Colors.success + '40', text: Colors.success },
    in_progress: { bg: Colors.warning + '20', text: Colors.warning },
    completed: { bg: Colors.success + '20', text: Colors.success },
    cancelled: { bg: Colors.error + '15', text: Colors.error },
    draft: { bg: Colors.gray200, text: Colors.gray600 },
};

const STATUS_LABELS: Record<string, string> = {
    submitted: 'Submitted',
    matched: 'Matched',
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    draft: 'Draft',
};

interface RequestCardProps {
    job: JobRequest;
    onPress: () => void;
    isArtisanView?: boolean;
}

export function RequestCard({ job, onPress, isArtisanView }: RequestCardProps) {
    const statusColor = STATUS_COLORS[job.status] ?? STATUS_COLORS.draft;

    return (
        <TouchableOpacity
            className="bg-white rounded-[24px] p-5 border border-gray-50 gap-3"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 }}
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityLabel={`${job.category} request, ${STATUS_LABELS[job.status]}`}
        >
            <View className="flex-row justify-between items-center mb-1">
                <View className="bg-surface px-3 py-1.5 rounded-full border border-gray-100">
                    <Text className="text-[11px] font-semibold text-graphite capitalize tracking-wide">
                        {job.category === 'not_sure' ? 'Not Sure' : job.category.replace('_', '/')}
                    </Text>
                </View>
                <View
                    className="px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: statusColor.bg }}
                >
                    <Text
                        className="text-[11px] font-bold tracking-wide"
                        style={{ color: statusColor.text }}
                    >
                        {STATUS_LABELS[job.status]?.toUpperCase()}
                    </Text>
                </View>
            </View>

            <Text className="text-base text-graphite font-medium leading-relaxed" numberOfLines={2}>{job.description}</Text>

            <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                    <Ionicons name="location-outline" size={14} color={Colors.gray500} />
                    <Text className="text-xs text-gray-500">{job.location.area}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Ionicons name="cash-outline" size={14} color={Colors.gray500} />
                    <Text className="text-xs text-gray-500">{formatNaira(job.budget)}</Text>
                </View>
                <Text className="text-xs text-gray-400 ml-auto">{timeAgo(job.createdAt)}</Text>
            </View>

            {(job.artisanName || (isArtisanView && job.clientName)) && (
                <View className="flex-row items-center gap-2 pt-3 mt-1 border-t border-gray-50">
                    <View className="w-6 h-6 rounded-full bg-surface items-center justify-center">
                        <Ionicons name="person" size={12} color={Colors.muted} />
                    </View>
                    <Text className="text-sm text-graphite font-semibold tracking-tight">
                        {isArtisanView ? job.clientName : job.artisanName}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
