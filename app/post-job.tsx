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
    { label: '🔴 NOW', value: 'now' },
    { label: '🟡 TODAY', value: 'today' },
    { label: '🟢 WEEK', value: 'this_week' },
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

    const steps = ['Protocol', 'Intel', 'Logistics', 'Final'];

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
            Alert.alert('System Error', err.message ?? 'Transmission failed. Re-initiating backup protocols...');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <View className="flex-1 bg-background px-10 justify-center items-center">
                <View className="absolute inset-0">
                    <LoomThread variant="dense" opacity={0.3} animated scale={1.5} />
                </View>
                <Animated.View 
                    entering={FadeIn.duration(800).springify()} 
                    className="w-32 h-32 rounded-[48px] bg-success/10 items-center justify-center mb-12 shadow-2xl border border-success/20 backdrop-blur-md"
                >
                    <Ionicons name="shield-checkmark" size={68} color="#1AB26C" />
                </Animated.View>

                <Text className="text-h1 text-center text-[44px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink leading-tight">MISSION{"\n"}LIVE</Text>
                <Text className="text-[15px] text-center mt-6 text-ink/60 leading-7 normal-case font-jakarta-medium px-4 italic">
                    Your request has been broadcasted. Our intelligence is currently matching the perfect artisan for your project.
                </Text>

                <View className="w-full mt-16 gap-5">
                    <PrimaryButton
                        title="TRACK MISSION"
                        onPress={() => router.push({ pathname: '/matched-artisans', params: { skill: category } })}
                        variant="accent"
                        className="h-18 rounded-2xl shadow-2xl border border-white/10"
                    />
                    <TouchableOpacity
                        onPress={() => router.replace('/')}
                        className="h-18 rounded-2xl border-[2.5px] border-primary bg-white items-center justify-center flex-row shadow-lg active:bg-gray-50"
                    >
                        <Text className="text-primary font-jakarta-extrabold uppercase italic tracking-tighter text-[13px]">BACK TO COMMAND</Text>
                    </TouchableOpacity>
                </View>
                
                <Text className="mt-12 text-center text-[9px] text-muted uppercase tracking-[5px] font-jakarta-extrabold italic opacity-30">
                    MISSION REF: {Math.random().toString(36).substring(7).toUpperCase()}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
            </View>
            <SubAppHeader
                label={step === 0 ? "SERVICE PROCUREMENT" : "MISSION CALIBRATION"}
                title={step === 0 ? "INITIATE" : steps[step].toUpperCase()}
                description={step === 0 ? "Select the category of support required." : "Provide specific mission parameters below."}
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            {/* ─── Tactical Stepper Matrix ───────────────────────────────────── */}
            <View className="flex-row px-8 py-8 gap-5 bg-white/40 border-b border-card-border/50">
                {steps.map((s, i) => (
                    <View key={s} className="flex-1 gap-2.5">
                        <View className={`h-1.5 rounded-full ${i <= step ? 'bg-primary shadow-primary/20' : 'bg-card-border/30'}`} />
                        <Text className={`text-label text-[10px] uppercase tracking-[2px] ${i === step ? 'text-primary font-jakarta-extrabold italic' : 'text-ink/20 font-jakarta-bold'}`}>
                            {s}
                        </Text>
                    </View>
                ))}
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ─── Step 1: Protocol Classification ─────────────────────────── */}
                {step === 0 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-8 pt-8">
                        <View className="flex-row flex-wrap gap-5">
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
                                        className={`rounded-[32px] overflow-hidden border-[1.5px] shadow-lg transition-transform ${
                                            isSelected ? 'border-primary -translate-y-1 shadow-primary/20 shadow-2xl' : (errors.category ? 'border-error/50' : 'border-card-border/50')
                                        }`}
                                        style={{ width: (width - 64 - 20) / 2, height: 200 }}
                                    >
                                        <ImageBackground
                                            source={image || { uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop' }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        >
                                            <View className={`absolute inset-0 ${isSelected ? 'bg-primary/80' : 'bg-ink/50'}`} />
                                            
                                            <View className="absolute top-5 left-5 w-12 h-12 rounded-2xl bg-white/20 border border-white/30 items-center justify-center backdrop-blur-md shadow-inner">
                                                <Ionicons
                                                    name={(cat as any).icon || 'hammer-outline'}
                                                    size={24}
                                                    color="white"
                                                />
                                            </View>

                                            {isSelected && (
                                                <View className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white items-center justify-center shadow-2xl">
                                                    <Ionicons name="checkmark-done" size={20} color="#00120C" />
                                                </View>
                                            )}

                                            <View className="absolute bottom-6 left-6 right-6">
                                                <Text className="text-[16px] font-jakarta-extrabold text-white uppercase italic tracking-tighter">
                                                    {cat.label}
                                                </Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {errors.category && <Text className="text-label text-error mt-6 text-[11px] uppercase italic px-2 font-jakarta-extrabold tracking-widest">{errors.category}</Text>}

                        <PrimaryButton
                            title="INITIALIZE INTEL PHASE"
                            onPress={() => {
                                if (!category) {
                                    setErrors({ category: 'MISSION PARAMETER MISSING: SELECT SERVICE' });
                                } else {
                                    setStep(1);
                                }
                            }}
                            className="mt-16 h-18 rounded-2xl shadow-2xl border border-white/10"
                        />
                    </Animated.View>
                )}

                {/* ─── Step 2: Intel Acquisition ───────────────────────────────── */}
                {step === 1 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-8 pt-10">
                        <View className="flex-row items-center gap-2 mb-3 px-1">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                            <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">MISSION DEBRIEF</Text>
                        </View>
                        <Text className="text-h1 text-[40px] mb-3 uppercase italic font-jakarta-extrabold tracking-tighter text-ink">INTEL LOG</Text>
                        <Text className="text-[15px] text-ink/60 mb-12 normal-case font-jakarta-medium italic">Detail the specific parameters for this operational objective.</Text>

                        <View className={`bg-white rounded-[32px] border-[1.5px] overflow-hidden shadow-2xl ${
                            errors.description ? 'border-error/50 shadow-error/10' : 'border-card-border/50'
                        }`}>
                            <TextInput
                                className="text-[16px] text-ink p-8 min-h-[220px] font-jakarta-medium italic leading-7"
                                style={{ textAlignVertical: 'top' }}
                                placeholder='Commence mission briefing here...'
                                placeholderTextColor="#94A3B8"
                                multiline
                                autoFocus
                                value={description}
                                onChangeText={(val) => {
                                    setDescription(val);
                                    if (val.length >= 10) setErrors(prev => ({ ...prev, description: '' }));
                                }}
                            />

                            <View className="flex-row items-center justify-between border-t border-card-border/30 p-6 bg-background shadow-inner">
                                <View className="flex-row gap-4">
                                    <TouchableOpacity className="flex-row items-center gap-2.5 bg-primary/10 px-5 py-3 rounded-2xl border border-primary/20 active:bg-primary/20">
                                        <Ionicons name="mic-outline" size={20} color="#00120C" />
                                        <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold italic tracking-tight">AUDIO LOG</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center gap-2.5 bg-white px-5 py-3 rounded-2xl border border-card-border items-center justify-center shadow-sm active:bg-gray-50">
                                        <Ionicons name="images-outline" size={20} color="#64748B" />
                                        <Text className="text-label text-ink/40 text-[10px] uppercase font-jakarta-extrabold italic tracking-tight">ASSET</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="bg-white/80 px-4 py-2 rounded-full border border-card-border/50">
                                    <Text className="text-label text-ink/30 text-[10px] uppercase font-jakarta-extrabold italic tracking-tighter">{description.length}/500</Text>
                                </View>
                            </View>
                        </View>
                        {errors.description && <Text className="text-label text-error mt-6 text-[11px] uppercase italic px-2 font-jakarta-extrabold tracking-widest">{errors.description}</Text>}

                        <PrimaryButton
                            title="STAMP LOG & PROCEED"
                            onPress={() => {
                                if (description.length < 10) {
                                    setErrors({ description: 'INTEL INSUFFICIENT: MIN 10 CHARACTERS' });
                                } else {
                                    setStep(2);
                                }
                            }}
                            className="mt-16 h-18 rounded-2xl shadow-2xl border border-white/10"
                        />
                    </Animated.View>
                )}

                {/* ─── Step 3: Logistics & Priority ───────────────────────────── */}
                {step === 2 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-8 pt-10">
                        <View className="flex-row items-center gap-2 mb-3 px-1">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                            <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">LOGISTICAL PARAMETERS</Text>
                        </View>
                        <Text className="text-h1 text-[40px] mb-3 uppercase italic font-jakarta-extrabold tracking-tighter text-ink">LOGISTICS</Text>
                        <Text className="text-[15px] text-ink/60 mb-12 normal-case font-jakarta-medium italic">Define operational zone and budget allocation matrix.</Text>

                        <Text className="text-label mb-5 text-primary uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic px-1">DEPLOYMENT ZONE</Text>
                        <View className={`flex-row items-center bg-white rounded-[24px] border-[1.5px] px-7 h-18 shadow-2xl gap-5 ${
                            errors.address ? 'border-error/50 shadow-error/10' : 'border-card-border/50'
                        }`}>
                            <Ionicons name="navigate-outline" size={26} color="#00120C" />
                            <TextInput
                                className="text-[16px] flex-1 text-ink font-jakarta-extrabold italic uppercase tracking-tight"
                                value={address}
                                onChangeText={(val) => {
                                    setAddress(val);
                                    if (val.length > 3) setErrors(prev => ({ ...prev, address: '' }));
                                }}
                                placeholder="SPECIFY AREA CODE OR NAME"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                        {errors.address && <Text className="text-label text-error mt-4 text-[11px] uppercase italic px-2 font-jakarta-extrabold tracking-widest">{errors.address}</Text>}

                        <Text className="text-label mb-5 mt-14 text-primary uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic px-1">BUDGET PROTOCOL</Text>
                        <View className="bg-white rounded-[42px] p-10 border-[1.5px] border-card-border/50 shadow-2xl">
                            <View className="flex-row items-center justify-between bg-background rounded-[28px] p-4 border border-card-border/30 shadow-inner">
                                <TouchableOpacity
                                    onPress={() => setBudget(Math.max(1000, budget - 1000))}
                                    activeOpacity={0.8}
                                    className="w-16 h-16 rounded-2xl bg-white items-center justify-center shadow-xl border border-card-border active:scale-95"
                                >
                                    <Ionicons name="remove" size={30} color="#00120C" />
                                </TouchableOpacity>
                                
                                <View className="items-center flex-1">
                                    <Text className="text-[38px] text-primary italic font-jakarta-extrabold tracking-tighter">{formatNaira(budget)}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => setBudget(budget + 1000)}
                                    activeOpacity={0.8}
                                    className="w-16 h-16 rounded-2xl bg-primary items-center justify-center shadow-xl border border-primary active:scale-95 px-1"
                                >
                                    <Ionicons name="add" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View className="mt-8 flex-row justify-center items-center gap-3 opacity-40">
                                <View className="w-1.5 h-1.5 rounded-full bg-accent" />
                                <Text className="text-label text-ink text-[10px] uppercase font-jakarta-extrabold tracking-[4px] italic">
                                    SUGGESTED RANGE: ₦5K — ₦50K
                                </Text>
                            </View>
                        </View>

                        <View className="mt-14 gap-6">
                            <Text className="text-label text-primary uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic px-1">URGENCY TERMINAL</Text>
                            <View className="flex-row gap-4">
                                {URGENCY_OPTIONS.map((opt) => {
                                    const isSelected = urgency === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            activeOpacity={0.9}
                                            onPress={() => setUrgency(opt.value)}
                                            className={`flex-1 py-6 rounded-2xl border-[1.5px] items-center justify-center shadow-lg transition-transform ${
                                                isSelected 
                                                    ? (opt.value === 'now' ? 'bg-error border-error shadow-error/20 -translate-y-1' : 'bg-primary border-primary shadow-primary/20 -translate-y-1') 
                                                    : 'bg-white border-card-border/50'
                                            }`}
                                        >
                                            <Text className={`text-[11px] tracking-[2px] uppercase font-jakarta-extrabold italic ${
                                                isSelected ? 'text-white' : 'text-ink'
                                            }`}>
                                                {opt.label.split(' ')[1]}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <PrimaryButton
                            title="VERIFY MISSION AUDIT"
                            onPress={() => {
                                if (!address || address.length < 3) {
                                    setErrors({ address: 'INVALID ZONE: SPECIFY AREA' });
                                } else {
                                    setStep(3);
                                }
                            }}
                            className="mt-16 h-18 rounded-2xl shadow-2xl border border-white/10"
                        />
                    </Animated.View>
                )}

                {/* ─── Step 4: Final Mission Audit ─────────────────────────────── */}
                {step === 3 && (
                    <Animated.View entering={FadeInDown.springify()} className="px-8 pt-10">
                        <View className="flex-row items-center gap-2 mb-3 px-1">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                            <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">TRANSMISSION REVIEW</Text>
                        </View>
                        <Text className="text-h1 text-[40px] mb-3 uppercase italic font-jakarta-extrabold tracking-tighter text-ink">FINAL AUDIT</Text>
                        <Text className="text-[15px] text-ink/60 mb-12 normal-case font-jakarta-medium italic">Verify mission parameters before system-wide broadcast.</Text>

                        <View className="gap-12 p-10 bg-white border-[1.5px] border-card-border/50 rounded-[42px] shadow-3xl overflow-hidden">
                            <View className="flex-row justify-between items-center">
                                <View className="gap-3">
                                    <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold tracking-[5px] italic">CLASSIFICATION</Text>
                                    <Text className="text-[26px] text-ink uppercase italic font-jakarta-extrabold tracking-tighter">
                                        {CATEGORIES.find((c) => c.id === category)?.label || 'OTHER SUPPORT'}
                                    </Text>
                                </View>
                                <View className="w-16 h-16 rounded-3xl bg-background items-center justify-center border border-card-border/50 shadow-inner">
                                    <Ionicons name={CATEGORIES.find((c) => c.id === category)?.icon as any || 'shield-outline'} size={32} color="#00120C" />
                                </View>
                            </View>

                            <View className="gap-4">
                                <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold tracking-[5px] italic">MISSION OBJECTIVE</Text>
                                <Text className="text-[15px] text-ink/70 leading-7 italic font-jakarta-medium" numberOfLines={6}>{description}</Text>
                            </View>

                            <View className="h-[1.5px] bg-card-border/20" />

                            <View className="flex-row justify-between items-end">
                                <View className="gap-3 flex-1">
                                    <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold tracking-[5px] italic">TARGET ZONE</Text>
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="navigate" size={14} color="#00120C" />
                                        <Text className="text-[16px] font-jakarta-extrabold uppercase text-ink tracking-tight italic">{address}</Text>
                                    </View>
                                </View>
                                <View className="gap-3 items-end">
                                    <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold tracking-[5px] italic">PRIORITY</Text>
                                    <Badge label={URGENCY_OPTIONS.find(o => o.value === urgency)?.label.split(' ')[1].toUpperCase()} variant={urgency === 'now' ? 'accent' : 'success'} />
                                </View>
                            </View>

                            <View className="bg-ink rounded-[42px] p-10 flex-row justify-between items-center shadow-3xl border border-white/10 mt-2">
                                <View>
                                    <Text className="text-label text-white/40 text-[10px] uppercase font-jakarta-extrabold tracking-[5px] italic">RESOURCE UNIT</Text>
                                    <Text className="text-[34px] text-white uppercase italic font-jakarta-extrabold tracking-tighter mt-2">{formatNaira(budget)}</Text>
                                </View>
                                <View className="w-16 h-16 rounded-[48px] bg-white/10 items-center justify-center border border-white/20 shadow-inner">
                                    <Ionicons name="wallet-outline" size={30} color="white" />
                                </View>
                            </View>
                        </View>

                        <View className="mt-16 gap-6">
                            <PrimaryButton
                                title="BROADCAST TO GRID"
                                onPress={handleSubmit}
                                loading={loading}
                                variant="accent"
                                className="h-18 rounded-2xl shadow-3xl border border-white/10"
                            />
                            <View className="flex-row justify-center items-center gap-2.5 opacity-30 pointer-events-none">
                                <Ionicons name="lock-closed" size={12} color="#94A3B8" />
                                <Text className="text-label text-center text-muted text-[9px] uppercase tracking-[5px] font-jakarta-extrabold italic">
                                    SECURE TRANSMISSION PROTOCOL ACTIVE
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}
                
                <View className="mt-20 items-center opacity-20 pointer-events-none">
                    <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Operational Directive Matrix v4.2 • Loom Command</Text>
                </View>
            </ScrollView>
        </View>
    );
}
