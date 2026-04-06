import BackButton from '@/components/ui/BackButton';
import { PrimaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { AppTextInput, PasswordInput, PhoneInput } from '@/components/ui/TextInputs';
import { authApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Typography } from '@/theme';
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

            const loginRes = await authApi.login({
                email: form.email || `${form.phone}@loom.ng`,
                password: form.password,
            });

            const role = loginRes.user.role === 'customer' ? 'client' : loginRes.user.role;
            signIn(
                role as any,
                {
                    id: loginRes.user.id,
                    email: loginRes.user.email,
                    name: form.name,
                    phone: form.phone,
                },
                loginRes.token
            );

            router.push({ pathname: '/(auth)/otp', params: { email: form.email } });
        } catch (err: any) {
            Alert.alert('Registration Failed', err.message || 'Could not create your account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <LoomThread variant="dense" scale={1.2} animated opacity={0.2} />

            <ScrollView
                contentContainerStyle={{ padding: 32, paddingTop: 80 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <BackButton onPress={() => router.back()} />

                <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 40, marginTop: 32 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>JOIN US</Text>
                            <Text style={[Typography.h1, { fontSize: 32 }]}>Log in</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/role-selection')}
                            style={{
                                backgroundColor: user?.role === 'artisan' ? '#7C472720' : Colors.primaryLight,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: Radius.xs,
                                borderWidth: 1,
                                borderColor: user?.role === 'artisan' ? '#7C4727' : Colors.primary,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={[Typography.label, { color: user?.role === 'artisan' ? '#7C4727' : Colors.primary, fontSize: 8 }]}>
                                {user?.role === 'artisan' ? 'AS ARTISAN' : 'AS CLIENT'}
                            </Text>
                            <Text style={{ fontSize: 8, color: Colors.muted, marginTop: 2, fontWeight: '700' }}>CHANGE</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 12, lineHeight: 22 }]}>
                        {user?.role === 'artisan'
                            ? 'Join the artisans and start earning.'
                            : 'Get your profile set to find artisan.'}
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <AppTextInput
                        label="NAME"
                        placeholder="e.g. Chinedu Okafor"
                        value={form.name}
                        onChangeText={(name) => setForm({ ...form, name })}
                        error={errors.name}
                        autoCapitalize="words"
                        containerStyle={{ borderRadius: Radius.xs }}
                    />
                    <PhoneInput
                        label="PHONE"
                        placeholder="8012345678"
                        value={form.phone}
                        onChangeText={(phone) => setForm({ ...form, phone })}
                        error={errors.phone}
                        containerStyle={{ borderRadius: Radius.xs }}
                    />
                    <AppTextInput
                        label="EMAIL"
                        placeholder="chinedu@email.com"
                        value={form.email}
                        onChangeText={(email) => setForm({ ...form, email })}
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        containerStyle={{ borderRadius: Radius.xs }}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChangeText={(password) => setForm({ ...form, password })}
                        error={errors.password}
                        containerStyle={{ borderRadius: Radius.xs }}
                    />

                    <PrimaryButton
                        title="GO"
                        onPress={handleSignUp}
                        loading={loading}
                        style={{ marginTop: 32, height: 60 }}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 48,
                        padding: 16,
                        backgroundColor: Colors.white,
                        borderRadius: Radius.xs,
                        borderWidth: 1,
                        borderColor: Colors.cardBorder
                    }}>
                        <Text style={[Typography.label, { color: Colors.muted, fontSize: 10, textTransform: 'none' }]}>
                            Have an account?{" "}
                            <Text
                                onPress={() => router.push('/(auth)/sign-in')}
                                style={{ color: Colors.primary, fontWeight: '800' }}
                            >
                                Log In
                            </Text>
                        </Text>
                    </View>

                    <View style={{ marginTop: 32, paddingBottom: 40 }}>
                        <Text style={[Typography.bodySmall, { textAlign: 'center', fontSize: 10, lineHeight: 18, color: Colors.muted }]}>
                            BY JOINING, YOU ACCEPT THE{"\n"}
                            <Text style={{ color: Colors.primary, fontWeight: '700' }}>THE RULES</Text> AND <Text style={{ color: Colors.primary, fontWeight: '700' }}>YOUR DATA</Text>
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
