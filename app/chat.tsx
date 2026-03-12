import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { threadApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { Message } from '@/types';
import { formatTime } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView, Platform,
    Text,
    TextInput, TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QUICK_REPLIES = [
    "I'm on my way",
    "How much will it cost?",
    "Okay, thank you!",
    "When can you come?",
    "Send me your location",
];

export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { threadId } = useLocalSearchParams<{ threadId: string }>();
    const { threads, user, addMessage } = useAppStore();
    const [text, setText] = useState('');
    const listRef = useRef<FlatList>(null);

    const thread = threads.find((t) => t.id === threadId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const loadMessages = useCallback(async () => {
        if (!threadId) return;
        try {
            const res = await threadApi.getMessages(threadId);
            const mapped = (res.results as any[]).map((row: any): Message => ({
                id: row.id,
                threadId: row.thread_id,
                senderId: row.sender_id,
                text: row.text, // Corrected from row.content
                timestamp: row.sent_at,
                read: Boolean(row.read_at),
            }));
            setMessages(mapped);
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setLoading(false);
        }
    }, [threadId]);

    useEffect(() => {
        loadMessages();
        // Poll for new messages every 5s
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [loadMessages]);

    const handleSend = async (msgText?: string) => {
        const content = msgText || text.trim();
        if (!content || !threadId) return;
        setText('');

        try {
            // Optimistic update
            const tempId = 'temp-' + Date.now();
            const optimisticMsg: Message = {
                id: tempId,
                threadId,
                senderId: user?.id || '',
                text: content,
                timestamp: new Date().toISOString(),
                read: false,
            };
            setMessages(prev => [...prev, optimisticMsg]);

            // Real send
            await threadApi.sendMessage(threadId, content);
            loadMessages(); // Refresh to get the real ID and timestamp
        } catch (err) {
            console.error('Failed to send message:', err);
            Alert.alert('Error', 'Failed to send message. Please try again.');
        }
    };

    const isMe = useCallback((msg: Message) => msg.senderId === (user?.id || 'u1'), [user?.id]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <LoomThread variant="minimal" opacity={0.3} animated />
            <AppHeader
                title={thread?.participantName || 'Chat'}
                showBack
                onBack={() => router.back()}
                showNotification={false}
            />

            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24, paddingBottom: 24, flexGrow: 1, justifyContent: 'flex-end' }}
                showsVerticalScrollIndicator={false}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
                renderItem={({ item, index }) => {
                    const mine = isMe(item);
                    return (
                        <Animated.View
                            entering={mine ? FadeInRight.delay(50).springify() : FadeInLeft.delay(50).springify()}
                            style={{
                                maxWidth: '85%',
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                borderRadius: Radius.md,
                                marginBottom: 12,
                                backgroundColor: mine ? Colors.accent : Colors.white,
                                alignSelf: mine ? 'flex-end' : 'flex-start',
                                borderTopRightRadius: mine ? 2 : Radius.md,
                                borderTopLeftRadius: mine ? Radius.md : 2,
                                borderWidth: 1,
                                borderColor: mine ? Colors.accent : Colors.cardBorder,
                                ...Shadows.sm
                            }}
                        >
                            <Text style={[Typography.body, { color: mine ? Colors.white : Colors.text, fontSize: 15, lineHeight: 22 }]}>
                                {item.text}
                            </Text>
                            <Text style={[Typography.label, {
                                fontSize: 9,
                                marginTop: 6,
                                color: mine ? 'rgba(255,255,255,0.6)' : Colors.muted,
                                alignSelf: mine ? 'flex-end' : 'flex-start',
                                letterSpacing: 0,
                                textTransform: 'none'
                            }]}>
                                {formatTime(item.timestamp)}
                            </Text>
                        </Animated.View>
                    );
                }}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Quick Replies */}
            <View style={{ backgroundColor: 'transparent' }}>
                <FlatList
                    data={QUICK_REPLIES}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16, gap: 10 }}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleSend(item)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: Radius.xs,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                borderWidth: 1,
                                borderColor: Colors.cardBorder,
                                ...Shadows.sm
                            }}
                        >
                            <Text style={[Typography.label, { color: Colors.primary, fontSize: 9, textTransform: 'none', letterSpacing: 0 }]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Comm Input */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: Math.max(insets.bottom, 16),
                backgroundColor: Colors.white,
                borderTopWidth: 1,
                borderTopColor: Colors.cardBorder,
                gap: 12,
                ...Shadows.lg
            }}>
                <TouchableOpacity style={{ padding: 4 }}>
                    <Ionicons name="attach-outline" size={26} color={Colors.muted} />
                </TouchableOpacity>

                <View style={{
                    flex: 1,
                    backgroundColor: Colors.background,
                    borderRadius: Radius.md,
                    borderWidth: 1.5,
                    borderColor: Colors.cardBorder,
                    minHeight: 48,
                    maxHeight: 120,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    justifyContent: 'center'
                }}>
                    <TextInput
                        style={[Typography.body, { color: Colors.text, fontSize: 15 }]}
                        placeholder="Type a message..."
                        placeholderTextColor={Colors.muted}
                        value={text}
                        onChangeText={setText}
                        multiline
                    />
                </View>

                <TouchableOpacity
                    onPress={() => handleSend()}
                    disabled={!text.trim()}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: Radius.md,
                        backgroundColor: text.trim() ? Colors.primary : Colors.gray200,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...Shadows.md
                    }}
                >
                    <Ionicons name="send" size={20} color={text.trim() ? Colors.white : Colors.muted} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
