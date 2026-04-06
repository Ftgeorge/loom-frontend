import BackButton from '@/components/ui/BackButton';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { OTPInput } from '@/components/ui/OTPInput';
import { authApi } from '@/services/api';
import { useAppStore } from '@/store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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
        <View className="flex-1 bg-background">
            <View className="absolute inset-0 opacity-40">
                <LoomThread variant="minimal" scale={1.2} animated />
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 32, paddingTop: 80 }}
                showsVerticalScrollIndicator={false}
            >
                <BackButton onPress={() => router.back()} />

                <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-14 mt-10 items-center px-4">
                    <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6 border border-primary/20 shadow-sm">
                        <Ionicons name="mail-open-outline" size={38} color="#00120C" />
                    </View>
                    <Text className="text-h1 text-[42px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter text-center">
                        VERIFY MAIL
                    </Text>
                    <Text className="text-body text-ink/70 mt-5 leading-[24px] font-jakarta-medium text-center">
                        Code transmitted to{'\n'}
                        <Text className="text-primary font-jakarta-extrabold italic">{maskedEmail}</Text>
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} className="w-full">
                    <OTPInput onComplete={setCode} error={error} />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()} className="w-full mt-14">
                    <PrimaryButton
                        title="VERIFY IDENTITY"
                        onPress={handleVerify}
                        loading={loading}
                        className="h-16 rounded-xl shadow-2xl border border-primary/20"
                    />

                    <SecondaryButton
                        title={resendLoading ? 'TRANSMITTING...' : 'RESEND PROTOCOL'}
                        onPress={handleResend}
                        className="mt-5 h-15 rounded-xl border-card-border"
                        textStyle={{ color: '#00120C', fontFamily: 'PlusJakartaSans-Bold', fontSize: 11, letterSpacing: 1 }}
                    />

                    {resendSuccess && (
                        <View className="flex-row items-center justify-center gap-1.5 mt-4">
                            <Ionicons name="checkmark-circle" size={14} color="#1AB26C" />
                            <Text className="text-body-sm text-success text-[11px] font-jakarta-bold uppercase italic">
                                Transmission successful to {maskedEmail}
                            </Text>
                        </View>
                    )}

                    <View className="mt-16 p-7 bg-white rounded-[28px] border-[1.5px] border-card-border shadow-md">
                        <View className="flex-row items-center gap-3 mb-2">
                            <Ionicons name="alert-circle-outline" size={18} color="#64748B" />
                            <Text className="text-label text-muted text-[11px] uppercase font-jakarta-bold tracking-tight">RESILIENCE PROTOCOL</Text>
                        </View>
                        <Text className="text-body-sm text-muted leading-5 font-jakarta-medium normal-case">
                            Check repository spam if missing. Authentication key neutralizes in{' '}
                            <Text className="text-primary font-jakarta-extrabold italic">10 MINUTES.</Text>
                        </Text>
                    </View>
                    
                    <View className="mt-12 items-center flex-row justify-center gap-2 opacity-30">
                        <Ionicons name="shield-checkmark" size={12} color="#64748B" />
                        <Text className="text-[8px] text-muted uppercase tracking-[2px] font-jakarta-bold">Encryption Active • Stable v1.0</Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

