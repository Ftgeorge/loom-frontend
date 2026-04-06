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
    className?: string;
}

export function PostJobCTA({ onPress, className = '' }: PostJobCTAProps) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <Animated.View style={animatedStyle} className={`mb-10 ${className}`}>
            <TouchableOpacity
                className="bg-primary-light border-[1.5px] border-primary/40 border-dashed rounded-sm p-6 flex-row items-center gap-4"
                onPress={onPress}
                onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
                onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
                activeOpacity={1}
            >
                <View className="w-[52px] h-[52px] rounded-md bg-primary items-center justify-center shadow-violet">
                    <Ionicons name="add" size={28} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-[10px] font-jakarta-bold text-primary tracking-[0.5px] mb-1 uppercase">
                        Post a Job
                    </Text>
                    <Text className="text-h3 text-[18px] text-ink">
                        What do you need done?
                    </Text>
                    <Text className="text-body-sm text-[12px] mt-1">
                        Post a request and let Loom find the right artisans
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} className="text-primary" />
            </TouchableOpacity>
        </Animated.View>
    );
}

