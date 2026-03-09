import { Colors, Radius, Shadows, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface PostJobCTAProps {
    onPress: () => void;
}

export function PostJobCTA({ onPress }: PostJobCTAProps) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <Animated.View style={[animatedStyle, { marginBottom: 40 }]}>
            <TouchableOpacity
                style={{
                    borderRadius: Radius.sm,
                    borderWidth: 1.5,
                    borderColor: Colors.primary + '40',
                    borderStyle: 'dashed',
                    padding: 24,
                    backgroundColor: Colors.primaryLight,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                }}
                onPress={onPress}
                onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
                onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
                activeOpacity={1}
            >
                <View style={{
                    width: 52, height: 52, borderRadius: 16,
                    backgroundColor: Colors.primary,
                    alignItems: 'center', justifyContent: 'center',
                    ...Shadows.violet,
                }}>
                    <Ionicons name="add" size={28} color={Colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 10, fontFamily: 'PlusJakartaSans-Bold',
                        color: Colors.primary, letterSpacing: 0.5,
                        marginBottom: 4, textTransform: 'uppercase',
                    }}>
                        Post a Job
                    </Text>
                    <Text style={[Typography.h3, { fontSize: 18, color: Colors.ink }]}>
                        What do you need done?
                    </Text>
                    <Text style={[Typography.bodySmall, { fontSize: 12, marginTop: 4 }]}>
                        Post a request and let Loom find the right professional
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
            </TouchableOpacity>
        </Animated.View>
    );
}
