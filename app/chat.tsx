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
import Animated, {  FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QUICK_REPLIES = [
    "I'm on my way",
    "How much will it cost?",
    "Okay, thank you!",
    "When can you come?",
    "Send location",
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
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.3} animated scale={1.3} />
            </View>
            <AppHeader
                title={thread?.participantName?.toUpperCase() || 'ENCRYPTED CHANNEL'}
                showBack
                onBack={() => router.back()}
                showNotification={false}
            />

            {loading && messages.length === 0 ? (
                <View className="flex-1 px-8 pt-8">
                    <SkeletonList count={8} type="message" />
                </View>
            ) : loadError && messages.length === 0 ? (
                <View className="flex-1 justify-center">
                    <ErrorState onRetry={() => loadMessages(true)} message="Failed to load secure conversation log." />
                </View>
            ) : (
                <View className="flex-1">
                    <FlatList
                        ref={listRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 40, paddingBottom: 40, flexGrow: 1, justifyContent: messages.length > 0 ? 'flex-end' : 'center' }}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        windowSize={5}
                        removeClippedSubviews={Platform.OS === 'android'}
                        ListEmptyComponent={() => (
                            <Animated.View entering={FadeInUp.springify()} className="items-center opacity-30 px-12">
                                <View className="w-20 h-20 rounded-[32px] bg-white border border-card-border items-center justify-center mb-6 shadow-inner">
                                    <Ionicons name="chatbubble-ellipses-outline" size={40} color="#94A3B8" />
                                </View>
                                <Text className="text-h3 text-muted text-center uppercase font-jakarta-extrabold italic tracking-tighter text-[16px]">Secure line established</Text>
                                <Text className="text-body text-muted text-center mt-3 normal-case font-jakarta-medium italic">Commence mission coordination</Text>
                            </Animated.View>
                        )}
                        renderItem={({ item }) => {
                            const mine = isMe(item);
                            return (
                                <Animated.View
                                    entering={mine ? FadeInRight.delay(50).springify() : FadeInLeft.delay(50).springify()}
                                    className={`max-w-[82%] px-6 py-4 rounded-[28px] mb-4 border shadow-md ${
                                        mine ? 'bg-primary self-end border-primary/20 rounded-tr-[4px] shadow-primary/20' : 'bg-white self-start border-card-border/50 rounded-tl-[4px] shadow-xl'
                                    }`}
                                >
                                    <Text className={`text-[15px] leading-6 font-jakarta-medium italic normal-case ${mine ? 'text-white' : 'text-ink'}`}>
                                        {item.text}
                                    </Text>
                                    <View className="mt-3 flex-row items-center justify-end gap-1.5 opacity-50">
                                        <Text className={`text-[10px] uppercase font-jakarta-extrabold tracking-tighter ${
                                            mine ? 'text-white' : 'text-muted'
                                        }`}>
                                            {formatTime(item.timestamp)}
                                        </Text>
                                        {mine && (
                                            <Ionicons name="checkmark-done" size={12} color="white" opacity={item.read ? 1 : 0.5} />
                                        )}
                                    </View>
                                </Animated.View>
                            );
                        }}
                        onContentSizeChange={() => {
                            if (messages.length > 0) {
                                listRef.current?.scrollToEnd({ animated: true });
                            }
                        }}
                    />

                    {/* Quick Replies Terminal */}
                    <View className="mb-4">
                        <FlatList
                            data={QUICK_REPLIES}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 16, gap: 12 }}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => handleSend(item)}
                                    className="px-6 py-3 rounded-full bg-white/60 border border-card-border/50 shadow-sm backdrop-blur-md active:bg-white"
                                >
                                    <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold italic tracking-tight">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            )}

            {/* Comm Input Protocol */}
            <View 
                className="flex-row items-center px-6 pt-6 pb-4 bg-white border-t border-card-border/50 gap-4 shadow-3xl"
                style={{ paddingBottom: Math.max(insets.bottom, 24) }}
            >
                <TouchableOpacity className="w-12 h-12 rounded-2xl bg-background border border-card-border/50 items-center justify-center shadow-inner active:bg-gray-50">
                    <Ionicons name="add-outline" size={28} color="#94A3B8" />
                </TouchableOpacity>

                <View className="flex-1 bg-background rounded-[24px] border-[1.5px] border-card-border/50 min-h-[52px] max-h-[140px] px-6 py-3 justify-center shadow-inner">
                    <TextInput
                        className="text-[15px] text-ink font-jakarta-medium italic p-0"
                        placeholder="Encrypted message..."
                        placeholderTextColor="#94A3B8"
                        value={text}
                        onChangeText={setText}
                        multiline
                    />
                </View>

                <TouchableOpacity
                    onPress={() => handleSend()}
                    disabled={!text.trim()}
                    className={`w-14 h-14 rounded-2xl items-center justify-center shadow-xl active:scale-[0.95] ${
                        text.trim() ? 'bg-primary shadow-primary/30' : 'bg-gray-100 border border-card-border/30'
                    }`}
                >
                    <Ionicons name="chevron-forward" size={24} color={text.trim() ? "white" : "#CBD5E1"} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
