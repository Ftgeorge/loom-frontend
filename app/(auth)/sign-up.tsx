import BackButton from '@/components/ui/BackButton';
import { PrimaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { AppTextInput, PasswordInput, PhoneInput } from '@/components/ui/TextInputs';
import { authApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Typography } from '@/theme';
import { SignUpSchema, mapZodErrors } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SignUpScreen() {
    const router = useRouter();
    const { user, signIn } = useAppStore();
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        const result = SignUpSchema.safeParse(form);
        if (!result.success) {
            setErrors(mapZodErrors(result.error));
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            await authApi.register({
                email: form.email || `${form.phone}@loom.ng`,
                password: form.password,
                role: (user?.role as any) ?? 'customer',
                name: form.name,
                phone: form.phone,
            });

            // Log in immediately to get a token so we can call /auth/request-otp
            const loginRes = await authApi.login({
                email: form.email || `${form.phone}@loom.ng`,
                password: form.password,
            });

            signIn(
                (loginRes.user.role as any) ?? 'client',
                {
                    id: loginRes.user.id,
                    email: loginRes.user.email,
                    name: form.name,
                    phone: form.phone,
                },
                loginRes.token
            );

            // Navigate to OTP verification
            router.push({ pathname: '/(auth)/otp', params: { email: form.email } });
        } catch (err: any) {
            Alert.alert('Sign Up Failed', err.message ?? 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4 }}>
                <LoomThread variant="dense" scale={1.2} animated />
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 32, paddingTop: 80 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <BackButton onPress={() => router.back()} />

                <Animated.View entering={FadeInDown.delay(100)} style={{ marginBottom: 32, marginTop: 24 }}>
                    <Text style={Typography.h1}>Create Account</Text>
                    <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8 }]}>
                        {user?.role === 'artisan'
                            ? 'Join as an artisan and start getting jobs.'
                            : 'Find trusted artisans near you.'}
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)}>
                    <AppTextInput
                        label="Full Name"
                        placeholder="e.g. Chinedu Okafor"
                        value={form.name}
                        onChangeText={(name) => setForm({ ...form, name })}
                        error={errors.name}
                        autoCapitalize="words"
                    />
                    <PhoneInput
                        label="Phone Number"
                        placeholder="8012345678"
                        value={form.phone}
                        onChangeText={(phone) => setForm({ ...form, phone })}
                        error={errors.phone}
                    />
                    <AppTextInput
                        label="Email"
                        placeholder="chinedu@email.com"
                        value={form.email}
                        onChangeText={(email) => setForm({ ...form, email })}
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="At least 6 characters"
                        value={form.password}
                        onChangeText={(password) => setForm({ ...form, password })}
                        error={errors.password}
                    />

                    <PrimaryButton
                        title="Create Account"
                        onPress={handleSignUp}
                        loading={loading}
                        style={{ marginTop: 24 }}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40, gap: 6 }}>
                        <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                            Already have an account?
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                            <Text style={[Typography.body, { color: Colors.primary, fontWeight: '700' }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 32, paddingBottom: 40 }}>
                        <Text style={[Typography.bodySmall, { textAlign: 'center', fontSize: 11, lineHeight: 18 }]}>
                            By signing up, you agree to our{' '}
                            <Text style={{ color: Colors.primary, fontWeight: '600' }}>Terms of Service</Text> and{' '}
                            <Text style={{ color: Colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
