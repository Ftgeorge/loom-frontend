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
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QUICK_REPLIES = [
    'I dey come',
    'How much e go cost?',
    'Okay, thank you!',
    'When you go fit come?',
    'Send me your location',
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
                text: row.content,
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

    const isMe = (msg: Message) => msg.senderId === (user?.id || 'u1');

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <AppHeader
                title={thread?.participantName || 'Chat'}
                showBack
                onBack={() => router.back()}
                showNotification={false}
            />
            <LoomThread variant="minimal" opacity={0.5} animated />

            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 20, paddingBottom: 16, flexGrow: 1, justifyContent: 'flex-end' }}
                renderItem={({ item }) => (
                    <Animated.View
                        entering={FadeIn}
                        style={{
                            maxWidth: '80%',
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderRadius: 20,
                            marginBottom: 8,
                            backgroundColor: isMe(item) ? Colors.accent : Colors.surface,
                            alignSelf: isMe(item) ? 'flex-end' : 'flex-start',
                            borderBottomRightRadius: isMe(item) ? 4 : 20,
                            borderBottomLeftRadius: isMe(item) ? 20 : 4,
                            borderWidth: isMe(item) ? 0 : 1,
                            borderColor: Colors.cardBorder,
                            ...Shadows.sm
                        }}
                    >
                        <Text style={[Typography.body, { color: isMe(item) ? Colors.white : Colors.text, fontSize: 15 }]}>{item.text}</Text>
                        <Text style={[Typography.label, {
                            fontSize: 9,
                            marginTop: 4,
                            color: isMe(item) ? 'rgba(255,255,255,0.7)' : Colors.muted,
                            alignSelf: 'flex-end'
                        }]}>
                            {formatTime(item.timestamp)}
                        </Text>
                    </Animated.View>
                )}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            />

            {/* Quick Replies */}
            <View>
                <FlatList
                    data={QUICK_REPLIES}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleSend(item)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: Radius.full,
                                backgroundColor: Colors.surface,
                                borderWidth: 1,
                                borderColor: Colors.cardBorder,
                                ...Shadows.sm
                            }}
                        >
                            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, fontFamily: 'MontserratAlternates-Medium' }]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Input Area */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: Math.max(insets.bottom, 16),
                backgroundColor: Colors.surface,
                borderTopWidth: 1,
                borderTopColor: Colors.cardBorder,
                gap: 12
            }}>
                <TouchableOpacity style={{ paddingBottom: 10 }}>
                    <Ionicons name="add-circle-outline" size={28} color={Colors.accent} />
                </TouchableOpacity>
                <View style={{
                    flex: 1,
                    backgroundColor: Colors.background,
                    borderRadius: Radius.lg,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                    minHeight: 44,
                    maxHeight: 120,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
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
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: text.trim() ? Colors.accent : Colors.cardBorder + '50',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 1
                    }}
                >
                    <Ionicons name="send" size={20} color={text.trim() ? Colors.white : Colors.muted} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
