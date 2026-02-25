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
                className="flex-row bg-white rounded-[20px] p-4 border border-gray-50 items-center gap-4"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}
                onPress={onPress}
                activeOpacity={0.85}
                accessibilityLabel={`View ${artisan.name}'s profile`}
            >
                <Avatar name={artisan.name} size={56} />
                <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-lg font-bold flex-1 text-graphite tracking-tight" numberOfLines={1}>{artisan.name}</Text>
                        {artisan.verified && <Badge variant="verified" />}
                    </View>
                    <Text className="text-xs text-muted capitalize" numberOfLines={1}>
                        {artisan.skills.map((s) => s.replace('_', '/')).join(', ')}
                    </Text>
                    <RatingStars rating={artisan.rating} size={13} count={artisan.reviewCount} />
                    <View className="flex-row justify-between items-center mt-1">
                        <Text className="text-xs text-muted">{artisan.distance}km away</Text>
                        <Text className="text-sm font-semibold text-black">
                            {formatNaira(artisan.priceRange.min)}–{formatNaira(artisan.priceRange.max)}
                        </Text>
                    </View>
                </View>
                {artisan.matchScore !== undefined && (
                    <View className="bg-black/10 rounded-full px-2 py-1">
                        <Text className="text-xs font-bold text-black">{artisan.matchScore}%</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            className="bg-white rounded-[24px] p-5 items-center justify-center border border-gray-50 w-[140px]"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 }}
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityLabel={`View ${artisan.name}'s profile`}
        >
            <Avatar name={artisan.name} size={64} />
            <Text className="text-base font-bold text-black mt-3 text-center tracking-tight" numberOfLines={1}>{artisan.name}</Text>
            <View className="mt-1 mb-1.5">
                <RatingStars rating={artisan.rating} size={14} showValue={false} />
            </View>
            <Text className="text-xs text-black font-medium capitalize" numberOfLines={1}>
                {artisan.skills[0]?.replace('_', '/')}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">{artisan.distance}km</Text>
            {artisan.verified && (
                <View className="absolute top-3 right-3">
                    <Badge variant="verified" />
                </View>
            )}
        </TouchableOpacity>
    );
}
