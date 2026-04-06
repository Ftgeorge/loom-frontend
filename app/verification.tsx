import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { AppTextInput } from '@/components/ui/TextInputs';
import { artisanApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LoomThread } from '@/components/ui/LoomThread';

export default function VerificationScreen() {
    const router = useRouter();
    const { from } = useLocalSearchParams<{ from?: string }>();
    const isFromOnboarding = from === 'onboarding';

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [verification, setVerification] = useState<any>(null);

    const [docType, setDocType] = useState('nin');
    const [docNumber, setDocNumber] = useState('');

    const loadStatus = async () => {
        try {
            const data = await artisanApi.getVerification();
            setVerification(data);
        } catch (err) {
            // Expected if no verification exists
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadStatus(); }, []);

    const handleSubmit = async () => {
        if (!docType || !docNumber) {
            Alert.alert('Protocol Error', 'Please fill in all required operational fields.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await artisanApi.submitVerification({
                documentType: docType,
                documentNumber: docNumber,
                documentUrl: 'https://loom-assets.s3.amazonaws.com/verifications/pending-id.jpg'
            });
            setVerification(res);
            Alert.alert(
                'Submission Successful', 
                'Your verification documents have been received and are now under review. You will be notified once they are approved.',
                [{ text: 'Continue to Dashboard', onPress: () => router.replace('/(tabs)/dashboard') }]
            );
        } catch (err: any) {
            Alert.alert('Transmission Error', err.message || 'Submission failed. Re-initiating backup protocols...');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <View className="flex-1 bg-background justify-center items-center">
            <LoomThread variant="minimal" animated opacity={0.3} scale={1.5} />
            <ActivityIndicator size="large" color="#00120C" />
            <Text className="text-label text-ink/40 mt-6 uppercase tracking-[5px] font-jakarta-extrabold italic">SYNCING IDENTITY HUB...</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
            </View>
            <AppHeader
                title={isFromOnboarding ? "FINAL AUDIT" : "IDENTITY SCAN"}
                showBack={!isFromOnboarding}
                onBack={() => router.back()}
                showNotification={false}
            />

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 24, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {isFromOnboarding && !verification && (
                    <Animated.View entering={FadeInDown.delay(200).springify()} className="mb-12">
                        <View className="bg-primary rounded-[42px] p-8 shadow-2xl border border-white/10 overflow-hidden">
                            <View className="flex-row gap-5 items-center">
                                <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center border border-white/30 shadow-inner">
                                    <Ionicons name="sparkles" size={28} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[20px] text-white uppercase italic font-jakarta-extrabold tracking-tighter">WELCOME TO LOOM</Text>
                                    <Text className="text-[13px] text-white/80 mt-1 italic font-jakarta-medium leading-5">
                                        Verify your identity to unlock core features and begin operational tasks.
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                onPress={() => router.replace('/(tabs)/dashboard')}
                                className="mt-6 self-end px-4 py-2 bg-white/10 rounded-full border border-white/20 active:bg-white/20"
                            >
                                <Text className="text-label text-white text-[9px] uppercase font-jakarta-extrabold italic tracking-widest">I&apos;LL VERIFY LATER</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

                {verification ? (
                    <Animated.View entering={FadeInUp.springify()} className="mt-10">
                        <View className="p-12 items-center bg-white rounded-[48px] border-[1.5px] border-card-border/50 shadow-3xl">
                            <View className={`w-20 h-20 rounded-[28px] items-center justify-center mb-8 shadow-xl ${
                                verification.status === 'approved' ? 'bg-success/10 border border-success/20' : verification.status === 'rejected' ? 'bg-error/10 border border-error/20' : 'bg-accent/10 border border-accent/20'
                            }`}>
                                <Ionicons
                                    name={verification.status === 'approved' ? 'shield-checkmark' : verification.status === 'rejected' ? 'shield-outline' : 'time-outline'}
                                    size={40}
                                    color={verification.status === 'approved' ? '#1AB26C' : verification.status === 'rejected' ? '#EF4444' : '#00120C'}
                                />
                            </View>
                            <Text className="text-[32px] text-center uppercase italic font-jakarta-extrabold tracking-tighter text-ink">
                                {verification.status}
                            </Text>
                            <Text className="text-[15px] text-center text-ink/60 mt-4 normal-case leading-6 italic font-jakarta-medium">
                                {verification.status === 'pending'
                                    ? 'Our intelligence team is currently reviewing your documents. This protocol usually completes within 24-48 hours.'
                                    : verification.status === 'approved'
                                        ? 'Your identity is verified. Clients can now see your tactical operative badge.'
                                        : `Verification rejected: ${verification.rejection_reason || 'Please re-initiate with clear documents.'}`}
                            </Text>

                            {(verification.status === 'rejected' || verification.status === 'approved') && (
                                <PrimaryButton
                                    title={verification.status === 'approved' ? "ACCESS DASHBOARD" : "RETRY PROTOCOL"}
                                    onPress={() => {
                                        if (verification.status === 'approved') {
                                            router.replace('/(tabs)/dashboard');
                                        } else {
                                            setVerification(null);
                                        }
                                    }}
                                    variant={verification.status === 'approved' ? 'accent' : 'primary'}
                                    className="mt-12 w-full h-18 rounded-3xl shadow-2xl border border-white/10"
                                />
                            )}
                        </View>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInUp.springify()}>
                        <View className="flex-row items-center gap-2 mb-4 px-1">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                            <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">IDENTIFICATION PROTOCOL</Text>
                        </View>
                        <Text className="text-h1 text-[38px] leading-[40px] uppercase italic font-jakarta-extrabold tracking-tighter mb-4 text-ink">SECURE SCAN</Text>
                        <Text className="text-[15px] text-ink/60 mb-10 normal-case font-jakarta-medium italic">Select your primary identification document for system-wide verification.</Text>

                        <View className="flex-row gap-4 mb-10">
                            {['nin', 'bvn', 'voter_id'].map((type) => {
                                const isSelected = docType === type;
                                return (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => setDocType(type)}
                                        activeOpacity={0.8}
                                        className={`flex-1 py-5 rounded-2xl border-[1.5px] items-center shadow-lg transition-transform ${
                                            isSelected ? 'border-primary bg-primary/10 -translate-y-1' : 'border-card-border/50 bg-white'
                                        }`}
                                    >
                                        <Text className={`text-[11px] font-jakarta-extrabold uppercase italic tracking-[2px] ${
                                            isSelected ? 'text-primary' : 'text-ink/40'
                                        }`}>{type.replace('_', ' ')}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <AppTextInput
                            label="FIELD IDENTIFIER (ID NUMBER)"
                            placeholder="OPERATIVE CARD NUMBER"
                            value={docNumber}
                            onChangeText={setDocNumber}
                            className="h-18 rounded-3xl border-card-border/50 shadow-2xl"
                        />

                        <View className="mt-12">
                            <Text className="text-label mb-5 text-primary uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic px-1">DIGITAL ASSET SCAN</Text>
                            <TouchableOpacity activeOpacity={0.9} className="h-56 rounded-[32px] border-2 border-dashed border-card-border/50 items-center justify-center bg-white shadow-3xl active:bg-gray-50 transition-all">
                                <View className="w-16 h-16 rounded-2xl bg-background items-center justify-center border border-card-border/50 shadow-inner mb-4">
                                    <Ionicons name="camera-outline" size={32} color="#00120C" />
                                </View>
                                <Text className="text-ink/40 mt-2 uppercase text-[11px] font-jakarta-extrabold italic tracking-widest">TAP TO CAPTURE ASSET</Text>
                            </TouchableOpacity>
                        </View>

                        <PrimaryButton
                            title="SUBMIT FOR AUDIT"
                            onPress={handleSubmit}
                            loading={submitting}
                            variant="accent"
                            className="mt-16 h-18 rounded-3xl shadow-3xl border border-white/10"
                        />
                        
                        <View className="mt-10 items-center flex-row justify-center gap-2 opacity-20">
                            <Ionicons name="lock-closed" size={12} color="#64748B" />
                            <Text className="text-[8px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">End-to-End Encryption Enabled • Identity Hub v4.2</Text>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
