import BackButton from '@/components/ui/BackButton';
import { PrimaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { AppTextInput } from '@/components/ui/TextInputs';
import { Colors, Typography } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

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

    const containerStyle = { flex: 1, backgroundColor: Colors.background };
    const contentStyle = { padding: 32, paddingTop: 80 };

    if (sent) {
        return (
            <View style={containerStyle}>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4 }}>
                    <LoomThread variant="minimal" scale={1.2} animated />
                </View>
                <ScrollView contentContainerStyle={contentStyle}>
                    <Animated.View entering={FadeInDown.delay(100)}>
                        <Text style={Typography.h1}>Check Your Phone</Text>
                        <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8, marginBottom: 40 }]}>
                            We've sent a password reset link to your phone number. Follow the link to reset your password.
                        </Text>
                        <PrimaryButton
                            title="Back to Sign In"
                            onPress={() => router.back()}
                        />
                    </Animated.View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={containerStyle}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4 }}>
                <LoomThread variant="minimal" scale={1.2} animated />
            </View>
            <ScrollView
                contentContainerStyle={contentStyle}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <BackButton onPress={() => router.back()} />

                <Animated.View entering={FadeInDown.delay(100)} style={{ marginBottom: 40, marginTop: 24 }}>
                    <Text style={Typography.h1}>Forgot Password?</Text>
                    <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8 }]}>
                        Enter your phone number and we'll send you a link to reset your password.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)}>
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
                </Animated.View>
            </ScrollView>
        </View>
    );
}
