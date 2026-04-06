import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
} from 'react-native-reanimated';

interface OnlineToggleProps {
    online: boolean;
    onToggle: () => void;
}

export function OnlineToggle({ online, onToggle }: OnlineToggleProps) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const handlePress = () => {
        scale.value = withSequence(
            withSpring(0.92, { damping: 6 }),
            withSpring(1, { damping: 10 })
        );
        onToggle();
    };

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={1}
                className={`flex-row items-center gap-2.5 px-5 py-3 rounded-full border-[1.5px] shadow-sm ${
                    online ? "bg-success/10 border-success/30" : "bg-white border-card-border"
                }`}
            >
                <View className={`w-2.5 h-2.5 rounded-full ${online ? "bg-success shadow-[0_0_8px_rgba(26,178,108,0.6)]" : "bg-muted"}`} />
                <Text className={`text-[12px] font-jakarta-extrabold italic tracking-tight ${online ? "text-success" : "text-muted"}`}>
                    {online ? "CONNECTED" : "OFFLINE"}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}
