import { PrimaryButton } from '@/components/ui/Buttons';
import { AppTextInput } from '@/components/ui/TextInputs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!phone) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setSent(true);
        setLoading(false);
    };

    if (sent) {
        return (
            <ScrollView className="flex-1 bg-operis-bg" contentContainerStyle={{ padding: 32, paddingTop: 100 }}>
                <Text className="text-[28px] font-bold text-olive">Check Your Phone</Text>
                <Text className="text-base text-gray-500 mt-2 mb-10">
                    We've sent a password reset link to your phone number. Follow the link to reset your password.
                </Text>
                <PrimaryButton
                    title="Back to Sign In"
                    onPress={() => router.back()}
                    style={{ marginTop: 40 }}
                />
            </ScrollView>
        );
    }

    return (
        <ScrollView className="flex-1 bg-operis-bg" contentContainerStyle={{ padding: 32, paddingTop: 100 }}>
            <Text className="text-[28px] font-bold text-olive">Forgot Password?</Text>
            <Text className="text-base text-gray-500 mt-2 mb-10">
                Enter your phone number and we'll send you a link to reset your password.
            </Text>

            <AppTextInput
                label="Phone Number"
                placeholder="+234 801 234 5678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <PrimaryButton
                title="Send Reset Link"
                onPress={handleSend}
                loading={loading}
                disabled={!phone}
                style={{ marginTop: 24 }}
            />
        </ScrollView>
    );
}
