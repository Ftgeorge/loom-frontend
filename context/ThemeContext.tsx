import { getColors, ThemeMode } from '@/theme';
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { useAppStore } from '@/store';

type ThemeContextType = {
    mode: ThemeMode;
    colors: ReturnType<typeof getColors>;
    isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    colors: getColors('light'),
    isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { themeMode } = useAppStore();
    const systemScheme = useColorScheme();

    // 'system' follows the device preference; otherwise use the stored choice
    const activeMode: ThemeMode =
        themeMode === 'system'
            ? (systemScheme === 'dark' ? 'dark' : 'light')
            : (themeMode ?? 'light');

    return (
        <ThemeContext.Provider
            value={{
                mode: activeMode,
                colors: getColors(activeMode),
                isDark: activeMode === 'dark',
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

/** Drop-in hook — use instead of importing Colors directly for theme-aware components */
export function useTheme() {
    return useContext(ThemeContext);
}
