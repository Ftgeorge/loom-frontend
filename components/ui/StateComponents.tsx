import { Colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from './Buttons';

// ─── Empty State ────────────────────────────────────────
interface EmptyStateProps {
    icon?: string;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ icon = 'folder-open-outline', title, message, actionLabel, onAction }: EmptyStateProps) {
    return (
        <View className="flex-1 items-center justify-center px-10 py-16">
            <Ionicons name={icon as any} size={64} color={Colors.muted} />
            <Text className="text-2xl font-bold tracking-tight mt-6 text-center text-graphite">{title}</Text>
            <Text className="text-base text-muted text-center mt-2 leading-relaxed">{message}</Text>
            {actionLabel && onAction && (
                <PrimaryButton title={actionLabel} onPress={onAction} style={{ marginTop: 24 }} className="bg-graphite" />
            )}
        </View>
    );
}

// ─── Error State ────────────────────────────────────────
interface ErrorStateProps {
    message?: string;
    onRetry: () => void;
}

export function ErrorState({ message = 'Please check your connection.', onRetry }: ErrorStateProps) {
    return (
        <View className="flex-1 items-center justify-center px-10 py-16">
            <Ionicons name="cloud-offline-outline" size={64} color={Colors.error} />
            <Text className="text-2xl font-bold tracking-tight mt-6 text-center text-graphite">Something went wrong</Text>
            <Text className="text-base text-muted text-center mt-2 leading-relaxed">{message}</Text>
            <SecondaryButton
                title="Try Again"
                onPress={onRetry}
                style={{ marginTop: 24, borderColor: Colors.graphite }}
                textStyle={{ color: Colors.graphite }}
            />
        </View>
    );
}

// ─── Offline Banner ─────────────────────────────────────
export function OfflineBanner() {
    return (
        <View className="bg-graphite flex-row items-center justify-center py-3 gap-2">
            <Ionicons name="wifi-outline" size={16} color={Colors.white} />
            <Text className="text-xs font-semibold tracking-wide text-white">You're offline. Some features may not work.</Text>
        </View>
    );
}

// ─── Toast / Snackbar ───────────────────────────────────
interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    visible: boolean;
}

export function Toast({ message, type = 'success', visible }: ToastProps) {
    if (!visible) return null;

    let bgColor = Colors.info;
    let iconName = 'information-circle';

    if (type === 'success') {
        bgColor = Colors.success;
        iconName = 'checkmark-circle';
    } else if (type === 'error') {
        bgColor = Colors.error;
        iconName = 'close-circle';
    }

    return (
        <View
            className="absolute bottom-10 left-5 right-5 flex-row items-center py-4 px-5 rounded-[16px] gap-2 shadow-[0_4px_8px_rgba(0,0,0,0.15)] elevation-5"
            style={{ backgroundColor: bgColor }}
        >
            <Ionicons name={iconName as any} size={20} color={Colors.white} />
            <Text className="text-sm text-white font-semibold tracking-wide flex-1">{message}</Text>
        </View>
    );
}
