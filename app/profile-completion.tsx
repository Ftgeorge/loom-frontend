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

            if (profileImage && !profileImage.startsWith('http')) {
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
            Alert.alert('Transmission Error', err.message || 'Could not update your profile data.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (activeStep === 0) {
            if (!city || !state || !area) {
                Alert.alert('Required Fields', 'Please specify your primary deployment zone.');
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
                <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
            </View>
            <AppHeader
                title="PROFILE ACTIVATION"
                showBack={activeStep > 0}
                onBack={() => setActiveStep(0)}
                showNotification={false}
            />

            {/* ─── Tactical Stepper Matrix ───────────────────────────────────── */}
            <View className="flex-row px-10 py-6 gap-3">
                {STEPS.filter((_, i) => user?.role !== 'artisan' || i === 0).map((s, i) => (
                    <View key={s} className="flex-1 gap-2">
                        <View className={`h-1.5 rounded-full shadow-sm ${
                            i <= activeStep ? 'bg-primary shadow-primary/20' : 'bg-card-border/30'
                        }`} />
                        <Text className={`text-label text-[9px] uppercase tracking-[3px] ${
                            i === activeStep ? 'text-primary font-jakarta-extrabold italic' : 'text-ink/20 font-jakarta-bold'
                        }`}>
                            {s.toUpperCase()}
                        </Text>
                    </View>
                ))}
            </View>

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 160 }} 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {activeStep === 0 && (
                    <Animated.View entering={FadeInUp.springify()} className="px-8 pt-6">
                        <View className="items-center mb-12">
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={pickImage}
                                className={`w-36 h-36 rounded-full bg-white border-[2px] items-center justify-center p-2 shadow-2xl ${
                                    profileImage ? 'border-primary border-solid' : 'border-primary/40 border-dashed'
                                }`}
                            >
                                <View className="w-full h-full rounded-full bg-background items-center justify-center overflow-hidden border border-card-border/50 shadow-inner">
                                    {profileImage ? (
                                        <Image source={{ uri: profileImage }} className="w-full h-full" resizeMode="cover" />
                                    ) : (
                                        <Ionicons name="person" size={56} color="#00120C" className="opacity-40" />
                                    )}
                                </View>
                                <View className="absolute bottom-1 right-1 w-11 h-11 rounded-full bg-accent items-center justify-center border-4 border-white shadow-lg">
                                    <Ionicons name={profileImage ? "create" : "camera"} size={18} color="white" />
                                </View>
                            </TouchableOpacity>
                            <Text className="text-[20px] mt-6 uppercase italic font-jakarta-extrabold tracking-tight text-ink">
                                {user?.role === 'artisan' ? 'PROFESSIONAL IDENTITY' : 'CLIENT AVATAR'}
                            </Text>
                            <Text className="text-[14px] text-ink/40 mt-2 text-center italic font-jakarta-medium px-4">
                                {user?.role === 'artisan' ? 'Present a professional image to the service grid.' : 'Help the community recognize your operative profile.'}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-2 mb-3 px-1">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                            <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">GEOGRAPHICAL SYNC</Text>
                        </View>
                        <Text className="text-h1 text-[40px] uppercase italic font-jakarta-extrabold tracking-tighter mb-4 text-ink">DEPLOYMENT HUB</Text>
                        <Text className="text-[15px] text-ink/60 mb-12 normal-case font-jakarta-medium italic leading-6">
                            {user?.role === 'artisan'
                                ? 'Specify your primary operational territory for service inquiries.'
                                : 'Identify your residence to streamline professional discovery.'}
                        </Text>

                        <View className="gap-6 mb-12">
                            <LocationSuggestionInput
                                label="TERRITORY (STATE)"
                                placeholder="E.G. LAGOS"
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
                                placeholder="E.G. IKEJA"
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
                                label="SPECIFIC AREA / SECTOR"
                                placeholder="E.G. OPEBI"
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
                            className="h-18 rounded-[20px] shadow-2xl border border-white/10"
                        />
                    </Animated.View>
                )}

                {activeStep === 1 && (
                    <Animated.View entering={FadeInRight.springify()} className="px-8 pt-8">
                        <View className="flex-row items-center gap-2 mb-3 px-1">
                            <View className="w-1.5 h-1.5 rounded-full bg-accent shadow-sm" />
                            <Text className="text-label text-accent tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">PREFERENCE MATRIX</Text>
                        </View>
                        <Text className="text-h1 text-[40px] uppercase italic font-jakarta-extrabold tracking-tighter mb-4 text-ink">FIELD INTERESTS</Text>
                        <Text className="text-[15px] text-ink/60 mb-12 normal-case font-jakarta-medium italic leading-6">
                            Optimize your command center with specialized service classifications.
                        </Text>

                        <View className="flex-row flex-wrap gap-4 py-8 px-6 bg-white rounded-[42px] border-[1.5px] border-card-border/50 shadow-2xl">
                            {CATEGORIES.map((cat) => (
                                <View key={cat.id}>
                                    <Chip
                                        label={cat.label.toUpperCase()}
                                        selected={selectedInterests.includes(cat.id)}
                                        onPress={() => toggleInterest(cat.id)}
                                        className="py-4 px-7 rounded-[20px]"
                                    />
                                </View>
                            ))}
                        </View>

                        <PrimaryButton
                            title="INITIALIZE PROTOCOL"
                            onPress={nextStep}
                            loading={loading}
                            variant="accent"
                            className="mt-16 h-18 rounded-[20px] shadow-2xl border border-white/10"
                            disabled={selectedInterests.length === 0}
                        />

                        <TouchableOpacity
                            onPress={handleComplete}
                            activeOpacity={0.8}
                            className="items-center mt-10 p-5 rounded-[20px] bg-background border border-card-border/50 shadow-inner"
                        >
                            <Text className="text-ink/40 font-jakarta-extrabold uppercase text-[10px] tracking-[4px] italic">BYPASS INITIALIZATION</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </ScrollView>
            
            <View className="absolute bottom-12 left-0 right-0 items-center pointer-events-none opacity-20">
                <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Identity Sync Protocol v4.2 • Loom Command</Text>
            </View>
        </View>
    );
}
