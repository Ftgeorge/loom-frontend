import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { OTPInput } from '@/components/ui/OTPInput';
import { useAppStore } from '@/store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

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
            <View className="mb-10 items-center">
                <Text className="text-[28px] font-bold text-primary">Verify Your Number</Text>
                <Text className="text-base text-gray-500 mt-2 text-center">Enter the 6-digit code sent to your phone</Text>
            </View>

            <OTPInput onComplete={setCode} error={error} />

            <PrimaryButton
                title="Verify"
                onPress={handleVerify}
                loading={loading}
                style={{ marginTop: 40, width: '100%' }}
            />

            <SecondaryButton
                title="Resend Code"
                onPress={handleResend}
                style={{ marginTop: 24, width: '100%' }}
            />

            <Text className="text-xs text-gray-400 mt-10 text-center">
                For demo, enter any 6 digits to proceed.
            </Text>
        </ScrollView>
    );
}
