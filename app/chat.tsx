import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { threadApi } from '@/services/api';
import { useAppStore } from '@/store';
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
import { ErrorState } from '@/components/ui/StateComponents';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import Animated, {  FadeInLeft, FadeInRight } from 'react-native-reanimated';
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
    const { threads, user, markNotificationsAsReadByThreadId } = useAppStore();
    const [text, setText] = useState('');
    const listRef = useRef<FlatList>(null);

    const thread = threads.find((t) => t.id === threadId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const loadMessages = useCallback(async (isInitial = false) => {
        if (!threadId) return;
        if (isInitial) setLoading(true);
        try {
            const res = await threadApi.getMessages(threadId);
            const mapped = (res.results as any[]).map((row: any): Message => ({
                id: row.id,
                threadId: row.thread_id,
                senderId: row.sender_id,
                text: row.text,
                timestamp: row.sent_at,
                read: Boolean(row.read_at),
            }));
            
            setMessages(mapped);
            setLoadError(false);

            const myId = user?.id;
            const unreadFromOther = (res.results as any[]).some(
                (m) => !m.read_at && m.sender_id !== myId
            );
            
            if (unreadFromOther && myId) {
                threadApi.markRead(threadId).catch((err) =>
                    console.error('Failed to mark messages as read:', err)
                );
                markNotificationsAsReadByThreadId(threadId);
            }
        } catch (err) {
            console.error('Failed to load messages:', err);
            if (messages.length === 0) {
                setLoadError(true);
            }
        } finally {
            setLoading(false);
        }
    }, [threadId, user?.id, messages.length]);

    useEffect(() => {
        loadMessages(true);
        const interval = setInterval(() => loadMessages(false), 5000);
        return () => clearInterval(interval);
    }, [threadId, loadMessages]);

    const handleSend = async (msgText?: string) => {
        const content = msgText || text.trim();
        if (!content || !threadId) return;
        setText('');

        try {
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

            await threadApi.sendMessage(threadId, content);
            loadMessages();
        } catch (err) {
            console.error('Failed to send message:', err);
            Alert.alert('Error', 'Failed to send message. Please try again.');
        }
    };

    const isMe = useCallback((msg: Message) => msg.senderId === (user?.id || 'u1'), [user?.id]);

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
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

            {loading && messages.length === 0 ? (
                <View className="flex-1 p-6">
                    <SkeletonList count={6} type="message" />
                </View>
            ) : loadError && messages.length === 0 ? (
                <View className="flex-1">
                    <ErrorState onRetry={() => loadMessages(true)} message="Failed to load your conversation." />
                </View>
            ) : (
                <>
                    <FlatList
                        ref={listRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 24, paddingBottom: 24, flexGrow: 1, justifyContent: messages.length > 0 ? 'flex-end' : 'center' }}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        windowSize={5}
                        removeClippedSubviews={Platform.OS === 'android'}
                        ListEmptyComponent={() => (
                            <View className="items-center opacity-50">
                                <Ionicons name="chatbubble-ellipses-outline" size={48} color="#94A3B8" />
                                <Text className="text-body text-muted mt-4 normal-case">Say hello to start the chat!</Text>
                            </View>
                        )}
                        renderItem={({ item }) => {
                            const mine = isMe(item);
                            return (
                                <Animated.View
                                    entering={mine ? FadeInRight.delay(50).springify() : FadeInLeft.delay(50).springify()}
                                    className={`max-w-[85%] px-4 py-3 rounded-md mb-3 border shadow-sm ${
                                        mine ? 'bg-accent self-end border-accent rounded-tr-[2px]' : 'bg-white self-start border-card-border rounded-tl-[2px]'
                                    }`}
                                >
                                    <Text className={`text-body text-[15px] leading-[22px] normal-case ${mine ? 'text-white' : 'text-body'}`}>
                                        {item.text}
                                    </Text>
                                    <Text className={`text-[9px] mt-2 uppercase tracking-tight ${
                                        mine ? 'text-white/60 self-end' : 'text-muted self-start'
                                    }`}>
                                        {formatTime(item.timestamp)}
                                    </Text>
                                </Animated.View>
                            );
                        }}
                        onContentSizeChange={() => {
                            if (messages.length > 0) {
                                listRef.current?.scrollToEnd({ animated: true });
                            }
                        }}
                    />

                    <View className="bg-transparent">
                        <FlatList
                            data={QUICK_REPLIES}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16, gap: 10 }}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSend(item)}
                                    className="px-4 py-[10px] rounded-xs bg-white/80 border border-card-border shadow-sm"
                                >
                                    <Text className="text-label text-primary text-[9px] normal-case tracking-normal">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </>
            )}

            {/* Comm Input */}
            <View 
                className="flex-row items-center px-4 pt-4 bg-white border-t border-card-border gap-3 shadow-lg"
                style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
                <TouchableOpacity className="p-1">
                    <Ionicons name="attach-outline" size={26} color="#94A3B8" />
                </TouchableOpacity>

                <View className="flex-1 bg-background rounded-md border-[1.5px] border-card-border min-h-[48px] max-h-[120px] px-4 py-[10px] justify-center">
                    <TextInput
                        className="text-body text-ink text-[15px] p-0"
                        placeholder="Type a message..."
                        placeholderTextColor="#94A3B8"
                        value={text}
                        onChangeText={setText}
                        multiline
                    />
                </View>

                <TouchableOpacity
                    onPress={() => handleSend()}
                    disabled={!text.trim()}
                    className={`w-12 h-12 rounded-md items-center justify-center shadow-md ${
                        text.trim() ? 'bg-primary' : 'bg-gray-200'
                    }`}
                >
                    <Ionicons name="send" size={20} color={text.trim() ? "white" : "#94A3B8"} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

