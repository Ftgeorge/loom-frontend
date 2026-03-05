import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { AppTextInput, PhoneInput } from '@/components/ui/TextInputs';
import { artisanApi, userApi } from '@/services/api';
import { Colors } from '@/theme';
import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const STEPS = ['Basics', 'Skills', 'Areas', 'Availability', 'Pricing'];

export default function ArtisanOnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
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
            // 1. Update user basic info (name, phone)
            const [firstName, ...lastNameParts] = name.trim().split(' ');
            const lastName = lastNameParts.join(' ');
            await userApi.updateProfile({ first_name: firstName, last_name: lastName, phone });

            // 2. Create Artisan Profile
            const profile = await artisanApi.createProfile({
                bio: `Available for ${selectedSkills.join(', ')} in ${selectedAreas.join(', ')}.`,
                yearsOfExperience: 1, // Default during onboarding
            });

            const profileId = profile.id;

            // 3. Attach skills (sequentially for simplicity in onboarding)
            for (const skill of selectedSkills) {
                // We need to map category ID back to a skill name. 
                // For now, using the ID as name or finding the label.
                const skillLabel = CATEGORIES.find(c => c.id === skill)?.label || skill;
                await artisanApi.addSkill(profileId, skillLabel);
            }

            router.replace('/(tabs)/dashboard');
        } catch (err: any) {
            Alert.alert('Onboarding Error', err.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <AppHeader
                title="Set Up Profile"
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            <View className="flex-row px-5 py-4 gap-1">
                {STEPS.map((s, i) => (
                    <View key={s} className="flex-1 items-center gap-1">
                        <View className={`h-[3px] w-full rounded-[2px] ${i <= step ? 'bg-graphite' : 'bg-surface'}`} />
                        <Text className={`text-[10px] uppercase tracking-widest ${i === step ? 'text-graphite font-bold' : 'text-muted font-medium'}`}>{s}</Text>
                    </View>
                ))}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
                {step === 0 && (
                    <Animated.View entering={FadeInRight.springify()} className="p-8">
                        <Text className="text-[22px] font-extrabold tracking-tight mb-2 text-graphite">Your basic info</Text>
                        <AppTextInput label="Full Name" value={name} onChangeText={setName} placeholder="Your full name" />
                        <PhoneInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="8012345678" />
                        <TouchableOpacity className="h-[120px] rounded-[24px] border-2 border-surface bg-surface/30 border-dashed items-center justify-center gap-2 mb-2">
                            <Ionicons name="camera-outline" size={32} color={Colors.muted} />
                            <Text className="text-sm font-medium text-muted">Add profile photo</Text>
                        </TouchableOpacity>
                        <PrimaryButton title="Next" onPress={() => setStep(1)} disabled={!name} style={{ marginTop: 32 }} className="bg-graphite" />
                    </Animated.View>
                )}

                {step === 1 && (
                    <Animated.View entering={FadeInRight.springify()} className="p-8">
                        <Text className="text-[22px] font-extrabold tracking-tight mb-2 text-graphite">What are your trades?</Text>
                        <Text className="text-base text-muted mb-6">Select all that apply</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <Chip key={cat.id} label={cat.label} selected={selectedSkills.includes(cat.id)} onPress={() => toggleSkill(cat.id)} />
                            ))}
                        </View>
                        <PrimaryButton title="Next" onPress={() => setStep(2)} disabled={selectedSkills.length === 0} style={{ marginTop: 32 }} className="bg-graphite" />
                    </Animated.View>
                )}

                {step === 2 && (
                    <Animated.View entering={FadeInRight.springify()} className="p-8">
                        <Text className="text-[22px] font-extrabold tracking-tight mb-2 text-graphite">Service areas</Text>
                        <Text className="text-base text-muted mb-6">Where can clients find you?</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {areas.map((area) => (
                                <Chip key={area} label={area} selected={selectedAreas.includes(area)} onPress={() => toggleArea(area)} />
                            ))}
                        </View>
                        <PrimaryButton title="Next" onPress={() => setStep(3)} disabled={selectedAreas.length === 0} style={{ marginTop: 32 }} className="bg-graphite" />
                    </Animated.View>
                )}

                {step === 3 && (
                    <Animated.View entering={FadeInRight.springify()} className="p-8">
                        <Text className="text-[22px] font-extrabold tracking-tight mb-2 text-graphite">Your availability</Text>
                        <Text className="text-base text-muted mb-6">Select your working days</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {days.map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    className={`w-[46px] h-[46px] rounded-[23px] border-[1.5px] items-center justify-center ${selectedDays.includes(d) ? 'border-graphite bg-surface shadow-sm' : 'border-surface bg-background'}`}
                                    onPress={() => toggleDay(d)}
                                >
                                    <Text className={`text-sm ${selectedDays.includes(d) ? 'text-graphite font-bold' : 'text-muted font-medium'}`}>{d}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <PrimaryButton title="Next" onPress={() => setStep(4)} style={{ marginTop: 32 }} className="bg-graphite" />
                    </Animated.View>
                )}

                {step === 4 && (
                    <Animated.View entering={FadeInRight.springify()} className="p-8">
                        <Text className="text-[22px] font-extrabold tracking-tight mb-2 text-graphite">Pricing style</Text>
                        <Text className="text-base text-muted mb-6">How do you prefer to charge?</Text>
                        {[
                            { value: 'fixed', label: 'Fixed Price', desc: 'Set a fixed price per job' },
                            { value: 'estimate', label: 'Estimate', desc: 'Give clients a price range' },
                            { value: 'hourly', label: 'Hourly Rate', desc: 'Charge by the hour' },
                        ].map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                className={`flex-row items-center gap-4 p-5 rounded-[20px] border-[1.5px] mb-4 shadow-sm ${pricingStyle === opt.value ? 'border-graphite bg-surface' : 'border-surface bg-background'}`}
                                onPress={() => setPricingStyle(opt.value)}
                            >
                                <View>
                                    <View className={`w-[22px] h-[22px] rounded-[11px] border-2 items-center justify-center ${pricingStyle === opt.value ? 'border-graphite' : 'border-surface'}`}>
                                        {pricingStyle === opt.value && <View className="w-2.5 h-2.5 rounded-full bg-graphite" />}
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-base font-bold text-graphite">{opt.label}</Text>
                                    <Text className="text-xs text-muted mt-0.5">{opt.desc}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <PrimaryButton title="Complete Setup" onPress={handleComplete} loading={loading} style={{ marginTop: 32 }} className="bg-graphite" />
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
