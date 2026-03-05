import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { AppTextInput } from '@/components/ui/TextInputs';
import { userApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Typography } from '@/theme';
import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';

const STEPS = ['Location', 'Interests'];

export default function ProfileCompletionScreen() {
    const router = useRouter();
    const { user, signIn } = useAppStore();
    const [activeStep, setActiveStep] = useState(0);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [area, setArea] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleInterest = (id: string) => {
        setSelectedInterests((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        if (!city || !state || !area) {
            Alert.alert('Required Fields', 'Please tell us where you are located.');
            return;
        }

        setLoading(true);
        try {
            // In a real app, we might save selectedInterests too. 
            // For now we'll save the location as it's the core requirement.
            await userApi.updateProfile({
                city,
                state,
                area,
                // We could extend the backend to support interests array if needed
            });

            // Re-sign in to update local user state
            if (user) {
                signIn(user.role as any, {
                    ...user,
                    location: { city, state, area }
                });
            }

            if (user?.role === 'artisan') {
                router.replace('/artisan-onboarding');
            } else {
                router.replace('/(tabs)/home');
            }
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (activeStep === 0) {
            if (!city || !state || !area) {
                Alert.alert('Required Fields', 'Please tell us where you are located.');
                return;
            }
            setActiveStep(1);
        } else {
            handleComplete();
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader
                title="Profile Setup"
                showBack={activeStep > 0}
                onBack={() => setActiveStep(0)}
            />

            {/* Progress Indicator */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 16, gap: 8, marginHorizontal: 32 }}>
                {STEPS.map((s, i) => (
                    <View key={s} style={{ flex: 1, gap: 4 }}>
                        <View style={{
                            height: 3,
                            borderRadius: 2,
                            backgroundColor: i <= activeStep ? Colors.primary : Colors.cardBorder
                        }} />
                        <Text style={[Typography.label, {
                            fontSize: 9,
                            color: i === activeStep ? Colors.primary : Colors.muted,
                            fontWeight: i === activeStep ? '700' : '500'
                        }]}>
                            {s}
                        </Text>
                    </View>
                ))}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
                {activeStep === 0 && (
                    <Animated.View entering={FadeInRight} style={{ padding: 32 }}>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8 }}>
                            Where are you based?
                        </Text>
                        <Text style={{ fontSize: 16, color: Colors.textSecondary, lineHeight: 24, marginBottom: 32 }}>
                            This helps us show you artisans in your neighborhood.
                        </Text>

                        <TouchableOpacity
                            style={{
                                height: 120,
                                borderRadius: 24,
                                backgroundColor: Colors.surface,
                                borderWidth: 1,
                                borderColor: Colors.cardBorder,
                                borderStyle: 'dashed',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 32
                            }}
                        >
                            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                                <Ionicons name="camera" size={24} color={Colors.primary} />
                            </View>
                            <Text style={{ fontWeight: '600', color: Colors.textSecondary, fontSize: 13 }}>Add Photo</Text>
                        </TouchableOpacity>

                        <AppTextInput
                            label="State"
                            placeholder="e.g. Lagos"
                            value={state}
                            onChangeText={setState}
                        />
                        <AppTextInput
                            label="City"
                            placeholder="e.g. Ikeja"
                            value={city}
                            onChangeText={setCity}
                        />
                        <AppTextInput
                            label="Area / Neighborhood"
                            placeholder="e.g. Opebi"
                            value={area}
                            onChangeText={setArea}
                        />

                        <PrimaryButton
                            title="Continue"
                            onPress={nextStep}
                            style={{ marginTop: 24 }}
                        />
                    </Animated.View>
                )}

                {activeStep === 1 && (
                    <Animated.View entering={FadeInRight} style={{ padding: 32 }}>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8 }}>
                            What services do you need?
                        </Text>
                        <Text style={{ fontSize: 16, color: Colors.textSecondary, lineHeight: 24, marginBottom: 32 }}>
                            We'll customize your home feed based on your interests.
                        </Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {CATEGORIES.map((cat) => (
                                <View key={cat.id} style={{ marginBottom: 4 }}>
                                    <Chip
                                        label={cat.label}
                                        selected={selectedInterests.includes(cat.id)}
                                        onPress={() => toggleInterest(cat.id)}
                                    />
                                </View>
                            ))}
                        </View>

                        <PrimaryButton
                            title="Complete Setup"
                            onPress={nextStep}
                            loading={loading}
                            style={{ marginTop: 40 }}
                            disabled={selectedInterests.length === 0}
                        />

                        <TouchableOpacity
                            onPress={handleComplete}
                            style={{ alignItems: 'center', marginTop: 16, padding: 8 }}
                        >
                            <Text style={{ color: Colors.muted, fontWeight: '600' }}>Skip for now</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
