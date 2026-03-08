import { Colors, Radius, Shadows, Typography } from '@/theme';
import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { JobRequest } from '@/types';

interface ActiveJobBannerProps {
    job: JobRequest;
    onPress: () => void;
}

export function ActiveJobBanner({ job, onPress }: ActiveJobBannerProps) {
    return (
        <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginBottom: 32 }}>
            <TouchableOpacity
                style={{
                    backgroundColor: Colors.primary,
                    borderRadius: Radius.xl,
                    padding: 20,
                    ...Shadows.brand,
                    overflow: 'hidden',
                }}
                onPress={onPress}
                activeOpacity={0.92}
            >
                {/* Decorative */}
                <View style={{ position: 'absolute', right: -20, top: -20, opacity: 0.06 }}>
                    <Ionicons name="shield-checkmark" size={180} color={Colors.white} />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <View style={{
                        backgroundColor: Colors.success + '30',
                        paddingHorizontal: 10, paddingVertical: 4,
                        borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4,
                    }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success }} />
                        <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans-Bold', color: Colors.successLight }}>
                            ACTIVE JOB
                        </Text>
                    </View>
                </View>

                <Text style={[Typography.h2, { color: Colors.white, fontSize: 20 }]}>
                    {CATEGORIES.find(c => c.id === job.category)?.label || 'General Service'}
                </Text>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                    Tap to track your job progress
                </Text>

                <View style={{ marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontFamily: 'Inter-Regular', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Progress</Text>
                        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 11, color: Colors.successLight }}>75%</Text>
                    </View>
                    <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                        <View style={{ width: '75%', height: '100%', backgroundColor: Colors.success, borderRadius: 2 }} />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
