import { SubAppHeader } from '@/components/AppSubHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Badge, Card, Chip } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { jobApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { CategoryId, Urgency } from '@/types';
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
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, withSpring, useSharedValue, interpolateColor } from 'react-native-reanimated';

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
        // Final validation
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
            // Go to step with error
            if (errs.category) setStep(0);
            else if (errs.description) setStep(1);
            else if (errs.address || errs.budget) setStep(2);
            return;
        }

        setLoading(true);
        try {
            // POST /jobs — backend schema: { title, description, location }
            const backendJob = await jobApi.create({
                skill: category,
                description,
                budget,
                location: `${address}, ${user?.location?.city || 'Abuja'}`,
                urgency,
            });

            // Map the response to our frontend type
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
<<<<<<< HEAD
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
=======
            <View style={{ flex: 1, backgroundColor: Colors.background, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center' }}>
                <LoomThread variant="dense" opacity={0.2} animated />
                <Animated.View entering={FadeIn.duration(800).springify()} style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: Colors.primaryLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 40,
                    ...Shadows.lg
                }}>
                    <Ionicons name="shield-checkmark" size={64} color={Colors.primary} />
                </Animated.View>

                <Text style={[Typography.h1, { textAlign: 'center', fontSize: 32 }]}>Done!</Text>
                <Text style={[Typography.body, { textAlign: 'center', marginTop: 16, color: Colors.muted, lineHeight: 24 }]}>
                    Your job is out! We are looking for the best hands for you.
                </Text>

                <View style={{ width: '100%', marginTop: 56, gap: 12 }}>
                    <PrimaryButton
                        title="Who's in?"
                        onPress={() => router.push({ pathname: '/matched-artisans', params: { skill: category } })}
                        variant="accent"
                        style={{ height: 64, borderRadius: Radius.md, ...Shadows.md }}
                    />
                    <SecondaryButton
                        title="Home"
                        onPress={() => router.back()}
                        style={{ height: 60, borderRadius: Radius.md, borderColor: Colors.primary }}
                        textStyle={{ color: Colors.primary }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
            </View>
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            <SubAppHeader
                label={step === 0 ? "SERVICE PROCUREMENT" : "MISSION CALIBRATION"}
                title={step === 0 ? "INITIATE" : steps[step].toUpperCase()}
                description={step === 0 ? "Select the category of support required." : "Provide specific mission parameters below."}
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

<<<<<<< HEAD
            {/* ─── Tactical Stepper Matrix ───────────────────────────────────── */}
            <View className="flex-row px-8 py-8 gap-5 bg-white/40 border-b border-card-border/50">
                {steps.map((s, i) => (
                    <View key={s} className="flex-1 gap-2.5">
                        <View className={`h-1.5 rounded-full ${i <= step ? 'bg-primary shadow-primary/20' : 'bg-card-border/30'}`} />
                        <Text className={`text-label text-[10px] uppercase tracking-[2px] ${i === step ? 'text-primary font-jakarta-extrabold italic' : 'text-ink/20 font-jakarta-bold'}`}>
                            {s}
=======
            {/* Technical Stepper */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 20, gap: 12 }}>
                {steps.map((s, i) => (
                    <View key={s} style={{ flex: 1, gap: 6 }}>
                        <View style={{
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: i <= step ? Colors.primary : Colors.gray200
                        }} />
                        <Text style={[
                            Typography.label,
                            {
                                color: i === step ? Colors.primary : Colors.gray400,
                                fontSize: 8,
                                fontWeight: i === step ? '800' : '600'
                            }
                        ]}>
                            {s.toUpperCase()}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
                    <Animated.View entering={FadeInDown.springify()} className="px-8 pt-8">
                        <View className="flex-row flex-wrap gap-5">
                            {[...CATEGORIES, { id: 'not_sure', label: 'Others', icon: 'help-circle' }].map((cat) => {
=======
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                            {[...CATEGORIES, { id: 'not_sure', label: 'Other Support', icon: 'help-circle' }].map((cat) => {
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
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
=======
                                        style={{
                                            width: (width - 48 - 12) / 2,
                                            height: 160,
                                            borderRadius: Radius.lg,
                                            overflow: 'hidden',
                                            borderWidth: 2,
                                            borderColor: category === cat.id ? Colors.primary : (errors.category ? Colors.error : 'transparent'),
                                            ...Shadows.sm
                                        }}
                                    >
                                        <ImageBackground
                                            source={image || { uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop' }}
                                            style={{ width: '100%', height: '100%' }}
                                        >
                                            <View style={{
                                                position: 'absolute',
                                                top: 0, left: 0, right: 0, bottom: 0,
                                                backgroundColor: category === cat.id ? 'rgba(7, 131, 101, 0.7)' : 'rgba(0,0,0,0.45)',
                                            }} />
                                            
                                            <View style={{
                                                position: 'absolute',
                                                top: 12,
                                                left: 12,
                                                width: 36,
                                                height: 36,
                                                borderRadius: 12,
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                borderWidth: 1,
                                                borderColor: 'rgba(255,255,255,0.3)',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                                <Ionicons
                                                    name={(cat as any).icon || 'hammer-outline'}
                                                    size={24}
                                                    color="white"
                                                />
                                            </View>

<<<<<<< HEAD
                                            {isSelected && (
                                                <View className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white items-center justify-center shadow-2xl">
                                                    <Ionicons name="checkmark-done" size={20} color="#00120C" />
                                                </View>
                                            )}

                                            <View className="absolute bottom-6 left-6 right-6">
                                                <Text className="text-[16px] font-jakarta-extrabold text-white uppercase italic tracking-tighter">
=======
                                            {category === cat.id && (
                                                <View style={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: 12,
                                                    backgroundColor: Colors.white,
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Ionicons name="checkmark" size={16} color={Colors.primary} />
                                                </View>
                                            )}

                                            <View style={{
                                                position: 'absolute',
                                                bottom: 12,
                                                left: 12,
                                                right: 12
                                            }}>
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontFamily: 'PlusJakartaSans-Bold',
                                                    color: Colors.white,
                                                }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                                    {cat.label}
                                                </Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
<<<<<<< HEAD
                        {errors.category && <Text className="text-label text-error mt-6 text-[11px] uppercase italic px-2 font-jakarta-extrabold tracking-widest">{errors.category}</Text>}

                        <PrimaryButton
                            title="INITIALIZE INTEL PHASE"
=======
                        {errors.category && <Text style={[Typography.label, { color: Colors.error, marginTop: 16, fontSize: 10, textTransform: 'none' }]}>{errors.category}</Text>}

                        <PrimaryButton
                            title="Go"
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            onPress={() => {
                                if (!category) {
                                    setErrors({ category: 'MISSION PARAMETER MISSING: SELECT SERVICE' });
                                } else {
                                    setStep(1);
                                }
                            }}
<<<<<<< HEAD
                            className="mt-16 h-18 rounded-2xl shadow-2xl border border-white/10"
=======
                            style={{ marginTop: 48, height: 64, borderRadius: Radius.md }}
                            variant="primary"
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        />
                    </Animated.View>
                )}

                {/* ─── Step 2: Intel Acquisition ───────────────────────────────── */}
                {step === 1 && (
<<<<<<< HEAD
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
=======
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 8 }]}>Tell us more</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>Say everything we need to know.</Text>

                        <View style={{
                            backgroundColor: Colors.white,
                            borderRadius: Radius.lg,
                            borderWidth: 1.5,
                            borderColor: errors.description ? Colors.error : Colors.cardBorder,
                            padding: 20,
                            minHeight: 220,
                            ...Shadows.md
                        }}>
                            <TextInput
                                style={[Typography.body, { color: Colors.text, textAlignVertical: 'top', height: 140, fontSize: 16 }]}
                                placeholder='Write here...'
                                placeholderTextColor={Colors.gray400}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                multiline
                                autoFocus
                                value={description}
                                onChangeText={(val) => {
                                    setDescription(val);
                                    if (val.length >= 10) setErrors(prev => ({ ...prev, description: '' }));
                                }}
                            />

<<<<<<< HEAD
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
=======
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.gray100, paddingTop: 16, gap: 12 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.xs }}>
                                    <Ionicons name="mic-outline" size={18} color={Colors.primary} />
                                    <Text style={[Typography.label, { color: Colors.primary, fontSize: 9, textTransform: 'none' }]}>Voice Note</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.gray100, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.xs }}>
                                    <Ionicons name="images-outline" size={18} color={Colors.muted} />
                                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 9, textTransform: 'none' }]}>Add Photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {errors.description && <Text style={[Typography.label, { color: Colors.error, marginTop: 16, fontSize: 10, textTransform: 'none' }]}>{errors.description}</Text>}

                        <PrimaryButton
                            title="Go"
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            onPress={() => {
                                if (description.length < 10) {
                                    setErrors({ description: 'INTEL INSUFFICIENT: MIN 10 CHARACTERS' });
                                } else {
                                    setStep(2);
                                }
                            }}
<<<<<<< HEAD
                            className="mt-16 h-18 rounded-2xl shadow-2xl border border-white/10"
=======
                            style={{ marginTop: 48, height: 64, borderRadius: Radius.md }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        />
                    </Animated.View>
                )}

                {/* ─── Step 3: Logistics & Priority ───────────────────────────── */}
                {step === 2 && (
<<<<<<< HEAD
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
=======
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 8 }]}>Where & Cash</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 40 }]}>Where and how much cash?</Text>

                        <Text style={[Typography.label, { marginBottom: 12, color: Colors.primary }]}>WHERE?</Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.white,
                            borderRadius: Radius.md,
                            borderWidth: 1.5,
                            borderColor: errors.address ? Colors.error : Colors.cardBorder,
                            paddingHorizontal: 20,
                            height: 64,
                            marginBottom: 8,
                            gap: 16,
                            ...Shadows.sm
                        }}>
                            <Ionicons name="navigate-outline" size={24} color={Colors.primary} />
                            <TextInput
                                style={[Typography.body, { flex: 1, color: Colors.text, fontSize: 16 }]}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                value={address}
                                onChangeText={(val) => {
                                    setAddress(val);
                                    if (val.length > 3) setErrors(prev => ({ ...prev, address: '' }));
                                }}
