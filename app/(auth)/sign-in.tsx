import { PrimaryButton } from '@/components/ui/Buttons';
import { AppTextInput, PasswordInput } from '@/components/ui/TextInputs';
import { useAppStore } from '@/store';
import { SignInSchema, mapZodErrors } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
    const router = useRouter();
    const { signIn, user } = useAppStore();
    const [form, setForm] = useState({ phone: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        const result = SignInSchema.safeParse(form);
        if (!result.success) {
            setErrors(mapZodErrors(result.error));
            return;
        }
        setErrors({});
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        signIn(user?.role ?? 'client');
        setLoading(false);
        router.replace(user?.role === 'artisan' ? '/(tabs)/dashboard' : '/(tabs)/home');
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView className="flex-1 bg-operis-bg" contentContainerStyle={{ padding: 32, paddingTop: 100 }} keyboardShouldPersistTaps="handled">
                <View className="mb-10">
                    <Text className="text-3xl font-bold text-olive">Welcome Back</Text>
                    <Text className="text-base text-gray-500 mt-2">Sign in to continue using Operis</Text>
                </View>

                <AppTextInput
                    label="Phone Number or Email"
                    placeholder="+234 801 234 5678"
                    value={form.phone}
                    onChangeText={(phone) => setForm({ ...form, phone })}
                    error={errors.phone}
                    keyboardType="phone-pad"
                />
                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChangeText={(password) => setForm({ ...form, password })}
                    error={errors.password}
                />

                <TouchableOpacity
                    className="self-end p-2"
                    onPress={() => router.push('/(auth)/forgot-password')}
                >
                    <Text className="text-sm text-accent font-medium">Forgot Password?</Text>
                </TouchableOpacity>

                <PrimaryButton
                    title="Sign In"
                    onPress={handleSignIn}
                    loading={loading}
                    style={{ marginTop: 16 }}
                />

                <TouchableOpacity
                    className="items-center mt-10 p-2"
                    onPress={() => router.push('/(auth)/sign-up')}
                >
                    <Text className="text-base text-gray-500">
                        Don't have an account? <Text className="text-olive font-semibold">Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
