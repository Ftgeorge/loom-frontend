import { Avatar, RatingStars } from '@/components/ui/AvatarRating';
import type { Artisan } from '@/types';
import { formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ArtisanCardProps {
    artisan: Artisan;
    onPress?: () => void;
    grid?: boolean;
    list?: boolean;
    featured?: boolean;
    className?: string;
}

const ArtisanCardComponent: React.FC<ArtisanCardProps> = ({
    artisan,
    onPress,
    grid = false,
    list = false,
    featured = false,
    className = '',
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = useCallback(() => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    }, []);

    const onPressOut = useCallback(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, []);

    // Selection of craft image based on skills
    const getCraftImage = (skills: string[]) => {
        const skill = skills[0]?.toLowerCase() || 'general';
        if (skill.includes('plumb')) return { uri: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400' };
        if (skill.includes('elect')) return { uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400' };
        if (skill.includes('carp')) return { uri: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400' };
        if (skill.includes('tailor')) return { uri: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400' };
        if (skill.includes('mech')) return { uri: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400' };
        if (skill.includes('clean')) return { uri: 'https://images.unsplash.com/photo-1581578769538-da81ad722e4a?w=400' };
        if (skill.includes('hair') || skill.includes('beau')) return { uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400' };
        if (skill.includes('ac') || skill.includes('repair')) return { uri: 'https://images.unsplash.com/photo-1558223108-630d94ec171c?w=400' };
        return { uri: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400' };
    };

    const craftImage = getCraftImage(artisan.skills);

    const renderList = () => (
        <Animated.View 
            style={animatedStyle}
            className={`bg-surface rounded-md shadow-sm border-[1px] border-card-border overflow-hidden flex-row mb-3 ${className}`}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
                className="flex-1 flex-row"
            >
                <View className="w-[100px] h-[100px]">
                    <ImageBackground source={craftImage} className="w-full h-full">
                        <View className="absolute inset-0 bg-black/10" />
                    </ImageBackground>
                </View>

                <View className="flex-1 p-4 justify-center">
                    <View className="flex-row items-center gap-1">
                        <Text className="text-h3 text-[16px]" numberOfLines={1}>{artisan.name}</Text>
                        {artisan.verified && <Ionicons name="checkmark-circle" size={16} className="text-primary" />}
                    </View>
                    <Text className="text-body-sm text-muted mt-1" numberOfLines={1}>{artisan.skills.join(' • ')}</Text>
                    
                    <View className="flex-row items-center justify-between mt-3">
                        <RatingStars rating={artisan.rating} size={10} showValue={false} />
                        <Text className="text-label text-primary text-[10px] normal-case tracking-normal">
                            From {formatNaira(artisan.baseFee)}
                        </Text>
                    </View>
                </View>

                <View className="absolute top-3 right-3 bg-primary-light px-2 py-1 rounded-xs">
                    <Text className="text-label text-[8px] text-primary">VIEW</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderGrid = () => (
        <Animated.View 
            style={animatedStyle}
            className={`bg-surface rounded-md shadow-sm border-[1px] border-card-border overflow-hidden flex-1 m-[6px] ${className}`}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
                className="flex-1 flex-col"
            >
                <View className="h-[110px] w-full">
                    <ImageBackground source={craftImage} className="w-full h-full">
                        <View className="absolute inset-0 bg-black/10" />
                    </ImageBackground>
                    <View className="absolute -bottom-5 left-3 z-[10] border-[3px] border-white rounded-[25px]">
                        <Avatar name={artisan.name} size={40} />
                    </View>
                </View>

                <View className="p-3 pt-6">
                    <Text className="text-h3 text-[14px]" numberOfLines={1}>{artisan.name}</Text>
                    <Text className="text-body-sm text-muted text-[11px]" numberOfLines={1}>{artisan.skills[0] || 'Artisan'}</Text>
                    
                    <View className="flex-row justify-between items-center mt-[10px]">
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="star" size={10} className="text-warning" />
                            <Text className="text-label text-[10px] normal-case tracking-normal">{artisan.rating}</Text>
                        </View>
                        <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                            <Ionicons name="arrow-forward" size={12} color="white" />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    if (grid) return renderGrid();
    return renderList();
};

export const ArtisanCard = React.memo(ArtisanCardComponent);
ArtisanCard.displayName = 'ArtisanCard';

