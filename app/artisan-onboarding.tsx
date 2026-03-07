import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { AppTextInput } from '@/components/ui/TextInputs';
import { artisanApi } from '@/services/api';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const STEPS = ['Specialties', 'Sectors', 'Cycle', 'Pricing'];

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

            router.replace('/(tabs)/dashboard');
        } catch (err: any) {
            Alert.alert('Initialization Error', err.message || 'Failed to save operative profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" animated opacity={0.2} />
            <AppHeader
                title="Professional Setup"
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            <View style={{ flexDirection: 'row', paddingVertical: 16, gap: 4, paddingHorizontal: 20 }}>
                {STEPS.map((s, i) => (
                    <View key={s} style={{ flex: 1, gap: 4 }}>
                        <View style={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: i <= step ? Colors.primary : Colors.gray100
                        }} />
                        <Text style={[
                            Typography.label,
                            {
                                fontSize: 8,
                                textAlign: 'center',
                                color: i === step ? Colors.primary : Colors.muted,
                                opacity: i === step ? 1 : 0.5
                            }
                        ]}>{s.toUpperCase()}</Text>
                    </View>
                ))}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
                {step === 0 && (
                    <Animated.View entering={FadeInRight.springify()} style={{ padding: 32 }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>STEP 01</Text>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 12 }]}>Choose your Skills</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>Which technical specialties do you offer to the network?</Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {CATEGORIES.map((cat) => (
                                <Chip
                                    key={cat.id}
                                    label={cat.label}
                                    selected={selectedSkills.includes(cat.id)}
                                    onPress={() => toggleSkill(cat.id)}
                                    containerStyle={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: Radius.xs,
                                        borderColor: selectedSkills.includes(cat.id) ? Colors.primary : Colors.cardBorder
                                    }}
                                />
                            ))}
                        </View>
                        <PrimaryButton
                            title="CONTINUE"
                            onPress={() => setStep(1)}
                            disabled={selectedSkills.length === 0}
                            style={{ marginTop: 48, height: 60, borderRadius: Radius.md }}
                        />
                    </Animated.View>
                )}

                {step === 1 && (
                    <Animated.View entering={FadeInRight.springify()} style={{ padding: 32 }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>STEP 02</Text>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 12 }]}>Service Areas</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>Select the areas where you can work on-site.</Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {areas.map((area) => (
                                <Chip
                                    key={area}
                                    label={area}
                                    selected={selectedAreas.includes(area)}
                                    onPress={() => toggleArea(area)}
                                    containerStyle={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: Radius.xs,
                                        borderColor: selectedAreas.includes(area) ? Colors.primary : Colors.cardBorder
                                    }}
                                />
                            ))}
                        </View>
                        <PrimaryButton
                            title="CONTINUE"
                            onPress={() => setStep(2)}
                            disabled={selectedAreas.length === 0}
                            style={{ marginTop: 48, height: 60, borderRadius: Radius.md }}
                        />
                    </Animated.View>
                )}

                {step === 2 && (
                    <Animated.View entering={FadeInRight.springify()} style={{ padding: 32 }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>STEP 03</Text>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 12 }]}>Work Schedule</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>Select the days you are available to work.</Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                            {days.map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    style={{
                                        width: 54,
                                        height: 54,
                                        borderRadius: Radius.xs,
                                        borderWidth: 1.5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: selectedDays.includes(d) ? Colors.primaryLight : Colors.white,
                                        borderColor: selectedDays.includes(d) ? Colors.primary : Colors.cardBorder,
                                        ...Shadows.sm
                                    }}
                                    onPress={() => toggleDay(d)}
                                >
                                    <Text style={[
                                        Typography.label,
                                        { color: selectedDays.includes(d) ? Colors.primary : Colors.muted, fontSize: 12 }
                                    ]}>{d.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <PrimaryButton
                            title="CONTINUE"
                            onPress={() => setStep(3)}
                            style={{ marginTop: 56, height: 60, borderRadius: Radius.md }}
                        />
                    </Animated.View>
                )}

                {step === 3 && (
                    <Animated.View entering={FadeInRight.springify()} style={{ padding: 32 }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>STEP 04</Text>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 12 }]}>Pricing</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>How would you like to set your service prices?</Text>

                        {[
                            { value: 'fixed', label: 'FIXED PRICE', desc: 'Secure jobs with a set cost' },
                            { value: 'estimate', label: 'VARIABLE ESTIMATE', desc: 'Provide an estimated range per job' },
                            { value: 'hourly', label: 'HOURLY RATE', desc: 'Charge based on hours worked' },
                        ].map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 16,
                                    padding: 24,
                                    borderRadius: Radius.md,
                                    borderWidth: 1.5,
                                    marginBottom: 16,
                                    backgroundColor: Colors.white,
                                    borderColor: pricingStyle === opt.value ? Colors.primary : Colors.cardBorder,
                                    ...Shadows.sm
                                }}
                                onPress={() => setPricingStyle(opt.value)}
                            >
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: Radius.xs,
                                    borderWidth: 2,
                                    borderColor: pricingStyle === opt.value ? Colors.primary : Colors.gray200,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: pricingStyle === opt.value ? Colors.primaryLight : 'transparent'
                                }}>
                                    {pricingStyle === opt.value && (
                                        <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: Colors.primary }} />
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[Typography.h3, { color: Colors.primary, fontSize: 16 }]}>{opt.label}</Text>
                                    <Text style={[Typography.bodySmall, { color: Colors.muted, marginTop: 4, lineHeight: 18 }]}>{opt.desc}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <PrimaryButton
                            title="COMPLETE SETUP"
                            onPress={handleComplete}
                            loading={loading}
                            style={{ marginTop: 48, height: 64, borderRadius: Radius.md }}
                            variant="accent"
                        />
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
