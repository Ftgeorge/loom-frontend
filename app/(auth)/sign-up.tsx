import BackButton from '@/components/ui/BackButton';
import { PrimaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { AppTextInput, PasswordInput, PhoneInput } from '@/components/ui/TextInputs';
import { authApi } from '@/services/api';
import { useAppStore } from '@/store';
import { SignUpSchema, mapZodErrors } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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

    const isArtisan = user?.role === 'artisan';

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View className="absolute inset-0">
                <LoomThread variant="dense" scale={1.2} animated opacity={0.2} />
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 32, paddingTop: 80 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <BackButton onPress={() => router.back()} />

                <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-12 mt-10 px-1">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-label text-primary mb-3 tracking-[2px] uppercase font-jakarta-extrabold italic">JOIN THE ECOSYSTEM</Text>
                            <Text className="text-h1 text-[42px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter">
                                CREATE{"\n"}IDENTITY
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/role-selection')}
                            className={`px-4 py-2.5 rounded-xl border-[1.5px] items-center shadow-sm ${
                                isArtisan ? 'bg-accent/10 border-accent' : 'bg-primary/10 border-primary'
                            }`}
                        >
                            <Text className={`text-label text-[9px] uppercase font-jakarta-extrabold italic ${
                                isArtisan ? 'text-accent' : 'text-primary'
                            }`}>
                                {isArtisan ? 'AS ARTISAN' : 'AS CLIENT'}
                            </Text>
                            <View className="flex-row items-center gap-1 mt-0.5">
                                <Ionicons name="swap-horizontal" size={10} color="#64748B" />
                                <Text className="text-[8px] color-muted font-jakarta-bold uppercase tracking-tighter">SWITCH</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text className="text-body text-ink/70 mt-6 leading-[24px] font-jakarta-medium max-w-[280px]">
                        {isArtisan
                            ? 'Initiate your professional profile and begin operational deployment.'
                            : 'Set up your client terminal to discover top-tier artisans.'}
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <View className="gap-5">
                        <AppTextInput
                            label="FULL OPERATIVE NAME"
                            placeholder="e.g. Chinedu Okafor"
                            value={form.name}
                            onChangeText={(name) => setForm({ ...form, name })}
                            error={errors.name}
                            autoCapitalize="words"
                            className="h-16 rounded-[20px]"
                        />
                        <PhoneInput
                            label="MISSION PHONE"
                            placeholder="8012345678"
                            value={form.phone}
                            onChangeText={(phone) => setForm({ ...form, phone })}
                            error={errors.phone}
                            className="h-16 rounded-[20px]"
                        />
                        <AppTextInput
                            label="EMAIL FREQUENCY"
                            placeholder="chinedu@loom.network"
                            value={form.email}
                            onChangeText={(email) => setForm({ ...form, email })}
                            error={errors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="h-16 rounded-[20px]"
                        />
                        <PasswordInput
                            label="SECRET KEY"
                            placeholder="••••••••••••"
                            value={form.password}
                            onChangeText={(password) => setForm({ ...form, password })}
                            error={errors.password}
                            className="h-16 rounded-[20px]"
                        />
                    </View>

                    <PrimaryButton
                        title="INITIALIZE PROFILE"
                        onPress={handleSignUp}
                        loading={loading}
                        className="mt-10 h-16 rounded-xl shadow-2xl border border-primary/20"
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <View className="mt-12 p-6 bg-white rounded-[28px] border-[1.5px] border-card-border shadow-md flex-row items-center justify-center gap-3">
                        <Ionicons name="log-in-outline" size={18} color="#64748B" />
                        <Text className="text-label text-muted text-[11px] uppercase font-jakarta-bold tracking-tight">
                            Identity verified?{" "}
                            <Text
                                onPress={() => router.push('/(auth)/sign-in')}
                                className="text-primary font-jakarta-extrabold italic"
                            >
                                ACCESS TERMINAL
                            </Text>
                        </Text>
                    </View>

                    <View className="mt-10 pb-10 items-center">
                        <Text className="text-[9px] text-muted text-center uppercase tracking-widest leading-4 font-jakarta-bold opacity-60">
                            BY INITIALIZING, YOU ACCEDE TO OUR{"\n"}
                            <Text className="text-primary font-jakarta-extrabold italic">SECURITY PROTOCOLS</Text> AND <Text className="text-primary font-jakarta-extrabold italic">DATA DIRECTIVES</Text>
                        </Text>
                        
                        <View className="mt-8 items-center flex-row justify-center gap-2 opacity-30">
                            <Ionicons name="shield-checkmark" size={12} color="#64748B" />
                            <Text className="text-[8px] text-muted uppercase tracking-[2px] font-jakarta-bold">Encryption Active • Stable v1.0</Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

