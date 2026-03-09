import { Colors, Radius, Shadows, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface NLSearchBarProps {
    onPress: () => void;
}

export function NLSearchBar({ onPress }: NLSearchBarProps) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <Animated.View style={[animatedStyle, { marginBottom: 40 }]}>
            <TouchableOpacity
                style={{
                    backgroundColor: Colors.surface,
                    borderRadius: Radius.sm,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                    ...Shadows.md,
                }}
                onPress={onPress}
                onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
                onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
                activeOpacity={1}
            >
                <View style={{
                    // width: 40, height: 40, borderRadius: 6,
                    // backgroundColor: Colors.primaryLight,
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Ionicons name="search" size={26} color={Colors.muted} />
                </View>
                <Text style={[Typography.body, { flex: 1, fontSize: 15, color: Colors.muted }]}>
                    Describe what you need help with...
                </Text>
                <View style={{
                    backgroundColor: Colors.primary,
                    width: 42, height: 42, borderRadius: 10,
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
