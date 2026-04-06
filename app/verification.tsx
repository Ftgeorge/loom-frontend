import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { AppTextInput } from '@/components/ui/TextInputs';
import { artisanApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

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
            Alert.alert('Error', 'Please fill in all required fields.');
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
            Alert.alert('Error', err.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <View className="flex-1 bg-background justify-center items-center">
            <ActivityIndicator size="large" color="#078365" />
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <AppHeader
                title={isFromOnboarding ? "Final Step" : "Verification"}
                showBack={!isFromOnboarding}
                onBack={() => router.back()}
                showNotification={false}
            />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {isFromOnboarding && !verification && (
                    <Animated.View entering={FadeInUp.delay(200).springify()}>
                        <Card className="bg-primary mb-8 p-5">
                            <View className="flex-row gap-4 items-center">
                                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                                    <Ionicons name="sparkles" size={20} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-h3 text-white text-base">Welcome to Loom! 🎊</Text>
                                    <Text className="text-body-sm text-white/90 mt-1">
                                        You&apos;re almost there. Verify your identity now to unlock all features and start earning.
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                onPress={() => router.replace('/(tabs)/dashboard')}
                                className="mt-4 self-end p-2"
                            >
                                <Text className="text-label text-white text-[10px] underline">I&apos;LL DO THIS LATER</Text>
                            </TouchableOpacity>
                        </Card>
                    </Animated.View>
                )}
                {verification ? (
                    <Animated.View entering={FadeInUp.springify()}>
                        <Card className="p-6 items-center">
                            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                                verification.status === 'approved' ? 'bg-success/20' : verification.status === 'rejected' ? 'bg-error/20' : 'bg-warning/20'
                            }`}>
                                <Ionicons
                                    name={verification.status === 'approved' ? 'checkmark-circle' : verification.status === 'rejected' ? 'close-circle' : 'time-outline'}
                                    size={32}
                                    color={verification.status === 'approved' ? '#22C55E' : verification.status === 'rejected' ? '#EF4444' : '#F59E0B'}
                                />
                            </View>
                            <Text className="text-h2 text-center uppercase tracking-widest font-jakarta-extrabold">
                                {verification.status}
                            </Text>
                            <Text className="text-body-sm text-center text-muted mt-2 normal-case leading-5">
                                {verification.status === 'pending'
                                    ? 'Our team is currently reviewing your documents. This usually takes 24-48 hours.'
                                    : verification.status === 'approved'
                                        ? 'Your profile is now verified! Clients can see your badge.'
                                        : `Verification rejected: ${verification.rejection_reason || 'Please try again with clear documents.'}`}
                            </Text>

                            {(verification.status === 'rejected' || verification.status === 'approved') && (
                                <PrimaryButton
                                    title={verification.status === 'approved' ? "CONTINUE TO DASHBOARD" : "RETRY VERIFICATION"}
                                    onPress={() => {
                                        if (verification.status === 'approved') {
                                            router.replace('/(tabs)/dashboard');
                                        } else {
                                            setVerification(null);
                                        }
                                    }}
                                    className="mt-6 w-full"
                                />
                            )}
                        </Card>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInUp.springify()}>
                        <Text className="text-h3 mb-2 uppercase">Select Document Type</Text>
                        <View className="flex-row gap-[10px] mb-6">
                            {['nin', 'bvn', 'voter_id'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => setDocType(type)}
                                    className={`flex-1 py-3 rounded-xs border-[1.5px] items-center ${
                                        docType === type ? 'border-primary bg-primary/10' : 'border-card-border bg-white'
                                    }`}
                                >
                                    <Text className={`text-[12px] font-jakarta-bold uppercase ${
                                        docType === type ? 'text-primary' : 'text-muted'
                                    }`}>{type.replace('_', ' ')}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <AppTextInput
                            label="DOCUMENT NUMBER"
                            placeholder="Enter your card number"
                            value={docNumber}
                            onChangeText={setDocNumber}
                        />

                        <View className="mt-6">
                            <Text className="text-h3 mb-3 uppercase">Upload Document Image</Text>
                            <TouchableOpacity className="h-40 rounded-md border-2 border-dashed border-card-border items-center justify-center bg-white shadow-xs">
                                <Ionicons name="cloud-upload-outline" size={40} color="#94A3B8" />
                                <Text className="text-muted mt-3 normal-case">Tap to capture or upload</Text>
                            </TouchableOpacity>
                        </View>

                        <PrimaryButton
                            title="SUBMIT FOR REVIEW"
                            onPress={handleSubmit}
                            loading={submitting}
                            className="mt-10 h-15 rounded-sm shadow-md"
                        />
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}

