import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { AppTextInput } from '@/components/ui/TextInputs';
import { artisanApi } from '@/services/api';
import { Colors, Radius, Shadows, Typography } from '@/theme';
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
        <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader
                title={isFromOnboarding ? "Final Step" : "Verification"}
                showBack={!isFromOnboarding}
                onBack={() => router.back()}
                showNotification={false}
            />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {isFromOnboarding && !verification && (
                    <Animated.View entering={FadeInUp.delay(200).springify()}>
                        <Card style={{ backgroundColor: Colors.primary, marginBottom: 32, padding: 20 }}>
                            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white + '20', alignItems: 'center', justifyContent: 'center' }}>
                                    <Ionicons name="sparkles" size={20} color={Colors.white} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[Typography.h3, { color: Colors.white, fontSize: 16 }]}>Welcome to Loom! 🎊</Text>
                                    <Text style={[Typography.bodySmall, { color: Colors.white, opacity: 0.9, marginTop: 4 }]}>
                                        You&apos;re almost there. Verify your identity now to unlock all features and start earning.
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                onPress={() => router.replace('/(tabs)/dashboard')}
                                style={{ marginTop: 16, alignSelf: 'flex-end', padding: 8 }}
                            >
                                <Text style={[Typography.label, { color: Colors.white, fontSize: 10, textDecorationLine: 'underline' }]}>I&apos;LL DO THIS LATER</Text>
                            </TouchableOpacity>
                        </Card>
                    </Animated.View>
                )}
                {verification ? (
                    <Animated.View entering={FadeInUp.springify()}>
                        <Card style={{ padding: 24, alignItems: 'center' }}>
                            <View style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                backgroundColor: verification.status === 'approved' ? Colors.success + '20' : verification.status === 'rejected' ? Colors.error + '20' : Colors.warning + '20',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16
                            }}>
                                <Ionicons
                                    name={verification.status === 'approved' ? 'checkmark-circle' : verification.status === 'rejected' ? 'close-circle' : 'time-outline'}
                                    size={32}
                                    color={verification.status === 'approved' ? Colors.success : verification.status === 'rejected' ? Colors.error : Colors.warning}
                                />
                            </View>
                            <Text style={[Typography.h2, { textAlign: 'center' }]}>
                                {verification.status.toUpperCase()}
                            </Text>
                            <Text style={[Typography.bodySmall, { textAlign: 'center', color: Colors.muted, marginTop: 8 }]}>
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
                                    style={{ marginTop: 24, width: '100%' }}
                                />
                            )}
                        </Card>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInUp.springify()}>
                        <Text style={[Typography.h3, { marginBottom: 8 }]}>Select Document Type</Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                            {['nin', 'bvn', 'voter_id'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => setDocType(type)}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        borderRadius: Radius.xs,
                                        borderWidth: 1.5,
                                        borderColor: docType === type ? Colors.primary : Colors.cardBorder,
                                        backgroundColor: docType === type ? Colors.primary + '10' : Colors.white,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 12,
                                        fontFamily: 'PlusJakartaSans-Bold',
                                        color: docType === type ? Colors.primary : Colors.muted
                                    }}>{type.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <AppTextInput
                            label="Document Number"
                            placeholder="Enter your card number"
                            value={docNumber}
                            onChangeText={setDocNumber}
                        />

                        <View style={{ marginTop: 24 }}>
                            <Text style={[Typography.h3, { marginBottom: 12 }]}>Upload Document Image</Text>
                            <TouchableOpacity style={{
                                height: 160,
                                borderRadius: Radius.md,
                                borderWidth: 2,
                                borderStyle: 'dashed',
                                borderColor: Colors.cardBorder,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Colors.white
                            }}>
                                <Ionicons name="cloud-upload-outline" size={40} color={Colors.muted} />
                                <Text style={{ color: Colors.muted, marginTop: 12 }}>Tap to capture or upload</Text>
                            </TouchableOpacity>
                        </View>

                        <PrimaryButton
                            title="SUBMIT FOR REVIEW"
                            onPress={handleSubmit}
                            loading={submitting}
                            style={{ marginTop: 40, height: 60, borderRadius: Radius.sm, ...Shadows.md }}
                        />
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
