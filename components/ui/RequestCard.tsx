import { Colors } from '@/theme';
import type { JobRequest } from '@/types';
import { formatNaira, timeAgo } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    submitted: { bg: Colors.info + '20', text: Colors.info },
    matched: { bg: Colors.accent + '20', text: Colors.accent },
    scheduled: { bg: Colors.softSage + '40', text: Colors.deepOlive },
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
            className="bg-white rounded-2xl p-5 border border-operis-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] gap-2.5"
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityLabel={`${job.category} request, ${STATUS_LABELS[job.status]}`}
        >
            <View className="flex-row justify-between items-center">
                <View className="bg-sage-200/30 px-3 py-1 rounded-full">
                    <Text className="text-xs font-semibold text-olive capitalize">
                        {job.category === 'not_sure' ? 'Not Sure' : job.category.replace('_', '/')}
                    </Text>
                </View>
                <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: statusColor.bg }}
                >
                    <Text
                        className="text-[11px] font-semibold"
                        style={{ color: statusColor.text }}
                    >
                        {STATUS_LABELS[job.status]}
                    </Text>
                </View>
            </View>

            <Text className="text-base text-gray-700" numberOfLines={2}>{job.description}</Text>

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
                <View className="flex-row items-center gap-1 pt-2 mt-1 border-t border-gray-100">
                    <Ionicons name="person-outline" size={14} color={Colors.gray500} />
                    <Text className="text-sm text-gray-600 font-medium">
                        {isArtisanView ? job.clientName : job.artisanName}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