<<<<<<< HEAD
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
=======
                                placeholder="Your area"
                                placeholderTextColor={Colors.gray400}
                            />
                        </View>
                        {errors.address && <Text style={[Typography.label, { color: Colors.error, marginBottom: 16, fontSize: 10, textTransform: 'none' }]}>{errors.address}</Text>}

                        <Text style={[Typography.label, { marginBottom: 16, marginTop: 32, color: Colors.primary }]}>CASH?</Text>
                        <View style={{
                            backgroundColor: Colors.white,
                            borderRadius: Radius.lg,
                            padding: 20,
                            borderWidth: 1.5,
                            borderColor: Colors.cardBorder,
                            ...Shadows.sm
                        }}>
                            <View style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                backgroundColor: Colors.gray100,
                                borderRadius: Radius.md,
                                padding: 8
                            }}>
                                <TouchableOpacity
                                    onPress={() => setBudget(Math.max(1000, budget - 1000))}
                                    activeOpacity={0.7}
                                    style={{ 
                                        width: 48, 
                                        height: 48, 
                                        borderRadius: Radius.sm, 
                                        backgroundColor: Colors.white, 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        ...Shadows.xs
                                    }}
                                >
                                    <Ionicons name="remove" size={20} color={Colors.primary} />
                                </TouchableOpacity>
                                
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={[Typography.h1, { fontSize: 32, color: Colors.text }]}>{formatNaira(budget)}</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                </View>

                                <TouchableOpacity
                                    onPress={() => setBudget(budget + 1000)}
