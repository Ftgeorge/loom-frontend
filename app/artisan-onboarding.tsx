import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { artisanApi } from '@/services/api';
import { CATEGORIES } from '@/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { areas, days } from '@/data/ArtisanOnboardingArray';
import { Ionicons } from '@expo/vector-icons';

const STEPS = ['Skills', 'Areas', 'Days', 'Prices'];

export default function ArtisanOnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [pricingStyle, setPricingStyle] = useState('estimate');
    const [loading, setLoading] = useState(false);
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
            <View className="absolute inset-0">
                <LoomThread variant="minimal" animated opacity={0.2} />
            </View>
            <AppHeader
                title="OPERATIVE SETUP"
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            {/* Tactical Progress Tracker */}
            <View className="flex-row py-6 px-8 gap-3">
                {STEPS.map((s, i) => (
                    <View key={s} className="flex-1 gap-2">
                        <View className={`h-1.5 rounded-full shadow-sm ${
                            i <= step ? 'bg-primary' : 'bg-gray-100'
                        }`} />
                        <Text className={`text-label text-[9px] text-center uppercase tracking-widest ${
                            i === step ? 'text-primary font-jakarta-extrabold italic' : 'text-muted font-jakarta-bold opacity-40'
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
                    <Animated.View entering={FadeInRight.springify()} className="px-8 pt-6">
                        <Text className="text-label text-primary mb-3 uppercase tracking-[2px] font-jakarta-extrabold italic">PHASE 01</Text>
                        <Text className="text-h1 text-[38px] leading-[40px] uppercase italic font-jakarta-extrabold tracking-tighter mb-4">Core Skills</Text>
                        <Text className="text-body text-muted mb-12 normal-case font-jakarta-medium">Select your specialized fields of operation.</Text>

                        <View className="flex-row flex-wrap gap-3">
                            {CATEGORIES.map((cat) => (
                                <Chip
                                    key={cat.id}
                                    label={cat.label.toUpperCase()}
                                    selected={selectedSkills.includes(cat.id)}
                                    onPress={() => toggleSkill(cat.id)}
                                    className="py-3 px-6 rounded-2xl"
                                />
                            ))}
                        </View>
                        <PrimaryButton
                            title="NEXT PHASE"
                            onPress={() => setStep(1)}
                            disabled={selectedSkills.length === 0}
                            className="mt-16 h-16 rounded-xl shadow-xl"
                        />
                    </Animated.View>
                )}

                {step === 1 && (
                    <Animated.View entering={FadeInRight.springify()} className="px-8 pt-6">
                        <Text className="text-label text-primary mb-3 uppercase tracking-[2px] font-jakarta-extrabold italic">PHASE 02</Text>
                        <Text className="text-h1 text-[38px] leading-[40px] uppercase italic font-jakarta-extrabold tracking-tighter mb-4">Service Zones</Text>
                        <Text className="text-body text-muted mb-12 normal-case font-jakarta-medium">Map your intended zones of deployment.</Text>

                        <View className="flex-row flex-wrap gap-3">
                            {areas.map((area) => (
                                <Chip
                                    key={area}
                                    label={area.toUpperCase()}
                                    selected={selectedAreas.includes(area)}
                                    onPress={() => toggleArea(area)}
                                    className="py-3 px-6 rounded-2xl"
                                />
                            ))}
                        </View>
                        <PrimaryButton
                            title="NEXT PHASE"
                            onPress={() => setStep(2)}
                            disabled={selectedAreas.length === 0}
                            className="mt-16 h-16 rounded-xl shadow-xl"
                        />
                    </Animated.View>
                )}

                {step === 2 && (
                    <Animated.View entering={FadeInRight.springify()} className="px-8 pt-6">
                        <Text className="text-label text-primary mb-3 uppercase tracking-[2px] font-jakarta-extrabold italic">PHASE 03</Text>
                        <Text className="text-h1 text-[38px] leading-[40px] uppercase italic font-jakarta-extrabold tracking-tighter mb-4">Availability</Text>
                        <Text className="text-body text-muted mb-12 normal-case font-jakarta-medium">Define your weekly mission uptime.</Text>

                        <View className="flex-row flex-wrap gap-4 justify-center py-4 bg-white/50 rounded-[32px] border border-card-border/50 shadow-sm">
                            {days.map((d) => {
                                const isSelected = selectedDays.includes(d);
                                return (
                                    <TouchableOpacity
                                        key={d}
                                        activeOpacity={0.8}
                                        className={`w-[60px] h-[60px] rounded-[20px] border-[1.5px] items-center justify-center shadow-md ${
                                            isSelected ? 'bg-primary border-primary' : 'bg-white border-card-border'
                                        }`}
                                        onPress={() => toggleDay(d)}
                                    >
                                        <Text className={`text-label text-[13px] uppercase font-jakarta-extrabold ${
                                            isSelected ? 'text-white' : 'text-ink'
                                        }`}>{d}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <PrimaryButton
                            title="NEXT PHASE"
                            onPress={() => setStep(3)}
                            className="mt-16 h-16 rounded-xl shadow-xl"
                        />
                    </Animated.View>
                )}

                {step === 3 && (
                    <Animated.View entering={FadeInRight.springify()} className="px-8 pt-6">
                        <Text className="text-label text-primary mb-3 uppercase tracking-[2px] font-jakarta-extrabold italic">PHASE 04</Text>
                        <Text className="text-h1 text-[38px] leading-[40px] uppercase italic font-jakarta-extrabold tracking-tighter mb-4">Pricing Strategy</Text>
                        <Text className="text-body text-muted mb-12 normal-case font-jakarta-medium">Establish your resource allocation model.</Text>

                        {[
                            { value: 'fixed', label: 'FLAT RATE', desc: 'Secure unified pricing for core services.', icon: 'lock-closed-outline' },
                            { value: 'estimate', label: 'FLUCTUATING', desc: 'Dynamic pricing based on mission complexity.', icon: 'git-branch-outline' },
                            { value: 'hourly', label: 'TEMPORAL', desc: 'Temporal resource allocation credits.', icon: 'time-outline' },
                        ].map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                activeOpacity={0.9}
                                className={`flex-row items-center gap-5 p-7 rounded-[28px] border-[1.5px] mb-5 bg-white shadow-lg ${
                                    pricingStyle === opt.value ? 'border-primary' : 'border-card-border'
                                }`}
                                onPress={() => setPricingStyle(opt.value)}
                            >
                                <View className={`w-12 h-12 rounded-2xl items-center justify-center border shadow-sm ${
                                    pricingStyle === opt.value ? 'bg-primary border-primary/20' : 'bg-surface border-card-border'
                                }`}>
                                    <Ionicons 
                                        name={opt.icon as any} 
                                        size={24} 
                                        color={pricingStyle === opt.value ? 'white' : '#94A3B8'} 
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className={`text-h3 text-primary text-base uppercase font-jakarta-extrabold italic tracking-tight ${
                                        pricingStyle === opt.value ? 'text-primary' : 'text-ink'
                                    }`}>{opt.label}</Text>
                                    <Text className="text-body-sm text-muted mt-1 leading-[20px] normal-case font-jakarta-medium italic">{opt.desc}</Text>
                                </View>
                                <View className={`w-7 h-7 rounded-full border-[1.5px] items-center justify-center ${
                                    pricingStyle === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200'
                                }`}>
                                    {pricingStyle === opt.value && (
                                        <View className="w-3.5 h-3.5 rounded-full bg-primary shadow-sm" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}

                        <PrimaryButton
                            title="INITIALIZE PROTOCOL"
                            onPress={handleComplete}
                            loading={loading}
                            className="mt-14 h-16 rounded-xl shadow-2xl"
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


