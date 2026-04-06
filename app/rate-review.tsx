import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { Toast } from '@/components/ui/StateComponents';
import { LoomThread } from '@/components/ui/LoomThread';
import { jobApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, TextInput } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const TAGS = ['Professional', 'Rapid Response', 'Affordable', 'Friendly', 'Punctual', 'Highly Skilled'];

export default function RateReviewScreen() {
    const router = useRouter();
    const { jobId } = useLocalSearchParams<{ jobId: string }>();
    const [rating, setRating] = useState(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (jobId) {
                const tagComment = selectedTags.length
                    ? `[${selectedTags.join(', ')}] ${comment}`.trim()
                    : comment;
                await jobApi.rate(jobId, { rating, comment: tagComment || undefined });
            }
            setSubmitted(true);
            setTimeout(() => router.back(), 1500);
        } catch (err: any) {
            Alert.alert('System Error', err.message ?? 'Transmission failed. Re-initiating protocol...');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.3} animated scale={1.3} />
            </View>
            <AppHeader title="MISSION FEEDBACK" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Mission Identity ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(100).springify()} className="items-center mt-10 mb-12">
                    <View className="flex-row items-center gap-2 mb-4">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">POST-OPERATION DEBRIEF</Text>
                    </View>
                    <Text className="text-h1 text-center text-[38px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink leading-tight">HOW WAS THE SERVICE?</Text>
                    <Text className="text-[15px] text-ink/60 text-center mt-4 normal-case font-jakarta-medium italic">Your intel helps our operatives improve the collective grid.</Text>
                </Animated.View>

                {/* ─── Tactical Star Matrix ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mb-14 p-10 bg-white border-[1.5px] border-card-border/50 rounded-[48px] shadow-2xl">
                    <View className="flex-row justify-center gap-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                activeOpacity={0.8}
                                className="active:scale-[1.15] transition-transform"
                            >
                                <Animated.View entering={ZoomIn.delay(star * 100).springify()}>
                                    <Ionicons
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={44}
                                        color={star <= rating ? "#F59E0B" : "#CBD5E1"}
                                        style={star <= rating ? { shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10 } : {}}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text className={`text-[12px] font-jakarta-extrabold text-center mt-8 uppercase italic tracking-[4px] ${rating > 0 ? 'text-primary' : 'text-muted/40'}`}>
                        {rating === 0 ? 'TAP TO CALIBRATE' : rating <= 2 ? 'NEEDS RE-EVALUATION' : rating <= 4 ? 'SATISFACTORY DEPLOYMENT' : 'EXCEPTIONAL EXECUTION'}
                    </Text>
                </Animated.View>

                {/* ─── Merit Tokens (Tags) ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(300).springify()} className="mb-14 px-1">
                    <Text className="text-label mb-6 text-primary uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic">MISSION MERITS</Text>
                    <View className="flex-row flex-wrap gap-4">
                        {TAGS.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <TouchableOpacity
                                    key={tag}
                                    activeOpacity={0.8}
                                    onPress={() => toggleTag(tag)}
                                    className={`px-6 py-3.5 rounded-full border-[1.5px] shadow-sm active:scale-95 transition-transform ${
                                        isSelected ? 'bg-primary border-primary shadow-primary/20' : 'bg-white border-card-border/50'
                                    }`}
                                >
                                    <Text className={`text-[10px] uppercase font-jakarta-extrabold italic tracking-widest ${
                                        isSelected ? 'text-white' : 'text-ink'
                                    }`}>{tag.toUpperCase()}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>

                {/* ─── Intel Expansion (Comment) ─────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(400).springify()} className="px-1">
                    <Text className="text-label mb-6 text-primary uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic">ADDITIONAL INTEL</Text>
                    <View className="bg-white rounded-[32px] border-[1.5px] border-card-border/50 p-8 min-h-[160px] shadow-2xl mb-12">
                        <TextInput
                            className="text-[15px] text-ink font-jakarta-medium italic leading-6 p-0"
                            placeholder="WHAT ELSE WOULD YOU LIKE TO REPORT ON THIS OPERATION?"
                            placeholderTextColor="#94A3B8"
                            multiline
                            value={comment}
                            onChangeText={setComment}
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

                    <PrimaryButton
                        title="SUBMIT REPORT"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={rating === 0}
                        variant="accent"
                        className="h-18 rounded-3xl shadow-2xl border border-white/10"
                    />
                </Animated.View>
            </ScrollView>

            <Toast message="REPORT SUBMITTED SUCCESSFULLY" type="success" visible={submitted} />
            
            <View className="absolute bottom-12 left-0 right-0 items-center pointer-events-none opacity-20">
                <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Feedback Loop Sync • Secure v4.2</Text>
            </View>
        </View>
    );
}
