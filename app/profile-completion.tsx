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
import { Alert, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
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
            <View className="absolute inset-0">
                <LoomThread variant="dense" scale={1.2} animated opacity={0.3} />
            </View>
            <AppHeader
                title="Profile Activation"
                showBack={activeStep > 0}
                onBack={() => setActiveStep(0)}
                showNotification={false}
            />

            {/* Tactical Progress Tracker */}
            <View className="flex-row px-10 py-6 gap-3">
                {STEPS.filter((_, i) => user?.role !== 'artisan' || i === 0).map((s, i) => (
                    <View key={s} className="flex-1 gap-2">
                        <View className={`h-1.5 rounded-full shadow-sm ${
                            i <= activeStep ? 'bg-primary' : 'bg-gray-100'
                        }`} />
                        <Text className={`text-label text-[10px] uppercase tracking-widest ${
                            i === activeStep ? 'text-primary font-jakarta-extrabold italic' : 'text-muted font-jakarta-bold'
                        }`}>
                            {s}
                        </Text>
                    </View>
                ))}
            </View>

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }} 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {activeStep === 0 && (
                    <Animated.View entering={FadeInUp.springify()} className="px-8 pt-6">
                        <View className="items-center mb-12">
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={pickImage}
                                className={`w-[160px] h-[160px] rounded-full bg-white border-[2px] items-center justify-center p-1.5 shadow-2xl ${
                                    profileImage ? 'border-primary border-solid' : 'border-primary/40 border-dashed'
                                }`}
                            >
                                <View className="w-full h-full rounded-full bg-primary/5 items-center justify-center overflow-hidden border border-card-border/50">
                                    {profileImage ? (
                                        <Image source={{ uri: profileImage }} className="w-full h-full" />
                                    ) : (
                                        <Ionicons name="person" size={68} color="#00120C" className="opacity-80" />
                                    )}
                                </View>
                                <View className="absolute bottom-1 right-1 w-11 h-11 rounded-full bg-accent items-center justify-center border-4 border-white shadow-lg">
                                    <Ionicons name={profileImage ? "create" : "camera"} size={20} color="white" />
                                </View>
                            </TouchableOpacity>
                            <Text className="text-h3 mt-6 text-[22px] uppercase italic font-jakarta-extrabold tracking-tight">
                                {user?.role === 'artisan' ? 'Business Identity' : 'Personal Avatar'}
                            </Text>
                            <Text className="text-body-sm text-muted mt-2 normal-case font-jakarta-medium">
                                {user?.role === 'artisan' ? 'Present a professional image to clients' : 'Help the community recognize you'}
                            </Text>
                        </View>

                        <Text className="text-[28px] font-jakarta-extrabold text-ink mb-2 uppercase italic tracking-tighter">
                            Operational Hub
                        </Text>
                        <Text className="text-base text-ink/70 leading-7 mb-10 font-jakarta-medium">
                            {user?.role === 'artisan'
                                ? 'Specify your primary deployment zone for service inquiries.'
                                : 'Identify your residence to streamline professional matching.'}
                        </Text>

                        <View className="gap-6">
                            <LocationSuggestionInput
                                label="TERRITORY (STATE)"
                                placeholder="e.g. Lagos"
                                value={state}
                                onChangeText={(text) => {
                                    setState(text);
                                    setCity('');
                                    setArea('');
                                }}
                                suggestions={NIGERIAN_STATES}
                            />

                            <LocationSuggestionInput
                                label="OPERATIONAL CITY"
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
                                label="SPECIFIC AREA / NEIGHBORHOOD"
                                placeholder="e.g. Opebi"
                                value={area}
                                onChangeText={setArea}
                                suggestions={
                                    (state && city && NIGERIAN_STATISTICS[state as keyof typeof NIGERIAN_STATISTICS])
                                        ? NIGERIAN_STATISTICS[state as keyof typeof NIGERIAN_STATISTICS].areas
                                        : []
                                }
                            />
                        </View>

                        <PrimaryButton
                            title="SYNC PARAMETERS"
                            onPress={nextStep}
                            className="mt-12 h-16 rounded-xl shadow-xl border border-primary/20"
                        />
                    </Animated.View>
                )}

                {activeStep === 1 && (
                    <Animated.View entering={FadeInRight.springify()} className="px-8 pt-8">
                        <Text className="text-[28px] font-jakarta-extrabold text-ink mb-2 uppercase italic tracking-tighter">
                            Service Interests
                        </Text>
                        <Text className="text-base text-ink/70 leading-7 mb-10 font-jakarta-medium">
                            Optimize your home terminal with specialized service classifications.
                        </Text>

                        <View className="flex-row flex-wrap gap-3">
                            {CATEGORIES.map((cat) => (
                                <View key={cat.id} className="mb-1">
                                    <Chip
                                        label={cat.label.toUpperCase()}
                                        selected={selectedInterests.includes(cat.id)}
                                        onPress={() => toggleInterest(cat.id)}
                                        className="py-3 px-6 rounded-2xl"
                                    />
                                </View>
                            ))}
                        </View>

                        <PrimaryButton
                            title="INITIALIZE ECOSYSTEM"
                            onPress={nextStep}
                            loading={loading}
                            className="mt-16 h-16 rounded-xl shadow-xl"
                            disabled={selectedInterests.length === 0}
                        />

                        <TouchableOpacity
                            onPress={handleComplete}
                            className="items-center mt-6 p-4 rounded-xl bg-surface/50 border border-card-border"
                        >
                            <Text className="text-muted font-jakarta-extrabold uppercase text-[10px] tracking-widest italic opacity-60">Bypass for Now</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}


