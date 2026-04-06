import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface StatCardProps {
    label: string;
    value: string;
    icon: string;
    delay: number;
    accent?: boolean;
}

export function StatCard({ label, value, icon, delay, accent }: StatCardProps) {
    return (
        <Animated.View
            entering={FadeInUp.delay(delay).springify()}
            className="flex-1"
        >
            <View className={`${
                accent ? "bg-primary border-transparent" : "bg-white border-card-border"
            } rounded-2xl p-5 border shadow-sm`}>
                <View className={`w-10 h-10 rounded-xl items-center justify-center mb-3.5 shadow-sm ${
                    accent ? "bg-white/15" : "bg-background"
                }`}>
                    <Ionicons 
                        name={icon as any} 
                        size={18} 
                        color={accent ? "#FFFFFF" : "#00120C"} 
                    />
                </View>
                <Text className={`text-h1 text-[24px] mb-0.5 font-jakarta-extrabold italic ${
                    accent ? "text-white" : "text-ink"
                }`}>
                    {value}
                </Text>
                <Text className={`text-label text-[9px] tracking-[1.5px] uppercase font-jakarta-bold italic ${
                    accent ? "text-white/60" : "text-muted"
                }`}>
                    {label}
                </Text>
            </View>
        </Animated.View>
    );
}
