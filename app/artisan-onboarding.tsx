import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { artisanApi } from '@/services/api';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { CATEGORIES } from '@/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const STEPS = ['Skills', 'Areas', 'Days', 'Prices'];

export default function ArtisanOnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [pricingStyle, setPricingStyle] = useState('estimate');
    const [loading, setLoading] = useState(false);

    const areas = ['Wuse', 'Garki', 'Maitama', 'Gwarinpa', 'Jabi', 'Asokoro', 'Kubwa', 'Nyanya', 'Life Camp', 'Utako'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

    const toggleSkill = (id: string) => {
        setSelectedSkills((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
    };
    const toggleArea = (a: string) => {
        setSelectedAreas((prev) => prev.includes(a) ? prev.filter((s) => s !== a) : [...prev, a]);
    };
    const toggleDay = (d: string) => {
        setSelectedDays((prev) => prev.includes(d) ? prev.filter((s) => s !== d) : [...prev, d]);
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            const profile = await artisanApi.createProfile({
                bio: `Available for ${selectedSkills.join(', ')} in ${selectedAreas.join(', ')}.`,
                yearsOfExperience: 1,
            });

            const profileId = profile.id;
            for (const skill of selectedSkills) {
                const skillLabel = CATEGORIES.find(c => c.id === skill)?.label || skill;
                await artisanApi.addSkill(profileId, skillLabel);
            }

            router.replace('/verification');
        } catch (err: any) {
            Alert.alert('Initialization Error', err.message || 'Failed to save operative profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" animated opacity={0.2} />
            <AppHeader
                title="OPERATIVE SETUP"
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            <View className="flex-row py-4 gap-1 px-5">
                {STEPS.map((s, i) => (
                    <View key={s} className="flex-1 gap-1">
                        <View className={`h-1 rounded-full ${
                            i <= step ? 'bg-primary' : 'bg-gray-100'
                        }`} />
                        <Text className={`text-label text-[8px] text-center uppercase ${
                            i === step ? 'text-primary' : 'text-muted opacity-50'
                        }`}>{s}</Text>
                    </View>
                ))}
            </View>

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }} 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {step === 0 && (
                    <Animated.View entering={FadeInRight.springify()} className="p-8">
                        <Text className="text-label text-primary mb-2 uppercase">Step 1</Text>
                        <Text className="text-h1 text-[28px] mb-3">What can you do?</Text>
                        <Text className="text-body text-muted mb-8">What help do you provide?</Text>

                        <View className="flex-row flex-wrap gap-[10px]">
                            {CATEGORIES.map((cat) => (
                                <Chip
                                    key={cat.id}
                                    label={cat.label.toUpperCase()}
                                    selected={selectedSkills.includes(cat.id)}
                                    onPress={() => toggleSkill(cat.id)}
                                    containerStyle={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 8,
                                        borderColor: selectedSkills.includes(cat.id) ? '#00120C' : '#E8ECEF'
                                    }}
                                />
                            ))}
                        </View>
                        <PrimaryButton
                            title="NEXT PHASE"
                            onPress={() => setStep(1)}
                            disabled={selectedSkills.length === 0}
                            className="mt-12 h-[60px] rounded-md"
                        />
                    </Animated.View>
                )}

                {step === 1 && (
                    <Animated.View entering={FadeInRight.springify()} className="p-8">
                        <Text className="text-label text-primary mb-2 uppercase">Step 2</Text>
                        <Text className="text-h1 text-[28px] mb-3">Where do you work?</Text>
                        <Text className="text-body text-muted mb-8">Pick the places where you can go for work.</Text>

                        <View className="flex-row flex-wrap gap-[10px]">
                            {areas.map((area) => (
                                <Chip
                                    key={area}
                                    label={area.toUpperCase()}
                                    selected={selectedAreas.includes(area)}
                                    onPress={() => toggleArea(area)}
                                    containerStyle={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 8,
                                        borderColor: selectedAreas.includes(area) ? '#00120C' : '#E8ECEF'
                                    }}
                                />
                            ))}
                        </View>
                        <PrimaryButton
                            title="NEXT PHASE"
                            onPress={() => setStep(2)}
                            disabled={selectedAreas.length === 0}
                            className="mt-12 h-[60px] rounded-md"
                        />
                    </Animated.View>
                )}

                {step === 2 && (
                    <Animated.View entering={FadeInRight.springify()} className="p-8">
                        <Text className="text-label text-primary mb-2 uppercase">Step 3</Text>
                        <Text className="text-h1 text-[28px] mb-3">When are you free?</Text>
                        <Text className="text-body text-muted mb-8">Pick the days you can do work.</Text>

                        <View className="flex-row flex-wrap gap-3 justify-center">
                            {days.map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    className={`w-[54px] h-[54px] rounded-xs border-[1.5px] items-center justify-center shadow-sm ${
                                        selectedDays.includes(d) ? 'bg-primary/5 border-primary' : 'bg-white border-card-border'
                                    }`}
                                    onPress={() => toggleDay(d)}
                                >
                                    <Text className={`text-label text-[12px] uppercase ${
                                        selectedDays.includes(d) ? 'text-primary' : 'text-muted'
                                    }`}>{d}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <PrimaryButton
                            title="NEXT PHASE"
                            onPress={() => setStep(3)}
                            className="mt-14 h-[60px] rounded-md"
                        />
                    </Animated.View>
                )}

                {step === 3 && (
                    <Animated.View entering={FadeInRight.springify()} className="p-8">
                        <Text className="text-label text-primary mb-2 uppercase">Step 4</Text>
                        <Text className="text-h1 text-[28px] mb-3">How much?</Text>
                        <Text className="text-body text-muted mb-8">How do you want to charge?</Text>

                        {[
                            { value: 'fixed', label: 'FLAT RATE', desc: 'Secure unified pricing for core services.', icon: 'lock-closed-outline' },
                            { value: 'estimate', label: 'FLUCTUATING', desc: 'Dynamic pricing based on mission complexity.', icon: 'git-branch-outline' },
                            { value: 'hourly', label: 'TEMPORAL', desc: 'Temporal resource allocation credits.', icon: 'time-outline' },
                        ].map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                className={`flex-row items-center gap-4 p-6 rounded-md border-[1.5px] mb-4 bg-white shadow-sm ${
                                    pricingStyle === opt.value ? 'border-primary' : 'border-card-border'
                                }`}
                                onPress={() => setPricingStyle(opt.value)}
                            >
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                                    pricingStyle === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200'
                                }`}>
                                    {pricingStyle === opt.value && (
                                        <View className="w-[10px] h-[10px] rounded-full bg-primary" />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-h3 text-primary text-base uppercase">{opt.label}</Text>
                                    <Text className="text-body-sm text-muted mt-1 leading-[18px]">{opt.desc}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <PrimaryButton
                            title="INITIALIZE PROTOCOL"
                            onPress={handleComplete}
                            loading={loading}
                            className="mt-12 h-16 rounded-md"
                            variant="accent"
                        />
                        
                        <View className="mt-8 items-center flex-row justify-center gap-2 opacity-30">
                            <Ionicons name="shield-checkmark" size={14} color="#64748B" />
                            <Text className="text-[8px] text-muted uppercase tracking-[2px] font-jakarta-bold italic">Integrity Check Complete • v2.4.0</Text>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}

