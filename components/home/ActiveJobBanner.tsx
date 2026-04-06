import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { JobRequest } from '@/types';

interface ActiveJobBannerProps {
    job: JobRequest;
    onPress: () => void;
    className?: string;
}

export function ActiveJobBanner({ job, onPress, className = '' }: ActiveJobBannerProps) {
    return (
        <Animated.View entering={FadeInDown.delay(200).springify()} className={`mb-8 ${className}`}>
            <TouchableOpacity
                className="bg-primary rounded-md p-5 shadow-brand overflow-hidden"
                onPress={onPress}
                activeOpacity={0.92}
            >
                {/* Decorative */}
                <View className="absolute -right-5 -top-5 opacity-[0.06]">
                    <Ionicons name="shield-checkmark" size={180} color="white" />
                </View>

                <View className="flex-row items-center gap-2 mb-4">
                    <View className="bg-success/30 px-[10px] py-1 rounded-[20px] flex-row items-center gap-1">
                        <View className="w-[6px] h-[6px] rounded-full bg-success" />
                        <Text className="text-[10px] font-jakarta-bold text-success-light">
                            ACTIVE JOB
                        </Text>
                    </View>
                </View>

                <Text className="text-h2 text-white text-[20px]">
                    {CATEGORIES.find(c => c.id === job.category)?.label || 'General Service'}
                </Text>
                <Text className="font-inter text-[13px] text-white/60 mt-1">
                    Tap to track your job progress
                </Text>

                <View className="mt-5">
                    <View className="flex-row justify-between mb-2">
                        <Text className="font-inter text-[11px] text-white/60">Progress</Text>
                        <Text className="font-inter-bold text-[11px] text-success-light">75%</Text>
                    </View>
                    <View className="h-1 bg-white/10 rounded-xs overflow-hidden">
                        <View className="w-[75%] h-full bg-success rounded-xs" />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

