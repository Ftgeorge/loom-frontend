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
import { ErrorState } from '@/components/ui/StateComponents';
<<<<<<< HEAD
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import Animated, {  FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';
=======
import Animated, { FadeIn, FadeInLeft, FadeInRight } from 'react-native-reanimated';
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
    const { threads, user, addMessage } = useAppStore();
    const [text, setText] = useState('');
    const listRef = useRef<FlatList>(null);

    const thread = threads.find((t) => t.id === threadId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const loadMessages = useCallback(async () => {
        if (!threadId) return;
        try {
            setLoadError(false);
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
        } catch (err) {
            console.error('Failed to load messages:', err);
            setLoadError(true);
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
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.3} animated scale={1.3} />
            </View>
            <AppHeader
                title={thread?.participantName?.toUpperCase() || 'ENCRYPTED CHANNEL'}
                showBack
                onBack={() => router.back()}
                showNotification={false}
            />

<<<<<<< HEAD
            {loading && messages.length === 0 ? (
                <View className="flex-1 px-8 pt-8">
                    <SkeletonList count={8} type="message" />
                </View>
            ) : loadError && messages.length === 0 ? (
                <View className="flex-1 justify-center">
                    <ErrorState onRetry={() => loadMessages(true)} message="Failed to load secure conversation log." />
                </View>
=======
            {loadError ? (
                <ErrorState onRetry={loadMessages} message="Failed to load your conversation." />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            ) : (
                <View className="flex-1">
                    <FlatList
                        ref={listRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
<<<<<<< HEAD
                        contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 40, paddingBottom: 40, flexGrow: 1, justifyContent: messages.length > 0 ? 'flex-end' : 'center' }}
=======
                        contentContainerStyle={{ padding: 24, paddingBottom: 24, flexGrow: 1, justifyContent: 'flex-end' }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        windowSize={5}
                        removeClippedSubviews={Platform.OS === 'android'}
<<<<<<< HEAD
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
=======
                        renderItem={({ item, index }) => {
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            const mine = isMe(item);
                            return (
                                <Animated.View
                                    entering={mine ? FadeInRight.delay(50).springify() : FadeInLeft.delay(50).springify()}
<<<<<<< HEAD
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
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                </Animated.View>
                            );
                        }}
                        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
                    />

<<<<<<< HEAD
                    {/* Quick Replies Terminal */}
                    <View className="mb-4">
=======
                    {/* Quick Replies */}
                    <View style={{ backgroundColor: 'transparent' }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
                                    className="px-6 py-3 rounded-full bg-white/60 border border-card-border/50 shadow-sm backdrop-blur-md active:bg-white"
                                >
                                    <Text className="text-label text-primary text-[10px] uppercase font-jakarta-extrabold italic tracking-tight">{item}</Text>
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            )}

<<<<<<< HEAD
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
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        value={text}
                        onChangeText={setText}
                        multiline
                    />
                </View>

                <TouchableOpacity
                    onPress={() => handleSend()}
                    disabled={!text.trim()}
<<<<<<< HEAD
                    className={`w-14 h-14 rounded-2xl items-center justify-center shadow-xl active:scale-[0.95] ${
                        text.trim() ? 'bg-primary shadow-primary/30' : 'bg-gray-100 border border-card-border/30'
                    }`}
                >
                    <Ionicons name="chevron-forward" size={24} color={text.trim() ? "white" : "#CBD5E1"} />
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
