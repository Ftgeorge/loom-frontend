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
            <View className="flex-1 bg-background px-8 justify-center items-center">
                <LoomThread variant="dense" opacity={0.2} animated />
                <Animated.View entering={FadeIn.duration(800).springify()} className="w-30 h-30 rounded-full bg-primary/10 items-center justify-center mb-10 shadow-lg">
                    <Ionicons name="shield-checkmark" size={64} color="#078365" />
                </Animated.View>

                <Text className="text-h1 text-center text-[32px] uppercase">Done!</Text>
                <Text className="text-body text-center mt-4 text-muted leading-6">
                    Your job is out! We are looking for the best hands for you.
                </Text>

                <View className="w-full mt-14 gap-3">
                    <PrimaryButton
                        title="WHO'S IN?"
                        onPress={() => router.push({ pathname: '/matched-artisans', params: { skill: category } })}
                        variant="accent"
                        className="h-16 rounded-md shadow-md"
                    />
                    <SecondaryButton
                        title="HOME"
                        onPress={() => router.back()}
                        className="h-15 rounded-md border-primary"
                        textStyle={{ color: '#078365', fontFamily: 'PlusJakartaSans-Bold' }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.3} animated />
            <SubAppHeader
                label="POST A JOB"
                title="Need a hand?"
                description="Pick a service and tell us what you need done."
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            {/* Technical Stepper */}
            <View className="flex-row px-6 py-5 gap-3">
                {steps.map((s, i) => (
                    <View key={s} className="flex-1 gap-[6px]">
                        <View className={`h-[3px] rounded-full ${i <= step ? 'bg-primary' : 'bg-gray-200'}`} />
                        <Text className={`text-label text-[8px] uppercase ${i === step ? 'text-primary font-jakarta-extrabold' : 'text-gray-400 font-jakarta-bold'}`}>
                            {s}
                        </Text>
                    </View>
                ))}
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Step 1: Category */}
                {step === 0 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-6 pt-4">

                        <View className="flex-row flex-wrap gap-3">
                            {[...CATEGORIES, { id: 'not_sure', label: 'Other Support', icon: 'help-circle' }].map((cat) => {
                                const image = CATEGORY_IMAGES[cat.id];
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setCategory(cat.id);
                                            setErrors(prev => ({ ...prev, category: '' }));
                                        }}
                                        className={`rounded-lg overflow-hidden border-2 shadow-sm ${
                                            category === cat.id ? 'border-primary' : (errors.category ? 'border-error' : 'border-transparent')
                                        }`}
                                        style={{ width: (width - 48 - 12) / 2, height: 160 }}
                                    >
                                        <ImageBackground
                                            source={image || { uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop' }}
                                            className="w-full h-full"
                                        >
                                            <View className={`absolute inset-0 ${category === cat.id ? 'bg-primary/70' : 'bg-black/45'}`} />
                                            
                                            <View className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/20 border border-white/30 items-center justify-center">
                                                <Ionicons
                                                    name={(cat as any).icon || 'hammer-outline'}
                                                    size={20}
                                                    color="white"
                                                />
                                            </View>

                                            {category === cat.id && (
                                                <View className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white items-center justify-center">
                                                    <Ionicons name="checkmark" size={16} color="#078365" />
                                                </View>
                                            )}

                                            <View className="absolute bottom-3 left-3 right-3">
                                                <Text className="text-[14px] font-jakarta-bold text-white uppercase">
                                                    {cat.label}
                                                </Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {errors.category && <Text className="text-label text-error mt-4 text-[10px] normal-case">{errors.category}</Text>}

                        <PrimaryButton
                            title="NEXT STEP"
                            onPress={() => {
                                if (!category) {
                                    setErrors({ category: 'Please select a service' });
                                } else {
                                    setStep(1);
                                }
                            }}
                            className="mt-12 h-16 rounded-md"
                            variant="primary"
                        />
                    </Animated.View>
                )}

                {/* Step 2: Description */}
                {step === 1 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-6 pt-4">
                        <Text className="text-h1 text-[28px] mb-2 uppercase">Tell us more</Text>
                        <Text className="text-body text-muted mb-8 normal-case">Say everything we need to know.</Text>

                        <View className={`bg-white rounded-lg border-[1.5px] p-5 min-h-[220px] shadow-md ${
                            errors.description ? 'border-error' : 'border-card-border'
                        }`}>
                            <TextInput
                                className="text-body text-ink text-base min-h-[140px]"
                                style={{ textAlignVertical: 'top' }}
                                placeholder='Write here...'
                                placeholderTextColor="#94A3B8"
                                multiline
                                autoFocus
                                value={description}
                                onChangeText={(val) => {
                                    setDescription(val);
                                    if (val.length >= 10) setErrors(prev => ({ ...prev, description: '' }));
                                }}
                            />

                            <View className="flex-row border-t border-gray-100 pt-4 gap-3">
                                <TouchableOpacity className="flex-row items-center gap-[6px] bg-primary/10 px-3 py-2 rounded-xs">
                                    <Ionicons name="mic-outline" size={18} color="#078365" />
                                    <Text className="text-label text-primary text-[9px] normal-case">Voice Note</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center gap-[6px] bg-gray-100 px-3 py-2 rounded-xs">
                                    <Ionicons name="images-outline" size={18} color="#64748B" />
                                    <Text className="text-label text-muted text-[9px] normal-case">Add Photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {errors.description && <Text className="text-label text-error mt-4 text-[10px] normal-case">{errors.description}</Text>}

                        <PrimaryButton
                            title="NEXT STEP"
                            onPress={() => {
                                if (description.length < 10) {
                                    setErrors({ description: 'Please provide more details (min 10 chars)' });
                                } else {
                                    setStep(2);
                                }
                            }}
                            className="mt-12 h-16 rounded-md"
                        />
                    </Animated.View>
                )}

                {/* Step 3: Location & Budget */}
                {step === 2 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-6 pt-4">
                        <Text className="text-h1 text-[28px] mb-2 uppercase">Where & Cash</Text>
                        <Text className="text-body text-muted mb-10 normal-case">Where and how much cash?</Text>

                        <Text className="text-label mb-3 text-primary uppercase">Where?</Text>
                        <View className={`flex-row items-center bg-white rounded-md border-[1.5px] px-5 h-16 mb-2 gap-4 shadow-sm ${
                            errors.address ? 'border-error' : 'border-card-border'
                        }`}>
                            <Ionicons name="navigate-outline" size={24} color="#078365" />
                            <TextInput
                                className="text-body flex-1 text-ink text-base"
                                value={address}
                                onChangeText={(val) => {
                                    setAddress(val);
                                    if (val.length > 3) setErrors(prev => ({ ...prev, address: '' }));
                                }}
                                placeholder="Your area"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                        {errors.address && <Text className="text-label text-error mb-4 text-[10px] normal-case">{errors.address}</Text>}

                        <Text className="text-label mb-4 mt-8 text-primary uppercase">Cash?</Text>
                        <View className="bg-white rounded-lg p-5 border-[1.5px] border-card-border shadow-sm">
                            <View className="flex-row items-center justify-between bg-gray-100 rounded-md p-2">
                                <TouchableOpacity
                                    onPress={() => setBudget(Math.max(1000, budget - 1000))}
                                    activeOpacity={0.7}
                                    className="w-12 h-12 rounded-sm bg-white items-center justify-center shadow-xs"
                                >
                                    <Ionicons name="remove" size={20} color="#078365" />
                                </TouchableOpacity>
                                
                                <View className="items-center flex-1">
                                    <Text className="text-h1 text-[32px] text-ink">{formatNaira(budget)}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => setBudget(budget + 1000)}
                                    activeOpacity={0.7}
                                    className="w-12 h-12 rounded-sm bg-primary items-center justify-center shadow-xs"
                                >
                                    <Ionicons name="add" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View className="mt-4 flex-row justify-center items-center gap-[6px]">
                                <Text className="text-body-sm text-muted text-[11px] normal-case">
                                    Suggested: ₦5k — ₦45k
                                </Text>
                            </View>
                        </View>

                        <View className="mt-10 gap-4">
                            <Text className="text-label text-primary uppercase">When?</Text>
                            <View className="flex-row gap-[10px]">
                                {URGENCY_OPTIONS.map((opt) => {
                                    const isSelected = urgency === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            activeOpacity={0.7}
                                            onPress={() => setUrgency(opt.value)}
                                            className={`flex-1 py-[18px] rounded-md border-[1.5px] items-center justify-center ${
                                                isSelected 
                                                    ? (opt.value === 'now' ? 'bg-error border-error shadow-md' : 'bg-primary border-primary shadow-md') 
                                                    : 'bg-white border-card-border'
                                            }`}
                                            style={{ transform: [{ scale: isSelected ? 1.02 : 1 }] }}
                                        >
                                            <Text className={`text-label text-[10px] tracking-[1px] uppercase ${
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
                            title="REVIEW DETAILS"
                            onPress={() => {
                                if (!address || address.length < 3) {
                                    setErrors({ address: 'Please provide an address' });
                                } else {
                                    setStep(3);
                                }
                            }}
                            className="mt-12 h-16 rounded-lg"
                        />
                    </Animated.View>
                )}

                {/* Step 4: Review */}
                {step === 3 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-6 pt-4">
                        <Text className="text-h1 text-[28px] mb-2 uppercase">Looks good?</Text>
                        <Text className="text-body text-muted mb-8 normal-case">Look am one more time.</Text>

                        <Card className="gap-8 p-6 bg-white border-[1.5px] border-card-border rounded-lg shadow-lg">
                            <View className="flex-row justify-between items-center">
                                <View className="gap-[6px]">
                                    <Text className="text-label text-muted text-[10px] uppercase">The Vibe</Text>
                                    <Text className="text-h3 text-primary uppercase">
                                        {CATEGORIES.find((c) => c.id === category)?.label || 'General Support'}
                                    </Text>
                                </View>
                                <View className="w-12.5 h-12.5 rounded-xs bg-primary/10 items-center justify-center">
                                    <Ionicons name={CATEGORIES.find((c) => c.id === category)?.icon as any || 'shield'} size={28} color="#078365" />
                                </View>
                            </View>

                            <View className="gap-2">
                                <Text className="text-label text-muted text-[10px] uppercase">What to do</Text>
                                <Text className="text-body text-ink leading-[22px] normal-case" numberOfLines={5}>{description}</Text>
                            </View>

                            <View className="h-[1px] bg-gray-100" />

                            <View className="flex-row justify-between">
                                <View className="gap-[6px] flex-1">
                                    <Text className="text-label text-muted text-[10px] uppercase">Where</Text>
                                    <Text className="text-body font-jakarta-bold uppercase">{address}</Text>
                                </View>
                                <View className="gap-[6px] items-end">
                                    <Text className="text-label text-muted text-[10px] uppercase">Fast?</Text>
                                    <Badge label={URGENCY_OPTIONS.find(o => o.value === urgency)?.label.split(' ')[1].toUpperCase()} variant={urgency === 'now' ? 'accent' : 'success'} />
                                </View>
                            </View>

                            <View className="bg-primary rounded-md p-6 flex-row justify-between items-center shadow-md">
                                <Text className="text-label text-white/70 text-[10px] uppercase">You Pay</Text>
                                <Text className="text-h2 text-white text-[26px] uppercase">{formatNaira(budget)}</Text>
                            </View>
                        </Card>

                        <View className="mt-10 gap-4">
                            <PrimaryButton
                                title="LOOM IT"
                                onPress={handleSubmit}
                                loading={loading}
                                variant="accent"
                                className="h-16 rounded-md shadow-md"
                            />
                            <Text className="text-label text-center text-muted text-[10px] normal-case tracking-normal">
                                Safe and sound.
                            </Text>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}

