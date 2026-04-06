import { SubAppHeader } from '@/components/AppSubHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { artisanApi, jobApi } from '@/services/api';
import { mapArtisan } from '@/services/mappers';
import { useAppStore } from '@/store';
import type { Artisan } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TIME_SLOTS = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM',
];

const DAYS = (() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push({
            date: d.toISOString().split('T')[0],
            day: d.toLocaleDateString('en', { weekday: 'short' }),
            num: d.getDate(),
            month: d.toLocaleDateString('en', { month: 'short' }),
        });
    }
    return days;
})();

export default function BookingScreen() {
    const router = useRouter();
    const { artisanId } = useLocalSearchParams<{ artisanId: string }>();
    const { user } = useAppStore();
    const [artisan, setArtisan] = useState<Artisan | null>(null);
    const [selectedDate, setSelectedDate] = useState(DAYS[0].date);
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (artisanId) {
            artisanApi.getById(artisanId).then(res => {
                setArtisan(mapArtisan(res));
            }).catch(console.error);
        }
    }, [artisanId]);

    const handleConfirm = async () => {
        if (!artisan) return;
        setLoading(true);
        try {
            const jobRes = await jobApi.create({
                description: notes || `Service booking with ${artisan.name}`,
                skill: artisan.skills[0] || 'general',
                budget: 0,
                urgency: 'today',
                location: `${user?.location?.area}, ${user?.location?.city}`
            });

            await jobApi.assign(jobRes.id, artisan.id);
            router.push('/(tabs)/requests');
        } catch (err: any) {
            console.error("[Booking] Error:", err);
            const msg = err.details 
                ? `${err.message}: ${JSON.stringify(err.details)}` 
                : err.message || "Unable to complete booking.";
            Alert.alert("Booking Failed", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.3} animated />
            <SubAppHeader
                label="BOOKING"
                title="Select Slot"
                description="Choose a date and time that works best for your service."
                showBack
                onBack={() => router.back()}
                onNotification={() => {}}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Date Selection */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View className="flex-row items-center gap-2 mb-4">
                        <Ionicons name="calendar-outline" size={14} color="#078365" />
                        <Text className="text-label text-primary text-[10px] uppercase">Choose Date</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6">
                        <View className="flex-row px-6 gap-3">
                            {DAYS.map((d) => (
                                <TouchableOpacity
                                    key={d.date}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedDate(d.date)}
                                    className={`w-[72px] h-[100px] items-center justify-center rounded-md border-[1.5px] shadow-sm ${
                                        selectedDate === d.date ? 'bg-primary border-primary' : 'bg-white border-card-border'
                                    }`}
                                >
                                    <View className={`absolute top-2 w-3 h-[1px] ${
                                        selectedDate === d.date ? 'bg-accent' : 'bg-card-border'
                                    }`} />
                                    <Text className={`text-label text-[9px] uppercase font-jakarta-medium ${
                                        selectedDate === d.date ? 'text-white/60' : 'text-muted'
                                    }`}>{d.day}</Text>
                                    <Text className={`text-h2 text-[24px] my-1 font-jakarta-bold ${
                                        selectedDate === d.date ? 'text-white' : 'text-body'
                                    }`}>{d.num}</Text>
                                    <Text className={`text-label text-[9px] uppercase font-jakarta-extrabold ${
                                        selectedDate === d.date ? 'text-accent' : 'text-primary'
                                    }`}>{d.month}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </Animated.View>

                {/* Time Selection */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-10">
                    <View className="flex-row items-center gap-2 mb-4">
                        <Ionicons name="time-outline" size={14} color="#078365" />
                        <Text className="text-label text-primary text-[10px] uppercase">Select Time</Text>
                    </View>
                    <View className="flex-row flex-wrap gap-3">
                        {TIME_SLOTS.map((t) => (
                            <TouchableOpacity
                                key={t}
                                activeOpacity={0.8}
                                onPress={() => setSelectedTime(t)}
                                className={`px-4 py-3 rounded-xs border-[1.5px] shadow-sm ${
                                    selectedTime === t ? 'bg-accent border-accent' : 'bg-white border-card-border'
                                }`}
                            >
                                <Text className={`text-label text-[10px] font-jakarta-extrabold uppercase ${
                                    selectedTime === t ? 'text-white' : 'text-primary'
                                }`}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Service Details */}
                <Animated.View entering={FadeInDown.delay(300).springify()} className="mt-10">
                    <View className="flex-row items-center gap-2 mb-4">
                        <Ionicons name="document-text-outline" size={14} color="#078365" />
                        <Text className="text-label text-primary text-[10px] uppercase">Service Details</Text>
                    </View>
                    <View className="bg-white rounded-md border-[1.5px] border-card-border p-4 min-h-[140px] shadow-sm">
                        <TextInput
                            className="text-body text-ink text-[14px] p-0"
                            placeholder="Tell the artisan more about what you need..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>
                </Animated.View>

                {/* Footer Action */}
                <Animated.View entering={FadeInDown.delay(400).springify()} className="mt-12">
                    <PrimaryButton
                        title="CONFIRM BOOKING"
                        onPress={handleConfirm}
                        loading={loading}
                        disabled={!selectedTime}
                        variant="accent"
                        className="h-16 rounded-md shadow-md"
                    />
                    <View className="flex-row items-center justify-center gap-2 mt-5">
                        <Ionicons name="shield-checkmark" size={12} color="#22C55E" />
                        <Text className="text-label text-muted text-[8px] normal-case font-jakarta-medium">
                            PROFESSIONAL SERVICE GUARANTEED
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

