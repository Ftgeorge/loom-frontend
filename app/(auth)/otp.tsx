import BackButton from '@/components/ui/BackButton';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { OTPInput } from '@/components/ui/OTPInput';
import { authApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Typography } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function OTPScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email?: string }>();
    const { signIn, user, setEmailVerified } = useAppStore();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendSuccess, setResendSuccess] = useState(false);

    const maskedEmail = email
        ? email.replace(/(.{2}).+(@.+)/, '$1****$2')
        : 'your email';

    const handleVerify = async () => {
        if (code.length < 6) {
            setError('Enter all 6 digits');
            return;
        }
        setError('');
        setLoading(true);

        try {
            await authApi.verifyOtp(code);
            setEmailVerified(true);
            router.replace('/profile-completion');
        } catch (err: any) {
            setError(err.message ?? 'Invalid or expired code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            Alert.alert('Error', 'No email address found. Please go back and try again.');
            return;
        }
        setResendSuccess(false);
        setResendLoading(true);
        setError('');

        try {
            await authApi.requestOtp(email);
            setResendSuccess(true);
        } catch (err: any) {
            const msg = err.message ?? 'Failed to resend code.';
            if (msg.includes('COOLDOWN')) {
                setError('Please wait 60 seconds before requesting a new code.');
            } else {
                setError(msg);
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4 }}>
                <LoomThread variant="minimal" scale={1.2} animated />
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 32, paddingTop: 80 }}
                showsVerticalScrollIndicator={false}
            >
                <BackButton onPress={() => router.back()} />

                <Animated.View entering={FadeInDown.delay(100)} style={{ marginBottom: 48, marginTop: 24, alignItems: 'center' }}>
                    <Text style={Typography.h1}>Verify Email</Text>
                    <Text style={[Typography.body, { textAlign: 'center', marginTop: 12, color: Colors.textSecondary }]}>
                        Enter the 6-digit code we sent to{'\n'}
                        <Text style={{ color: Colors.text, fontWeight: '600' }}>{maskedEmail}</Text>
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)} style={{ width: '100%' }}>
                    <OTPInput onComplete={setCode} error={error} />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300)} style={{ width: '100%', marginTop: 48 }}>
                    <PrimaryButton
                        title="Confirm & Verify"
                        onPress={handleVerify}
                        loading={loading}
                    />

                    <SecondaryButton
                        title={resendLoading ? 'Sending...' : 'Resend Code'}
                        onPress={handleResend}
                        style={{ marginTop: 16 }}
                    />

                    {resendSuccess && (
                        <Text style={[Typography.bodySmall, { textAlign: 'center', marginTop: 12, color: Colors.success }]}>
                            ✓ A new code has been sent to {maskedEmail}
                        </Text>
                    )}

                    <View style={{
                        marginTop: 48,
                        padding: 20,
                        backgroundColor: Colors.surface,
                        borderRadius: Radius.md,
                        borderWidth: 1,
                        borderColor: Colors.cardBorder
                    }}>
                        <Text style={[Typography.bodySmall, { textAlign: 'center', color: Colors.muted }]}>
                            Check your inbox and spam folder. The code expires in{' '}
                            <Text style={{ fontWeight: '600', color: Colors.text }}>10 minutes.</Text>
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}
