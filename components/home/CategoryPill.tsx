import { Colors, Radius, Shadows } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

// Maps each category id to its local image asset
const CATEGORY_IMAGES: Record<string, any> = {
    plumber: require('../../assets/images/cat_plumber.png'),
    electrician: require('../../assets/images/cat_electrician.png'),
    carpenter: require('../../assets/images/cat_carpenter.png'),
    tailor: require('../../assets/images/cat_tailor.png'),
    mechanic: require('../../assets/images/cat_mechanic.png'),
    cleaning: require('../../assets/images/cat_cleaning.png'),
    hair_beauty: require('../../assets/images/cat_hair_beauty.png'),
    ac_repair: require('../../assets/images/cat_ac_repair.png'),
};

interface CategoryPillProps {
    cat: { id: string; label: string; icon: string };
    onPress: () => void;
}

export function CategoryPill({ cat, onPress }: CategoryPillProps) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const image = CATEGORY_IMAGES[cat.id];

    return (
        <Animated.View style={[animatedStyle, { width: 110 }]}>
            <TouchableOpacity
                style={{
                    height: 140,
                    borderRadius: Radius.lg,
                    overflow: 'hidden',
                    ...Shadows.md,
                }}
                onPress={onPress}
                onPressIn={() => { scale.value = withSpring(0.95, { damping: 14 }); }}
                onPressOut={() => { scale.value = withSpring(1, { damping: 14 }); }}
                activeOpacity={1}
            >
                {/* Background photo */}
                <ImageBackground
                    source={image}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                >
                    {/* Dark gradient overlay — bottom heavy so label is readable */}
                    <View style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.45)',
                    }} />

                    {/* Top-left icon badge */}
                    <View style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.3)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Ionicons name={cat.icon as any} size={17} color="white" />
                    </View>

                    {/* Bottom label */}
                    <View style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        padding: 10,
                    }}>
                        <Text style={{
                            fontSize: 11,
                            fontFamily: 'PlusJakartaSans-Bold',
                            color: Colors.white,
                            lineHeight: 14,
                        }}>
                            {cat.label}
                        </Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </Animated.View>
    );
}
