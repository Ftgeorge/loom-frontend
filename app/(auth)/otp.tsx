import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { OTPInput } from '@/components/ui/OTPInput';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function OTPScreen() {
    const router = useRouter();
    const { signIn, user } = useAppStore();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async () => {
        if (code.length < 6) {
            setError('Enter all 6 digits');
            return;
        }
        setError('');
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        signIn(user?.role ?? 'client');
        setLoading(false);
        router.replace(user?.role === 'artisan' ? '/(tabs)/dashboard' : '/(tabs)/home');
    };

    const handleResend = async () => {
        setError('');
        // Mock resend
        await new Promise((r) => setTimeout(r, 500));
    };

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 32, paddingTop: 100, alignItems: 'center' }}>
            <Animated.View entering={FadeInDown.delay(100)} className="mb-10 items-center">
                <Text className="text-[28px] font-extrabold text-graphite tracking-tight">Verify Your Number</Text>
                <Text className="text-base text-muted leading-relaxed mt-2 text-center">Enter the 6-digit code sent to your phone</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} className="w-full">
                <OTPInput onComplete={setCode} error={error} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)} className="w-full">
                <PrimaryButton
                    title="Verify"
                    onPress={handleVerify}
                    loading={loading}
                    style={{ marginTop: 40, width: '100%' }}
                    className="bg-graphite"
                />

                <SecondaryButton
                    title="Resend Code"
                    onPress={handleResend}
                    style={{ marginTop: 24, width: '100%', borderColor: Colors.graphite }}
                    textStyle={{ color: Colors.graphite }}
                />

                <Text className="text-xs text-gray-400 mt-10 text-center">
                    For demo, enter any 6 digits to proceed.
                </Text>
            </Animated.View>
        </ScrollView>
    );
}
