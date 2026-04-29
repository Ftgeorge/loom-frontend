import { Avatar, RatingStars } from '@/components/ui/AvatarRating';
import { Badge, Chip } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { Artisan } from '@/types';
import { formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ArtisanCardProps {
    artisan: Artisan;
    onPress?: () => void;
    grid?: boolean;
    list?: boolean;
    featured?: boolean;
}

const ArtisanCardComponent: React.FC<ArtisanCardProps> = ({
    artisan,
    onPress,
    grid = false,
    list = false,
    featured = false,
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
        <Animated.View style={[styles.card, styles.listCard, animatedStyle]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
                style={[styles.touchable, { flexDirection: 'row' }]}
            >
                <View style={styles.imageContainer}>
                    <ImageBackground source={craftImage} style={styles.fullImage}>
                        <View style={styles.overlay} />
                    </ImageBackground>
                </View>

                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={styles.name} numberOfLines={1}>{artisan.name}</Text>
                        {artisan.verified && <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />}
                    </View>
                    <Text style={styles.skills} numberOfLines={1}>{artisan.skills.join(' • ')}</Text>
                    
                    <View style={styles.footerRow}>
                        <RatingStars rating={artisan.rating} size={10} showValue={false} />
                        <Text style={styles.price}>From {formatNaira(artisan.baseFee)}</Text>
                    </View>
                </View>

                <View style={styles.viewBadge}>
                    <Text style={styles.viewText}>VIEW</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderGrid = () => (
        <Animated.View style={[styles.card, styles.gridCard, animatedStyle]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
                style={[styles.touchable, { flexDirection: 'column' }]}
            >
                <View style={styles.gridImageContainer}>
                    <ImageBackground source={craftImage} style={styles.fullImage}>
                        <View style={styles.overlay} />
                    </ImageBackground>
                    <View style={styles.gridAvatar}>
                        <Avatar name={artisan.name} size={40} />
                    </View>
                </View>

                <View style={styles.gridContent}>
                    <Text style={styles.gridName} numberOfLines={1}>{artisan.name}</Text>
                    <Text style={styles.gridSkills} numberOfLines={1}>{artisan.skills[0] || 'Artisan'}</Text>
                    
                    <View style={styles.gridFooter}>
                        <View style={styles.gridStats}>
                            <Ionicons name="star" size={10} color={Colors.warning} />
                            <Text style={styles.gridRating}>{artisan.rating}</Text>
                        </View>
                        <View style={styles.gridAction}>
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

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        ...Shadows.sm,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.cardBorder,
    },
    listCard: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    gridCard: {
        flex: 1,
        margin: 6,
    },
    touchable: {
        flex: 1,
    },
    imageContainer: {
        width: 100,
        height: 100,
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    name: {
        ...Typography.h3,
        fontSize: 16,
    },
    skills: {
        ...Typography.bodySmall,
        color: Colors.muted,
        marginTop: 4,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    price: {
        ...Typography.label,
        color: Colors.primary,
        fontSize: 10,
    },
    viewBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: Radius.xs,
    },
    viewText: {
        ...Typography.label,
        fontSize: 8,
        color: Colors.primary,
    },
    // Grid styles
    gridImageContainer: {
        height: 110,
        width: '100%',
    },
    gridAvatar: {
        position: 'absolute',
        bottom: -20,
        left: 12,
        zIndex: 10,
        borderWidth: 3,
        borderColor: Colors.white,
        borderRadius: 25,
    },
    gridContent: {
        padding: 12,
        paddingTop: 24,
    },
    gridName: {
        ...Typography.h3,
        fontSize: 14,
    },
    gridSkills: {
        ...Typography.bodySmall,
        color: Colors.muted,
        fontSize: 11,
    },
    gridFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    gridStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    gridRating: {
        ...Typography.label,
        fontSize: 10,
    },
    gridAction: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export const ArtisanCard = React.memo(ArtisanCardComponent);
ArtisanCard.displayName = 'ArtisanCard';
