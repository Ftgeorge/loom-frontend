import { ClerkProvider, useAuth } from "@clerk/expo";

import * as SecureStore from "expo-secure-store";
import React from "react";

// ─── Secure token cache for Clerk ────────────────────────
const tokenCache = {
    async getToken(key: string) {
        try {
            return SecureStore.getItemAsync(key);
        } catch {
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch {
            return;
        }
    },
};

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

interface Props {
    children: React.ReactNode;
}

export function ClerkAuthProvider({ children }: Props) {
    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}
        >
            {children}
        </ClerkProvider>
    );
}

export { useAuth };
