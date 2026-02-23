import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card, Chip } from '@/components/ui/CardChipBadge';
import { AppTextInput } from '@/components/ui/TextInputs';
import { submitJobRequest } from '@/services/mockApi';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import type { CategoryId, Urgency } from '@/types';
import { CATEGORIES } from '@/types';
import { formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

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

    const steps = ['Category', 'Description', 'Location & Budget', 'Review'];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const job = await submitJobRequest({
                clientId: user?.id || 'u1',
                clientName: user?.name || 'George',
                category: (category || 'not_sure') as CategoryId | 'not_sure',
                description,
                budget,
                urgency,
                location: { area: address, city: user?.location.city || 'Abuja', state: user?.location.state || 'FCT' },
            });
            addJob(job);
            setSubmitted(true);
        } catch {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <View className="flex-1 bg-operis-bg items-center justify-center p-10">
                <View className="mb-5">
                    <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
                </View>
                <Text className="text-[28px] font-bold text-center">Request Submitted! 🎉</Text>
                <Text className="text-base text-gray-500 text-center mt-4">
                    We're matching you with the best artisans near you. You'll get notified when someone accepts.
                </Text>
                <PrimaryButton
                    title="See Matched Artisans"
                    onPress={() => router.push('/matched-artisans')}
                    style={{ marginTop: 32, width: '100%' }}
                />
                <SecondaryButton
                    title="Back to Home"
                    onPress={() => router.back()}
                    style={{ marginTop: 16, width: '100%' }}
                />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader
                title="Post a Job"
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            {/* Progress */}
            <View className="flex-row px-5 py-4 gap-1">
                {steps.map((s, i) => (
                    <View key={s} className="flex-1 items-center gap-1">
                        <View className={`h-[3px] w-full rounded-[2px] ${i <= step ? 'bg-sage-200' : 'bg-gray-200'}`} />
                        <Text className={`text-xs ${i === step ? 'text-olive font-semibold' : 'text-gray-400'}`}>{s}</Text>
                    </View>
                ))}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
                {/* Step 1: Category */}
                {step === 0 && (
                    <View className="p-8">
                        <Text className="text-2xl font-bold mb-6">What do you need help with?</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {[...CATEGORIES, { id: 'not_sure', label: 'Not Sure', icon: 'help' }].map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    className={`px-5 py-4 rounded-md bg-white border-[1.5px] ${category === cat.id ? 'border-sage-200 bg-sage-200/20' : 'border-gray-200'}`}
                                    onPress={() => setCategory(cat.id)}
                                    activeOpacity={0.8}
                                >
                                    <Text className={`text-sm ${category === cat.id ? 'text-olive font-semibold' : 'text-gray-600'}`}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <PrimaryButton
                            title="Next"
                            onPress={() => setStep(1)}
                            disabled={!category}
                            style={{ marginTop: 32 }}
                        />
                    </View>
                )}

                {/* Step 2: Description */}
                {step === 1 && (
                    <View className="p-8">
                        <Text className="text-2xl font-bold mb-6">Describe the issue</Text>
                        <TextInput
                            className="bg-white border-[1.5px] border-gray-200 rounded-md p-5 min-h-[140px] text-base text-olive"
                            placeholder='English: "My socket sparked and stopped working…"&#10;Pidgin: "My socket dey spark, e no dey work again…"'
                            placeholderTextColor={Colors.gray400}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                        />

                        <View className="flex-row gap-4 mt-5">
                            <TouchableOpacity className="flex-row items-center gap-2 px-5 py-4 rounded-md border border-gray-200 border-dashed">
                                <Ionicons name="mic-outline" size={22} color={Colors.deepOlive} />
                                <Text className="text-sm text-gray-600">Voice Input</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center gap-2 px-5 py-4 rounded-md border border-gray-200 border-dashed">
                                <Ionicons name="image-outline" size={22} color={Colors.deepOlive} />
                                <Text className="text-sm text-gray-600">Add Photo</Text>
                            </TouchableOpacity>
                        </View>

                        <PrimaryButton
                            title="Next"
                            onPress={() => setStep(2)}
                            disabled={description.length < 10}
                            style={{ marginTop: 32 }}
                        />
                    </View>
                )}

                {/* Step 3: Location & Budget */}
                {step === 2 && (
                    <View className="p-8">
                        <Text className="text-2xl font-bold mb-6">Location & Budget</Text>

                        <AppTextInput
                            label="Address"
                            placeholder="e.g. Wuse 2, Abuja"
                            value={address}
                            onChangeText={setAddress}
                        />

                        {/* Map placeholder */}
                        <View className="h-[120px] bg-gray-100 rounded-md items-center justify-center mb-5">
                            <Ionicons name="map-outline" size={40} color={Colors.gray400} />
                            <Text className="text-xs text-gray-400 mt-1">Map preview</Text>
                        </View>

                        <Text className="text-sm font-semibold mb-2 mt-5">Budget</Text>
                        <View className="flex-row items-center justify-center gap-6">
                            <TouchableOpacity
                                className="w-11 h-11 rounded-[22px] bg-sage-200/30 items-center justify-center"
                                onPress={() => setBudget(Math.max(1000, budget - 5000))}
                            >
                                <Ionicons name="remove" size={24} color={Colors.deepOlive} />
                            </TouchableOpacity>
                            <Text className="text-3xl font-bold min-w-[120px] text-center">{formatNaira(budget)}</Text>
                            <TouchableOpacity
                                className="w-11 h-11 rounded-[22px] bg-sage-200/30 items-center justify-center"
                                onPress={() => setBudget(budget + 5000)}
                            >
                                <Ionicons name="add" size={24} color={Colors.deepOlive} />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-sm font-semibold mb-2 mt-5">Urgency</Text>
                        <View className="flex-row gap-2">
                            {URGENCY_OPTIONS.map((opt) => (
                                <Chip
                                    key={opt.value}
                                    label={opt.label}
                                    selected={urgency === opt.value}
                                    onPress={() => setUrgency(opt.value)}
                                />
                            ))}
                        </View>

                        <PrimaryButton
                            title="Review"
                            onPress={() => setStep(3)}
                            disabled={!address}
                            style={{ marginTop: 32 }}
                        />
                    </View>
                )}

                {/* Step 4: Review */}
                {step === 3 && (
                    <View className="p-8">
                        <Text className="text-2xl font-bold mb-6">Review Your Request</Text>

                        <Card className="gap-4">
                            <View className="gap-1">
                                <Text className="text-xs text-gray-500">Category</Text>
                                <Text className="text-base font-medium">
                                    {CATEGORIES.find((c) => c.id === category)?.label || 'Not Sure'}
                                </Text>
                            </View>
                            <View className="gap-1">
                                <Text className="text-xs text-gray-500">Description</Text>
                                <Text className="text-sm text-gray-600" numberOfLines={3}>{description}</Text>
                            </View>
                            <View className="gap-1">
                                <Text className="text-xs text-gray-500">Location</Text>
                                <Text className="text-base font-medium">{address}</Text>
                            </View>
                            <View className="gap-1">
                                <Text className="text-xs text-gray-500">Budget</Text>
                                <Text className="text-base font-medium">{formatNaira(budget)}</Text>
                            </View>
                            <View className="gap-1">
                                <Text className="text-xs text-gray-500">Urgency</Text>
                                <Text className="text-base font-medium">
                                    {URGENCY_OPTIONS.find((o) => o.value === urgency)?.label}
                                </Text>
                            </View>
                        </Card>

                        <PrimaryButton
                            title="Submit Request"
                            onPress={handleSubmit}
                            loading={loading}
                            style={{ marginTop: 32 }}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
