import { AppHeader } from '@/components/AppHeader';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import type { Message } from '@/types';
import { formatTime } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView, Platform,
    Text,
    TextInput, TouchableOpacity,
    View,
} from 'react-native';
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
    const messages = thread?.messages || [];

    const handleSend = async (msgText?: string) => {
        const content = msgText || text.trim();
        if (!content) return;
        setText('');

        const msg: Message = {
            id: 'm' + Date.now(),
            threadId: threadId || '',
            senderId: user?.id || 'u1',
            text: content,
            timestamp: new Date().toISOString(),
            read: false,
        };
        addMessage(threadId || '', msg);

        // Simulate reply after a delay
        setTimeout(() => {
            const reply: Message = {
                id: 'm' + (Date.now() + 1),
                threadId: threadId || '',
                senderId: 'other',
                text: 'Okay, I go get back to you shortly.',
                timestamp: new Date().toISOString(),
                read: false,
            };
            addMessage(threadId || '', reply);
        }, 2000);
    };

    useEffect(() => {
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 300);
    }, [messages.length]);

    const isMe = (msg: Message) => msg.senderId === (user?.id || 'u1');

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
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
                contentContainerStyle={{ padding: 20, paddingBottom: 8, flexGrow: 1, justifyContent: 'flex-end' }}
                renderItem={({ item }) => (
                    <View className={`max-w-[78%] px-4 py-3 rounded-2xl mb-3 ${isMe(item) ? 'bg-graphite self-end rounded-br-md shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'bg-surface self-start rounded-bl-md border border-gray-50 shadow-[0_2px_4px_rgba(0,0,0,0.02)]'}`}>
                        <Text className={`text-[15px] leading-[22px] font-medium ${isMe(item) ? 'text-white' : 'text-graphite'}`}>{item.text}</Text>
                        <Text className={`text-[10px] font-semibold tracking-widest mt-1.5 uppercase ${isMe(item) ? 'text-white/60' : 'text-gray-400'}`}>
                            {formatTime(item.timestamp)}
                        </Text>
                    </View>
                )}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            />

            {/* Quick Replies */}
            <FlatList
                data={QUICK_REPLIES}
                horizontal
                className="flex-grow-0 flex-shrink-0 max-h-[60px]"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, gap: 10, alignItems: 'center' }}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-white px-5 rounded-full border border-gray-100 items-center justify-center h-10"
                        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
                        onPress={() => handleSend(item)}
                    >
                        <Text className="text-[13px] text-graphite font-medium tracking-tight">{item}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Input */}
            <View className={`flex-row items-end px-5 pt-3 border-t border-gray-50 bg-white gap-3`} style={{ paddingBottom: insets.bottom || 16 }}>
                <TouchableOpacity className="pb-3.5">
                    <Ionicons name="attach" size={24} color={Colors.muted} />
                </TouchableOpacity>
                <View className="flex-1 bg-surface rounded-2xl border border-gray-50 min-h-[44px]">
                    <TextInput
                        className="flex-1 text-[15px] font-medium text-graphite max-h-[100px] py-3 px-4"
                        placeholder="Type a message..."
                        placeholderTextColor={Colors.gray400}
                        value={text}
                        onChangeText={setText}
                        multiline
                    />
                </View>
                <TouchableOpacity
                    className={`w-11 h-11 rounded-full items-center justify-center mb-0.5 ${!text.trim() ? 'bg-surface border border-gray-100' : 'bg-graphite shadow-sm'}`}
                    onPress={() => handleSend()}
                    disabled={!text.trim()}
                >
                    <Ionicons name="paper-plane" size={18} color={text.trim() ? Colors.white : Colors.gray400} style={text.trim() ? { transform: [{ translateX: -1 }, { translateY: 1 }] } : {}} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
