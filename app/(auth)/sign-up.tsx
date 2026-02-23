import { PrimaryButton } from '@/components/ui/Buttons';
import { AppTextInput, PasswordInput, PhoneInput } from '@/components/ui/TextInputs';
import { useAppStore } from '@/store';
import { SignUpSchema, mapZodErrors } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
    const router = useRouter();
    const { user } = useAppStore();
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
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        router.push('/(auth)/otp');
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView className="flex-1 bg-operis-bg" contentContainerStyle={{ padding: 32, paddingTop: 80 }} keyboardShouldPersistTaps="handled">
                <View className="mb-10">
                    <Text className="text-3xl font-bold text-olive">Create Account</Text>
                    <Text className="text-base text-gray-500 mt-2">
                        {user?.role === 'artisan'
                            ? 'Join as an artisan and start getting jobs'
                            : 'Find trusted artisans near you'}
                    </Text>
                </View>

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
                    label="Email (optional)"
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

                <TouchableOpacity
                    className="items-center mt-10 p-2"
                    onPress={() => router.push('/(auth)/sign-in')}
                >
                    <Text className="text-base text-gray-500">
                        Already have an account? <Text className="text-olive font-semibold">Sign In</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center mt-6">
                    <Text className="text-xs text-gray-400 text-center leading-[18px]">
                        By signing up, you agree to our{' '}
                        <Text className="text-olive font-semibold">Terms of Service</Text> and{' '}
                        <Text className="text-olive font-semibold">Privacy Policy</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