<<<<<<< HEAD
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
=======
                                    activeOpacity={0.7}
                                    style={{ 
                                        width: 48, 
                                        height: 48, 
                                        borderRadius: Radius.sm, 
                                        backgroundColor: Colors.primary, 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        ...Shadows.xs
                                    }}
                                >
                                    <Ionicons name="add" size={20} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                                <Text style={[Typography.bodySmall, { color: Colors.muted, fontSize: 11 }]}>
                                    Suggested: ₦5k — ₦45k
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                </Text>
                            </View>
                        </View>

<<<<<<< HEAD
                        <View className="mt-14 gap-6">
                            <Text className="text-label text-primary uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic px-1">URGENCY TERMINAL</Text>
                            <View className="flex-row gap-4">
=======
                        <View style={{ marginTop: 40, gap: 16 }}>
                            <Text style={[Typography.label, { color: Colors.primary }]}>WHEN?</Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                {URGENCY_OPTIONS.map((opt) => {
                                    const isSelected = urgency === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            activeOpacity={0.9}
                                            onPress={() => setUrgency(opt.value)}
<<<<<<< HEAD
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
=======
                                            style={{
                                                flex: 1,
                                                paddingVertical: 18,
                                                borderRadius: Radius.md,
                                                backgroundColor: isSelected ? (opt.value === 'now' ? Colors.error : Colors.primary) : Colors.white,
                                                borderWidth: 1.5,
                                                borderColor: isSelected ? 'transparent' : Colors.cardBorder,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                ...(isSelected ? Shadows.md : {}),
                                                transform: [{ scale: isSelected ? 1.02 : 1 }]
                                            }}
                                        >
                                            <Text style={[Typography.label, { 
                                                color: isSelected ? Colors.white : Colors.text,
                                                fontSize: 10,
                                                letterSpacing: 1,
                                                textTransform: 'uppercase',
                                                fontWeight: isSelected ? '900' : '600'
                                            }]}>
                                                {opt.label.split(' ').slice(1).join(' ')}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <PrimaryButton
<<<<<<< HEAD
                            title="VERIFY MISSION AUDIT"
=======
                            title="Check Final Info"
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            onPress={() => {
                                if (!address || address.length < 3) {
                                    setErrors({ address: 'INVALID ZONE: SPECIFY AREA' });
                                } else {
                                    setStep(3);
                                }
                            }}
<<<<<<< HEAD
                            className="mt-16 h-18 rounded-2xl shadow-2xl border border-white/10"
=======
                            style={{ marginTop: 48, height: 64, borderRadius: Radius.lg }}
                            variant="primary"
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        />
                    </Animated.View>
                )}

                {/* ─── Step 4: Final Mission Audit ─────────────────────────────── */}
                {step === 3 && (
<<<<<<< HEAD
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
=======
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 8 }]}>Looks good?</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>Look am one more time.</Text>

                        <Card style={{
                            gap: 32,
                            padding: 24,
                            borderRadius: Radius.lg,
                            backgroundColor: Colors.white,
                            borderWidth: 1.5,
                            borderColor: Colors.cardBorder,
                            ...Shadows.lg
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ gap: 6 }}>
                                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>THE VIBE</Text>
                                    <Text style={[Typography.h3, { color: Colors.primary }]}>
                                        {CATEGORIES.find((c) => c.id === category)?.label || 'General Support'}
                                    </Text>
                                </View>
                                <View style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: Radius.xs,
                                    backgroundColor: Colors.primaryLight,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Ionicons name={CATEGORIES.find((c) => c.id === category)?.icon as any || 'shield'} size={28} color={Colors.primary} />
                                </View>
                            </View>

                            <View style={{ gap: 8 }}>
                                <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>WHAT TO DO</Text>
                                <Text style={[Typography.body, { color: Colors.text, lineHeight: 22 }]} numberOfLines={5}>{description}</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: Colors.gray100 }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ gap: 6, flex: 1 }}>
                                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>WHERE</Text>
                                    <Text style={[Typography.body, { fontWeight: '700' }]}>{address}</Text>
                                </View>
                                <View style={{ gap: 6, alignItems: 'flex-end' }}>
                                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>FAST?</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                    <Badge label={URGENCY_OPTIONS.find(o => o.value === urgency)?.label.split(' ')[1].toUpperCase()} variant={urgency === 'now' ? 'accent' : 'success'} />
                                </View>
                            </View>

