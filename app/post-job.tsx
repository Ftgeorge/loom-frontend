import { SubAppHeader } from '@/components/AppSubHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Badge, Card } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { jobApi } from '@/services/api';
import { useAppStore } from '@/store';
import type { Urgency } from '@/types';
import { CATEGORIES } from '@/types';
import { CATEGORY_IMAGES } from '@/components/home/CategoryPill';
import { JobRequestSchema, mapZodErrors, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ImageBackground,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const URGENCY_OPTIONS: { label: string; value: Urgency }[] = [
    { label: '🔴 Now', value: 'now' },
    { label: '🟡 Today', value: 'today' },
    { label: '🟢 This Week', value: 'this_week' },
];

export default function PostJobScreen() {
    const router = useRouter();
    const { user, addJob } = useAppStore();
    const [step, setStep] = useState(0);
    const [category, setCategory] = useState<string>('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState(user?.location?.area || '');
    const [budget, setBudget] = useState(10000);
    const [urgency, setUrgency] = useState<Urgency>('today');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const steps = ['Type', 'Info', 'Where', 'OK'];

    const handleSubmit = async () => {
        const result = JobRequestSchema.safeParse({
            category,
            description,
            budget,
            urgency,
            address,
        });

        if (!result.success) {
            const errs = mapZodErrors(result.error);
            setErrors(errs);
            if (errs.category) setStep(0);
            else if (errs.description) setStep(1);
            else if (errs.address || errs.budget) setStep(2);
            return;
        }

        setLoading(true);
        try {
            const backendJob = await jobApi.create({
                skill: category,
                description,
                budget,
                location: `${address}, ${user?.location?.city || 'Abuja'}`,
                urgency,
            });

            const { mapJob } = require('@/services/mappers');
            addJob(mapJob(backendJob));
            setSubmitted(true);
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <View className="flex-1 bg-background px-10 justify-center items-center">
                <LoomThread variant="dense" opacity={0.3} animated />
                <Animated.View 
                    entering={FadeIn.duration(800).springify()} 
                    className="w-32 h-32 rounded-full bg-success/10 items-center justify-center mb-12 shadow-2xl border border-success/20"
                >
                    <Ionicons name="shield-checkmark" size={68} color="#1AB26C" />
                </Animated.View>

                <Text className="text-h1 text-center text-[40px] uppercase italic font-jakarta-extrabold tracking-tighter">Mission Live</Text>
                <Text className="text-body text-center mt-6 text-muted leading-7 normal-case font-jakarta-medium px-4">
                    Your request has been broadcasted. Our intelligence is currently matching the perfect artisan for your project.
                </Text>

                <View className="w-full mt-16 gap-4">
                    <PrimaryButton
                        title="TRACK MISSION"
                        onPress={() => router.push({ pathname: '/matched-artisans', params: { skill: category } })}
                        variant="accent"
                        className="h-16 rounded-xl shadow-xl"
                    />
                    <SecondaryButton
                        title="BACK TO COMMAND"
                        onPress={() => router.replace('/')}
                        className="h-15 rounded-xl border-primary bg-white border-[1.5px] shadow-sm"
                        textStyle={{ color: '#00120C', fontFamily: 'PlusJakartaSans-Bold', fontSize: 11, letterSpacing: 1 }}
                    />
                </View>
                
                <Text className="mt-12 text-center text-[8px] text-muted uppercase tracking-widest opacity-40 font-jakarta-bold">
                    Mission Reference: {Math.random().toString(36).substring(7).toUpperCase()}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.3} animated />
            <SubAppHeader
                label="SERVICE PROCUREMENT"
                title="INITIATE REQUEST"
                description={step === 0 ? "Select the category of support required." : "Provide specific mission parameters below."}
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            {/* Tactical Stepper */}
            <View className="flex-row px-8 py-6 gap-4 bg-white/50">
                {steps.map((s, i) => (
                    <View key={s} className="flex-1 gap-2">
                        <View className={`h-1 rounded-full ${i <= step ? 'bg-primary shadow-sm' : 'bg-gray-100'}`} />
                        <Text className={`text-label text-[9px] uppercase tracking-widest ${i === step ? 'text-primary font-jakarta-extrabold italic' : 'text-gray-400 font-jakarta-bold'}`}>
                            {s}
                        </Text>
                    </View>
                ))}
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Step 1: Category Intelligence */}
                {step === 0 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-8 pt-6">
                        <View className="flex-row flex-wrap gap-4">
                            {[...CATEGORIES, { id: 'not_sure', label: 'Others', icon: 'help-circle' }].map((cat) => {
                                const image = CATEGORY_IMAGES[cat.id];
                                const isSelected = category === cat.id;
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            setCategory(cat.id);
                                            setErrors(prev => ({ ...prev, category: '' }));
                                        }}
                                        className={`rounded-[24px] overflow-hidden border-[1.5px] shadow-md ${
                                            isSelected ? 'border-primary' : (errors.category ? 'border-error' : 'border-card-border')
                                        }`}
                                        style={{ width: (width - 64 - 16) / 2, height: 180 }}
                                    >
                                        <ImageBackground
                                            source={image || { uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop' }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        >
                                            <View className={`absolute inset-0 ${isSelected ? 'bg-primary/80' : 'bg-ink/50'}`} />
                                            
                                            <View className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/20 border border-white/30 items-center justify-center backdrop-blur-sm">
                                                <Ionicons
                                                    name={(cat as any).icon || 'hammer-outline'}
                                                    size={22}
                                                    color="white"
                                                />
                                            </View>

                                            {isSelected && (
                                                <View className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white items-center justify-center shadow-lg">
                                                    <Ionicons name="checkmark" size={18} color="#00120C" />
                                                </View>
                                            )}

                                            <View className="absolute bottom-5 left-5 right-5">
                                                <Text className="text-[15px] font-jakarta-extrabold text-white uppercase italic tracking-tight">
                                                    {cat.label}
                                                </Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {errors.category && <Text className="text-label text-error mt-6 text-[10px] normal-case px-2 font-jakarta-bold">{errors.category}</Text>}

                        <PrimaryButton
                            title="PROCEED"
                            onPress={() => {
                                if (!category) {
                                    setErrors({ category: 'Mission parameter missing: select a service' });
                                } else {
                                    setStep(1);
                                }
                            }}
                            className="mt-16 h-16 rounded-xl shadow-lg border border-primary"
                            variant="primary"
                        />
                    </Animated.View>
                )}

                {/* Step 2: Mission Brief */}
                {step === 1 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-8 pt-8">
                        <Text className="text-h1 text-[32px] mb-2 uppercase italic font-jakarta-extrabold tracking-tight">Mission Brief</Text>
                        <Text className="text-body text-muted mb-10 normal-case font-jakarta-medium">Detail the specific requirements for this mission.</Text>

                        <View className={`bg-white rounded-[24px] border-[1.5px] overflow-hidden shadow-lg ${
                            errors.description ? 'border-error' : 'border-card-border'
                        }`}>
                            <TextInput
                                className="text-body text-ink text-base p-6 min-h-[160px] font-jakarta-medium leading-6"
                                style={{ textAlignVertical: 'top' }}
                                placeholder='Commence briefing here...'
                                placeholderTextColor="#94A3B8"
                                multiline
                                autoFocus
                                value={description}
                                onChangeText={(val) => {
                                    setDescription(val);
                                    if (val.length >= 10) setErrors(prev => ({ ...prev, description: '' }));
                                }}
                            />

                            <View className="flex-row items-center justify-between border-t border-gray-50 p-5 bg-surface/50">
                                <View className="flex-row gap-3">
                                    <TouchableOpacity className="flex-row items-center gap-[10px] bg-primary/10 px-4 py-2.5 rounded-lg border border-primary/20">
                                        <Ionicons name="mic-outline" size={20} color="#00120C" />
                                        <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold">Audio Log</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center gap-[10px] bg-white px-4 py-2.5 rounded-lg border border-card-border shadow-sm">
                                        <Ionicons name="images-outline" size={20} color="#64748B" />
                                        <Text className="text-label text-muted text-[10px] uppercase font-jakarta-bold">Vision</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-label text-muted text-[9px] uppercase font-jakarta-bold">{description.length}/500</Text>
                            </View>
                        </View>
                        {errors.description && <Text className="text-label text-error mt-6 text-[10px] normal-case px-2 font-jakarta-bold">{errors.description}</Text>}

                        <PrimaryButton
                            title="ESTABLISH PARAMETERS"
                            onPress={() => {
                                if (description.length < 10) {
                                    setErrors({ description: 'Briefing insufficent: min 10 characters required' });
                                } else {
                                    setStep(2);
                                }
                            }}
                            className="mt-16 h-16 rounded-xl shadow-lg"
                        />
                    </Animated.View>
                )}

                {/* Step 3: Location & Logistics */}
                {step === 2 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-8 pt-8">
                        <Text className="text-h1 text-[32px] mb-2 uppercase italic font-jakarta-extrabold tracking-tight">Logistics</Text>
                        <Text className="text-body text-muted mb-10 normal-case font-jakarta-medium">Define operational zone and budget allocation.</Text>

                        <Text className="text-label mb-4 text-primary uppercase tracking-widest text-[10px] font-jakarta-extrabold">Deployment Zone</Text>
                        <View className={`flex-row items-center bg-white rounded-2xl border-[1.5px] px-6 h-16 shadow-md gap-4 ${
                            errors.address ? 'border-error' : 'border-card-border'
                        }`}>
                            <Ionicons name="navigate-outline" size={24} color="#00120C" />
                            <TextInput
                                className="text-body flex-1 text-ink text-base font-jakarta-semibold"
                                value={address}
                                onChangeText={(val) => {
                                    setAddress(val);
                                    if (val.length > 3) setErrors(prev => ({ ...prev, address: '' }));
                                }}
                                placeholder="Specify Area Code or Name"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                        {errors.address && <Text className="text-label text-error mt-4 text-[10px] normal-case px-2 font-jakarta-bold">{errors.address}</Text>}

                        <Text className="text-label mb-4 mt-12 text-primary uppercase tracking-widest text-[10px] font-jakarta-extrabold">Resource Allocation</Text>
                        <Card className="bg-white rounded-[24px] p-6 border-[1.5px] border-card-border shadow-lg">
                            <View className="flex-row items-center justify-between bg-surface rounded-xl p-3 border border-card-border/50">
                                <TouchableOpacity
                                    onPress={() => setBudget(Math.max(1000, budget - 1000))}
                                    activeOpacity={0.7}
                                    className="w-14 h-14 rounded-lg bg-white items-center justify-center shadow-md border border-card-border"
                                >
                                    <Ionicons name="remove" size={24} color="#00120C" />
                                </TouchableOpacity>
                                
                                <View className="items-center flex-1">
                                    <Text className="text-h1 text-[36px] text-ink italic font-jakarta-extrabold tracking-tighter">{formatNaira(budget)}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => setBudget(budget + 1000)}
                                    activeOpacity={0.7}
                                    className="w-14 h-14 rounded-lg bg-primary items-center justify-center shadow-md border border-primary px-1"
                                >
                                    <Ionicons name="add" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View className="mt-5 flex-row justify-center items-center gap-2">
                                <View className="w-1.5 h-1.5 rounded-full bg-accent" />
                                <Text className="text-label text-muted text-[10px] uppercase font-jakarta-bold tracking-tight">
                                    Suggested Range: ₦5k — ₦45k
                                </Text>
                            </View>
                        </Card>

                        <View className="mt-12 gap-5">
                            <Text className="text-label text-primary uppercase tracking-widest text-[10px] font-jakarta-extrabold">Urgency Protocol</Text>
                            <View className="flex-row gap-3">
                                {URGENCY_OPTIONS.map((opt) => {
                                    const isSelected = urgency === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            activeOpacity={0.8}
                                            onPress={() => setUrgency(opt.value)}
                                            className={`flex-1 py-5 rounded-xl border-[1.5px] items-center justify-center shadow-sm ${
                                                isSelected 
                                                    ? (opt.value === 'now' ? 'bg-error border-error' : 'bg-primary border-primary') 
                                                    : 'bg-white border-card-border'
                                            }`}
                                        >
                                            <Text className={`text-label text-[10px] tracking-widest uppercase ${
                                                isSelected ? 'text-white font-jakarta-extrabold' : 'text-ink font-jakarta-bold'
                                            }`}>
                                                {opt.label.split(' ')[1]}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <PrimaryButton
                            title="REVIEW PROTOCOL"
                            onPress={() => {
                                if (!address || address.length < 3) {
                                    setErrors({ address: 'Deployment zone invalid: specify a valid area' });
                                } else {
                                    setStep(3);
                                }
                            }}
                            className="mt-16 h-16 rounded-xl shadow-xl border border-primary/10"
                        />
                    </Animated.View>
                )}

                {/* Step 4: Final Validation */}
                {step === 3 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-8 pt-8">
                        <Text className="text-h1 text-[32px] mb-2 uppercase italic font-jakarta-extrabold tracking-tight">Final Audit</Text>
                        <Text className="text-body text-muted mb-10 normal-case font-jakarta-medium">Verify mission parameters before broadcast.</Text>

                        <Card className="gap-10 p-8 bg-white border-[1.5px] border-card-border rounded-[32px] shadow-2xl overflow-hidden">
                            <View className="flex-row justify-between items-center">
                                <View className="gap-2">
                                    <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold tracking-widest">Service Classification</Text>
                                    <Text className="text-h2 text-ink uppercase italic font-jakarta-extrabold">
                                        {CATEGORIES.find((c) => c.id === category)?.label || 'Other Support'}
                                    </Text>
                                </View>
                                <View className="w-14 h-14 rounded-2xl bg-primary/5 items-center justify-center border border-primary/10">
                                    <Ionicons name={CATEGORIES.find((c) => c.id === category)?.icon as any || 'shield'} size={32} color="#00120C" />
                                </View>
                            </View>

                            <View className="gap-3">
                                <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold tracking-widest">Mission Objective</Text>
                                <Text className="text-body text-ink leading-7 normal-case font-jakarta-medium" numberOfLines={5}>{description}</Text>
                            </View>

                            <View className="h-[1px] bg-gray-50" />

                            <View className="flex-row justify-between items-end">
                                <View className="gap-2 flex-1">
                                    <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold tracking-widest">Operational Zone</Text>
                                    <Text className="text-body font-jakarta-bold uppercase text-ink tracking-tight shadow-sm">{address}</Text>
                                </View>
                                <View className="gap-2 items-end">
                                    <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold tracking-widest">Priority</Text>
                                    <Badge label={URGENCY_OPTIONS.find(o => o.value === urgency)?.label.split(' ')[1].toUpperCase()} variant={urgency === 'now' ? 'accent' : 'success'} />
                                </View>
                            </View>

                            <View className="bg-primary rounded-[20px] p-8 flex-row justify-between items-center shadow-xl border border-primary">
                                <View>
                                    <Text className="text-label text-white/50 text-[10px] uppercase font-jakarta-bold tracking-widest">Resource Allocation</Text>
                                    <Text className="text-h2 text-white text-[32px] uppercase italic font-jakarta-extrabold tracking-tighter mt-1">{formatNaira(budget)}</Text>
                                </View>
                                <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center border border-white/20">
                                    <Ionicons name="wallet-outline" size={24} color="white" />
                                </View>
                            </View>
                        </Card>

                        <View className="mt-14 gap-5">
                            <PrimaryButton
                                title="LOAD TO GRID"
                                onPress={handleSubmit}
                                loading={loading}
                                variant="accent"
                                className="h-16 rounded-xl shadow-2xl"
                            />
                            <View className="flex-row justify-center items-center gap-2">
                                <Ionicons name="lock-closed-outline" size={12} color="#94A3B8" />
                                <Text className="text-label text-center text-muted text-[10px] uppercase tracking-widest opacity-60 font-jakarta-bold">
                                    Secure Transmission protocol active
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}


