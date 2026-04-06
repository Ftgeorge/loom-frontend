import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { Toast } from '@/components/ui/StateComponents';
import { AppTextInput } from '@/components/ui/TextInputs';
import { jobApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const TAGS = ['Professional', 'Fast', 'Affordable', 'Friendly', 'Punctual', 'Skilled'];

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
            Alert.alert('Error', err.message ?? 'Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <AppHeader title="Rate Experience" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100)} className="items-center my-8">
                    <Text className="text-h1 text-center text-[24px] uppercase italic">How was your service?</Text>
                    <Text className="text-body text-muted mt-2 normal-case">Your feedback helps our pros grow.</Text>
                </Animated.View>

                {/* Star Rating */}
                <Animated.View entering={FadeInDown.delay(200)} className="mb-10">
                    <View className="flex-row justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                activeOpacity={0.7}
                            >
                                <Animated.View entering={ZoomIn.delay(star * 100)}>
                                    <Ionicons
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={48}
                                        color={star <= rating ? "#F59E0B" : "#CBD5E1"}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text className={`text-h3 text-center mt-4 uppercase ${rating > 0 ? 'text-primary' : 'text-muted'}`}>
                        {rating === 0 ? 'Tap to rate' : rating <= 2 ? 'Could be better' : rating <= 4 ? 'Great experience' : 'Exceptional!'}
                    </Text>
                </Animated.View>

                {/* Tags */}
                <Animated.View entering={FadeInDown.delay(300)} className="mb-10">
                    <Text className="text-h3 mb-4 uppercase">What went well?</Text>
                    <View className="flex-row flex-wrap gap-[10px]">
                        {TAGS.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag.toUpperCase()}
                                selected={selectedTags.includes(tag)}
                                onPress={() => toggleTag(tag)}
                                className="px-5 py-3 rounded-full"
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Comment */}
                <Animated.View entering={FadeInDown.delay(400)}>
                    <AppTextInput
                        label="SHARE MORE DETAILS (OPTIONAL)"
                        placeholder="WHAT ELSE WOULD YOU LIKE TO TELL US?"
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        numberOfLines={4}
                        className="min-h-[140px] pt-4 shadow-sm"
                        style={{ textAlignVertical: 'top' }}
                    />

                    <PrimaryButton
                        title="SUBMIT REVIEW"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={rating === 0}
                        className="mt-10 h-16 rounded-md shadow-md"
                    />
                </Animated.View>
            </ScrollView>

            <Toast message="Thank you for your review!" type="success" visible={submitted} />
        </View>
    );
}


