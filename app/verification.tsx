import { SubAppHeader } from '@/components/AppSubHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { AppTextInput } from '@/components/ui/TextInputs';
import { artisanApi } from '@/services/api';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function VerificationScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [verification, setVerification] = useState<any>(null);

    const [docType, setDocType] = useState('nin');
    const [docNumber, setDocNumber] = useState('');
    const [docUrl, setDocUrl] = useState('https://example.com/mock-id.jpg'); // Placeholder for now

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
                documentUrl: docUrl
            });
            setVerification(res);
            Alert.alert('Success', 'Verification documents submitted for review.');
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
            <SubAppHeader
                label="IDENTITY"
                title="Verification"
                description="Secure your profile and build trust with clients."
                showBack
                onBack={() => router.back()}
            />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
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

                            {verification.status === 'rejected' && (
                                <PrimaryButton
                                    title="RETRY VERIFICATION"
                                    onPress={() => setVerification(null)}
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
                                        borderRadius: Radius.md,
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
                            style={{ marginTop: 40, height: 60, borderRadius: Radius.md, ...Shadows.md }}
                        />
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
