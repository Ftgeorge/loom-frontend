import BackButton from '@/components/ui/BackButton';
import { OauthButton, PrimaryButton } from '@/components/ui/Buttons';
import { AppTextInput, PasswordInput, PhoneInput } from '@/components/ui/TextInputs';
import { useAppStore } from '@/store';
import { SignUpSchema, mapZodErrors } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

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
            <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 32, paddingTop: 80 }} keyboardShouldPersistTaps="handled">
                <BackButton onPress={() => router.back()} />
                <Animated.View entering={FadeInDown.delay(100)} className="mb-10">
                    <Text className="text-3xl font-extrabold text-graphite tracking-tight">Create Account</Text>
                    <Text className="text-base text-muted leading-relaxed mt-2">
                        {user?.role === 'artisan'
                            ? 'Join as an artisan and start getting jobs'
                            : 'Find trusted artisans near you'}
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
                        className="bg-graphite"
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300)}>
                    <View className="flex flex-row items-center gap-4 px-2 my-6">
                        <View className="flex-1 h-[1px] bg-gray-50" />
                        <Text className="text-xs text-muted font-semibold tracking-widest uppercase">Or</Text>
                        <View className="flex-1 h-[1px] bg-gray-50" />
                    </View>

                    <OauthButton
                        title="Continue with Google"
                        onPress={() => { }}
                        className="border-gray-100"
                        textStyle={{ color: '#2C2C2C' }} // Graphite text color
                        image={require("../../assets/images/google-icon.jpeg")}
                    />

                    <View className='flex flex-row items-center justify-center mt-12 gap-2'>
                        <Text className="text-base text-muted">
                            Already have an account?
                        </Text>
                        <TouchableOpacity
                            className="items-center"
                            onPress={() => router.push('/(auth)/sign-in')}
                        >
                            <Text className="text-graphite font-bold text-base">Sign In</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity className="items-center mt-8">
                        <Text className="text-xs text-gray-400 text-center leading-[20px]">
                            By signing up, you agree to our{' '}
                            <Text className="text-graphite font-bold">Terms of Service</Text> and{' '}
                            <Text className="text-graphite font-bold">Privacy Policy</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
