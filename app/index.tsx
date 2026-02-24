import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function SplashScreen() {
    const router = useRouter();
    const { isAuthenticated, hasCompletedOnboarding, user } = useAppStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated) {
                router.replace(user?.role === 'artisan' ? '/(tabs)/dashboard' : '/(tabs)/home');
            } else if (hasCompletedOnboarding) {
                router.replace('/role-selection');
            } else {
                router.replace('/onboarding');
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-primary items-center justify-center">
            <View className="items-center">
                <View className="w-[100px] h-[100px] rounded-[50px] bg-primary/10 items-center justify-center mb-10">
                    <Text className="text-5xl font-extrabold text-primary">O</Text>
                </View>
                <Text className="text-4xl font-bold text-white tracking-[2px]">Operis</Text>
                <Text className="text-base text-primary/60 mt-2">Find Trusted Artisans Near You</Text>
            </View>
            <ActivityIndicator color={Colors.primaryLight} size="large" className="absolute bottom-20" />
        </View>
    );
}
