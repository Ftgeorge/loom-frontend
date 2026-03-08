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
                    borderRadius: Radius.xl,
                    paddingHorizontal: 20,
                    paddingVertical: 18,
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
                    width: 36, height: 36, borderRadius: 12,
                    backgroundColor: Colors.primaryLight,
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Ionicons name="search" size={18} color={Colors.primary} />
                </View>
                <Text style={[Typography.body, { flex: 1, fontSize: 15, color: Colors.muted }]}>
                    Describe what you need help with...
                </Text>
                <View style={{
                    backgroundColor: Colors.primary,
                    width: 32, height: 32, borderRadius: 10,
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Ionicons name="arrow-forward" size={16} color={Colors.white} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
