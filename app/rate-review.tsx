import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Chip } from '@/components/ui/CardChipBadge';
import { Toast } from '@/components/ui/StateComponents';
import { AppTextInput } from '@/components/ui/TextInputs';
import { Colors, Typography } from '@/theme';
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
        if (!jobId) {
            // No jobId in params — still allow review to be submitted locally
        }
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
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Rate Experience" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100)} style={{ alignItems: 'center', marginVertical: 32 }}>
                    <Text style={[Typography.h1, { textAlign: 'center', fontSize: 24 }]}>How was your service?</Text>
                    <Text style={[Typography.body, { color: Colors.muted, marginTop: 8 }]}>Your feedback helps our pros grow.</Text>
                </Animated.View>

                {/* Star Rating */}
                <Animated.View entering={FadeInDown.delay(200)} style={{ marginBottom: 40 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
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
                                        color={star <= rating ? Colors.accent : Colors.cardBorder}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={[Typography.h3, { textAlign: 'center', marginTop: 16, color: rating > 0 ? Colors.primary : Colors.muted }]}>
                        {rating === 0 ? 'Tap to rate' : rating <= 2 ? 'Could be better' : rating <= 4 ? 'Great experience' : 'Exceptional!'}
                    </Text>
                </Animated.View>

                {/* Tags */}
                <Animated.View entering={FadeInDown.delay(300)} style={{ marginBottom: 40 }}>
                    <Text style={[Typography.h3, { marginBottom: 16 }]}>What went well?</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {TAGS.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                selected={selectedTags.includes(tag)}
                                onPress={() => toggleTag(tag)}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Comment */}
                <Animated.View entering={FadeInDown.delay(400)}>
                    <AppTextInput
                        label="Share more details (Optional)"
                        placeholder="What else would you like to tell us?"
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        numberOfLines={4}
                        style={{ minHeight: 120, textAlignVertical: 'top', paddingTop: 16 }}
                    />

                    <PrimaryButton
                        title="Submit Review"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={rating === 0}
                        style={{ marginTop: 40 }}
                    />
                </Animated.View>
            </ScrollView>

            <Toast message="Thank you for your review!" type="success" visible={submitted} />
        </View>
    );
}

