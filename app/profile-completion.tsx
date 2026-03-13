import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { userApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { CategoryId, CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { LocationSuggestionInput } from '@/components/ui/LocationSuggestionInput';
import { NIGERIAN_STATES, NIGERIAN_STATISTICS } from '@/utils/locations';
import * as ImagePicker from 'expo-image-picker';

const STEPS = ['Location', 'Interests'];

export default function ProfileCompletionScreen() {
    const router = useRouter();
    const { user, signIn, selectedState } = useAppStore();
    const [activeStep, setActiveStep] = useState(0);
    const [city, setCity] = useState(user?.location?.city || '');
    const [state, setState] = useState(user?.location?.state || selectedState || '');
    const [area, setArea] = useState(user?.location?.area || '');
    const [selectedInterests, setSelectedInterests] = useState<CategoryId[]>(user?.interests || []);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(user?.avatar || null);

    const toggleInterest = (id: CategoryId) => {
        setSelectedInterests((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions to upload a photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleComplete = async () => {
        if (!city || !state || !area) {
            Alert.alert('Required Fields', 'Please tell us where you are located.');
            return;
        }

        setLoading(true);
        try {
            let finalAvatarUrl = undefined;

            if (profileImage) {
                const uploadRes = await userApi.uploadAvatar(profileImage);
                finalAvatarUrl = uploadRes.avatar_url;
            }

            await userApi.updateProfile({
                city,
                state,
                area,
                avatar_url: finalAvatarUrl,
                interests: selectedInterests
            });

            if (user) {
                signIn(user.role as any, {
                    ...user,
                    location: { city, state, area },
                    avatar: finalAvatarUrl || user.avatar,
                    interests: selectedInterests
                });
            }

            if (user?.role === 'artisan') {
                router.replace('/artisan-onboarding');
            } else {
                router.replace('/(tabs)/home');
            }
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not update your profile');
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
            // If artisan, skip the "Interests" step as they'll pick skills in artisan-onboarding
            if (user?.role === 'artisan') {
                handleComplete();
            } else {
                setActiveStep(1);
            }
        } else {
            handleComplete();
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={StyleSheet.absoluteFill}>
                <LoomThread variant="dense" scale={1.2} animated opacity={0.3} />
            </View>
            <AppHeader
                title="Profile Setup"
                showBack={activeStep > 0}
                onBack={() => setActiveStep(0)}
                showNotification={false}
            />

            {/* Progress Indicator */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 16, gap: 8, marginHorizontal: 32 }}>
                {STEPS.filter((_, i) => user?.role !== 'artisan' || i === 0).map((s, i) => (
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
                    <Animated.View entering={FadeInUp.springify()} style={{ padding: 32 }}>
                        <View style={{ alignItems: 'center', marginBottom: 40 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={pickImage}
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderRadius: 70,
                                    backgroundColor: Colors.white,
                                    borderWidth: 1.5,
                                    borderColor: Colors.primary,
                                    borderStyle: profileImage ? 'solid' : 'dashed',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 4,
                                    ...Shadows.md
                                }}
                            >
                                <View style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 70,
                                    backgroundColor: Colors.primaryLight,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {profileImage ? (
                                        <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%' }} />
                                    ) : (
                                        <Ionicons name="person" size={60} color={Colors.primary} />
                                    )}
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 4,
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: Colors.accent,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 3,
                                    borderColor: Colors.white,
                                    ...Shadows.sm
                                }}>
                                    <Ionicons name={profileImage ? "create" : "camera"} size={20} color={Colors.white} />
                                </View>
                            </TouchableOpacity>
                            <Text style={[Typography.h3, { marginTop: 20, fontSize: 20 }]}>
                                {user?.role === 'artisan' ? 'Add Business Photo' : 'Add Profile Photo'}
                            </Text>
                            <Text style={[Typography.bodySmall, { color: Colors.muted, marginTop: 4 }]}>
                                {user?.role === 'artisan' ? 'Show clients who you are' : 'Help people recognize you'}
                            </Text>
                        </View>

                        <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8 }}>
                            {user?.role === 'artisan' ? 'Where are you based?' : 'Where are you based?'}
                        </Text>
                        <Text style={{ fontSize: 16, color: Colors.textSecondary, lineHeight: 24, marginBottom: 32 }}>
                            {user?.role === 'artisan'
                                ? 'This helps clients in your area find and book your services.'
                                : 'This helps us show you pros in your neighborhood.'}
                        </Text>

                        <LocationSuggestionInput
                            label="State"
                            placeholder="e.g. Lagos"
                            value={state}
                            onChangeText={(text) => {
                                setState(text);
                                // Reset city and area if state changes
                                setCity('');
                                setArea('');
                            }}
                            suggestions={NIGERIAN_STATES}
                        />

                        <LocationSuggestionInput
                            label="City"
                            placeholder="e.g. Ikeja"
                            value={city}
                            onChangeText={(text) => {
                                setCity(text);
                                setArea('');
                            }}
                            suggestions={
                                (state && NIGERIAN_STATISTICS[state as keyof typeof NIGERIAN_STATISTICS])
                                    ? NIGERIAN_STATISTICS[state as keyof typeof NIGERIAN_STATISTICS].cities
                                    : []
                            }
                        />

                        <LocationSuggestionInput
                            label="Area / Neighborhood"
                            placeholder="e.g. Opebi"
                            value={area}
                            onChangeText={setArea}
                            suggestions={
                                (state && city && NIGERIAN_STATISTICS[state as keyof typeof NIGERIAN_STATISTICS])
                                    ? NIGERIAN_STATISTICS[state as keyof typeof NIGERIAN_STATISTICS].areas
                                    : []
                            }
                        />

                        <PrimaryButton
                            title="Continue"
                            onPress={nextStep}
                            style={{ marginTop: 24, height: 60, borderRadius: Radius.md }}
                        />
                    </Animated.View>
                )}

                {activeStep === 1 && (
                    <Animated.View entering={FadeInRight} style={{ padding: 32 }}>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8 }}>
                            What services do you need?
                        </Text>
                        <Text style={{ fontSize: 16, color: Colors.textSecondary, lineHeight: 24, marginBottom: 32 }}>
                            We&apos;ll customize your home feed based on your interests.
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
