import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { userApi } from '@/services/api';
import { useAppStore } from '@/store';
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
        <View className="flex-1 bg-background">
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
            <View className="flex-row px-6 py-4 gap-2 mx-8">
                {STEPS.filter((_, i) => user?.role !== 'artisan' || i === 0).map((s, i) => (
                    <View key={s} className="flex-1 gap-1">
                        <View className={`h-[3px] rounded-full ${
                            i <= activeStep ? 'bg-primary' : 'bg-card-border'
                        }`} />
                        <Text className={`text-label text-[9px] uppercase ${
                            i === activeStep ? 'text-primary font-jakarta-bold' : 'text-muted font-jakarta-medium'
                        }`}>
                            {s}
                        </Text>
                    </View>
                ))}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
                {activeStep === 0 && (
                    <Animated.View entering={FadeInUp.springify()} className="p-8">
                        <View className="items-center mb-10">
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={pickImage}
                                className={`w-[140px] h-[140px] rounded-full bg-white border-[1.5px] items-center justify-center p-1 shadow-md ${
                                    profileImage ? 'border-primary border-solid' : 'border-primary border-dashed'
                                }`}
                            >
                                <View className="w-full h-full rounded-full bg-primary/5 items-center justify-center overflow-hidden">
                                    {profileImage ? (
                                        <Image source={{ uri: profileImage }} className="w-full h-full" />
                                    ) : (
                                        <Ionicons name="person" size={60} color="#00120C" />
                                    )}
                                </View>
                                <View className="absolute bottom-0 right-1 w-10 h-10 rounded-full bg-accent items-center justify-center border-[3px] border-white shadow-sm">
                                    <Ionicons name={profileImage ? "create" : "camera"} size={20} color="white" />
                                </View>
                            </TouchableOpacity>
                            <Text className="text-h3 mt-5 text-[20px]">
                                {user?.role === 'artisan' ? 'Add Business Photo' : 'Add Profile Photo'}
                            </Text>
                            <Text className="text-body-sm text-muted mt-1">
                                {user?.role === 'artisan' ? 'Show clients who you are' : 'Help people recognize you'}
                            </Text>
                        </View>

                        <Text className="text-[24px] font-jakarta-extrabold text-ink mb-2">
                            {user?.role === 'artisan' ? 'Where are you based?' : 'Where are you based?'}
                        </Text>
                        <Text className="text-base text-ink/70 leading-6 mb-8">
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
                            className="mt-6 h-[60px] rounded-md"
                        />
                    </Animated.View>
                )}

                {activeStep === 1 && (
                    <Animated.View entering={FadeInRight} className="p-8">
                        <Text className="text-[24px] font-jakarta-extrabold text-ink mb-2">
                            What services do you need?
                        </Text>
                        <Text className="text-base text-ink/70 leading-6 mb-8">
                            We&apos;ll customize your home feed based on your interests.
                        </Text>

                        <View className="flex-row flex-wrap gap-[10px]">
                            {CATEGORIES.map((cat) => (
                                <View key={cat.id} className="mb-1">
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
                            className="mt-10"
                            disabled={selectedInterests.length === 0}
                        />

                        <TouchableOpacity
                            onPress={handleComplete}
                            className="items-center mt-4 p-2"
                        >
                            <Text className="text-muted font-jakarta-semibold">Skip for now</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}

