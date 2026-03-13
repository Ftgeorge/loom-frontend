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
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" animated opacity={0.2} />
            <AppHeader
                title="Setup your profile"
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
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>STEP 1</Text>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 12 }]}>What can you do?</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>What help do you provide?</Text>

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
                            title="NEXT"
                            onPress={() => setStep(1)}
                            disabled={selectedSkills.length === 0}
                            style={{ marginTop: 48, height: 60, borderRadius: Radius.md }}
                        />
                    </Animated.View>
                )}

                {step === 1 && (
                    <Animated.View entering={FadeInRight.springify()} style={{ padding: 32 }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>STEP 2</Text>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 12 }]}>Where do you work?</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>Pick the places where you can go for work.</Text>

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
                            title="NEXT"
                            onPress={() => setStep(2)}
                            disabled={selectedAreas.length === 0}
                            style={{ marginTop: 48, height: 60, borderRadius: Radius.md }}
                        />
                    </Animated.View>
                )}

                {step === 2 && (
                    <Animated.View entering={FadeInRight.springify()} style={{ padding: 32 }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>STEP 3</Text>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 12 }]}>When are you free?</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>Pick the days you can do work.</Text>

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
                            title="NEXT"
                            onPress={() => setStep(3)}
                            style={{ marginTop: 56, height: 60, borderRadius: Radius.md }}
                        />
                    </Animated.View>
                )}

                {step === 3 && (
                    <Animated.View entering={FadeInRight.springify()} style={{ padding: 32 }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>STEP 4</Text>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 12 }]}>How much?</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>How do you want to charge?</Text>

                        {[
                            { value: 'fixed', label: 'SAME PRICE', desc: 'A set cost for the job' },
                            { value: 'estimate', label: 'IT DEPENDS', desc: 'Give a price range' },
                            { value: 'hourly', label: 'BY THE HOUR', desc: 'Charge for the time you spend' },
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
                                    borderRadius: Radius.xl,
                                    borderWidth: 2,
                                    borderColor: pricingStyle === opt.value ? Colors.primary : Colors.gray200,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: pricingStyle === opt.value ? Colors.primaryLight : 'transparent'
                                }}>
                                    {pricingStyle === opt.value && (
                                        <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: Colors.primary }} />
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[Typography.h3, { color: Colors.primary, fontSize: 16 }]}>{opt.label}</Text>
                                    <Text style={[Typography.bodySmall, { color: Colors.muted, marginTop: 4, lineHeight: 18 }]}>{opt.desc}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <PrimaryButton
                            title="FINISH"
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
