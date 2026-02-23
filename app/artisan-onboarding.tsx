import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { AppTextInput, PhoneInput } from '@/components/ui/TextInputs';
import { Colors } from '@/theme';
import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        router.replace('/(tabs)/dashboard');
    };

    return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader
                title="Set Up Profile"
                showBack
                onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
                showNotification={false}
            />

            {/* Progress */}
            <View className="flex-row px-5 py-4 gap-1">
                {STEPS.map((s, i) => (
                    <View key={s} className="flex-1 items-center gap-1">
                        <View className={`h-[3px] w-full rounded-[2px] ${i <= step ? 'bg-sage-200' : 'bg-gray-200'}`} />
                        <Text className={`text-[10px] ${i === step ? 'text-olive font-semibold' : 'text-gray-400'}`}>{s}</Text>
                    </View>
                ))}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
                {/* Step 1: Basics */}
                {step === 0 && (
                    <View className="p-8">
                        <Text className="text-[22px] font-bold mb-2">Your basic info</Text>
                        <AppTextInput label="Full Name" value={name} onChangeText={setName} placeholder="Your full name" />
                        <PhoneInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="8012345678" />
                        <TouchableOpacity className="h-[120px] rounded-lg border-2 border-gray-200 border-dashed items-center justify-center gap-2 mb-2">
                            <Ionicons name="camera-outline" size={32} color={Colors.gray400} />
                            <Text className="text-sm text-gray-400">Add profile photo</Text>
                        </TouchableOpacity>
                        <PrimaryButton title="Next" onPress={() => setStep(1)} disabled={!name} style={{ marginTop: 32 }} />
                    </View>
                )}

                {/* Step 2: Skills */}
                {step === 1 && (
                    <View className="p-8">
                        <Text className="text-[22px] font-bold mb-2">What are your trades?</Text>
                        <Text className="text-base text-gray-500 mb-6">Select all that apply</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <Chip key={cat.id} label={cat.label} selected={selectedSkills.includes(cat.id)} onPress={() => toggleSkill(cat.id)} />
                            ))}
                        </View>
                        <PrimaryButton title="Next" onPress={() => setStep(2)} disabled={selectedSkills.length === 0} style={{ marginTop: 32 }} />
                    </View>
                )}

                {/* Step 3: Service Areas */}
                {step === 2 && (
                    <View className="p-8">
                        <Text className="text-[22px] font-bold mb-2">Service areas</Text>
                        <Text className="text-base text-gray-500 mb-6">Where can clients find you?</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {areas.map((area) => (
                                <Chip key={area} label={area} selected={selectedAreas.includes(area)} onPress={() => toggleArea(area)} />
                            ))}
                        </View>
                        <PrimaryButton title="Next" onPress={() => setStep(3)} disabled={selectedAreas.length === 0} style={{ marginTop: 32 }} />
                    </View>
                )}

                {/* Step 4: Availability */}
                {step === 3 && (
                    <View className="p-8">
                        <Text className="text-[22px] font-bold mb-2">Your availability</Text>
                        <Text className="text-base text-gray-500 mb-6">Select your working days</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {days.map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    className={`w-[46px] h-[46px] rounded-[23px] border-[1.5px] items-center justify-center ${selectedDays.includes(d) ? 'border-sage-200 bg-sage-200/20' : 'border-gray-200 bg-white'}`}
                                    onPress={() => toggleDay(d)}
                                >
                                    <Text className={`text-sm ${selectedDays.includes(d) ? 'text-olive font-semibold' : 'text-gray-500 font-medium'}`}>{d}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <PrimaryButton title="Next" onPress={() => setStep(4)} style={{ marginTop: 32 }} />
                    </View>
                )}

                {/* Step 5: Pricing */}
                {step === 4 && (
                    <View className="p-8">
                        <Text className="text-[22px] font-bold mb-2">Pricing style</Text>
                        <Text className="text-base text-gray-500 mb-6">How do you prefer to charge?</Text>
                        {[
                            { value: 'fixed', label: 'Fixed Price', desc: 'Set a fixed price per job' },
                            { value: 'estimate', label: 'Estimate', desc: 'Give clients a price range' },
                            { value: 'hourly', label: 'Hourly Rate', desc: 'Charge by the hour' },
                        ].map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                className={`flex-row items-center gap-4 p-5 rounded-md border-[1.5px] mb-4 ${pricingStyle === opt.value ? 'border-sage-200 bg-sage-200/10' : 'border-gray-200 bg-white'}`}
                                onPress={() => setPricingStyle(opt.value)}
                            >
                                <View>
                                    <View className={`w-[22px] h-[22px] rounded-[11px] border-2 items-center justify-center ${pricingStyle === opt.value ? 'border-[#3D5A50]' : 'border-gray-300'}`}>
                                        {pricingStyle === opt.value && <View className="w-3 h-3 rounded-full bg-[#3D5A50]" />}
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-base font-semibold">{opt.label}</Text>
                                    <Text className="text-xs text-gray-500">{opt.desc}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <PrimaryButton title="Complete Setup" onPress={handleComplete} loading={loading} style={{ marginTop: 32 }} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
