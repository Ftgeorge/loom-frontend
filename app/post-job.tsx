import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Badge, Card, Chip } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { jobApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { CategoryId, Urgency } from '@/types';
import { CATEGORIES } from '@/types';
import { JobRequestSchema, mapZodErrors, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
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

    const steps = ['Type', 'Deets', 'Place', 'Review'];

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
            Alert.alert('Error', err.message ?? 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
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

                <Text style={[Typography.h1, { textAlign: 'center', fontSize: 32 }]}>Job Posted!</Text>
                <Text style={[Typography.body, { textAlign: 'center', marginTop: 16, color: Colors.muted, lineHeight: 24 }]}>
                    Your request is now live. We're matching you with the best professionals in your area.
                </Text>

                <View style={{ width: '100%', marginTop: 56, gap: 12 }}>
                    <PrimaryButton
                        title="View Matches"
                        onPress={() => router.push({ pathname: '/matched-artisans', params: { skill: category } })}
                        variant="accent"
                        style={{ height: 64, borderRadius: Radius.md, ...Shadows.md }}
                    />
                    <SecondaryButton
                        title="Go to Home"
                        onPress={() => router.back()}
                        style={{ height: 60, borderRadius: Radius.md, borderColor: Colors.primary }}
                        textStyle={{ color: Colors.primary }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
            <AppHeader
                title="Post a Job"
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

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
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 8 }]}>Select Service</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 40 }]}>What kind of professional do you need?</Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                            {[...CATEGORIES, { id: 'not_sure', label: 'Other Support', icon: 'help-circle' }].map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setCategory(cat.id);
                                        setErrors(prev => ({ ...prev, category: '' }));
                                    }}
                                    style={{
                                        width: (width - 48 - 12) / 2,
                                        backgroundColor: category === cat.id ? Colors.primary : Colors.white,
                                        borderWidth: 1.5,
                                        borderColor: category === cat.id ? Colors.primary : (errors.category ? Colors.error : Colors.cardBorder),
                                        borderRadius: Radius.md,
                                        padding: 24,
                                        alignItems: 'center',
                                        gap: 12,
                                        ...Shadows.sm
                                    }}
                                >
                                    <View style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: Radius.xs,
                                        backgroundColor: category === cat.id ? 'rgba(255,255,255,0.1)' : Colors.primaryLight,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Ionicons
                                            name={(cat as any).icon || 'hammer-outline'}
                                            size={28}
                                            color={category === cat.id ? Colors.white : Colors.primary}
                                        />
                                    </View>
                                    <Text style={[Typography.label, {
                                        color: category === cat.id ? Colors.white : Colors.text,
                                        textAlign: 'center',
                                        fontSize: 10,
                                        letterSpacing: 0,
                                        textTransform: 'none'
                                    }]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.category && <Text style={[Typography.label, { color: Colors.error, marginTop: 16, fontSize: 10, textTransform: 'none' }]}>{errors.category}</Text>}

                        <PrimaryButton
                            title="Continue"
                            onPress={() => {
                                if (!category) {
                                    setErrors({ category: 'Please select a service' });
                                } else {
                                    setStep(1);
                                }
                            }}
                            style={{ marginTop: 48, height: 64, borderRadius: Radius.md }}
                            variant="primary"
                        />
                    </Animated.View>
                )}

                {/* Step 2: Description */}
                {step === 1 && (
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 8 }]}>Job Details</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>Describe what you need help with.</Text>

                        <View style={{
                            backgroundColor: Colors.white,
                            borderRadius: Radius.md,
                            borderWidth: 1.5,
                            borderColor: errors.description ? Colors.error : Colors.cardBorder,
                            padding: 20,
                            minHeight: 220,
                            ...Shadows.md
                        }}>
                            <TextInput
                                style={[Typography.body, { color: Colors.text, textAlignVertical: 'top', height: 140, fontSize: 16 }]}
                                placeholder='Type your message here...'
                                placeholderTextColor={Colors.gray400}
                                multiline
                                autoFocus
                                value={description}
                                onChangeText={(val) => {
                                    setDescription(val);
                                    if (val.length >= 10) setErrors(prev => ({ ...prev, description: '' }));
                                }}
                            />

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
                            title="Continue to Location"
                            onPress={() => {
                                if (description.length < 10) {
                                    setErrors({ description: 'Please provide more details (min 10 chars)' });
                                } else {
                                    setStep(2);
                                }
                            }}
                            style={{ marginTop: 48, height: 64, borderRadius: Radius.md }}
                        />
                    </Animated.View>
                )}

                {/* Step 3: Location & Budget */}
                {step === 2 && (
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 8 }]}>Logistics</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 40 }]}>Where and what is your budget?</Text>

                        <Text style={[Typography.label, { marginBottom: 12, color: Colors.primary }]}>SERVICE ADDRESS</Text>
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
                                value={address}
                                onChangeText={(val) => {
                                    setAddress(val);
                                    if (val.length > 3) setErrors(prev => ({ ...prev, address: '' }));
                                }}
                                placeholder="Area, City"
                                placeholderTextColor={Colors.gray400}
                            />
                        </View>
                        {errors.address && <Text style={[Typography.label, { color: Colors.error, marginBottom: 16, fontSize: 10, textTransform: 'none' }]}>{errors.address}</Text>}

                        <Text style={[Typography.label, { marginBottom: 16, marginTop: 32, color: Colors.primary }]}>ESTIMATED BUDGET</Text>
                        <View style={{
                            backgroundColor: Colors.white,
                            borderRadius: Radius.md,
                            padding: 32,
                            alignItems: 'center',
                            borderWidth: 1.5,
                            borderColor: Colors.cardBorder,
                            ...Shadows.md
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 40 }}>
                                <TouchableOpacity
                                    onPress={() => setBudget(Math.max(1000, budget - 1000))}
                                    style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Ionicons name="remove" size={24} color={Colors.primary} />
                                </TouchableOpacity>
                                <Text style={[Typography.h1, { fontSize: 44, color: Colors.text }]}>{formatNaira(budget)}</Text>
                                <TouchableOpacity
                                    onPress={() => setBudget(budget + 1000)}
                                    style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Ionicons name="add" size={24} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[Typography.label, { marginTop: 24, color: Colors.muted, textTransform: 'none', letterSpacing: 0 }]}>
                                Standard range: ₦5k — ₦45k
                            </Text>
                        </View>

                        <View style={{ marginTop: 40, gap: 16 }}>
                            <Text style={[Typography.label, { color: Colors.primary }]}>URGENCY</Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {URGENCY_OPTIONS.map((opt) => (
                                    <Chip
                                        key={opt.value}
                                        label={opt.label.split(' ')[1].toUpperCase()}
                                        selected={urgency === opt.value}
                                        onPress={() => setUrgency(opt.value)}
                                        containerStyle={{
                                            paddingVertical: 12,
                                            paddingHorizontal: 16,
                                            backgroundColor: urgency === opt.value ? (opt.value === 'now' ? Colors.error : Colors.primary) : Colors.white
                                        }}
                                    />
                                ))}
                            </View>
                        </View>

                        <PrimaryButton
                            title="Continue to Review"
                            onPress={() => {
                                if (!address || address.length < 3) {
                                    setErrors({ address: 'Please provide an address' });
                                } else {
                                    setStep(3);
                                }
                            }}
                            style={{ marginTop: 48, height: 64, borderRadius: Radius.md }}
                            variant="primary"
                        />
                    </Animated.View>
                )}

                {/* Step 4: Review */}
                {step === 3 && (
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h1, { fontSize: 28, marginBottom: 8 }]}>Review Details</Text>
                        <Text style={[Typography.body, { color: Colors.muted, marginBottom: 32 }]}>Verify all details before posting your job.</Text>

                        <Card style={{
                            gap: 32,
                            padding: 24,
                            borderRadius: Radius.md,
                            backgroundColor: Colors.white,
                            borderWidth: 1.5,
                            borderColor: Colors.cardBorder,
                            ...Shadows.lg
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ gap: 6 }}>
                                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>SERVICE TYPE</Text>
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
                                <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>DESCRIPTION</Text>
                                <Text style={[Typography.body, { color: Colors.text, lineHeight: 22 }]} numberOfLines={5}>{description}</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: Colors.gray100 }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ gap: 6, flex: 1 }}>
                                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>LOCATION</Text>
                                    <Text style={[Typography.body, { fontWeight: '700' }]}>{address}</Text>
                                </View>
                                <View style={{ gap: 6, alignItems: 'flex-end' }}>
                                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>PRIORITY</Text>
                                    <Badge label={URGENCY_OPTIONS.find(o => o.value === urgency)?.label.split(' ')[1].toUpperCase()} variant={urgency === 'now' ? 'accent' : 'success'} />
                                </View>
                            </View>

                            <View style={{
                                backgroundColor: Colors.primary,
                                borderRadius: Radius.xs,
                                padding: 24,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                ...Shadows.md
                            }}>
                                <Text style={[Typography.label, { color: 'rgba(255,255,255,0.7)', fontSize: 10 }]}>TOTAL BUDGET</Text>
                                <Text style={[Typography.h2, { color: Colors.white, fontSize: 26 }]}>{formatNaira(budget)}</Text>
                            </View>
                        </Card>

                        <View style={{ marginTop: 40, gap: 16 }}>
                            <PrimaryButton
                                title="POST JOB NOW"
                                onPress={handleSubmit}
                                loading={loading}
                                variant="accent"
                                style={{ height: 64, borderRadius: Radius.md, ...Shadows.md }}
                            />
                            <Text style={[Typography.label, { textAlign: 'center', color: Colors.muted, textTransform: 'none', letterSpacing: 0, fontSize: 10 }]}>
                                Your details are safe and secure.
                            </Text>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
