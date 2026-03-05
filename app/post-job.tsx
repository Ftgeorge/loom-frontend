import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Badge, Card, Chip } from '@/components/ui/CardChipBadge';
import { jobApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { CategoryId, Urgency } from '@/types';
import { CATEGORIES } from '@/types';
import { formatNaira } from '@/utils/helpers';
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
    const [address, setAddress] = useState(user?.location.area || '');
    const [budget, setBudget] = useState(10000);
    const [urgency, setUrgency] = useState<Urgency>('today');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const steps = ['Type', 'Deets', 'Place', 'Review'];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // POST /jobs — backend schema: { title, description, location }
            const backendJob = await jobApi.create({
                skill: category || 'not_sure',
                description,
                budget,
                location: `${address}, ${user?.location?.city || 'Abuja'}`,
                urgency,
            });
            // Also keep a local copy in the store for immediate UI feedback
            addJob({
                id: backendJob.id,
                clientId: user?.id || 'u1',
                clientName: user?.name || 'User',
                category: (category || 'not_sure') as CategoryId | 'not_sure',
                description,
                budget,
                urgency,
                location: {
                    area: address,
                    city: user?.location?.city || 'Abuja',
                    state: user?.location?.state || 'FCT',
                },
                status: (backendJob.status as any) || 'submitted',
                createdAt: new Date().toISOString(),
            });
            setSubmitted(true);
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.surface, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View entering={FadeIn.duration(600)} style={{ marginBottom: 32 }}>
                    <Ionicons name="checkmark-circle" size={100} color={Colors.success} />
                </Animated.View>
                <Text style={[Typography.h1, { textAlign: 'center' }]}>Request Live! 🚀</Text>
                <Text style={[Typography.body, { textAlign: 'center', marginTop: 16, color: Colors.textSecondary }]}>
                    We're matching you with the best artisans. We'll holla at you once we find a pro.
                </Text>
                <PrimaryButton
                    title="View Matches"
                    onPress={() => router.push({ pathname: '/matched-artisans', params: { skill: category } })}
                    style={{ marginTop: 48, width: '100%' }}
                />
                <SecondaryButton
                    title="Done"
                    onPress={() => router.back()}
                    style={{ marginTop: 16, width: '100%' }}
                />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader
                title="Create Request"
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            {/* Premium Stepper */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 16, gap: 8 }}>
                {steps.map((s, i) => (
                    <View key={s} style={{ flex: 1, gap: 4 }}>
                        <View style={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: i <= step ? Colors.primary : Colors.cardBorder
                        }} />
                        <Text style={[
                            Typography.label,
                            { color: i === step ? Colors.primary : Colors.muted, fontSize: 9 }
                        ]}>
                            {s}
                        </Text>
                    </View>
                ))}
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Step 1: Category */}
                {step === 0 && (
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h2, { marginBottom: 8 }]}>What happened? 🛠️</Text>
                        <Text style={[Typography.body, { marginBottom: 32 }]}>Choose a category so we can find the right pro.</Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                            {[...CATEGORIES, { id: 'not_sure', label: 'Other / Not Sure', icon: 'help-circle' }].map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    activeOpacity={0.8}
                                    onPress={() => setCategory(cat.id)}
                                    style={{
                                        width: (width - 48 - 12) / 2,
                                        backgroundColor: category === cat.id ? Colors.primaryLight : Colors.surface,
                                        borderWidth: 1.5,
                                        borderColor: category === cat.id ? Colors.primary : Colors.cardBorder,
                                        borderRadius: Radius.lg,
                                        padding: 20,
                                        alignItems: 'center',
                                        gap: 8,
                                        ...Shadows.sm
                                    }}
                                >
                                    <Ionicons name={(cat as any).icon || 'hammer'} size={32} color={category === cat.id ? Colors.primary : Colors.textSecondary} />
                                    <Text style={[Typography.bodySmall, {
                                        fontFamily: category === cat.id ? 'MontserratAlternates-SemiBold' : 'MontserratAlternates',
                                        color: category === cat.id ? Colors.primary : Colors.textSecondary,
                                        textAlign: 'center'
                                    }]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <PrimaryButton
                            title="Continue"
                            onPress={() => setStep(1)}
                            disabled={!category}
                            style={{ marginTop: 40 }}
                        />
                    </Animated.View>
                )}

                {/* Step 2: Description */}
                {step === 1 && (
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h2, { marginBottom: 8 }]}>Gimme deets ✍️</Text>
                        <Text style={[Typography.body, { marginBottom: 24 }]}>Briefly explain the issue. You can use English or Pidgin.</Text>

                        <View style={{
                            backgroundColor: Colors.surface,
                            borderRadius: Radius.lg,
                            borderWidth: 1.5,
                            borderColor: Colors.cardBorder,
                            padding: 16,
                            minHeight: 180,
                            ...Shadows.sm
                        }}>
                            <TextInput
                                style={[Typography.body, { color: Colors.text, textAlignVertical: 'top', height: 120 }]}
                                placeholder='English: "My socket sparked..."&#10;Pidgin: "My socket dey spark..."'
                                placeholderTextColor={Colors.muted}
                                multiline
                                autoFocus
                                value={description}
                                onChangeText={setDescription}
                            />

                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.cardBorder, paddingTop: 12, gap: 12 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.md }}>
                                    <Ionicons name="mic" size={18} color={Colors.primary} />
                                    <Text style={[Typography.label, { color: Colors.primary }]}>Voice Assistant</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.md }}>
                                    <Ionicons name="camera" size={18} color={Colors.muted} />
                                    <Text style={[Typography.label, { color: Colors.muted }]}>Add Photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <PrimaryButton
                            title="Continue"
                            onPress={() => setStep(2)}
                            disabled={description.length < 5}
                            style={{ marginTop: 40 }}
                        />
                    </Animated.View>
                )}

                {/* Step 3: Location & Budget */}
                {step === 2 && (
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h2, { marginBottom: 8 }]}>Where & How much? 💰</Text>
                        <Text style={[Typography.body, { marginBottom: 32 }]}>Set your location and estimated budget.</Text>

                        <Text style={[Typography.label, { marginBottom: 8 }]}>Service Address</Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.surface,
                            borderRadius: Radius.lg,
                            borderWidth: 1.5,
                            borderColor: Colors.cardBorder,
                            paddingHorizontal: 16,
                            height: 56,
                            marginBottom: 24,
                            gap: 12
                        }}>
                            <Ionicons name="location" size={20} color={Colors.primary} />
                            <TextInput
                                style={[Typography.body, { flex: 1, color: Colors.text }]}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Area, City"
                            />
                        </View>

                        <Text style={[Typography.label, { marginBottom: 16 }]}>Estimated Budget</Text>
                        <View style={{
                            backgroundColor: Colors.surface,
                            borderRadius: Radius.xl,
                            padding: 24,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: Colors.cardBorder,
                            ...Shadows.sm
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 32 }}>
                                <TouchableOpacity
                                    onPress={() => setBudget(Math.max(1000, budget - 1000))}
                                    style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Ionicons name="remove" size={24} color={Colors.primary} />
                                </TouchableOpacity>
                                <Text style={[Typography.h1, { fontSize: 36 }]}>{formatNaira(budget)}</Text>
                                <TouchableOpacity
                                    onPress={() => setBudget(budget + 1000)}
                                    style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Ionicons name="add" size={24} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[Typography.bodySmall, { marginTop: 16, color: Colors.muted }]}>Typical range: ₦5k — ₦25k</Text>
                        </View>

                        <View style={{ marginTop: 32, gap: 12 }}>
                            <Text style={[Typography.label]}>How urgent?</Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {URGENCY_OPTIONS.map((opt) => (
                                    <Chip
                                        key={opt.value}
                                        label={opt.label}
                                        selected={urgency === opt.value}
                                        onPress={() => setUrgency(opt.value)}
                                        color={opt.value === 'now' ? Colors.error : undefined}
                                    />
                                ))}
                            </View>
                        </View>

                        <PrimaryButton
                            title="Review Request"
                            onPress={() => setStep(3)}
                            disabled={!address}
                            style={{ marginTop: 48 }}
                        />
                    </Animated.View>
                )}

                {/* Step 4: Review */}
                {step === 3 && (
                    <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={[Typography.h2, { marginBottom: 32 }]}>Final Look 👀</Text>

                        <Card style={{ gap: 24 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ gap: 4 }}>
                                    <Text style={[Typography.label]}>Service Type</Text>
                                    <Text style={[Typography.bodyLarge, { color: Colors.primary }]}>
                                        {CATEGORIES.find((c) => c.id === category)?.label || 'Other'}
                                    </Text>
                                </View>
                                <Ionicons name={CATEGORIES.find((c) => c.id === category)?.icon as any || 'hammer'} size={32} color={Colors.primary} />
                            </View>

                            <View style={{ gap: 4 }}>
                                <Text style={[Typography.label]}>Description</Text>
                                <Text style={[Typography.body]} numberOfLines={3}>{description}</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: Colors.cardBorder }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ gap: 4 }}>
                                    <Text style={[Typography.label]}>Location</Text>
                                    <Text style={[Typography.bodyLarge]}>{address}</Text>
                                </View>
                                <View style={{ gap: 4, alignItems: 'flex-end' }}>
                                    <Text style={[Typography.label]}>Urgency</Text>
                                    <Badge label={URGENCY_OPTIONS.find(o => o.value === urgency)?.label} variant={urgency === 'now' ? 'warn' : 'success'} />
                                </View>
                            </View>

                            <View style={{
                                backgroundColor: Colors.primaryLight,
                                borderRadius: Radius.md,
                                padding: 16,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text style={[Typography.bodyLarge, { color: Colors.primaryDark }]}>Estimated Budget</Text>
                                <Text style={[Typography.h2, { color: Colors.primaryDark }]}>{formatNaira(budget)}</Text>
                            </View>
                        </Card>

                        <View style={{ marginTop: 32, gap: 16 }}>
                            <PrimaryButton
                                title="Confirm & Match Me"
                                onPress={handleSubmit}
                                loading={loading}
                            />
                            <Text style={[Typography.bodySmall, { textAlign: 'center', color: Colors.muted }]}>
                                You won't be charged until the job is completed.
                            </Text>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}

