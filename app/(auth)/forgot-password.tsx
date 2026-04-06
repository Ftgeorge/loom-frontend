import BackButton from '@/components/ui/BackButton';
import { PrimaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { AppTextInput } from '@/components/ui/TextInputs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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
            <View className="flex-1 bg-background">
                <View className="absolute inset-0 opacity-40">
                    <LoomThread variant="minimal" scale={1.2} animated />
                </View>
                <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ padding: 32, paddingTop: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View entering={FadeInDown.delay(100).springify()} className="items-center">
                        <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-8 border border-primary/20 shadow-sm">
                            <Ionicons name="mail-unread-outline" size={44} color="#00120C" />
                        </View>
                        <Text className="text-h1 text-[42px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter text-center">
                            TRANSMISSION{"\n"}SUCCESS
                        </Text>
                        <Text className="text-body text-ink/70 mt-6 mb-12 leading-[24px] font-jakarta-medium text-center max-w-[300px]">
                            We've transmitted a recovery protocol link to your terminal. Check your communications to reset your secret key.
                        </Text>
                        <PrimaryButton
                            title="ACCESS SIGN IN"
                            onPress={() => router.back()}
                            className="h-16 w-full rounded-xl shadow-xl border border-primary/20"
                        />
                    </Animated.View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0 opacity-40">
                <LoomThread variant="minimal" scale={1.2} animated />
            </View>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 32, paddingTop: 80 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <BackButton onPress={() => router.back()} />

                <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-14 mt-10 px-1">
                    <Text className="text-label text-primary mb-3 tracking-[2px] uppercase font-jakarta-extrabold italic">PROTOCOL RECOVERY</Text>
                    <Text className="text-h1 text-[42px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter">
                        FORGOT{"\n"}SECRET KEY?
                    </Text>
                    <Text className="text-body text-ink/70 mt-5 leading-[24px] font-jakarta-medium max-w-[280px]">
                        Initialize your identity via phone number to receive a secure restoration link.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <AppTextInput
                        label="VERIFIED PHONE NUMBER"
                        placeholder="+234 801 234 5678"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        className="h-16 rounded-[20px]"
                    />

                    <PrimaryButton
                        title="TRANSMIT RECOVERY LINK"
                        onPress={handleSend}
                        loading={loading}
                        disabled={!phone}
                        className="mt-10 h-16 rounded-xl shadow-2xl border border-primary/20"
                    />
                    
                    <View className="mt-12 items-center flex-row justify-center gap-2 opacity-30">
                        <Ionicons name="shield-checkmark" size={12} color="#64748B" />
                        <Text className="text-[8px] text-muted uppercase tracking-[2px] font-jakarta-bold">Encryption Active • Stable v1.0</Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

