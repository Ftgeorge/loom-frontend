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
            className="flex-1 bg-operis-bg"
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
                    <View className={`max-w-[78%] px-4 py-3 rounded-xl mb-2 ${isMe(item) ? 'bg-olive self-end rounded-br-[4px]' : 'bg-white self-start rounded-bl-[4px] border border-gray-200'}`}>
                        <Text className={`text-base ${isMe(item) ? 'text-white' : 'text-gray-700'}`}>{item.text}</Text>
                        <Text className={`text-[10px] mt-0.5 ${isMe(item) ? 'text-sage-200' : 'text-gray-400'}`}>
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
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8, gap: 8 }}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity className="bg-sage-200/25 px-4 py-2 rounded-full border border-sage-200" onPress={() => handleSend(item)}>
                        <Text className="text-xs text-olive font-medium">{item}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Input */}
            <View className={`flex-row items-end px-4 pt-2 border-t border-gray-200 bg-white gap-2`} style={{ paddingBottom: insets.bottom || 16 }}>
                <TouchableOpacity className="pb-4">
                    <Ionicons name="attach" size={24} color={Colors.gray500} />
                </TouchableOpacity>
                <TextInput
                    className="flex-1 text-base text-olive max-h-[100px] py-2"
                    placeholder="Type a message..."
                    placeholderTextColor={Colors.gray400}
                    value={text}
                    onChangeText={setText}
                    multiline
                />
                <TouchableOpacity
                    className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${!text.trim() ? 'bg-gray-200' : 'bg-olive'}`}
                    onPress={() => handleSend()}
                    disabled={!text.trim()}
                >
                    <Ionicons name="send" size={20} color={text.trim() ? Colors.white : Colors.gray400} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