<<<<<<< HEAD
                            <View className="bg-ink rounded-[42px] p-10 flex-row justify-between items-center shadow-3xl border border-white/10 mt-2">
                                <View>
                                    <Text className="text-label text-white/40 text-[10px] uppercase font-jakarta-extrabold tracking-[5px] italic">RESOURCE UNIT</Text>
                                    <Text className="text-[34px] text-white uppercase italic font-jakarta-extrabold tracking-tighter mt-2">{formatNaira(budget)}</Text>
                                </View>
                                <View className="w-16 h-16 rounded-[48px] bg-white/10 items-center justify-center border border-white/20 shadow-inner">
                                    <Ionicons name="wallet-outline" size={30} color="white" />
                                </View>
=======
                            <View style={{
                                backgroundColor: Colors.primary,
                                borderRadius: Radius.md,
                                padding: 24,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                ...Shadows.md
                            }}>
                                <Text style={[Typography.label, { color: 'rgba(255,255,255,0.7)', fontSize: 10 }]}>YOU PAY</Text>
                                <Text style={[Typography.h2, { color: Colors.white, fontSize: 26 }]}>{formatNaira(budget)}</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            </View>
                        </View>

<<<<<<< HEAD
                        <View className="mt-16 gap-6">
=======
                        <View style={{ marginTop: 40, gap: 16 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            <PrimaryButton
                                title="BROADCAST TO GRID"
                                onPress={handleSubmit}
                                loading={loading}
                                variant="accent"
<<<<<<< HEAD
                                className="h-18 rounded-2xl shadow-3xl border border-white/10"
                            />
                            <View className="flex-row justify-center items-center gap-2.5 opacity-30 pointer-events-none">
                                <Ionicons name="lock-closed" size={12} color="#94A3B8" />
                                <Text className="text-label text-center text-muted text-[9px] uppercase tracking-[5px] font-jakarta-extrabold italic">
                                    SECURE TRANSMISSION PROTOCOL ACTIVE
                                </Text>
                            </View>
=======
                                style={{ height: 64, borderRadius: Radius.md, ...Shadows.md }}
                            />
                            <Text style={[Typography.label, { textAlign: 'center', color: Colors.muted, textTransform: 'none', letterSpacing: 0, fontSize: 10 }]}>
                                Safe and sound.
                            </Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
