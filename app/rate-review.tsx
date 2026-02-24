import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { Toast } from '@/components/ui/StateComponents';
import { AppTextInput } from '@/components/ui/TextInputs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
        await new Promise((r) => setTimeout(r, 1000));
        setSubmitted(true);
        setLoading(false);
        setTimeout(() => router.back(), 1500);
    };

    return (
        <View className="flex-1 bg-background">
            <AppHeader title="Rate & Review" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView contentContainerStyle={{ padding: 32, paddingBottom: 100 }}>
                <Text className="text-[28px] font-bold text-center mb-8">How was your experience?</Text>

                {/* Star Rating */}
                <View className="flex-row justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                        >
                            <Text className={`text-[44px] ${star <= rating ? 'text-accent' : 'text-gray-300'}`}>
                                {star <= rating ? '★' : '☆'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text className="text-base text-gray-500 text-center mt-2 mb-8">
                    {rating === 0 ? 'Tap to rate' : rating <= 2 ? 'Could be better' : rating <= 4 ? 'Good experience' : 'Excellent!'}
                </Text>

                {/* Tags */}
                <Text className="text-lg font-bold mb-4">What stood out?</Text>
                <View className="flex-row flex-wrap gap-2 mb-8">
                    {TAGS.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            selected={selectedTags.includes(tag)}
                            onPress={() => toggleTag(tag)}
                        />
                    ))}
                </View>

                {/* Comment */}
                <AppTextInput
                    label="Write a review (optional)"
                    placeholder="Tell others about your experience..."
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    numberOfLines={4}
                    style={{ minHeight: 100, textAlignVertical: 'top' }}
                />

                <PrimaryButton
                    title="Submit Review"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={rating === 0}
                    style={{ marginTop: 32 }}
                />
            </ScrollView>

            <Toast message="Review submitted! Thank you." type="success" visible={submitted} />
        </View>
    );
}
