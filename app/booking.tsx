import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
    const [selectedDate, setSelectedDate] = useState(DAYS[0].date);
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        router.back();
    };

    return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Book Appointment" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <Text className="text-lg font-bold mb-4 mt-5">Select Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {DAYS.map((d) => (
                        <TouchableOpacity
                            key={d.date}
                            className={`w-[65px] py-4 items-center rounded-md border-[1.5px] gap-0.5 ${selectedDate === d.date ? 'border-sage-200 bg-sage-200/20' : 'border-gray-200 bg-white'}`}
                            onPress={() => setSelectedDate(d.date)}
                        >
                            <Text className={`text-xs ${selectedDate === d.date ? 'text-olive' : 'text-gray-500'}`}>{d.day}</Text>
                            <Text className={`text-[20px] font-bold ${selectedDate === d.date ? 'text-olive' : ''}`}>{d.num}</Text>
                            <Text className={`text-xs text-gray-400 ${selectedDate === d.date ? 'text-olive' : ''}`}>{d.month}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text className="text-lg font-bold mb-4 mt-5">Select Time</Text>
                <View className="flex-row flex-wrap gap-2">
                    {TIME_SLOTS.map((t) => (
                        <TouchableOpacity
                            key={t}
                            className={`px-5 py-4 rounded-md border-[1.5px] ${selectedTime === t ? 'border-sage-200 bg-sage-200/20' : 'border-gray-200 bg-white'}`}
                            onPress={() => setSelectedTime(t)}
                        >
                            <Text className={`text-sm ${selectedTime === t ? 'text-olive font-semibold' : 'text-gray-600'}`}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-lg font-bold mb-4 mt-5">Notes (optional)</Text>
                <View className="bg-white border-[1.5px] border-gray-200 rounded-md p-5 min-h-[80px]">
                    <Text className="text-base text-gray-400">
                        {notes || 'Add any special instructions or details...'}
                    </Text>
                </View>

                <PrimaryButton
                    title="Confirm Booking"
                    onPress={handleConfirm}
                    loading={loading}
                    disabled={!selectedTime}
                    style={{ marginTop: 32 }}
                />
            </ScrollView>
        </View>
    );
}
