import type { Artisan } from '@/types';
import { formatNaira } from '@/utils/helpers';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Avatar, RatingStars } from './AvatarRating';
import { Badge } from './CardChipBadge';

interface ArtisanCardProps {
    artisan: Artisan;
    onPress: () => void;
    horizontal?: boolean;
}

export function ArtisanCard({ artisan, onPress, horizontal }: ArtisanCardProps) {
    if (horizontal) {
        return (
            <TouchableOpacity
                className="flex-row bg-white rounded-2xl p-5 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] gap-4 items-center"
                onPress={onPress}
                activeOpacity={0.85}
                accessibilityLabel={`View ${artisan.name}'s profile`}
            >
                <Avatar name={artisan.name} size={56} />
                <View className="flex-1 gap-[3px]">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-lg font-bold flex-1 text-primary" numberOfLines={1}>{artisan.name}</Text>
                        {artisan.verified && <Badge variant="verified" />}
                    </View>
                    <Text className="text-xs text-gray-500 capitalize" numberOfLines={1}>
                        {artisan.skills.map((s) => s.replace('_', '/')).join(', ')}
                    </Text>
                    <RatingStars rating={artisan.rating} size={13} count={artisan.reviewCount} />
                    <View className="flex-row justify-between mt-0.5">
                        <Text className="text-xs text-gray-500">{artisan.distance}km away</Text>
                        <Text className="text-xs font-semibold text-accent">
                            {formatNaira(artisan.priceRange.min)}–{formatNaira(artisan.priceRange.max)}
                        </Text>
                    </View>
                </View>
                {artisan.matchScore !== undefined && (
                    <View className="bg-accent rounded-full px-2 py-1">
                        <Text className="text-xs font-bold text-white">{artisan.matchScore}%</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] items-center gap-1 w-[140px]"
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityLabel={`View ${artisan.name}'s profile`}
        >
            <Avatar name={artisan.name} size={48} />
            <Text className="text-sm font-semibold text-primary mt-1 text-center" numberOfLines={1}>{artisan.name}</Text>
            <RatingStars rating={artisan.rating} size={12} showValue={false} />
            <Text className="text-xs text-gray-500 capitalize" numberOfLines={1}>
                {artisan.skills[0]?.replace('_', '/')}
            </Text>
            <Text className="text-xs text-gray-400">{artisan.distance}km</Text>
            {artisan.verified && (
                <View className="absolute top-2 right-2">
                    <Badge variant="verified" />
                </View>
            )}
        </TouchableOpacity>
    );
}
